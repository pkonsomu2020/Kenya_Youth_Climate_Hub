// ============================================================
// Google Custom Search Fetcher
// Reaches LinkedIn-hosted opportunity/event posts, which direct
// scraping can't (LinkedIn blocks bots + requires login) and Google
// News RSS rarely surfaces (it indexes news publishers, not social posts).
// ============================================================
const axios = require("axios");

/**
 * Run one Custom Search query and normalize results into the same
 * shape the RSS/Scrapfly fetchers produce.
 */
async function fetchGoogleSearch(queryConfig) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !cx) {
    console.warn("  ⚠️  No GOOGLE_API_KEY/GOOGLE_SEARCH_ENGINE_ID found, skipping Google Search targets.");
    return [];
  }

  try {
    console.log(`  🔎 Searching (Google): ${queryConfig.name} — "${queryConfig.query.slice(0, 70)}..."`);
    const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(queryConfig.query)}&num=10`;

    const response = await axios.get(url, { timeout: 15000 });
    const items = response.data.items || [];

    // Skip generic LinkedIn company/profile root pages — they're not a
    // specific opportunity/event post, just a org or person's landing page.
    const isGenericProfilePage = (url) => /linkedin\.com\/(company|in)\/[^/]+\/?(\?.*)?$/i.test(url);

    const results = items
      .filter((item) => item.link && item.title && !isGenericProfilePage(item.link))
      .map((item) => {
        // Best-effort structured date from Google's page metadata, if present.
        const metatags = item.pagemap?.metatags?.[0] || {};
        const rawDate = metatags["article:published_time"] || metatags["og:updated_time"] || metatags["date"] || "";

        return {
          title: item.title.replace(/\s*[-|]\s*LinkedIn\s*$/i, "").trim(),
          url: item.link,
          excerpt: (item.snippet || "").replace(/\s+/g, " ").slice(0, 400),
          raw_date: rawDate,
          source: "LinkedIn (via Google Search)",
          category: queryConfig.category,
          type: queryConfig.type,
          region: queryConfig.region || "Global",
        };
      });

    console.log(`  ✅ Found ${results.length} items from ${queryConfig.name}`);
    return results;
  } catch (err) {
    const status = err.response?.status;
    if (status === 429 || status === 403) {
      console.warn(`  ⚠️  Google Search quota/rate limit hit for "${queryConfig.name}": ${err.message}`);
    } else {
      console.error(`  ❌ Failed Google Search "${queryConfig.name}": ${err.message}`);
    }
    return [];
  }
}

/**
 * Run a list of queries sequentially with a polite delay between calls.
 */
async function fetchAllGoogleSearch(queries) {
  if (!queries || queries.length === 0) return [];

  const allItems = [];
  for (const q of queries) {
    const items = await fetchGoogleSearch(q);
    allItems.push(...items);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return allItems;
}

module.exports = { fetchAllGoogleSearch };
