// ============================================================
// Event Fetch Job
// ScrapingBee scrape → AI filter → Supabase save
// Run manually: node src/jobs/fetchEvents.js
// ============================================================
require('dotenv').config({ path: __dirname + '/../../.env' });

const { scrapeAllSites } = require("../services/eventScraper");
const { filterAndEnrichEvents } = require("../services/eventAIFilter");
const { saveEvents, expirePastEvents, pruneOldEvents } = require("../services/eventStorage");

async function runEventJob() {
  const startTime = Date.now();
  console.log("\n" + "=".repeat(60));
  console.log(`📅 KYCH Event Fetch Job — ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  try {
    // Step 0: Expire + prune existing stale records first. This is cheap
    // (DB-only) and must always complete, even if the scrape/AI steps below
    // are slow or get interrupted — so it runs before anything else.
    console.log("\n📅 STEP 0: Expiring past events already in Supabase...");
    const expiredUpfront = await expirePastEvents();
    console.log(`   → Expired: ${expiredUpfront} past events`);

    console.log("\n🧹 STEP 0b: Pruning old events (>30 days)...");
    const prunedUpfront = await pruneOldEvents(30);
    console.log(`   → Pruned: ${prunedUpfront} old events`);

    // Step 1: Scrape
    console.log("\n🐝 STEP 1: Scraping event sites...");
    const rawItems = await scrapeAllSites();
    console.log(`   → Scraped ${rawItems.length} raw events`);

    if (rawItems.length === 0) {
      console.log("   ⚠️  Nothing scraped. Exiting.");
      return { success: true, scraped: 0, approved: 0, saved: 0, expired: expiredUpfront, pruned: prunedUpfront };
    }

    // Step 2: AI filter + enrich
    console.log("\n🤖 STEP 2: AI filtering for climate relevance...");
    const enriched = await filterAndEnrichEvents(rawItems);
    const approved = enriched.filter((i) => i.is_approved);
    const rejected = enriched.filter((i) => !i.is_approved);

    console.log(`   → Approved: ${approved.length} events`);
    console.log(`   → Rejected: ${rejected.length} (not climate or past)`);

    if (approved.length > 0) {
      console.log("\n   📋 Sample approved events:");
      approved.slice(0, 4).forEach((i) => {
        console.log(`      [${i.climate_score?.toFixed(2)}] [${i.event_type}] ${i.title.slice(0, 60)}...`);
      });
    }

    // Step 3: Save
    console.log("\n💾 STEP 3: Saving to Supabase...");
    const { saved, skipped } = await saveEvents(approved);
    console.log(`   → Saved: ${saved} new events`);
    console.log(`   → Skipped: ${skipped}`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log("\n" + "=".repeat(60));
    console.log(`✅ Event job complete in ${duration}s`);
    console.log(`   Scraped: ${rawItems.length} | Approved: ${approved.length} | Saved: ${saved} | Expired: ${expiredUpfront} | Pruned: ${prunedUpfront}`);
    console.log("=".repeat(60) + "\n");

    return { success: true, scraped: rawItems.length, approved: approved.length, saved, expired: expiredUpfront, pruned: prunedUpfront, duration };
  } catch (err) {
    console.error("\n❌ Event job failed:", err.message);
    return { success: false, error: err.message };
  }
}

if (require.main === module) {
  runEventJob()
    .then((r) => { if (!r.success) process.exit(1); })
    .catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { runEventJob };
