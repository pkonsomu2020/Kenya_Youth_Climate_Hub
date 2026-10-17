"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// Admin editor for the `translations` JSONB column: { sw: {...}, fr: {...} }.
// Field keys must match TRANSLATABLE_FIELDS in lib/i18n/contentTranslation.js.

export type TranslationLocale = "sw" | "fr";
export type Translations = Partial<Record<TranslationLocale, Record<string, string>>>;
export type TranslationField = { key: string; label: string; multiline?: boolean };

const LOCALES: { code: TranslationLocale; label: string }[] = [
  { code: "sw", label: "Kiswahili" },
  { code: "fr", label: "Français" },
];

/** Fill every locale/field so inputs are controlled, prefilled from the row. */
export function initTranslations(source: Translations | null | undefined, fields: TranslationField[]) {
  const out = {} as Record<TranslationLocale, Record<string, string>>;
  for (const { code } of LOCALES) {
    out[code] = {};
    for (const f of fields) out[code][f.key] = source?.[code]?.[f.key] || "";
  }
  return out;
}

/** Drop empty strings/locales so the public site falls back to English for them. */
export function cleanTranslations(value: Translations): Translations {
  const out: Translations = {};
  for (const { code } of LOCALES) {
    const entries = Object.entries(value[code] || {})
      .map(([k, v]) => [k, v.trim()] as const)
      .filter(([, v]) => v);
    if (entries.length) out[code] = Object.fromEntries(entries);
  }
  return out;
}

const inputStyle = { width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 0, fontSize: ".88rem", fontFamily: "inherit" } as const;

export function TranslationFields({
  fields, value, onChange,
}: {
  fields: TranslationField[];
  value: Record<TranslationLocale, Record<string, string>>;
  onChange: (next: Record<TranslationLocale, Record<string, string>>) => void;
}) {
  const [open, setOpen] = useState<Record<TranslationLocale, boolean>>({ sw: false, fr: false });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
      <p style={{ fontSize: ".72rem", color: "var(--muted-foreground)", margin: 0 }}>
        Translations are filled automatically. Edit them here to correct wording; leave a field empty to show English. If you change the English text and leave these untouched, they are re-translated on save.
      </p>
      {LOCALES.map(({ code, label }) => {
        const filled = fields.filter((f) => value[code][f.key]?.trim()).length;
        return (
          <div key={code} style={{ border: "1px solid var(--border)" }}>
            <button
              type="button"
              onClick={() => setOpen({ ...open, [code]: !open[code] })}
              aria-expanded={open[code]}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: ".4rem", padding: ".6rem .8rem", background: "var(--cd)", border: "none", cursor: "pointer", fontFamily: "var(--fs)", fontWeight: 600, fontSize: ".82rem", color: "var(--dark)", textAlign: "left" }}
            >
              {open[code] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {label}
              <span style={{ marginLeft: "auto", fontSize: ".7rem", fontFamily: "var(--fm)", color: "var(--muted-foreground)", fontWeight: 400 }}>
                {filled}/{fields.length} filled
              </span>
            </button>
            {open[code] && (
              <div style={{ display: "flex", flexDirection: "column", gap: ".8rem", padding: ".8rem" }}>
                {fields.map((f) => {
                  const set = (v: string) => onChange({ ...value, [code]: { ...value[code], [f.key]: v } });
                  return (
                    <div key={f.key}>
                      <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--dark)", display: "block", marginBottom: ".3rem" }}>
                        {f.label} ({label})
                      </label>
                      {f.multiline ? (
                        <textarea lang={code} value={value[code][f.key]} onChange={(e) => set(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                      ) : (
                        <input lang={code} value={value[code][f.key]} onChange={(e) => set(e.target.value)} style={inputStyle} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
