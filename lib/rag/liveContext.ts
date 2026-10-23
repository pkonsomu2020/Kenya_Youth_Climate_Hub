// ============================================================
// Live context for the Climate AI: pulls the current funding calls,
// upcoming events, county flood risk + forecast and matching library
// resources that a question is about, so answers use real data.
// Server-only (called from app/api/chat/route.ts).
// ============================================================
import { KENYA_COUNTIES_WEATHER } from "@/lib/data/kenyaCountiesWeather";
import { OFFICIAL_EVENTS_2026 } from "@/lib/data/officialEvents";
import { getAccuWeatherTelemetry } from "@/lib/services/accuweather";
import { intlLocale, type Locale } from "@/i18n/config";

export type Source = { label: string; href: string };

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const DAY = 86_400_000;

const INTENTS = {
  funding: /(fund|grant|fellowship|internship|job|competition|accelerator|scholarship|deadline|apply|money|ufadhili|ruzuku|ushirika|mafunzo kazini|ajira|mashindano|omba|financ|subvention|bourse|stage|emploi|concours|postuler)/,
  events: /(event|summit|conference|workshop|hackathon|webinar|cop ?3|calendar|tukio|matukio|kongamano|warsha|evenement|sommet|atelier|conference|agenda)/,
  library: /(resource|toolkit|dataset|report|research|paper|guide|tool|library|rasilimali|ripoti|utafiti|maktaba|zana|ressource|rapport|recherche|outil|bibliotheque|donnees)/,
  weather: /(weather|rain|flood|forecast|drought|temperature|hali ya hewa|mvua|mafuriko|utabiri|ukame|meteo|pluie|inondation|prevision|secheresse)/,
};
const TYPE_WORDS: [RegExp, string][] = [
  [/(fellowship|ushirika|bourse)/, "Fellowship"],
  [/(internship|mafunzo kazini|stage)/, "Internship"],
  [/(job|ajira|emploi)/, "Job"],
  [/(competition|mashindano|concours)/, "Competition"],
  [/(grant|ruzuku|subvention)/, "Grant"],
];

async function getJson(url: string, ms = 6000) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(ms), cache: "no-store" });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

function parseDate(s?: string | null) {
  if (!s || /^(open|rolling|unknown|tba)$/i.test(s.trim())) return null;
  const d = new Date(s.replace(/(\d+)(st|nd|rd|th)/gi, "$1"));
  return isNaN(d.getTime()) ? null : d;
}
const cleanTitle = (t: string) => {
  const i = Math.max(t.lastIndexOf(" - "), t.lastIndexOf(" | "));
  return i > 20 ? t.slice(0, i) : t;
};

function countiesIn(q: string) {
  const f = fold(q);
  return KENYA_COUNTIES_WEATHER.filter((c) => {
    const name = fold(c.name).replace(/ city$/, "");
    return new RegExp(`(^|[^a-z])${name.replace(/[-']/g, "[-' ]?")}([^a-z]|$)`).test(f);
  }).slice(0, 2);
}

export async function buildLiveContext(query: string, locale: Locale, origin: string) {
  const f = fold(query);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const counties = countiesIn(query);
  const want = {
    funding: INTENTS.funding.test(f),
    events: INTENTS.events.test(f),
    library: INTENTS.library.test(f),
    weather: INTENTS.weather.test(f) || counties.length > 0,
  };
  const sections: string[] = [];
  const sources: Source[] = [];

  const [opps, liveEvents, library] = await Promise.all([
    want.funding ? getJson(`${origin}/api/opportunities?limit=100&lang=${locale}`) : null,
    want.events ? getJson(`${origin}/api/events?limit=100&lang=${locale}`) : null,
    want.library ? getJson(`${origin}/api/library?limit=50&lang=${locale}`) : null,
  ]);

  // ---- funding calls ----
  if (want.funding && opps?.data) {
    const type = TYPE_WORDS.find(([re]) => re.test(f))?.[1];
    type Opp = { title?: string; name?: string; provider?: string; type?: string; deadline?: string; url?: string; amount?: string | null };
    const rows = (opps.data as Opp[]).filter((o) => !type || o.type === type);
    const dated = rows
      .map((o) => ({ o, d: parseDate(o.deadline) }))
      .filter((x): x is { o: Opp; d: Date } => !!x.d && x.d >= today)
      .sort((a, b) => a.d.getTime() - b.d.getTime())
      .slice(0, 6);
    const open = rows.filter((o) => /^(open|rolling)$/i.test((o.deadline ?? "").trim())).slice(0, 3);
    const line = (o: Opp, when: string) =>
      `- ${cleanTitle(o.title || o.name || "")}${o.provider ? ` (${o.provider})` : ""} — ${o.type ?? "Opportunity"}${o.amount ? `, ${o.amount}` : ""} — ${when} — ${o.url}`;
    sections.push(
      `LIVE FUNDING CALLS${type ? ` (type: ${type})` : ""} — ${rows.length} on the board. Soonest closing:\n` +
        (dated.length ? dated.map(({ o, d }) => line(o, `closes ${d.toISOString().slice(0, 10)} (in ${Math.round((d.getTime() - today.getTime()) / DAY)} days)`)).join("\n") : "- none with a dated deadline") +
        (open.length ? `\nOpen / rolling:\n${open.map((o) => line(o, "open, apply any time")).join("\n")}` : ""),
    );
    sources.push({ label: "Funding board", href: "/opportunities" });
  }

  // ---- events (official calendar + live feed) ----
  if (want.events) {
    type Ev = { title: string; start: string | null; where: string; link?: string };
    const official: Ev[] = OFFICIAL_EVENTS_2026.map((e) => ({ title: e.title, start: e.endDate >= today.toISOString().slice(0, 10) ? e.startDate : null, where: e.location, link: e.link }))
      .filter((e) => e.start);
    type LiveEv = { title: string; event_date?: string | null; location?: string; url?: string };
    const live: Ev[] = ((liveEvents?.data ?? []) as LiveEv[])
      .filter((e) => e.event_date && e.event_date >= today.toISOString().slice(0, 10))
      .map((e) => ({ title: e.title, start: e.event_date!.slice(0, 10), where: e.location ?? "", link: e.url }));
    const seen = new Set<string>();
    const next = [...official, ...live]
      .sort((a, b) => a.start!.localeCompare(b.start!))
      .filter((e) => { const k = fold(e.title).replace(/[^a-z0-9]/g, "").slice(0, 16); if (seen.has(k)) return false; seen.add(k); return true; })
      .slice(0, 6);
    sections.push(`UPCOMING EVENTS (next ${next.length}):\n${next.map((e) => `- ${e.start}: ${e.title}${e.where ? ` — ${e.where}` : ""}${e.link ? ` — ${e.link}` : ""}`).join("\n")}`);
    sources.push({ label: "Events calendar", href: "/events" });
  }

  // ---- county flood risk + live forecast ----
  if (counties.length) {
    const blocks = await Promise.all(
      counties.map(async (c) => {
        let forecast = "";
        try {
          const w = await Promise.race([
            getAccuWeatherTelemetry(c.name, intlLocale[locale]),
            new Promise<null>((r) => setTimeout(() => r(null), 7000)),
          ]);
          if (w) {
            forecast = `\n  Now: ${w.currentTemp}, ${w.weatherText}; humidity ${w.humidity}; wind ${w.windSpeed}.` +
              `\n  Next days: ${w.dailyForecasts.slice(0, 4).map((d) => `${d.dayName} ${d.dateStr} ${d.highTemp}/${d.lowTemp}, rain ${d.precipProb}`).join("; ")}.`;
          }
        } catch { /* forecast unavailable; risk data still applies */ }
        return `- ${c.name} County (no. ${c.countyCode}, ${c.region}): flood risk "${c.riskLevel}", typical ${c.tempRange}. Advisory: ${c.advisory}${forecast}`;
      }),
    );
    sections.push(`COUNTY CONDITIONS (Climate Watch):\n${blocks.join("\n")}`);
    sources.push({ label: "Climate Watch", href: "/weather" });
  } else if (want.weather) {
    const high = KENYA_COUNTIES_WEATHER.filter((c) => c.riskLevel === "HIGH FLOOD RISK").map((c) => c.name);
    sections.push(`FLOOD RISK THIS SEASON: ${high.length} of 47 counties are at high flood risk: ${high.join(", ")}. Ask the user which county they are in for a forecast.`);
    sources.push({ label: "Climate Watch", href: "/weather" });
  }

  // ---- library resources matching the question ----
  if (want.library && library?.data) {
    type Res = { title: string; category?: string; topic?: string; url?: string; is_free?: boolean };
    const words = f.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 3);
    const scored = (library.data as Res[])
      .map((r) => ({ r, s: words.filter((w) => fold(`${r.title} ${r.topic ?? ""} ${r.category ?? ""}`).includes(w)).length }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 5);
    sections.push(`E-LIBRARY RESOURCES:\n${scored.map(({ r }) => `- ${cleanTitle(r.title)} — ${r.category ?? "Resource"}${r.topic ? `, ${r.topic}` : ""}${r.is_free ? ", free" : ""} — ${r.url}`).join("\n")}`);
    sources.push({ label: "E-Library", href: "/e-library" });
  }

  return { text: sections.join("\n\n"), sources };
}
