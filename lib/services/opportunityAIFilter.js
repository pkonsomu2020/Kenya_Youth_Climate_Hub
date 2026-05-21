// ============================================================
// Opportunity AI Filter Service
// Uses OpenAI GPT-4o-mini to:
// 1. Filter for climate relevance
// 2. Extract structured data (deadline, amount, topic, etc.)
// 3. Reject past-deadline opportunities
// ============================================================
const OpenAI = require("openai");


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Deadline parser ───────────────────────────────────────────
/**
 * Try to parse a deadline string into a Date object.
 * Returns null if unparseable.
 */
function parseDeadline(deadlineStr) {
  if (!deadlineStr || deadlineStr === "Open" || deadlineStr === "Rolling") return null;

  // Try direct Date parse
  const d = new Date(deadlineStr);
  if (!isNaN(d.getTime())) return d;

  // Try common formats: "Jun 15, 2026", "15 June 2026", "2026-06-15"
  const cleaned = deadlineStr
    .replace(/(\d+)(st|nd|rd|th)/gi, "$1") // remove ordinals
    .trim();
  const d2 = new Date(cleaned);
  if (!isNaN(d2.getTime())) return d2;

  return null;
}

/**
 * Check if a deadline has already passed.
 * Returns true if the deadline is in the past.
 * Returns false if it's in the future, open, or unparseable.
 */
function isDeadlinePassed(deadlineStr) {
  const deadline = parseDeadline(deadlineStr);
  if (!deadline) return false; // Can't parse = keep it (benefit of doubt)

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Compare date only, not time
  return deadline < today;
}

/**
 * Filter and enrich a batch of scraped opportunities.
 * Returns structured opportunity objects ready for Supabase.
 *
 * @param {Array} items - Raw scraped items
 * @returns {Array} - Enriched, filtered opportunities
 */
async function filterAndEnrichOpportunities(items) {
  if (!items || items.length === 0) return [];

  const BATCH_SIZE = 8;
  const results = [];

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const batchResults = await processBatch(batch);
    results.push(...batchResults);

    if (i + BATCH_SIZE < items.length) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  // ── Post-AI deadline filter ───────────────────────────────
  // After AI extracts deadlines, reject any that have already passed
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let expiredCount = 0;
  const filtered = results.map((item) => {
    if (!item.is_approved) return item; // Already rejected

    if (item.deadline && isDeadlinePassed(item.deadline)) {
      expiredCount++;
      return { ...item, is_approved: false, reject_reason: "deadline_passed" };
    }
    return item;
  });

  if (expiredCount > 0) {
    console.log(`  🗓️  Rejected ${expiredCount} opportunities with passed deadlines`);
  }

  return filtered;
}

async function processBatch(items) {
  const today = new Date().toISOString().split("T")[0]; // e.g. "2026-05-13"

  const itemsJson = items.map((item, idx) => ({
    index: idx,
    title: item.title,
    excerpt: (item.excerpt || "").slice(0, 350),
    type: item.type,
    source: item.source,
  }));

  const prompt = `You are a climate opportunity curator for Kenya Youth Climate Hub (KYCH), a platform for young Kenyan climate changemakers aged 15-35.

TODAY'S DATE: ${today}

Analyze these scraped opportunities and for each one:

1. **climate_score** (0.0-1.0): How relevant is this to climate/environment/sustainability?
   - 0.9-1.0: Directly about climate, clean energy, environment, sustainability, green economy
   - 0.7-0.8: Related to environment, water, agriculture, resilience, nature
   - 0.5-0.6: Tangentially related (general development with climate angle)
   - Below 0.5: NOT climate-related → REJECT

2. **is_approved** (true/false): Approve if climate_score >= 0.5 AND deadline is in the future (or unknown).
   - IMPORTANT: If the deadline has already PASSED before ${today}, set is_approved to FALSE.
   - CRITICAL: REJECT (set to false) any item that is a news article, press release, or journalistic report about jobs (e.g., "Over 26,000 youth secure jobs"). ONLY approve actual, direct job application postings or vacancies.

3. **topic**: Best matching topic from: Energy, Water, Agriculture, Policy, Finance, Innovation, Resilience, Advocacy, Waste, Data

4. **deadline**: Extract the EXACT deadline date if mentioned (e.g. "Jun 15, 2026", "May 30, 2026").
   - If no year is mentioned, assume 2026
   - If no deadline found, return null
   - If deadline is clearly in the past (before ${today}), set is_approved to FALSE

5. **amount**: Extract funding amount if mentioned (e.g. "KES 500K", "USD 5,000", "Stipend"), otherwise null

6. **provider**: Extract organization/provider name from title or excerpt

7. **ai_summary**: 1-2 sentence summary (max 150 chars) focused on what young Kenyans can gain

Focus on UPCOMING opportunities relevant to Kenya, Africa, and youth climate action.
REJECT anything with a deadline that has already passed.

Items to analyze:
${JSON.stringify(itemsJson, null, 2)}

Respond with ONLY a JSON array (no markdown):
[
  {
    "index": 0,
    "climate_score": 0.95,
    "is_approved": true,
    "topic": "Energy",
    "deadline": "Jun 15, 2026",
    "amount": "KES 250K",
    "provider": "Kenya Climate Fund",
    "ai_summary": "Grant for youth-led clean energy projects in rural Kenya."
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1500,
    });

    const raw = response.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const aiResults = JSON.parse(cleaned);

    return items.map((item, idx) => {
      const ai = aiResults.find((r) => r.index === idx);
      if (!ai) return { ...item, is_approved: false, climate_score: 0 };

      return {
        ...item,
        climate_score: ai.climate_score || 0,
        is_approved: ai.is_approved && (ai.climate_score || 0) >= 0.5,
        topic: ai.topic || "Innovation",
        deadline: ai.deadline || null,
        amount: ai.amount || null,
        provider: ai.provider || item.source,
        ai_summary: ai.ai_summary || null,
      };
    });
  } catch (err) {
    console.error("⚠️  AI filter error:", err.message);
    return items.map((item) => ({
      ...item,
      climate_score: 0.7,
      is_approved: true,
      topic: "Innovation",
      deadline: null,
      amount: null,
      provider: item.source,
      ai_summary: null,
    }));
  }
}

module.exports = { filterAndEnrichOpportunities, isDeadlinePassed, parseDeadline };
