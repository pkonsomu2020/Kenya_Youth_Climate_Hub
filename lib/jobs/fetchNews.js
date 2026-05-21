// ============================================================
// News Fetch Job
// Orchestrates: RSS fetch → Image extraction → AI filter → Supabase save
// Can be run manually: node src/jobs/fetchNews.js
// Or triggered by the cron scheduler in index.js
// ============================================================

const { fetchAllFeeds } = require("../services/rssFetcher");
const { enrichArticlesWithImages } = require("../services/imageExtractor");
const { filterArticlesWithAI } = require("../services/aiFilter");
const { saveArticles, pruneOldArticles } = require("../services/newsStorage");

async function runFetchJob() {
  const startTime = Date.now();
  console.log("\n" + "=".repeat(60));
  console.log(`🚀 KYCH News Fetch Job — ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  try {
    // ── Step 1: Fetch from all RSS feeds ──────────────────────
    console.log("\n📡 STEP 1: Fetching RSS feeds...");
    const rawArticles = await fetchAllFeeds();
    console.log(`   → Fetched ${rawArticles.length} raw articles`);

    if (rawArticles.length === 0) {
      console.log("   ⚠️  No articles fetched. Exiting.");
      return { success: true, fetched: 0, approved: 0, saved: 0 };
    }

    // ── Step 2: Extract images from article pages ─────────────
    console.log("\n🖼️  STEP 2: Extracting thumbnail images...");
    const articlesWithImages = await enrichArticlesWithImages(rawArticles, 10);
    const withImageCount = articlesWithImages.filter((a) => a.image_url).length;
    console.log(`   → ${withImageCount}/${articlesWithImages.length} articles have images`);

    // ── Step 3: AI filtering ──────────────────────────────────
    console.log("\n🤖 STEP 3: AI filtering for climate relevance...");
    const filteredArticles = await filterArticlesWithAI(articlesWithImages);

    const approved = filteredArticles.filter((a) => a.is_approved);
    const rejected = filteredArticles.filter((a) => !a.is_approved);

    console.log(`   → Approved: ${approved.length} articles`);
    console.log(`   → Rejected: ${rejected.length} articles (not climate-related)`);

    if (approved.length > 0) {
      console.log("\n   📋 Sample approved articles:");
      approved.slice(0, 3).forEach((a) => {
        const imgStatus = a.image_url ? "🖼️ " : "🎨 ";
        console.log(`      ${imgStatus}[${a.ai_score.toFixed(2)}] ${a.title.slice(0, 65)}...`);
      });
    }

    // ── Step 4: Save to Supabase ──────────────────────────────
    console.log("\n💾 STEP 4: Saving to Supabase...");
    const { saved, skipped } = await saveArticles(approved);
    console.log(`   → Saved: ${saved} new articles`);
    console.log(`   → Skipped: ${skipped} (already exist or rejected)`);

    // ── Step 5: Prune old articles (keep last 30 days) ────────
    console.log("\n🧹 STEP 5: Pruning old articles (>30 days)...");
    const pruned = await pruneOldArticles(30);
    console.log(`   → Pruned: ${pruned} old articles`);

    // ── Summary ───────────────────────────────────────────────
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log("\n" + "=".repeat(60));
    console.log(`✅ Job complete in ${duration}s`);
    console.log(`   Fetched: ${rawArticles.length} | Images: ${withImageCount} | Approved: ${approved.length} | Saved: ${saved}`);
    console.log("=".repeat(60) + "\n");

    return {
      success: true,
      fetched: rawArticles.length,
      withImages: withImageCount,
      approved: approved.length,
      saved,
      duration,
    };
  } catch (err) {
    console.error("\n❌ Fetch job failed:", err.message);
    console.error(err.stack);
    return { success: false, error: err.message };
  }
}

// Run directly if called as a script
if (require.main === module) {
  runFetchJob()
    .then((result) => {
      if (!result.success) process.exit(1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runFetchJob };
