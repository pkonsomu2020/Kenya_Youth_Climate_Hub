// ============================================================
// Opportunity Fetch Job
// Orchestrates: ScrapingBee scrape → AI filter → Supabase save
// Run manually: node src/jobs/fetchOpportunities.js
// Or triggered by cron in index.js
// ============================================================

const { scrapeAllSites } = require("../services/opportunityScraper");
const { filterAndEnrichOpportunities } = require("../services/opportunityAIFilter");
const { saveOpportunities, pruneOldOpportunities, expirePastDeadlines } = require("../services/opportunityStorage");

async function runOpportunityJob() {
  const startTime = Date.now();
  console.log("\n" + "=".repeat(60));
  console.log(`🌱 KYCH Opportunity Fetch Job — ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  try {
    // ── Step 1: Scrape all sites ──────────────────────────────
    console.log("\n🐝 STEP 1: Scraping opportunity sites...");
    const rawItems = await scrapeAllSites();
    console.log(`   → Scraped ${rawItems.length} raw opportunities`);

    if (rawItems.length === 0) {
      console.log("   ⚠️  Nothing scraped. Exiting.");
      return { success: true, scraped: 0, approved: 0, saved: 0 };
    }

    // ── Step 2: AI filter + enrich ────────────────────────────
    console.log("\n🤖 STEP 2: AI filtering for climate relevance...");
    const enriched = await filterAndEnrichOpportunities(rawItems);

    const approved = enriched.filter((i) => i.is_approved);
    const rejected = enriched.filter((i) => !i.is_approved);

    console.log(`   → Approved: ${approved.length} opportunities`);
    console.log(`   → Rejected: ${rejected.length} (not climate-related)`);

    if (approved.length > 0) {
      console.log("\n   📋 Sample approved opportunities:");
      approved.slice(0, 4).forEach((i) => {
        console.log(`      [${i.climate_score?.toFixed(2)}] [${i.type}] ${i.title.slice(0, 60)}...`);
      });
    }

    // ── Step 3: Save to Supabase ──────────────────────────────
    console.log("\n💾 STEP 3: Saving to Supabase...");
    const { saved, skipped } = await saveOpportunities(approved);
    console.log(`   → Saved: ${saved} new opportunities`);
    console.log(`   → Skipped: ${skipped} (already exist or rejected)`);

    // ── Step 4: Expire past-deadline items in Supabase ───────
    console.log("\n🗓️  STEP 4: Expiring past-deadline opportunities...");
    const expired = await expirePastDeadlines();
    console.log(`   → Expired: ${expired} past-deadline opportunities`);

    // ── Step 5: Prune old opportunities (keep 60 days) ────────
    console.log("\n🧹 STEP 5: Pruning old opportunities (>60 days)...");
    const pruned = await pruneOldOpportunities(60);
    console.log(`   → Pruned: ${pruned} old opportunities`);

    // ── Summary ───────────────────────────────────────────────
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log("\n" + "=".repeat(60));
    console.log(`✅ Job complete in ${duration}s`);
    console.log(`   Scraped: ${rawItems.length} | Approved: ${approved.length} | Saved: ${saved}`);
    console.log("=".repeat(60) + "\n");

    return { success: true, scraped: rawItems.length, approved: approved.length, saved, duration };
  } catch (err) {
    console.error("\n❌ Opportunity job failed:", err.message);
    console.error(err.stack);
    return { success: false, error: err.message };
  }
}

// Run directly if called as a script
if (require.main === module) {
  runOpportunityJob()
    .then((result) => { if (!result.success) process.exit(1); })
    .catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { runOpportunityJob };
