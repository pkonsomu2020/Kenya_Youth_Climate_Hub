"use client";
// ============================================================
// useHomeFeed — live data for the homepage:
// the "Right now on KYCH" board, live counts and upcoming events.
// Content arrives already translated via ?lang= (see lib/i18n/contentTranslation.js).
// ============================================================
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export type FeedOpportunity = { id: string; title: string; url: string; provider?: string; type?: string; deadline?: string | null };
export type FeedNews = { id: string; title: string; url: string; source?: string; published_at?: string; category?: string };
export type FeedEvent = { id: string; title: string; url?: string; event_type?: string; event_date?: string | null; location?: string; format?: string };

export type HomeFeed = {
  loading: boolean;
  closing: (FeedOpportunity & { daysLeft: number }) | null;
  latestNews: (FeedNews & { daysAgo: number }) | null;
  nextEvent: (FeedEvent & { daysUntil: number }) | null;
  featuredGrant: FeedOpportunity | null;
  upcomingEvents: (FeedEvent & { date: Date })[];
  counts: { opportunities: number | null; library: number | null; events: number | null };
};

const DAY = 86_400_000;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDate(str?: string | null): Date | null {
  if (!str || /^(open|rolling|unknown|tba)$/i.test(str.trim())) return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  const d2 = new Date(str.replace(/(\d+)(st|nd|rd|th)/gi, "$1"));
  return isNaN(d2.getTime()) ? null : d2;
}

const sum = (o?: Record<string, number>) => (o ? Object.values(o).reduce((a, b) => a + b, 0) : null);

async function getJson(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function useHomeFeed(): HomeFeed {
  const locale = useLocale();
  const [feed, setFeed] = useState<HomeFeed>({
    loading: true,
    closing: null,
    latestNews: null,
    nextEvent: null,
    featuredGrant: null,
    upcomingEvents: [],
    counts: { opportunities: null, library: null, events: null },
  });

  useEffect(() => {
    let cancelled = false;
    const lang = encodeURIComponent(locale);

    Promise.all([
      getJson(`/api/opportunities?limit=100&lang=${lang}`),
      getJson(`/api/news?limit=12&lang=${lang}`),
      getJson(`/api/events?limit=100&lang=${lang}`),
      getJson(`/api/opportunities/stats`),
      getJson(`/api/library/stats`),
      getJson(`/api/events/stats`),
    ]).then(([opps, news, events, oppStats, libStats, evStats]) => {
      if (cancelled) return;
      const today = startOfToday().getTime();

      const oppList: FeedOpportunity[] = opps?.data ?? [];
      const withDeadline = oppList
        .map((o) => ({ o, d: parseDate(o.deadline) }))
        .filter((x): x is { o: FeedOpportunity; d: Date } => !!x.d && x.d.getTime() >= today)
        .sort((a, b) => a.d.getTime() - b.d.getTime());
      const closing = withDeadline[0]
        ? { ...withDeadline[0].o, daysLeft: Math.round((withDeadline[0].d.getTime() - today) / DAY) }
        : null;
      const featuredGrant =
        // only grants that explicitly say they are open (not "unknown" deadlines)
        oppList.find((o) => o.type === "Grant" && /^(open|rolling)$/i.test((o.deadline ?? "").trim()) && o.id !== closing?.id) ?? null;

      const newsList: FeedNews[] = news?.data ?? [];
      const kenyaNews = newsList.find((n) => n.source?.includes("[Kenya]")) ?? newsList[0] ?? null;
      const latestNews = kenyaNews
        ? {
            ...kenyaNews,
            daysAgo: kenyaNews.published_at
              ? Math.max(0, Math.round((today - startOfDay(new Date(kenyaNews.published_at)).getTime()) / DAY))
              : 0,
          }
        : null;

      const evList: FeedEvent[] = events?.data ?? [];
      const upcoming = evList
        .map((e) => ({ ...e, date: parseDate(e.event_date) }))
        .filter((e): e is FeedEvent & { date: Date } => !!e.date && e.date.getTime() >= today)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      const nextEvent = upcoming[0]
        ? { ...upcoming[0], daysUntil: Math.round((startOfDay(upcoming[0].date).getTime() - today) / DAY) }
        : null;

      setFeed({
        loading: false,
        closing,
        latestNews,
        nextEvent,
        featuredGrant,
        upcomingEvents: upcoming.slice(0, 3),
        counts: {
          opportunities: sum(oppStats?.data?.types),
          library: sum(libStats?.data?.categories),
          events: sum(evStats?.data?.types),
        },
      });
    });

    return () => { cancelled = true; };
  }, [locale]);

  return feed;
}

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}
