// ============================================================
// Events Table Setup
// Run: node src/db/setup-events.js
// Then paste the SQL into Supabase SQL Editor
// ============================================================

const supabase = require("./supabase");

const SQL = `
-- ============================================================
-- KYCH Live Events Table
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS events_live (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  url           TEXT UNIQUE NOT NULL,
  source        TEXT,
  event_type    TEXT DEFAULT 'Conference',
  format        TEXT DEFAULT 'In-person',
  event_date    TEXT,
  location      TEXT DEFAULT 'TBA',
  topic         TEXT DEFAULT 'Innovation',
  climate_score NUMERIC(3,2) DEFAULT 0,
  ai_summary    TEXT,
  color         TEXT DEFAULT '#059669',
  is_approved   BOOLEAN DEFAULT TRUE,
  scraped_at    TIMESTAMPTZ,
  fetched_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_type     ON events_live(event_type);
CREATE INDEX IF NOT EXISTS idx_events_format   ON events_live(format);
CREATE INDEX IF NOT EXISTS idx_events_approved ON events_live(is_approved);
CREATE INDEX IF NOT EXISTS idx_events_fetched  ON events_live(fetched_at DESC);

ALTER TABLE events_live ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON events_live FOR SELECT
  USING (is_approved = TRUE);

CREATE POLICY "Service role full access"
  ON events_live FOR ALL
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

  console.log("🔌 Testing connection...");
  const { data, error } = await supabase.from("events_live").select("count").limit(1);

  if (error && error.code === "42P01") {
    console.log("⚠️  Table 'events_live' does not exist yet. Run the SQL above first.\n");
  } else if (error) {
    console.error("❌ Connection error:", error.message);
  } else {
    console.log("✅ Table 'events_live' exists and is ready!\n");
  }
}

setup().catch(console.error);
