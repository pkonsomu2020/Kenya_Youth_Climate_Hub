"use client";
// One list for the Events page: the official 2026 climate calendar (static, translated
// in lib/data/translations) plus live events collected into Supabase (/api/events).
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useLocalizedEvents } from "@/lib/data/useLocalizedEvents";
import { OFFICIAL_EVENTS_2026 } from "@/lib/data/officialEvents";

export type Region = "Kenya" | "Africa / Regional" | "Global";

export type BoardEvent = {
  id: string;
  title: string;
  description: string;
  start: string | null; // YYYY-MM-DD; null = date to be announced
  end: string | null;
  dateDisplay?: string;
  location: string;
  region: Region;
  format: string;
  kind: string;
  organizer?: string;
  sdgs: string[];
  link?: string;
  official: boolean;
};

type LiveRow = {
  id: string; title: string; description?: string; ai_summary?: string; url?: string; source?: string;
  event_type?: string; format?: string; event_date?: string | null; location?: string;
};

function regionOf(row: LiveRow): Region {
  const text = `${row.source ?? ""} ${row.location ?? ""}`;
  if (/kenya|nairobi|mombasa|kisumu|limuru|kibera/i.test(text)) return "Kenya";
  if (/africa/i.test(text)) return "Africa / Regional";
  return "Global";
}

// same event from both sources: compare titles without punctuation (English and translated),
// or a date within a week of the official dates with the same opening characters ("COP31…")
const titleKey = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16);

const DATE_RE = /^\d{4}-\d{2}-\d{2}/;

const WEEK = 7 * 86400000;
function nearOfficial(r: LiveRow) {
  if (!r.event_date || !DATE_RE.test(r.event_date)) return false;
  const d = Date.parse(r.event_date.slice(0, 10));
  const k = titleKey(r.title).slice(0, 5);
  return OFFICIAL_EVENTS_2026.some((e) =>
    titleKey(e.title).slice(0, 5) === k && d >= Date.parse(e.startDate) - WEEK && d <= Date.parse(e.endDate) + WEEK);
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useEventBoard() {
  const locale = useLocale();
  const official = useLocalizedEvents();
  const [live, setLive] = useState<LiveRow[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/events?limit=100&lang=${locale}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (!cancelled) { setLive(j?.data ?? []); setLoadedFor(locale); } })
      .catch(() => { if (!cancelled) setLoadedFor(locale); });
    return () => { cancelled = true; };
  }, [locale]);

  const events = useMemo<BoardEvent[]>(() => {
    const a: BoardEvent[] = official.map((e) => ({
      id: e.id, title: e.title, description: e.description, start: e.startDate, end: e.endDate,
      dateDisplay: e.dateDisplay, location: e.location, region: e.region, format: e.format, kind: e.eventType,
      organizer: e.organizer, sdgs: e.sdgs, link: e.link, official: true,
    }));
    const seen = new Set([...a, ...OFFICIAL_EVENTS_2026].map((e) => titleKey(e.title)));
    const b: BoardEvent[] = live
      .filter((r) => !seen.has(titleKey(r.title)) && !nearOfficial(r))
      .map((r) => {
        const start = r.event_date && DATE_RE.test(r.event_date) ? r.event_date.slice(0, 10) : null;
        return {
          id: r.id, title: r.title, description: r.ai_summary || r.description || "", start, end: start,
          location: r.location || "", region: regionOf(r), format: r.format || "In-person", kind: r.event_type || "Event",
          sdgs: [], link: r.url, official: false,
        };
      });
    // dated events by start date, then the ones still to be announced
    return [...a, ...b].sort((x, y) => (x.start ?? "9999").localeCompare(y.start ?? "9999"));
  }, [official, live]);

  return { events, loading: loadedFor !== locale };
}

/** Add-to-Google-Calendar link (all-day style window, same as the old page). */
export function calendarUrl(e: BoardEvent) {
  if (!e.start) return null;
  const f = (s: string) => s.replace(/-/g, "");
  const details = encodeURIComponent(`${e.description}${e.organizer ? `\n\nOrganized by: ${e.organizer}` : ""}\nVia Kenya Youth Climate Hub (KYCH)`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${f(e.start)}T060000Z/${f(e.end ?? e.start)}T140000Z&details=${details}&location=${encodeURIComponent(e.location)}`;
}
