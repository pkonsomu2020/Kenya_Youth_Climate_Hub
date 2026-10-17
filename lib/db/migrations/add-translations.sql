-- ============================================================
-- Multilingual content (English / Kiswahili / French)
-- Run once in the Supabase SQL Editor.
--
-- Each row keeps its English text in the normal columns and gets
-- a `translations` JSONB column shaped like:
--   { "sw": { "title": "...", "description": "..." },
--     "fr": { "title": "...", "description": "..." } }
-- Rows without translations simply show English.
-- ============================================================

ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE events_live   ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE library_tools ADD COLUMN IF NOT EXISTS translations JSONB;

-- After running this, translate existing rows with:
--   npm run translate:backfill
