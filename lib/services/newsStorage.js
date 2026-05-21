// ============================================================
// News Storage Service
// Saves filtered articles to Supabase, avoids duplicates
// ============================================================
const supabase = require("../db/supabase");

/**
 * Save a batch of AI-filtered articles to Supabase.
 * Uses upsert on URL to avoid duplicates.
 *
 * @param {Array} articles - Filtered articles with ai_score, category, etc.
 * @returns {{ saved: number, skipped: number }}
 */
async function saveArticles(articles) {
  if (!articles || articles.length === 0) {
    return { saved: 0, skipped: 0 };
  }

  // Only save approved articles (ai_score >= 0.5)
  const approved = articles.filter((a) => a.is_approved && a.title && a.url);

  if (approved.length === 0) {
    console.log("  ⚠️  No approved articles to save.");
    return { saved: 0, skipped: articles.length };
  }

  // Prepare records for Supabase
  const records = approved.map((a) => {
    let finalSource = a.source || "Unknown";
    if (a.region && !finalSource.includes(`[${a.region}]`)) {
      finalSource = `${finalSource} [${a.region}]`;
    }

    return {
      title: a.title.slice(0, 500),
      excerpt: (a.ai_summary || a.excerpt || "").slice(0, 600),
      url: a.url,
      source: finalSource,
      source_url: a.source_url || null,
      published_at: a.published_at || new Date().toISOString(),
      fetched_at: new Date().toISOString(),
      category: a.category || "News",
      relevance: a.ai_score >= 0.85 ? "High" : a.ai_score >= 0.65 ? "Medium" : "Low",
      ai_score: parseFloat((a.ai_score || 0).toFixed(2)),
      ai_summary: a.ai_summary || null,
      image_url: a.image_url || null,
      is_approved: true,
      gradient: a.gradient || "#059669",
      icon: a.icon || "Globe",
    };
  });

  const { data, error } = await supabase
    .from("news_articles")
    .upsert(records, {
      onConflict: "url",
      ignoreDuplicates: false,
    })
    .select("id");

  if (error) {
    console.error("  ❌ Supabase save error:", error.message);
    return { saved: 0, skipped: articles.length };
  }

  const saved = data?.length || 0;
  const skipped = articles.length - saved;
  return { saved, skipped };
}

/**
 * Get the latest news articles from Supabase.
 * Used by the API endpoint.
 *
 * @param {{ limit, category, offset }} options
 */
async function getArticles({ limit = 20, category = null, offset = 0 } = {}) {
  // Fetch a larger pool to allow for 70/30 mixing
  let query = supabase
    .from("news_articles")
    .select("*")
    .eq("is_approved", true)
    .order("published_at", { ascending: false })
    .limit(200);

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("❌ Error fetching articles:", error.message);
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

/**
 * Get count of articles per category.
 */
async function getCategoryCounts() {
  const { data, error } = await supabase
    .from("news_articles")
    .select("category")
    .eq("is_approved", true);

  if (error || !data) return {};

  return data.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Delete articles older than N days to keep the DB clean.
 */
async function pruneOldArticles(daysToKeep = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);

  const { error, count } = await supabase
    .from("news_articles")
    .delete({ count: "exact" })
    .lt("published_at", cutoff.toISOString());

  if (error) {
    console.error("❌ Prune error:", error.message);
    return 0;
  }

  return count || 0;
}

module.exports = { saveArticles, getArticles, getCategoryCounts, pruneOldArticles };
