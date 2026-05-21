// ============================================================
// Library AI Filter Service
// Filters for climate relevance + enriches with metadata
// Extracts: category, topic, use_case, tech_stack, difficulty
// ============================================================
const OpenAI = require("openai");


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function filterAndEnrichLibraryItems(items) {
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

  return results;
}

async function processBatch(items) {
  const itemsJson = items.map((item, idx) => ({
    index: idx,
    title: item.title,
    excerpt: (item.excerpt || "").slice(0, 300),
    category: item.category,
    source: item.source,
    stars: item.stars || null,
    language: item.language || null,
  }));

  const prompt = `You are a climate technology curator for Kenya Youth Climate Hub (KYCH).

Analyze these tools, libraries, datasets, and resources. For each one:

1. **climate_score** (0.0-1.0): How useful is this for climate action?
   - 0.9-1.0: Directly for climate modeling, carbon tracking, renewable energy, emissions, climate data
   - 0.7-0.8: Environmental monitoring, sustainability, green tech, biodiversity, water
   - 0.5-0.6: General data/AI tools with clear climate applications
   - Below 0.5: NOT climate-relevant → REJECT

2. **is_approved** (true/false): Approve if climate_score >= 0.5

3. **category**: Best fit from:
   "Open Source Tool" | "Dataset" | "Data Platform" | "Calculator" | "AI Tool" | "API" | "Framework" | "Toolkit" | "Report" | "Guide"

4. **topic**: Best match from:
   Energy | Water | Agriculture | Policy | Finance | Innovation | Resilience | Carbon | Biodiversity | Climate Modeling

5. **use_case**: One short sentence (max 100 chars) — what can a young Kenyan climate innovator DO with this?

6. **difficulty**: "Beginner" | "Intermediate" | "Advanced"

7. **is_free**: true if free/open-source, false if paid, null if unknown

8. **tech_stack**: Programming language or tech (e.g. "Python", "JavaScript", "R", "No-code") or null

9. **trending_score** (0-10): How trending/popular is this right now? Use stars/mentions as signal.

Items:
${JSON.stringify(itemsJson, null, 2)}

Respond with ONLY a JSON array (no markdown):
[
  {
    "index": 0,
    "climate_score": 0.95,
    "is_approved": true,
    "category": "Open Source Tool",
    "topic": "Carbon",
    "use_case": "Calculate and track carbon emissions for any organization or project.",
    "difficulty": "Intermediate",
    "is_free": true,
    "tech_stack": "Python",
    "trending_score": 8
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
        category: ai.category || item.category || "Open Source Tool",
        topic: ai.topic || "Innovation",
        use_case: ai.use_case || null,
        difficulty: ai.difficulty || "Intermediate",
        is_free: ai.is_free ?? true,
        tech_stack: ai.tech_stack || null,
        trending_score: ai.trending_score || 5,
      };
    });
  } catch (err) {
    console.error("⚠️  Library AI filter error:", err.message);
    return items.map((item) => ({
      ...item,
      climate_score: 0.7,
      is_approved: true,
      category: item.category || "Open Source Tool",
      topic: "Innovation",
      use_case: null,
      difficulty: "Intermediate",
      is_free: true,
      tech_stack: null,
      trending_score: 5,
    }));
  }
}

module.exports = { filterAndEnrichLibraryItems };
