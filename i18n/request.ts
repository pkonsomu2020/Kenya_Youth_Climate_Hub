import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales, type Locale } from "./config";

// Locale comes from the cookie set by the language switcher. First-time visitors
// get their browser language if we support it, otherwise English.
async function resolveLocale(): Promise<Locale> {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const accept = (await headers()).get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if ((locales as readonly string[]).includes(code)) return code as Locale;
  }
  return defaultLocale;
}

// Leaves are strings or arrays (read with t.raw); branches are nested objects.
type Messages = { [key: string]: unknown };

const isBranch = (v: unknown): v is Messages => typeof v === "object" && v !== null && !Array.isArray(v);

// Any key missing from sw/fr falls back to the English text instead of breaking the page.
function withFallback(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = base[key];
    out[key] = isBranch(value) && isBranch(baseValue) ? withFallback(baseValue, value) : value;
  }
  return out;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  const english: Messages = (await import("../messages/en.json")).default;
  const messages =
    locale === defaultLocale
      ? english
      : withFallback(english, (await import(`../messages/${locale}.json`)).default);

  return {
    locale,
    messages,
    timeZone: "Africa/Nairobi",
  };
});
