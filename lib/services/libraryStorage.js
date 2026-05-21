// ============================================================
// Library Storage Service — Supabase read/write
// ============================================================
const supabase = require("../db/supabase");
const { CATEGORY_META } = require("../config/librarySites");

async function saveLibraryItems(items) {
  if (!items || items.length === 0) return { saved: 0, skipped: 0 };

  const approved = items.filter((i) => i.is_approved && i.title && i.url);
  if (approved.length === 0) return { saved: 0, skipped: items.length };

  const records = approved.map((item) => {
    const meta = CATEGORY_META[item.category] || CATEGORY_META["Open Source Tool"];
    let finalSource = item.source || "Unknown";
    if (item.region && !finalSource.includes(`[${item.region}]`)) {
      finalSource = `${finalSource} [${item.region}]`;
    }

    return {
      title: item.title.slice(0, 500),
      description: (item.use_case || item.excerpt || "").slice(0, 600),
      url: item.url,
      source: finalSource,
      category: item.category || "Open Source Tool",
      topic: item.topic || "Innovation",
      use_case: item.use_case || null,
      difficulty: item.difficulty || "Intermediate",
      is_free: item.is_free ?? true,
      tech_stack: item.tech_stack || null,
      stars: item.stars || null,
      language: item.language || null,
      trending_score: item.trending_score || 5,
      climate_score: parseFloat((item.climate_score || 0).toFixed(2)),
      color: meta.color,
      icon: meta.icon,
      badge: meta.badge,
      is_approved: true,
      scraped_at: item.scraped_at || new Date().toISOString(),
      fetched_at: new Date().toISOString(),
    };
  });

  const { data, error } = await supabase
    .from("library_tools")
    .upsert(records, { onConflict: "url", ignoreDuplicates: true })
    .select("id");

  if (error) {
    console.error("  ❌ Supabase save error:", error.message);
    return { saved: 0, skipped: items.length };
  }

  return { saved: data?.length || 0, skipped: items.length - (data?.length || 0) };
}

async function getLibraryItems({
  limit = 30,
  category = null,
  topic = null,
  difficulty = null,
  is_free = null,
  offset = 0,
  sort = "trending",
} = {}) {
  // Fetch a larger pool to allow for 70/30 mixing
  let query = supabase
    .from("library_tools")
    .select("*")
    .eq("is_approved", true)
    .limit(200);

  if (category && category !== "All") query = query.eq("category", category);
  if (topic && topic !== "All") query = query.eq("topic", topic);
  if (difficulty && difficulty !== "All") query = query.eq("difficulty", difficulty);
  if (is_free !== null && is_free !== "All") query = query.eq("is_free", is_free === "true");

  // Sort
  if (sort === "trending") {
    query = query.order("trending_score", { ascending: false });
  } else if (sort === "newest") {
    query = query.order("fetched_at", { ascending: false });
  } else if (sort === "climate") {
    query = query.order("climate_score", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error("❌ Error fetching library items:", error.message);
    return [];
  }

  // Separate into Kenyan and Global
  const kenya = (data || []).filter((item) => item.source?.includes("[Kenya]") || item.source?.includes("[Africa]"));
  const global = (data || []).filter((item) => !item.source?.includes("[Kenya]") && !item.source?.includes("[Africa]"));

  // Mix 70/30 ratio
  const mixed = [];
  let kIdx = 0;
  let gIdx = 0;

  while (kIdx < kenya.length || gIdx < global.length) {
    for (let i = 0; i < 7 && kIdx < kenya.length; i++) mixed.push(kenya[kIdx++]);
    for (let i = 0; i < 3 && gIdx < global.length; i++) mixed.push(global[gIdx++]);
  }

  // Apply offset and limit
  return mixed.slice(offset, offset + limit);
}

async function getLibraryCounts() {
  const { data, error } = await supabase
    .from("library_tools")
    .select("category, topic, difficulty, is_free")
    .eq("is_approved", true);

  if (error || !data) return {};

  const categories = {};
  const topics = {};
  data.forEach((row) => {
    categories[row.category] = (categories[row.category] || 0) + 1;
    topics[row.topic] = (topics[row.topic] || 0) + 1;
  });
  return { categories, topics, total: data.length };
}

async function pruneOldLibraryItems(daysToKeep = 90) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);

  const { error, count } = await supabase
    .from("library_tools")
    .delete({ count: "exact" })
    .lt("fetched_at", cutoff.toISOString());

  if (error) { console.error("❌ Prune error:", error.message); return 0; }
  return count || 0;
}

module.exports = { saveLibraryItems, getLibraryItems, getLibraryCounts, pruneOldLibraryItems };
