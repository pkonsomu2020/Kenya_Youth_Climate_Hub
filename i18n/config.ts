export const locales = ["en", "sw", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

// Each language is labelled in its own language in the switcher.
export const localeLabels: Record<Locale, string> = {
  en: "English",
  sw: "Kiswahili",
  fr: "Français",
};

export const localeShort: Record<Locale, string> = {
  en: "EN",
  sw: "SW",
  fr: "FR",
};

// Used for Intl date / number formatting.
export const intlLocale: Record<Locale, string> = {
  en: "en-KE",
  sw: "sw-KE",
  fr: "fr-FR",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
