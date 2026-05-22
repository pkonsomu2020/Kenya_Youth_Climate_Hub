// ============================================================
// Event AI Filter Service
// Uses OpenAI GPT-4o-mini to:
// 1. Filter for climate relevance (events only)
// 2. Extract: date, location, format, type, topic
// 3. Reject past events
// ============================================================
const OpenAI = require("openai");


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Date helpers ──────────────────────────────────────────────
function parseEventDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/gi, "$1").trim();
  const d2 = new Date(cleaned);
  return isNaN(d2.getTime()) ? null : d2;
}

function isEventPast(dateStr) {
  const d = parseEventDate(dateStr);
  if (!d) return false; // Can't parse = keep (benefit of doubt)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

// ── Main filter function ──────────────────────────────────────
async function filterAndEnrichEvents(items) {
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

  // Post-AI: reject past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let expiredCount = 0;

  const filtered = results.map((item) => {
    if (!item.is_approved) return item;
    if (item.event_date && isEventPast(item.event_date)) {
      expiredCount++;
      return { ...item, is_approved: false, reject_reason: "event_past" };
    }
    return item;
  });

  if (expiredCount > 0) {
    console.log(`  📅 Rejected ${expiredCount} past events`);
  }

  return filtered;
}

async function processBatch(items) {
  const today = new Date().toISOString().split("T")[0];

  const itemsJson = items.map((item, idx) => ({
    index: idx,
    title: item.title,
    excerpt: (item.excerpt || "").slice(0, 350),
    type: item.type,
    source: item.source,
    raw_date: item.raw_date || "",
  }));

  const prompt = `You are an event curator for Kenya Youth Climate Hub (KYCH), a platform for young Kenyan changemakers.

TODAY'S DATE: ${today}

Analyze these scraped items and for each one determine if it is an ACTUAL UPCOMING EVENT that people can register for or attend.

STRICT RULES:
- REJECT news articles, press releases, or reports ABOUT events (e.g. "Summit was held...", "Conference concluded...")
- REJECT items where the title contains hashtags, emojis, or LinkedIn post noise
- REJECT items where the event date has already passed before ${today}
- REJECT items that are job postings, funding calls, or general news
- APPROVE only genuine upcoming event announcements with a clear title

For each APPROVED item extract:

1. **climate_score** (0.0-1.0): Climate/environment/AI/tech relevance
   - 0.8-1.0: Climate, clean energy, sustainability, AI, green economy
   - 0.5-0.7: Youth development, innovation, policy with climate angle
   - Below 0.5: REJECT

2. **is_approved**: true only if climate_score >= 0.5 AND it is a genuine upcoming event

3. **event_type**: Conference | Summit | Hackathon | Webinar | Workshop | Competition | Bootcamp | Dialogue

4. **format**: Online | In-person | Hybrid

5. **event_date**: Exact date as "YYYY-MM-DD" if explicitly stated in the text. Return null if not found — DO NOT GUESS.

6. **location**: Specific city/country or "Online"

7. **topic**: Energy | Water | Agriculture | Policy | Finance | Innovation | Resilience | Advocacy | AI & Tech

8. **clean_title**: A clean version of the title — remove emojis, hashtags, "- LinkedIn", truncation artifacts. Keep it concise and professional.

9. **ai_summary**: 1-2 sentence summary of what attendees will gain (max 150 chars)

Items:
${JSON.stringify(itemsJson, null, 2)}

Respond with ONLY a JSON array (no markdown):
[
  {
    "index": 0,
    "climate_score": 0.95,
    "is_approved": true,
    "event_type": "Summit",
    "format": "In-person",
    "event_date": "2026-06-15",
    "location": "Nairobi, Kenya",
    "topic": "Innovation",
    "clean_title": "Africa Climate Investment Summit 2026",
    "ai_summary": "Youth climate summit bringing together innovators and policymakers across East Africa."
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
        // Use AI-cleaned title if provided, otherwise keep original
        title: ai.clean_title || item.title,
        climate_score: ai.climate_score || 0,
        // Allow events with null dates — they show as "Date TBA" on the frontend
        is_approved: ai.is_approved && (ai.climate_score || 0) >= 0.5,
        event_type: ai.event_type || item.type || "Conference",
        format: ai.format || "In-person",
        event_date: ai.event_date || null,
        location: ai.location || "TBA",
        topic: ai.topic || "Innovation",
        ai_summary: ai.ai_summary || null,
      };
    });
  } catch (err) {
    console.error("⚠️  Event AI filter error:", err.message);
    return items.map((item) => ({
      ...item,
      climate_score: 0.7,
      is_approved: true,
      event_type: item.type || "Conference",
      format: "In-person",
      event_date: null,
      location: "TBA",
      topic: "Innovation",
      ai_summary: null,
    }));
  }
}

module.exports = { filterAndEnrichEvents, isEventPast, parseEventDate };
