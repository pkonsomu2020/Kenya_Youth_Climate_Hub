// ============================================================
// Library Fetch Job — Climate Tools & Resources
// Run manually: node src/jobs/fetchLibrary.js
// ============================================================

const { scrapeAllSites } = require("../services/libraryScraper");
const { filterAndEnrichLibraryItems } = require("../services/libraryAIFilter");
const { saveLibraryItems, pruneOldLibraryItems } = require("../services/libraryStorage");

async function runLibraryJob() {
  const startTime = Date.now();
  console.log("\n" + "=".repeat(60));
  console.log(`📚 KYCH Library Fetch Job — ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  try {
    console.log("\n🐝 STEP 1: Scraping climate tools & libraries...");
    const rawItems = await scrapeAllSites();
    console.log(`   → Scraped ${rawItems.length} raw items`);

    if (rawItems.length === 0) {
      console.log("   ⚠️  Nothing scraped. Exiting.");
      return { success: true, scraped: 0, approved: 0, saved: 0 };
    }

    console.log("\n🤖 STEP 2: AI filtering for climate relevance...");
    const enriched = await filterAndEnrichLibraryItems(rawItems);
    const approved = enriched.filter((i) => i.is_approved);
    const rejected = enriched.filter((i) => !i.is_approved);

    console.log(`   → Approved: ${approved.length} tools`);
    console.log(`   → Rejected: ${rejected.length} (not climate-related)`);

    if (approved.length > 0) {
      console.log("\n   📋 Sample approved tools:");
      approved.slice(0, 4).forEach((i) => {
        console.log(`      [${i.climate_score?.toFixed(2)}] [${i.category}] ${i.title.slice(0, 60)}`);
      });
    }

    console.log("\n💾 STEP 3: Saving to Supabase...");
    const { saved, skipped } = await saveLibraryItems(approved);
    console.log(`   → Saved: ${saved} new tools`);
    console.log(`   → Skipped: ${skipped}`);

    console.log("\n🧹 STEP 4: Pruning old items (>90 days)...");
    const pruned = await pruneOldLibraryItems(90);
    console.log(`   → Pruned: ${pruned} old items`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log("\n" + "=".repeat(60));
    console.log(`✅ Library job complete in ${duration}s`);
    console.log(`   Scraped: ${rawItems.length} | Approved: ${approved.length} | Saved: ${saved}`);
    console.log("=".repeat(60) + "\n");

    return { success: true, scraped: rawItems.length, approved: approved.length, saved, duration };
  } catch (err) {
    console.error("\n❌ Library job failed:", err.message);
    return { success: false, error: err.message };
  }
}

if (require.main === module) {
  runLibraryJob()
    .then((r) => { if (!r.success) process.exit(1); })
    .catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { runLibraryJob };
