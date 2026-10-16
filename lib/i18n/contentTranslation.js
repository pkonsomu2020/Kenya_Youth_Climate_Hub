// ============================================================
// Content translation — Kiswahili + French for dynamic content
// Translates scraped / admin-created rows ONCE when they are saved
// and stores the result in a `translations` JSONB column:
//   { sw: { title, description, ... }, fr: { ... } }
// API routes then swap the fields for the visitor's language.
// ============================================================
const OpenAI = require("openai");

const TARGET_LOCALES = ["sw", "fr"];
const LANGUAGE_NAMES = { sw: "Kiswahili (Swahili as spoken in Kenya)", fr: "French" };

// Which text columns are translated per table. Everything else (urls, dates,
// type/topic/category enums used for filtering) stays as-is.
const TRANSLATABLE_FIELDS = {
  news_articles: ["title", "excerpt"],
  events_live: ["title", "description", "location"],
  opportunities: ["title", "description"],
  library_tools: ["title", "description", "use_case"],
};

const BATCH_SIZE = 8;

let client = null;
function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.startsWith("sk-proj-placeholder")) return null;
  if (!client) client = new OpenAI({ apiKey: key });
  return client;
}

function pickFields(row, fields) {
  const out = {};
  for (const f of fields) if (row[f]) out[f] = String(row[f]);
  return out;
}

async function translateBatch(items, fields) {
  const openai = getClient();
  if (!openai) return null;

  const prompt = `You translate short content for the Kenya Youth Climate Hub, a website for young Kenyans aged 15–35.
Translate each item's fields into ${TARGET_LOCALES.map((l) => `${l} = ${LANGUAGE_NAMES[l]}`).join(" and ")}.
Rules:
- Natural, friendly, youth-appropriate tone; not stiff or bureaucratic.
- Keep names of people, organisations, programmes, places, currencies, numbers and URLs unchanged.
- Keep each translation about the same length as the original.
- Only translate the fields given: ${fields.join(", ")}.

Items:
${JSON.stringify(items.map((it, index) => ({ index, ...it })), null, 2)}

Respond with ONLY JSON of this shape:
{"items":[{"index":0,"sw":{${fields.map((f) => `"${f}":"..."`).join(",")}},"fr":{${fields.map((f) => `"${f}":"..."`).join(",")}}}]}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    response_format: { type: "json_object" },
    max_tokens: 4000,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return Array.isArray(parsed.items) ? parsed.items : null;
}

/**
 * Translate an array of rows for `table`. Returns a parallel array of
 * `translations` objects (or null where translation was unavailable).
 * Never throws — a failed translation must not block saving content.
 */
async function translateRows(table, rows) {
  const fields = TRANSLATABLE_FIELDS[table];
  if (!fields || !rows?.length || !getClient()) return rows.map(() => null);

  const result = rows.map(() => null);
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const slice = rows.slice(i, i + BATCH_SIZE);
    try {
      const items = await translateBatch(slice.map((r) => pickFields(r, fields)), fields);
      for (const item of items || []) {
        const idx = i + Number(item.index);
        if (idx < i || idx >= i + slice.length) continue;
        const translations = {};
        for (const locale of TARGET_LOCALES) {
          if (item[locale] && typeof item[locale] === "object") translations[locale] = pickFields(item[locale], fields);
        }
        if (Object.keys(translations).length) result[idx] = translations;
      }
    } catch (err) {
      console.error(`  ⚠️  Translation error (${table}):`, err.message);
    }
  }
  return result;
}

/**
 * Add a `translations` field to records about to be saved.
 * Rows already in the database with translations keep them (matched by url),
 * so re-scraping the same item never pays for a second translation.
 */
async function withTranslations(supabase, table, records) {
  if (!records?.length) return records;

  const existing = new Map();
  const urls = records.map((r) => r.url).filter(Boolean);
  if (urls.length) {
    const { data } = await supabase.from(table).select("url, translations").in("url", urls);
    for (const row of data || []) if (row.translations) existing.set(row.url, row.translations);
  }

  const todo = records.filter((r) => !existing.has(r.url));
  const translated = await translateRows(table, todo);
  const fresh = new Map(todo.map((r, i) => [r, translated[i]]));

  return records.map((r) => {
    const translations = existing.get(r.url) ?? fresh.get(r) ?? null;
    return translations ? { ...r, translations } : r;
  });
}

/**
 * Return a copy of `row` with translatable fields swapped to `locale`
 * (falling back to English per field) and the translations blob removed.
 */
function localizeRow(row, locale) {
  if (!row) return row;
  const { translations, ...rest } = row;
  if (!locale || locale === "en" || !translations || !translations[locale]) return rest;
  const t = translations[locale];
  const out = { ...rest };
  for (const [field, value] of Object.entries(t)) if (value) out[field] = value;
  return out;
}

module.exports = { TRANSLATABLE_FIELDS, TARGET_LOCALES, translateRows, withTranslations, localizeRow };
