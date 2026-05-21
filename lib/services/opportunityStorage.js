// ============================================================
// Opportunity Storage Service
// Saves filtered opportunities to Supabase
// Auto-hides past-deadline opportunities on read
// ============================================================
const supabase = require("../db/supabase");
const { TYPE_COLORS } = require("../config/opportunitySites");
const { isDeadlinePassed } = require("./opportunityAIFilter");

/**
 * Save a batch of AI-filtered opportunities to Supabase.
 * Uses upsert on URL to avoid duplicates.
 */
async function saveOpportunities(items) {
  if (!items || items.length === 0) return { saved: 0, skipped: 0 };

  const approved = items.filter((i) => i.is_approved && i.title && i.url);
  if (approved.length === 0) return { saved: 0, skipped: items.length };

  const records = approved.map((item) => {
    let finalSource = item.source || "Unknown";
    if (item.region && !finalSource.includes(`[${item.region}]`)) {
      finalSource = `${finalSource} [${item.region}]`;
    }

    return {
      title: item.title.slice(0, 500),
      description: (item.ai_summary || item.excerpt || "").slice(0, 600),
      url: item.url,
      source: finalSource,
      provider: (item.provider || item.source || "Unknown").slice(0, 200),
      type: item.type || "Grant",
      topic: item.topic || "Innovation",
      deadline: item.deadline || "Open",
      amount: item.amount || null,
      climate_score: parseFloat((item.climate_score || 0).toFixed(2)),
      ai_summary: item.ai_summary || null,
      is_approved: true,
      color: TYPE_COLORS[item.type] || "#059669",
      scraped_at: item.scraped_at || new Date().toISOString(),
      fetched_at: new Date().toISOString(),
    };
  });

  const { data, error } = await supabase
    .from("opportunities")
    .upsert(records, { onConflict: "url", ignoreDuplicates: true })
    .select("id");

  if (error) {
    console.error("  ❌ Supabase save error:", error.message);
    return { saved: 0, skipped: items.length };
  }

  return { saved: data?.length || 0, skipped: items.length - (data?.length || 0) };
}

/**
 * Get opportunities from Supabase for the API.
 * Automatically filters out past-deadline opportunities.
 */
async function getOpportunities({ limit = 20, type = null, topic = null, offset = 0 } = {}) {
  let query = supabase
    .from("opportunities")
    .select("*")
    .eq("is_approved", true)
    .order("fetched_at", { ascending: false })
    .limit(200);

  if (type && type !== "All") query = query.eq("type", type);
  if (topic && topic !== "All") query = query.eq("topic", topic);

  const { data, error } = await query;
  if (error) {
    console.error("❌ Error fetching opportunities:", error.message);
    return [];
  }

  // Filter out any past-deadline items that slipped through
  const activeData = (data || []).filter((item) => {
    if (!item.deadline || item.deadline === "Open" || item.deadline === "Rolling") return true;
    return !isDeadlinePassed(item.deadline);
  });

  // Separate into Kenyan and Global
  const kenya = activeData.filter((item) => item.source?.includes("[Kenya]") || item.source?.includes("[Africa]"));
  const global = activeData.filter((item) => !item.source?.includes("[Kenya]") && !item.source?.includes("[Africa]"));

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
 * Mark past-deadline opportunities as is_approved=false in Supabase.
 * Called on every fetch job and daily cron.
 */
async function expirePastDeadlines() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("id, deadline")
    .eq("is_approved", true)
    .not("deadline", "is", null)
    .neq("deadline", "Open")
    .neq("deadline", "Rolling");

  if (error || !data) return 0;

  const expiredIds = data
    .filter((item) => isDeadlinePassed(item.deadline))
    .map((item) => item.id);

  if (expiredIds.length === 0) return 0;

  const { error: updateError } = await supabase
    .from("opportunities")
    .update({ is_approved: false })
    .in("id", expiredIds);

  if (updateError) {
    console.error("❌ Expire error:", updateError.message);
    return 0;
  }

  console.log(`  🗓️  Expired ${expiredIds.length} past-deadline opportunities in Supabase`);
  return expiredIds.length;
}

/**
 * Get counts per type and topic (active/upcoming only).
 */
async function getOpportunityCounts() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("type, topic, deadline")
    .eq("is_approved", true);

  if (error || !data) return { types: {}, topics: {} };

  const active = data.filter((row) => !isDeadlinePassed(row.deadline));

  const types = {};
  const topics = {};
  active.forEach((row) => {
    types[row.type] = (types[row.type] || 0) + 1;
    topics[row.topic] = (topics[row.topic] || 0) + 1;
  });
  return { types, topics };
}

/**
 * Delete opportunities older than N days.
 */
async function pruneOldOpportunities(daysToKeep = 60) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);

  const { error, count } = await supabase
    .from("opportunities")
    .delete({ count: "exact" })
    .lt("fetched_at", cutoff.toISOString());

  if (error) {
    console.error("❌ Prune error:", error.message);
    return 0;
  }
  return count || 0;
}

module.exports = {
  saveOpportunities,
  getOpportunities,
  getOpportunityCounts,
  pruneOldOpportunities,
  expirePastDeadlines,
};
