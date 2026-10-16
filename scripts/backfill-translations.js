// ============================================================
// One-time backfill: translate existing content into Kiswahili + French.
// New content is translated automatically when it is saved; this script
// only fills rows that were stored before translations existed.
//
// Usage (needs NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENAI_API_KEY):
//   npm run translate:backfill
//   npm run translate:backfill -- news_articles   (one table only)
// ============================================================
const supabase = require("../lib/db/supabase");
const { TRANSLATABLE_FIELDS, translateRows } = require("../lib/i18n/contentTranslation");

const PAGE = 40;

async function backfillTable(table) {
  const fields = TRANSLATABLE_FIELDS[table];
  let done = 0;
  let failed = 0;

  for (;;) {
    const { data: rows, error } = await supabase
      .from(table)
      .select(["id", ...fields].join(","))
      .is("translations", null)
      .limit(PAGE);

    if (error) {
      console.error(`❌ ${table}: ${error.message}`);
      return;
    }
    if (!rows.length) break;

    const translations = await translateRows(table, rows);
    let progressed = 0;
    for (let i = 0; i < rows.length; i++) {
      if (!translations[i]) { failed++; continue; }
      const { error: upErr } = await supabase.from(table).update({ translations: translations[i] }).eq("id", rows[i].id);
      if (upErr) { failed++; continue; }
      done++;
      progressed++;
    }
    console.log(`  ${table}: ${done} translated so far`);
    // Stop if a whole page failed (e.g. no OpenAI key) instead of looping forever.
    if (!progressed) break;
  }

  console.log(`✅ ${table}: ${done} translated, ${failed} skipped`);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is not set — nothing can be translated.");
    process.exit(1);
  }
  const only = process.argv[2];
  const tables = only ? [only] : Object.keys(TRANSLATABLE_FIELDS);
  for (const table of tables) {
    if (!TRANSLATABLE_FIELDS[table]) {
      console.error(`❌ Unknown table "${table}". Use one of: ${Object.keys(TRANSLATABLE_FIELDS).join(", ")}`);
      process.exit(1);
    }
    await backfillTable(table);
  }
}

main();
