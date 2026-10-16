import type { Locale } from "@/i18n/config";

/**
 * Static data files keep their English text inline. Swahili / French text lives
 * in lib/data/translations/* as per-item overrides keyed by a stable id.
 * Missing fields fall back to English.
 */
export type Overrides<T> = Partial<Record<Exclude<Locale, "en">, Record<string, Partial<T>>>>;

export function localizeItems<T>(
  items: readonly T[],
  overrides: Overrides<T>,
  locale: string,
  getId: (item: T) => string,
): T[] {
  const table = locale === "en" ? undefined : overrides[locale as Exclude<Locale, "en">];
  if (!table) return [...items];
  return items.map((item) => {
    const o = table[getId(item)];
    return o ? { ...item, ...o } : item;
  });
}
