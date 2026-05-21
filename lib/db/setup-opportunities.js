// ============================================================
// Opportunities Table Setup
// Run: node src/db/setup-opportunities.js
// Then paste the SQL into Supabase SQL Editor
// ============================================================

const supabase = require("./supabase");

const SQL = `
-- ============================================================
-- KYCH Opportunities Table
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS opportunities (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  url           TEXT UNIQUE NOT NULL,
  source        TEXT,
  provider      TEXT,
  type          TEXT DEFAULT 'Grant',
  topic         TEXT DEFAULT 'Innovation',
  deadline      TEXT,
  amount        TEXT,
  climate_score NUMERIC(3,2) DEFAULT 0,
  ai_summary    TEXT,
  color         TEXT DEFAULT '#059669',
  is_approved   BOOLEAN DEFAULT TRUE,
  scraped_at    TIMESTAMPTZ,
  fetched_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_opp_type     ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opp_topic    ON opportunities(topic);
CREATE INDEX IF NOT EXISTS idx_opp_approved ON opportunities(is_approved);
CREATE INDEX IF NOT EXISTS idx_opp_fetched  ON opportunities(fetched_at DESC);

-- Row Level Security
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON opportunities FOR SELECT
  USING (is_approved = TRUE);

CREATE POLICY "Service role full access"
  ON opportunities FOR ALL
  USING (auth.role() = 'service_role');
`;

async function setup() {
  console.log("📋 SQL to run in Supabase SQL Editor:");
  console.log("=".repeat(60));
  console.log(SQL);
  console.log("=".repeat(60));
  console.log("\n📌 Steps:");
  console.log("1. Go to https://supabase.com/dashboard");
  console.log("2. Open your project → SQL Editor → New query");
  console.log("3. Paste the SQL above and click Run\n");

  // Test connection
  console.log("🔌 Testing connection...");
  const { data, error } = await supabase.from("opportunities").select("count").limit(1);

  if (error && error.code === "42P01") {
    console.log("⚠️  Table 'opportunities' does not exist yet. Run the SQL above first.\n");
  } else if (error) {
    console.error("❌ Connection error:", error.message);
  } else {
    console.log("✅ Table 'opportunities' exists and is ready!\n");
  }
}

setup().catch(console.error);
