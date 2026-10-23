// ============================================================
// Sanity checks for messages/{en,sw,fr}.json
//
//   node scripts/check-messages.mjs
//
// 1. ICU apostrophe trap: in next-intl an ASCII apostrophe right before
//    < { } # | starts a quoted literal, so "d'<b>Afosi</b>" prints the tags
//    as text. Use a typographic apostrophe (’) there instead.
// 2. Keys present in English but missing in Swahili or French (those fall
//    back to English at runtime, which is usually an oversight).
// ============================================================
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (l) => JSON.parse(readFileSync(join(root, "messages", `${l}.json`), "utf8"));

function leaves(obj, prefix = "", out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) leaves(v, key, out);
    else out.set(key, v);
  }
  return out;
}

const strings = (v) => (Array.isArray(v) ? v.flatMap(strings) : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [v]);

let problems = 0;
const en = leaves(load("en"));
for (const lang of ["en", "sw", "fr"]) {
  const msgs = leaves(load(lang));
  for (const [key, value] of msgs) {
    for (const s of strings(value)) {
      if (typeof s === "string" && /'[<{}#|]/.test(s)) {
        console.log(`[${lang}] apostrophe before ICU syntax in ${key}: ${s.slice(0, 80)}`);
        problems++;
      }
    }
  }
  if (lang !== "en") {
    const missing = [...en.keys()].filter((k) => !msgs.has(k));
    if (missing.length) {
      console.log(`[${lang}] ${missing.length} keys missing (fall back to English):`);
      for (const k of missing.slice(0, 40)) console.log(`   ${k}`);
      problems += missing.length;
    }
  }
}
console.log(problems ? `\n${problems} problem(s) found.` : "Messages look fine.");
process.exit(problems ? 1 : 0);
