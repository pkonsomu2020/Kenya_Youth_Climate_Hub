"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";
import { intlLocale, type Locale } from "@/i18n/config";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import type { HomeFeed } from "@/lib/useHomeFeed";

const STUB_COLOURS = ["var(--z-sun)", "var(--z-green)", "var(--z-pink)"];

/** The next three dated events as tickets. */
export function EventsTickets({ feed }: { feed: HomeFeed }) {
  const t = useTranslations("home.events");
  const tax = useTaxonomy();
  const locale = useLocale() as Locale;
  const fmtDay = new Intl.DateTimeFormat(intlLocale[locale], { day: "2-digit" });
  const fmtMonth = new Intl.DateTimeFormat(intlLocale[locale], { month: "short" });

  return (
    <section className="z-sec" style={{ paddingTop: 20 }} aria-labelledby="z-events-title">
      <div className="z-wrap">
        <div className="z-sec-head">
          <div>
            <span className="z-kicker z-mono">{t("kicker")}</span>
            <h2 id="z-events-title" className="z-h2">{t.rich("title", { br: () => <br />, s: (c) => <span className="z-serif">{c}</span> })}</h2>
          </div>
          <Link href="/events" className="z-btn z-btn--white">{t("cta")} <Icon name="arrow_forward" /></Link>
        </div>
        {feed.loading ? (
          <div className="z-tickets" aria-hidden="true">
            {[0, 1, 2].map((i) => <div key={i} className="z-ticket" style={{ height: 120 }} />)}
          </div>
        ) : feed.upcomingEvents.length === 0 ? (
          <p style={{ color: "var(--z-muted)" }}>{t("empty")}</p>
        ) : (
          <div className="z-tickets">
            {feed.upcomingEvents.map((e, i) => (
              <Link key={e.id} href="/events" className="z-ticket">
                <div className="z-ticket__date" style={{ background: STUB_COLOURS[i % 3] }}>
                  {fmtDay.format(e.date)}
                  <small>{fmtMonth.format(e.date).replace(".", "").toUpperCase()}</small>
                </div>
                <div className="z-ticket__body">
                  <h3>{e.title}</h3>
                  {e.event_type && <p>{tax(e.event_type)}</p>}
                  <span className="z-ticket__where">{[...new Set([e.location, e.format ? tax(e.format) : null].filter(Boolean))].join(" · ")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
