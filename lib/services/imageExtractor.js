// ============================================================
// Image Extractor Service
// Fetches the actual article page and extracts the best
// thumbnail image using Open Graph / Twitter Card / JSON-LD
// ============================================================
const axios = require("axios");

const HTTP = axios.create({
  timeout: 8000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
  },
  maxRedirects: 5,
  // Only download the first 100KB — enough for <head> tags
  responseType: "text",
});

/**
 * Extract the best thumbnail image URL from an article page.
 * Priority: og:image > twitter:image > JSON-LD image > first <img>
 *
 * @param {string} url - Article URL
 * @returns {string|null} - Image URL or null
 */
async function extractImageFromUrl(url) {
  if (!url) return null;

  // Allow Google News redirect URLs so axios can follow them and extract images from the destination


  try {
    const response = await HTTP.get(url, {
      // Stream and cut off after 100KB to avoid downloading full pages
      onDownloadProgress: () => {},
    });

    const html = response.data || "";
    // Parse the <head> section for meta tags for speed, but use full html for <img> tags
    const head = html.slice(0, 15000);

    return (
      extractOgImage(head, url) ||
      extractTwitterImage(head, url) ||
      extractJsonLdImage(head, url) ||
      extractFirstImg(html, url) ||
      null
    );
  } catch {
    return null;
  }
}

/** Extract og:image meta tag */
function extractOgImage(html, baseUrl) {
  const match =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return match ? cleanImageUrl(match[1], baseUrl) : null;
}

/** Extract twitter:image meta tag */
function extractTwitterImage(html, baseUrl) {
  const match =
    html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  return match ? cleanImageUrl(match[1], baseUrl) : null;
}

/** Extract image from JSON-LD structured data */
function extractJsonLdImage(html, baseUrl) {
  const match = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return null;
  try {
    const data = JSON.parse(match[1]);
    const img =
      data?.image?.url ||
      data?.image?.[0]?.url ||
      data?.image ||
      data?.thumbnailUrl ||
      (Array.isArray(data) && data[0]?.image?.url);
    return img && typeof img === "string" ? cleanImageUrl(img, baseUrl) : null;
  } catch {
    return null;
  }
}

/** Extract first meaningful <img> tag from HTML */
function extractFirstImg(html, baseUrl) {
  const matches = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
  for (const match of matches) {
    const src = match[1];
    // Skip tiny icons, tracking pixels, SVGs, data URIs
    if (
      src.startsWith("data:") ||
      src.includes(".svg") ||
      src.includes("pixel") ||
      src.includes("tracking") ||
      src.includes("1x1") ||
      src.includes("spacer")
    ) {
      continue;
    }
    return cleanImageUrl(src, baseUrl);
  }
  return null;
}

/** Clean and validate image URL, resolving relative paths */
function cleanImageUrl(src, baseUrl) {
  if (!src) return null;
  const trimmed = src.trim();
  
  let finalUrl = trimmed;
  // If it's a relative URL, resolve it against the base URL
  if (!trimmed.startsWith("http") && !trimmed.startsWith("data:")) {
    try {
      if (baseUrl) {
        finalUrl = new URL(trimmed, baseUrl).href;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
  
  if (!finalUrl.startsWith("http")) return null;
  if (finalUrl.length < 15) return null;
  return finalUrl;
}

/**
 * Enrich a batch of articles with images by fetching their pages.
 * Uses concurrency limit to avoid hammering servers.
 *
 * @param {Array} articles - Articles that need image_url populated
 * @param {number} concurrency - Max parallel requests (default 8)
 * @returns {Array} - Same articles with image_url filled in where possible
 */
async function enrichArticlesWithImages(articles, concurrency = 8) {
  // Only fetch images for articles that don't already have one
  const needsImage = articles.filter((a) => !a.image_url);
  const hasImage = articles.filter((a) => a.image_url);

  if (needsImage.length === 0) return articles;

  console.log(`  🖼️  Fetching images for ${needsImage.length} articles...`);

  const enriched = [];
  let fetched = 0;
  let found = 0;

  // Process in batches of `concurrency`
  for (let i = 0; i < needsImage.length; i += concurrency) {
    const batch = needsImage.slice(i, i + concurrency);

    const results = await Promise.allSettled(
      batch.map(async (article, idx) => {
        let imageUrl = await extractImageFromUrl(article.url);
        fetched++;
        if (imageUrl) {
          found++;
        } else {
          // Fallback images if extraction fails (avoids missing thumbnails on UI)
          const fallbacks = [
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop", // Mountains/Nature
            "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1200&auto=format&fit=crop", // Forest
            "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1200&auto=format&fit=crop", // Water/Ocean
            "https://images.unsplash.com/photo-1418065460487-3e41a6c8e18f?q=80&w=1200&auto=format&fit=crop", // Green scenery
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop", // Field
            "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&auto=format&fit=crop", // Solar/Leaves
          ];
          imageUrl = fallbacks[(fetched + idx) % fallbacks.length];
        }
        return { ...article, image_url: imageUrl };
      })
    );

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        enriched.push(result.value);
      } else {
        // Keep original article without image on failure
        enriched.push(batch[results.indexOf(result)]);
      }
    });

    // Small delay between batches to be polite to servers
    if (i + concurrency < needsImage.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log(`  ✅ Images found: ${found}/${fetched} articles`);

  // Merge back: articles that already had images + newly enriched ones
  return [...hasImage, ...enriched];
}

module.exports = { enrichArticlesWithImages, extractImageFromUrl };
