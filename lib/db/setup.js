// ============================================================
// Database Setup Script
// Run once: node src/db/setup.js
// Creates the news_articles table in Supabase
// ============================================================

const supabase = require("./supabase");

async function setupDatabase() {
  console.log("🔧 Setting up KYCH database tables...\n");

  // NOTE: Supabase doesn't allow raw SQL via the JS client directly.
  // This script verifies the connection and checks if the table exists.
  // You need to run the SQL below in your Supabase SQL Editor:
  // https://supabase.com/dashboard → SQL Editor

  const SQL = `
-- ============================================================
-- KYCH News Articles Table
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS news_articles (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  excerpt       TEXT,
  url           TEXT UNIQUE NOT NULL,
  source        TEXT,
  source_url    TEXT,
  published_at  TIMESTAMPTZ,
  fetched_at    TIMESTAMPTZ DEFAULT NOW(),
  category      TEXT DEFAULT 'News',
  relevance     TEXT DEFAULT 'High',
  ai_score      NUMERIC(3,2) DEFAULT 0,
  ai_summary    TEXT,
  image_url     TEXT,
  is_approved   BOOLEAN DEFAULT TRUE,
  gradient      TEXT DEFAULT '#059669',
  icon          TEXT DEFAULT 'Globe'
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category  ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_approved  ON news_articles(is_approved);

-- Enable Row Level Security
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (frontend can read without auth)
CREATE POLICY "Public read access"
  ON news_articles FOR SELECT
  USING (is_approved = TRUE);

-- Allow service role full access (backend can write)
CREATE POLICY "Service role full access"
  ON news_articles FOR ALL
  USING (auth.role() = 'service_role');
`;

  console.log("📋 SQL to run in Supabase SQL Editor:");
  console.log("=".repeat(60));
  console.log(SQL);
  console.log("=".repeat(60));
  console.log("\n📌 Steps:");
  console.log("1. Go to https://supabase.com/dashboard");
  console.log("2. Select your project");
  console.log("3. Click 'SQL Editor' in the left sidebar");
  console.log("4. Paste the SQL above and click 'Run'\n");

  // Test connection
  console.log("🔌 Testing Supabase connection...");
  const { data, error } = await supabase
    .from("news_articles")
    .select("count")
    .limit(1);

  if (error && error.code === "42P01") {
    console.log("⚠️  Table 'news_articles' does not exist yet.");
    console.log("   Please run the SQL above in Supabase SQL Editor first.\n");
  } else if (error) {
    console.error("❌ Connection error:", error.message);
  } else {
    console.log("✅ Connected to Supabase successfully!");
    console.log("✅ Table 'news_articles' exists and is ready.\n");
  }
}

setupDatabase().catch(console.error);
