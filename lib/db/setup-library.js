
const supabase = require("./supabase");

const SQL = `
CREATE TABLE IF NOT EXISTS library_tools (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT NOT NULL,
  description    TEXT,
  url            TEXT UNIQUE NOT NULL,
  source         TEXT,
  category       TEXT DEFAULT 'Open Source Tool',
  topic          TEXT DEFAULT 'Innovation',
  use_case       TEXT,
  difficulty     TEXT DEFAULT 'Intermediate',
  is_free        BOOLEAN DEFAULT TRUE,
  tech_stack     TEXT,
  stars          TEXT,
  language       TEXT,
  trending_score INTEGER DEFAULT 5,
  climate_score  NUMERIC(3,2) DEFAULT 0,
  color          TEXT DEFAULT '#059669',
  icon           TEXT DEFAULT 'Code2',
  badge          TEXT DEFAULT 'OSS',
  is_approved    BOOLEAN DEFAULT TRUE,
  scraped_at     TIMESTAMPTZ,
  fetched_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lib_category  ON library_tools(category);
CREATE INDEX IF NOT EXISTS idx_lib_topic     ON library_tools(topic);
CREATE INDEX IF NOT EXISTS idx_lib_trending  ON library_tools(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_lib_approved  ON library_tools(is_approved);

ALTER TABLE library_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON library_tools FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Service role full access"
  ON library_tools FOR ALL USING (auth.role() = 'service_role');
`;

async function setup() {
  console.log("📋 SQL to run in Supabase SQL Editor:");
  console.log("=".repeat(60));
  console.log(SQL);
  console.log("=".repeat(60));

  const { data, error } = await supabase.from("library_tools").select("count").limit(1);
  if (error && error.code === "42P01") {
    console.log("\n⚠️  Table 'library_tools' does not exist yet. Run the SQL above first.\n");
  } else if (error) {
    console.error("❌ Connection error:", error.message);
  } else {
    console.log("\n✅ Table 'library_tools' exists and is ready!\n");
  }
}

setup().catch(console.error);
