// ============================================================
// /api/alerts — automated alert strip content, built from live data:
// heavy rain and heat from the forecast, seasonal flood advisories,
// funding calls about to close and the next event. No manual editing.
// Returns structured alerts; the client renders them with translated
// templates (messages: alerts.*).
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { KENYA_COUNTIES_WEATHER } from "@/lib/data/kenyaCountiesWeather";
import { OFFICIAL_EVENTS_2026 } from "@/lib/data/officialEvents";
import { getAccuWeatherTelemetry } from "@/lib/services/accuweather";
import { defaultLocale, intlLocale, isLocale, type Locale } from "@/i18n/config";

export type Alert = {
  type: "rain" | "heat" | "flood" | "closing" | "event";
  /** values for the translated template; strings already in the right language where they come from data */
  params: Record<string, string | number>;
  href: string;
};

// A spread of counties across regions; forecasts are cached by the weather service.
const WATCH = ["Kisumu", "Mombasa", "Nairobi City", "Garissa", "Turkana", "Kakamega", "Tana River", "Nakuru", "Mandera"];
const TTL = 15 * 60_000;
const cache = new Map<Locale, { at: number; alerts: Alert[] }>();

const DAY = 86_400_000;
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
function parseDate(s?: string | null) {
  if (!s || /^(open|rolling|unknown|tba)$/i.test(s.trim())) return null;
  const d = new Date(s.replace(/(\d+)(st|nd|rd|th)/gi, "$1"));
  return isNaN(d.getTime()) ? null : d;
}
const cleanTitle = (t: string) => {
  const i = Math.max(t.lastIndexOf(" - "), t.lastIndexOf(" | "));
  return (i > 20 ? t.slice(0, i) : t).replace(/\s+/g, " ").trim();
};
async function getJson(url: string) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(6000), cache: "no-store" });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}
const withTimeout = <T,>(p: Promise<T>, ms: number) => Promise.race([p, new Promise<null>((r) => setTimeout(() => r(null), ms))]);

async function build(locale: Locale, origin: string): Promise<Alert[]> {
  const today = startOfToday();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const [weather, opps, events] = await Promise.all([
    Promise.all(WATCH.map((name) => withTimeout(getAccuWeatherTelemetry(name, intlLocale[locale]).catch(() => null), 7000))),
    getJson(`${origin}/api/opportunities?limit=100&lang=${locale}`),
    getJson(`${origin}/api/events?limit=100&lang=${locale}`),
  ]);

  const alerts: Alert[] = [];

  // ---- heavy rain: highest chance in the next two days, >= 70% ----
  const rain = weather
    .map((w, i) => {
      if (!w) return null;
      const days = w.dailyForecasts.slice(0, 2).map((d, k) => ({ d, k, p: parseInt(d.precipProb) || 0 }));
      const top = days.sort((a, b) => b.p - a.p)[0];
      return top && top.p >= 70 ? { county: WATCH[i].replace(/ City$/, ""), p: top.p, when: top.k } : null;
    })
    .filter((x): x is { county: string; p: number; when: number } => !!x)
    .sort((a, b) => b.p - a.p);
  if (rain.length) {
    alerts.push({
      type: "rain",
      params: { county: rain[0].county, chance: rain[0].p, when: rain[0].when === 0 ? "today" : "tomorrow", others: rain.length - 1 },
      href: "/weather",
    });
  }

  // ---- heat: hottest forecast high >= 35°C ----
  const heat = weather
    .map((w, i) => (w ? { county: WATCH[i].replace(/ City$/, ""), t: Math.max(...w.dailyForecasts.slice(0, 3).map((d) => parseInt(d.highTemp) || 0)) } : null))
    .filter((x): x is { county: string; t: number } => !!x && x.t >= 35)
    .sort((a, b) => b.t - a.t);
  if (heat.length) alerts.push({ type: "heat", params: { county: heat[0].county, temp: heat[0].t }, href: "/weather" });

  // ---- seasonal flood advisories (county risk list) ----
  const high = KENYA_COUNTIES_WEATHER.filter((c) => c.riskLevel === "HIGH FLOOD RISK");
  if (high.length) {
    const regions = [...new Set(high.map((c) => c.region))];
    // region names are sent as keys (comma-separated) and translated on the client
    alerts.push({ type: "flood", params: { count: high.length, regions: regions.slice(0, 3).join("|") }, href: "/weather" });
  }

  // ---- funding calls closing within 3 days ----
  type Opp = { title?: string; name?: string; deadline?: string };
  const closing = ((opps?.data ?? []) as Opp[])
    .map((o) => ({ o, d: parseDate(o.deadline) }))
    .filter((x): x is { o: Opp; d: Date } => !!x.d && x.d >= today && x.d.getTime() - today.getTime() <= 3 * DAY)
    .sort((a, b) => a.d.getTime() - b.d.getTime());
  if (closing.length) {
    alerts.push({
      type: "closing",
      params: { days: Math.round((closing[0].d.getTime() - today.getTime()) / DAY), title: cleanTitle(closing[0].o.title || closing[0].o.name || ""), others: closing.length - 1 },
      href: "/opportunities",
    });
  }

  // ---- next event within 14 days (official calendar + live feed) ----
  type LiveEv = { title: string; event_date?: string | null };
  const upcoming = [
    ...OFFICIAL_EVENTS_2026.filter((e) => e.startDate >= iso(today)).map((e) => ({ title: e.title, start: e.startDate })),
    ...((events?.data ?? []) as LiveEv[]).filter((e) => e.event_date && e.event_date >= iso(today)).map((e) => ({ title: e.title, start: e.event_date!.slice(0, 10) })),
  ].sort((a, b) => a.start.localeCompare(b.start));
  const next = upcoming[0];
  if (next) {
    const days = Math.round((new Date(`${next.start}T00:00:00`).getTime() - today.getTime()) / DAY);
    if (days <= 14) alerts.push({ type: "event", params: { days, title: cleanTitle(next.title) }, href: "/events" });
  }

  return alerts;
}

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang");
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const hit = cache.get(locale);
  if (hit && Date.now() - hit.at < TTL) return NextResponse.json({ alerts: hit.alerts, cached: true });
  const alerts = await build(locale, req.nextUrl.origin);
  cache.set(locale, { at: Date.now(), alerts });
  return NextResponse.json({ alerts }, { headers: { "Cache-Control": "public, max-age=300" } });
}
