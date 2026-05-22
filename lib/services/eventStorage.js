// ============================================================
// Event Storage Service — Supabase read/write
// ============================================================

/**
 * Clean scraped titles — remove emojis, hashtags, LinkedIn noise,
 * truncated suffixes, and excessive whitespace.
 */
function cleanTitle(raw) {
  if (!raw) return "";
  return raw
    // Remove emoji characters
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    // Remove hashtags
    .replace(/#\w+/g, "")
    // Remove "- LinkedIn" suffix and similar
    .replace(/[-–|]\s*(LinkedIn|Twitter|Facebook|Instagram|X\.com)\s*$/i, "")
    // Remove truncation artifacts like "fro -" at end
    .replace(/\s+\w{1,4}\s*[-–]\s*$/, "")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}
const supabase = require("../db/supabase");
const { CATEGORY_COLORS } = require("../config/eventSites");
const { isEventPast } = require("./eventAIFilter");

async function saveEvents(items) {
  if (!items || items.length === 0) return { saved: 0, skipped: 0 };

  const approved = items.filter((i) => i.is_approved && i.title && i.url);
  if (approved.length === 0) return { saved: 0, skipped: items.length };

  const records = approved.map((item) => {
    let finalSource = item.source || "Unknown";
    if (item.region && !finalSource.includes(`[${item.region}]`)) {
      finalSource = `${finalSource} [${item.region}]`;
    }

    return {
      title: cleanTitle(item.title).slice(0, 500),
      description: (item.ai_summary || item.excerpt || "").slice(0, 600),
      url: item.url,
      source: finalSource,
      event_type: item.event_type || "Conference",
      format: item.format || "In-person",
      event_date: item.event_date || null,
      location: (item.location || "TBA").slice(0, 200),
      topic: item.topic || "Innovation",
      climate_score: parseFloat((item.climate_score || 0).toFixed(2)),
      ai_summary: item.ai_summary || null,
      color: CATEGORY_COLORS[item.event_type] || "#059669",
      is_approved: true,
      scraped_at: item.scraped_at || new Date().toISOString(),
      fetched_at: new Date().toISOString(),
    };
  });

  const { data, error } = await supabase
    .from("events_live")
    .upsert(records, { onConflict: "url", ignoreDuplicates: true })
    .select("id");

  if (error) {
    console.error("  ❌ Supabase save error:", error.message);
    return { saved: 0, skipped: items.length };
  }

  return { saved: data?.length || 0, skipped: items.length - (data?.length || 0) };
}

async function getEvents({ limit = 30, type = null, format = null, offset = 0 } = {}) {
  // Fetch a larger pool to allow for 70/30 mixing
  let query = supabase
    .from("events_live")
    .select("*")
    .eq("is_approved", true)
    .order("fetched_at", { ascending: false })
    .limit(200);

  if (type && type !== "All") query = query.eq("event_type", type);
  if (format && format !== "All") query = query.eq("format", format);

  const { data, error } = await query;
  if (error) {
    console.error("❌ Error fetching events:", error.message);
    return [];
  }

  // Filter out past events
  const activeData = (data || []).filter((item) => !isEventPast(item.event_date));

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

async function expirePastEvents() {
  const { data, error } = await supabase
    .from("events_live")
    .select("id, event_date")
    .eq("is_approved", true)
    .not("event_date", "is", null);

  if (error || !data) return 0;

  const expiredIds = data
    .filter((item) => isEventPast(item.event_date))
    .map((item) => item.id);

  if (expiredIds.length === 0) return 0;

  const { error: updateError } = await supabase
    .from("events_live")
    .update({ is_approved: false })
    .in("id", expiredIds);

  if (updateError) {
    console.error("❌ Expire events error:", updateError.message);
    return 0;
  }

  console.log(`  📅 Expired ${expiredIds.length} past events in Supabase`);
  return expiredIds.length;
}

async function getEventCounts() {
  const { data, error } = await supabase
    .from("events_live")
    .select("event_type, format, event_date")
    .eq("is_approved", true);

  if (error || !data) return { types: {}, formats: {} };

  const active = data.filter((row) => !isEventPast(row.event_date));
  const types = {};
  const formats = {};
  active.forEach((row) => {
    types[row.event_type] = (types[row.event_type] || 0) + 1;
    formats[row.format] = (formats[row.format] || 0) + 1;
  });
  return { types, formats };
}

async function pruneOldEvents(daysToKeep = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);

  const { error, count } = await supabase
    .from("events_live")
    .delete({ count: "exact" })
    .lt("fetched_at", cutoff.toISOString());

  if (error) { console.error("❌ Prune events error:", error.message); return 0; }
  return count || 0;
}

module.exports = { saveEvents, getEvents, getEventCounts, expirePastEvents, pruneOldEvents };
