// ============================================================
// Opportunity Fetcher (Scrapfly + RSS)
// ============================================================
const Parser = require("rss-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const { OPPORTUNITY_SITES } = require("../config/opportunitySites");

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; KYCH-Bot/1.0)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

/**
 * Fetch HTML via Scrapfly API and parse with Cheerio
 */
async function fetchScrapfly(feedConfig) {
  try {
    console.log(`  🚀 Scraping (Scrapfly): ${feedConfig.name} — ${feedConfig.url.slice(0, 60)}...`);
    const scrapflyKey = process.env.SCRAPFLY_API_KEY;
    
    if (!scrapflyKey) {
      console.warn("  ⚠️  No SCRAPFLY_API_KEY found, skipping Scrapfly targets.");
      return [];
    }

    const encodedUrl = encodeURIComponent(feedConfig.url);
    // asp=true enables Anti-Scraping Protection bypass (Cloudflare etc)
    // render_js=false is usually enough for static job boards, but we can set render_js=true if needed.
    const apiUrl = `https://api.scrapfly.io/scrape?key=${scrapflyKey}&url=${encodedUrl}&asp=true&render_js=true`;
    
    const response = await axios.get(apiUrl, { timeout: 30000 });
    if (!response.data || !response.data.result || !response.data.result.content) {
      throw new Error("Invalid Scrapfly response");
    }

    const html = response.data.result.content;
    const $ = cheerio.load(html);
    const items = [];
    const selectors = feedConfig.selectors;

    $(selectors.list).slice(0, 15).each((i, el) => {
      let title = "";
      let link = "";
      let excerpt = "";

      if (selectors.title) title = $(el).find(selectors.title).text().trim();
      if (selectors.link) link = $(el).find(selectors.link).attr("href") || "";
      if (selectors.excerpt) excerpt = $(el).find(selectors.excerpt).text().trim();

      // Resolve relative URLs
      if (link && !link.startsWith("http")) {
        try {
          link = new URL(link, feedConfig.url).href;
        } catch (e) {
          /* ignore invalid URLs */
        }
      }

      if (title && link) {
        // Determine region
        const isKenya = feedConfig.url.toLowerCase().includes("kenya") || feedConfig.id.includes("kenya");
        const isAfrica = feedConfig.url.toLowerCase().includes("africa") || feedConfig.id.includes("africa");
        const region = isKenya ? "Kenya" : isAfrica ? "Africa" : "Global";

        items.push({
          title,
          url: link,
          excerpt: excerpt.replace(/\s+/g, " ").slice(0, 400),
          source: feedConfig.name,
          type: feedConfig.type || "Job",
          region: region,
        });
      }
    });

    console.log(`  ✅ Extracted ${items.length} items from ${feedConfig.name}`);
    return items;
  } catch (err) {
    console.error(`  ❌ Failed to fetch ${feedConfig.name}: ${err.message}`);
    return [];
  }
}

/**
 * Fetch RSS Feed
 */
async function fetchRssFeed(feedConfig) {
  try {
    console.log(`  📡 Fetching (RSS): ${feedConfig.name} — ${feedConfig.url.slice(0, 60)}...`);
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
        type: feedConfig.type || "Grant",
        region: region,
      };
    });
  } catch (err) {
    console.error(`  ❌ Failed to fetch RSS ${feedConfig.name}: ${err.message}`);
    return [];
  }
}

/**
 * Fetch all opportunities
 */
async function scrapeAllSites() {
  const allItems = [];

  for (const site of OPPORTUNITY_SITES) {
    if (site.isScrapfly) {
      const items = await fetchScrapfly(site);
      allItems.push(...items);
    } else {
      const items = await fetchRssFeed(site);
      allItems.push(...items);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // polite delay
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
