// ============================================================
// AI Filtering Service — OpenAI GPT-4o-mini
// Filters and scores news articles for climate relevance
// ============================================================
const OpenAI = require("openai");


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Filter a batch of articles for climate relevance using AI.
 * Returns each article with an ai_score (0-1) and ai_summary.
 * Articles scoring below 0.5 are marked as not approved.
 *
 * @param {Array} articles - Array of { title, excerpt, source }
 * @returns {Array} - Same articles with ai_score, ai_summary, is_approved, category added
 */
async function filterArticlesWithAI(articles) {
  if (!articles || articles.length === 0) return [];

  // Process in batches of 10 to stay within token limits
  const BATCH_SIZE = 10;
  const results = [];

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const batchResults = await processBatch(batch);
    results.push(...batchResults);

    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < articles.length) {
      await sleep(500);
    }
  }

  return results;
}

async function processBatch(articles) {
  const articlesJson = articles.map((a, idx) => ({
    index: idx,
    title: a.title,
    excerpt: (a.excerpt || "").slice(0, 300),
  }));

  const prompt = `You are a climate content curator for Kenya Youth Climate Hub (KYCH).

Analyze these news articles and for each one:
1. Score climate relevance from 0.0 to 1.0 (1.0 = highly relevant to climate/environment/sustainability)
2. Assign a category: "News", "Climate Insights", "Success Stories", "Events Recap", or "Partner Updates"
3. Write a 1-sentence summary (max 120 chars) focused on the climate angle

SCORING GUIDE:
- 0.8-1.0: Directly about climate change, clean energy, sustainability, environmental policy, nature conservation (Global or Local).
- 0.5-0.7: Related to environment, green economy, climate finance, agriculture, water, health with climate angle.
- Below 0.5: Not climate-related — REJECT

Note: ALL global climate and environmental news is highly relevant and should score above 0.5. You should ONLY reject articles that have absolutely nothing to do with climate or the environment.

Articles to analyze:
${JSON.stringify(articlesJson, null, 2)}

Respond with ONLY a JSON array (no markdown, no explanation):
[
  {
    "index": 0,
    "ai_score": 0.95,
    "category": "News",
    "ai_summary": "One sentence summary here"
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1000,
    });

    const raw = response.choices[0].message.content.trim();

    // Strip markdown code blocks if present
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const aiResults = JSON.parse(cleaned);

    // Merge AI results back into articles
    return articles.map((article, idx) => {
      const aiData = aiResults.find((r) => r.index === idx);
      if (!aiData) {
        return { ...article, ai_score: 0, is_approved: false, ai_summary: null };
      }
      return {
        ...article,
        ai_score: aiData.ai_score,
        category: aiData.category || article.category || "News",
        ai_summary: aiData.ai_summary || null,
        is_approved: aiData.ai_score >= 0.5,
      };
    });
  } catch (err) {
    console.error("⚠️  AI filtering error:", err.message);
    // On AI failure, approve all articles with default score
    // so we don't lose content due to API issues
    return articles.map((a) => ({
      ...a,
      ai_score: 0.7,
      is_approved: true,
      ai_summary: null,
    }));
  }
}

/**
 * Generate a short AI summary for a single article.
 * Used when an article doesn't have a good excerpt.
 */
async function generateSummary(title, content) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Write a 1-2 sentence summary of this climate news article for young Kenyan readers. Keep it under 150 characters and focus on the key climate impact.\n\nTitle: ${title}\nContent: ${content?.slice(0, 500) || ""}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });
    return response.choices[0].message.content.trim();
  } catch {
    return null;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { filterArticlesWithAI, generateSummary };
