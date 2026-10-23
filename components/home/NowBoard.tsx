"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import type { HomeFeed } from "@/lib/useHomeFeed";

type Item = {
  key: string;
  href: string;
  external: boolean;
  tone: "z-hot" | "z-new" | "z-soon";
  icon: string;
  when: string;
  title: string;
  src: string;
};

function ItemLink({ item }: { item: Item }) {
  const body = (
    <>
      <span className={`z-now__when ${item.tone}`}><Icon name={item.icon} />{item.when}</span>
      <span className="z-now__title">{item.title}</span>
      <span className="z-now__src">{item.src}</span>
    </>
  );
  return item.external ? (
    <a className="z-now__item" href={item.href} target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <Link className="z-now__item" href={item.href}>{body}</Link>
  );
}

/** "Right now on KYCH": the soonest deadline, newest Kenyan story, next event and an open grant. */
export function NowBoard({ feed }: { feed: HomeFeed }) {
  const t = useTranslations("home.now");
  const tax = useTaxonomy();
  const items: Item[] = [];

  if (feed.closing) {
    const d = feed.closing.daysLeft;
    items.push({
      key: "closing", href: feed.closing.url, external: true, tone: d <= 2 ? "z-hot" : "z-soon", icon: "timer",
      when: d === 0 ? t("closesToday") : d === 1 ? t("closesTomorrow") : t("closesIn", { n: d }),
      // scraped titles sometimes carry "_" and a repeated " | Provider" suffix
      title: feed.closing.title.replace(/_/g, " ").replace(/\s*\|\s*[^|]+$/, (m) => (feed.closing?.provider && m.includes(feed.closing.provider) ? "" : m)),
      src: [tax(feed.closing.type), feed.closing.provider].filter(Boolean).join(" · "),
    });
  }
  if (feed.latestNews) {
    const d = feed.latestNews.daysAgo;
    items.push({
      key: "news", href: feed.latestNews.url, external: true, tone: "z-new", icon: "bolt",
      when: d === 0 ? t("today") : d === 1 ? t("yesterday") : t("daysAgo", { n: d }),
      // Google News titles end in " - Publisher"; the publisher is already shown below
      title: feed.latestNews.source?.startsWith("Google News") ? feed.latestNews.title.replace(/\s+-\s+[^-]{2,80}$/, "") : feed.latestNews.title,
      src: [tax(feed.latestNews.category), (feed.latestNews.source ?? "").replace(/\s*\[.*\]$/, "")].filter(Boolean).join(" · "),
    });
  }
  if (feed.nextEvent) {
    const d = feed.nextEvent.daysUntil;
    items.push({
      key: "event", href: "/events", external: false, tone: "z-soon", icon: "event",
      when: d === 0 ? t("eventToday") : d === 1 ? t("eventTomorrow") : t("eventIn", { n: d }),
      title: feed.nextEvent.title,
      src: [feed.nextEvent.event_type, feed.nextEvent.location].filter(Boolean).join(" · "),
    });
  }
  if (feed.featuredGrant) {
    items.push({
      key: "grant", href: feed.featuredGrant.url, external: true, tone: "z-new", icon: "payments",
      when: t("openNow"),
      title: feed.featuredGrant.title,
      src: [tax("Grant"), feed.featuredGrant.provider].filter(Boolean).join(" · "),
    });
  }

  return (
    <section className="z-now" aria-labelledby="z-now-title">
      <div className="z-wrap">
        <div className="z-now__board" aria-busy={feed.loading}>
          <div className="z-now__label">
            <span className="z-live"><i aria-hidden="true" />{t("live")}</span>
            <b id="z-now-title">{t.rich("label", { br: () => <br /> })}</b>
          </div>
          {feed.loading
            ? [0, 1, 2, 3].map((i) => (
                <div key={i} className="z-now__item" aria-hidden="true">
                  <span className="z-skel" style={{ width: "45%" }} />
                  <span className="z-skel" style={{ width: "90%", height: 14 }} />
                  <span className="z-skel" style={{ width: "70%", height: 14 }} />
                </div>
              ))
            : items.map((item) => <ItemLink key={item.key} item={item} />)}
          {!feed.loading && items.length === 0 && (
            <div className="z-now__item" style={{ gridColumn: "2 / -1" }}>
              <span className="z-now__title">{t("empty")}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
