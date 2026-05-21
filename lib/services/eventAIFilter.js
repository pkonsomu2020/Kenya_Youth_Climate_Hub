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

Analyze these scraped events and for each one:

1. **climate_score** (0.0-1.0): How relevant is this to Climate Action OR Artificial Intelligence (AI)?
   - 0.9-1.0: Directly about Climate Change, AI, Machine Learning, Green Economy, Tech Innovation, Environment
   - 0.7-0.8: Related to nature, agriculture, data science, software development, or resilience
   - 0.5-0.6: Tangentially related (general youth empowerment or broad development)
   - Below 0.5: NOT related to Climate or AI/Tech → REJECT

2. **is_approved** (true/false): Approve if climate_score >= 0.5 AND event is upcoming (after ${today})
   - REJECT if the event date has already PASSED before ${today}
   - REJECT if clearly not related to Climate or AI
   - CRITICAL: REJECT (set to false) any item that is a news article, journalistic report, or press release about a past event. ONLY approve actual, upcoming event listings/announcements where people can register or attend.

3. **event_type**: One of: Conference, Summit, Hackathon, Webinar, Workshop, Competition, Bootcamp, Dialogue, Exhibition

4. **format**: "Online" or "In-person" or "Hybrid"

5. **event_date**: Extract the event date (e.g. "Jun 15, 2026"). If multi-day: use start date. If no year, assume 2026. Return null if unknown.

6. **location**: City/Country or "Online". For Kenya events, be specific (e.g. "Nairobi, Kenya").

7. **topic**: Best match from: Energy, Water, Agriculture, Policy, Finance, Innovation, Resilience, Advocacy, Biodiversity, AI & Tech

8. **ai_summary**: 1-2 sentence summary (max 150 chars) of what attendees will gain

IMPORTANT:
- Focus on events relevant to Kenya, Africa, and global youth action
- Tech, AI, and Hackathons are HIGH priority alongside Climate events
- Reject events that have already happened (before ${today})

Items to analyze:
${JSON.stringify(itemsJson, null, 2)}

Respond with ONLY a JSON array (no markdown):
[
  {
    "index": 0,
    "climate_score": 0.95,
    "is_approved": true,
    "event_type": "Summit",
    "format": "In-person",
    "event_date": "Jun 5, 2026",
    "location": "Nairobi, Kenya",
    "topic": "Innovation",
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
        climate_score: ai.climate_score || 0,
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
