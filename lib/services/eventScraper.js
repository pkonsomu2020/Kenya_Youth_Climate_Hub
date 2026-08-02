// ============================================================
// Event Fetcher (Scrapfly + RSS)
// ============================================================
const Parser = require("rss-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const { EVENT_SITES, EVENT_SEARCH_QUERIES } = require("../config/eventSites");
const { fetchAllGoogleSearch } = require("./googleSearchFetcher");

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; KYCH-Bot/1.0)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

// Generic fallback selectors for locating a date within a scraped list item.
// Sites rarely expose a dedicated "date" selector in our config, so we try
// the common patterns used across event/job-board markup.
const DATE_SELECTORS = [
  "time[datetime]",
  "time",
  "[itemprop='startDate']",
  ".event-date",
  ".date",
  ".entry-date",
  ".rw-river-article__date",
  "[class*='date']",
];

function extractRawDate($, el) {
  for (const sel of DATE_SELECTORS) {
    const found = $(el).find(sel).first();
    if (found.length) {
      const datetimeAttr = found.attr("datetime");
      if (datetimeAttr) return datetimeAttr.trim();
      const text = found.text().trim();
      if (text) return text.slice(0, 60);
    }
  }
  return "";
}

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
    const apiUrl = `https://api.scrapfly.io/scrape?key=${scrapflyKey}&url=${encodedUrl}&asp=true&render_js=true`;
    
    const response = await axios.get(apiUrl, { timeout: 30000 });
    if (!response.data || !response.data.result || !response.data.result.content) {
      throw new Error("Invalid Scrapfly response");
    }

    const html = response.data.result.content;
    const $ = cheerio.load(html);
    const items = [];
    const selectors = feedConfig.selectors;

    $(selectors.list).slice(0, 100).each((i, el) => {
      let title = "";
      let link = "";
      let excerpt = "";
      let rawDate = "";

      // Special case for Nairobi Events Guide (a tags directly)
      if (feedConfig.id === "nairobi-events-guide") {
        title = $(el).text().trim();
        link = $(el).attr("href") || "";
      } else {
        if (selectors.title) title = $(el).find(selectors.title).text().trim();
        if (selectors.link) link = $(el).find(selectors.link).attr("href") || "";
        if (selectors.excerpt) excerpt = $(el).find(selectors.excerpt).text().trim();
        rawDate = selectors.date ? $(el).find(selectors.date).first().text().trim() : extractRawDate($, el);
      }

      // Resolve relative URLs
      if (link && !link.startsWith("http")) {
        try {
          link = new URL(link, feedConfig.url).href;
        } catch (e) {
          /* ignore invalid URLs */
        }
      }

      if (title && title.length > 5 && link) {
        // Determine region
        const isKenya = feedConfig.url.toLowerCase().includes("kenya") || feedConfig.id.includes("kenya") || feedConfig.id.includes("nairobi");
        const isAfrica = feedConfig.url.toLowerCase().includes("africa") || feedConfig.id.includes("africa");
        const region = isKenya ? "Kenya" : isAfrica ? "Africa" : "Global";

        items.push({
          title,
          url: link,
          excerpt: excerpt.replace(/\s+/g, " ").slice(0, 400),
          raw_date: rawDate,
          source: feedConfig.name,
          category: feedConfig.category || "In-Person",
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
        // NOTE: this is the RSS article's publish date, not necessarily the
        // event date — it's a weak hint only, passed to the AI as context.
        raw_date: item.isoDate || item.pubDate || "",
        source: feedConfig.name,
        category: feedConfig.category || "In-Person",
        region: region,
      };
    });
  } catch (err) {
    console.error(`  ❌ Failed to fetch RSS ${feedConfig.name}: ${err.message}`);
    return [];
  }
}

/**
 * Fetch all events
 */
async function scrapeAllSites() {
  const allItems = [];

  for (const site of EVENT_SITES) {
    if (site.isScrapfly) {
      const items = await fetchScrapfly(site);
      allItems.push(...items);
    } else {
      const items = await fetchRssFeed(site);
      allItems.push(...items);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // polite delay
  }

  // Google Custom Search — reaches LinkedIn-hosted posts that RSS/Scrapfly can't
  const googleItems = await fetchAllGoogleSearch(EVENT_SEARCH_QUERIES);
  allItems.push(...googleItems);

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
