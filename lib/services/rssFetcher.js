// ============================================================
// RSS Fetcher Service
// Fetches climate news from Google News RSS and other feeds
// ============================================================
const Parser = require("rss-parser");
const { NEWS_FEEDS, CATEGORY_GRADIENTS, CATEGORY_ICONS } = require("../config/newsFeeds");

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; KYCH-NewsBot/1.0)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:content", "mediaContents", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail"],
      ["media:group", "mediaGroup"],
      ["enclosure", "enclosure"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

/**
 * Fetch articles from a single RSS feed URL.
 * Returns normalized article objects.
 */
async function fetchFeed(feedConfig) {
  try {
    console.log(`  📡 Fetching: ${feedConfig.source} — ${feedConfig.url.slice(0, 60)}...`);
    const feed = await parser.parseURL(feedConfig.url);

    const articles = (feed.items || []).slice(0, 15).map((item) => {
      // Extract image from various RSS formats — try all possible locations
      const imageUrl =
        // media:content (most common in Guardian, Carbon Brief)
        item.mediaContent?.$.url ||
        item.mediaContent?.url ||
        // media:content array (some feeds use multiple)
        item.mediaContents?.[0]?.$.url ||
        // media:thumbnail
        item.mediaThumbnail?.$.url ||
        item.mediaThumbnail?.url ||
        // media:group > media:content
        item.mediaGroup?.["media:content"]?.[0]?.$.url ||
        // enclosure (podcast-style feeds)
        (item.enclosure?.type?.startsWith("image/") ? item.enclosure.url : null) ||
        // Extract from content:encoded (full HTML content)
        extractImageFromContent(item.contentEncoded || "") ||
        // Extract from summary/content HTML
        extractImageFromContent(item.content || item.summary || "") ||
        null;

      // Clean up the excerpt
      const rawExcerpt = item.contentSnippet || item.summary || item.content || "";
      const excerpt = cleanText(rawExcerpt).slice(0, 300);

      // Parse published date
      const publishedAt = item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString();

      return {
        title: cleanText(item.title || ""),
        excerpt,
        url: item.link || item.guid || "",
        source: feedConfig.source,
        source_url: feed.link || feedConfig.url,
        published_at: publishedAt,
        category: feedConfig.category,
        image_url: imageUrl,
        gradient: CATEGORY_GRADIENTS[feedConfig.category] || "#059669",
        icon: CATEGORY_ICONS[feedConfig.category] || "Globe",
        relevance: "High",
        is_approved: true, // Will be updated by AI filter
        ai_score: 0,
        region: feedConfig.url.toLowerCase().includes("kenya") ? "Kenya" : feedConfig.url.toLowerCase().includes("africa") ? "Africa" : "Global",
      };
    });

    // Filter out articles with empty titles or URLs
    const valid = articles.filter((a) => a.title && a.url);
    console.log(`  ✅ Got ${valid.length} articles from ${feedConfig.source}`);
    return valid;
  } catch (err) {
    console.error(`  ❌ Failed to fetch ${feedConfig.source}: ${err.message}`);
    return [];
  }
}

/**
 * Fetch all configured RSS feeds in parallel.
 * Returns a deduplicated array of articles.
 */
async function fetchAllFeeds() {
  console.log(`\n📰 Fetching from ${NEWS_FEEDS.length} RSS feeds...\n`);

  // Fetch all feeds in parallel (with concurrency limit)
  const CONCURRENCY = 5;
  const allArticles = [];

  for (let i = 0; i < NEWS_FEEDS.length; i += CONCURRENCY) {
    const batch = NEWS_FEEDS.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map((feed) => fetchFeed(feed)));

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        allArticles.push(...result.value);
      }
    });
  }

  // Deduplicate by URL
  const seen = new Set();
  const unique = allArticles.filter((a) => {
    if (!a.url || seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  // Also deduplicate by title similarity (avoid near-duplicates)
  const deduped = deduplicateByTitle(unique);

  console.log(`\n📊 Total unique articles fetched: ${deduped.length}`);
  return deduped;
}

/**
 * Remove near-duplicate articles based on title similarity.
 */
function deduplicateByTitle(articles) {
  const result = [];
  const titles = [];

  for (const article of articles) {
    const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
    const isDuplicate = titles.some((t) => similarity(t, normalizedTitle) > 0.8);

    if (!isDuplicate) {
      result.push(article);
      titles.push(normalizedTitle);
    }
  }

  return result;
}

/**
 * Simple string similarity (Jaccard index on words).
 */
function similarity(a, b) {
  const setA = new Set(a.split(" "));
  const setB = new Set(b.split(" "));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

/**
 * Extract first image URL from HTML content string.
 */
function extractImageFromContent(html) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/**
 * Strip HTML tags and clean whitespace from text.
 */
function cleanText(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = { fetchAllFeeds, fetchFeed };
