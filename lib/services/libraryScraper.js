// ============================================================
// E-Library Fetcher (100% Free RSS)
// ============================================================
const Parser = require("rss-parser");
const { LIBRARY_SITES } = require("../config/librarySites");

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; KYCH-Bot/1.0)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

async function fetchRssFeed(feedConfig) {
  try {
    console.log(`  📡 Fetching: ${feedConfig.name} — ${feedConfig.url.slice(0, 60)}...`);
    const feed = await parser.parseURL(feedConfig.url);

    return (feed.items || []).slice(0, 15).map((item) => {
      // Determine region from ID or URL
      const isKenya = feedConfig.url.toLowerCase().includes("kenya") || feedConfig.id.includes("kenya");
      const isAfrica = feedConfig.url.toLowerCase().includes("africa") || feedConfig.id.includes("africa");
      const region = isKenya ? "Kenya" : isAfrica ? "Africa" : "Global";

      return {
        title: item.title?.trim() || "",
        url: item.link || feedConfig.url,
        excerpt: (item.contentSnippet || item.content || "").replace(/<[^>]+>/g, " ").trim().slice(0, 400),
        source: feedConfig.name,
        category: feedConfig.category || "Dataset",
        region: region,
      };
    });
  } catch (err) {
    console.error(`  ❌ Failed to fetch ${feedConfig.name}: ${err.message}`);
    return [];
  }
}

/**
 * Fetch all library items using only RSS
 */
async function scrapeAllSites() {
  const allItems = [];

  for (const site of LIBRARY_SITES) {
    const items = await fetchRssFeed(site);
    allItems.push(...items);
    await new Promise((resolve) => setTimeout(resolve, 500)); // polite delay
  }

  // Deduplicate by URL
  const uniqueItems = [];
  const seenUrls = new Set();
  
  for (const item of allItems) {
    if (!item.url || seenUrls.has(item.url)) continue;
    seenUrls.add(item.url);
    uniqueItems.push(item);
  }

  return uniqueItems;
}

module.exports = { scrapeAllSites };
