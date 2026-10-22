"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";
import type { HomeFeed } from "@/lib/useHomeFeed";

const CARDS = [
  { key: "funding", href: "/opportunities", icon: "payments", bg: "var(--z-green)", tape: "", count: "opportunities" },
  { key: "learn", href: "/e-library", icon: "psychology", bg: "var(--z-sun)", tape: "z-tape--sun", count: "library" },
  { key: "events", href: "/events", icon: "event", bg: "var(--z-pink)", tape: "z-tape--orange", count: "events" },
  { key: "safe", href: "/weather", icon: "rainy", bg: "var(--z-sky)", tape: "", count: null },
] as const;

/** "What are you here for?" — four ways into the site, each with a live count. */
export function Picker({ feed }: { feed: HomeFeed }) {
  const t = useTranslations("home.picker");

  return (
    <section className="z-sec" aria-labelledby="z-picker-title">
      <div className="z-wrap">
        <div className="z-sec-head">
          <div>
            <span className="z-kicker z-mono">{t("kicker")}</span>
            <h2 id="z-picker-title" className="z-h2">{t.rich("title", { br: () => <br />, s: (c) => <span className="z-serif">{c}</span> })}</h2>
          </div>
          <div className="z-note">
            {t("note")}
            <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
              <path d="M4 2 C 20 8, 22 18, 14 27 M8 22 L14 28 L20 21" fill="none" stroke="#E8501E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="z-picker">
          {CARDS.map((c) => {
            const n = c.count ? feed.counts[c.count] : null;
            return (
              <Link key={c.key} href={c.href} className="z-pick">
                <span className={`z-tape ${c.tape}`} aria-hidden="true" />
                <span className="z-pick__count">{c.count ? (n === null ? "…" : t(`${c.key}.count`, { n })) : t("safe.count")}</span>
                <div className="z-pick__ico" style={{ background: c.bg }}><Icon name={c.icon} /></div>
                <h3>{t(`${c.key}.title`)}</h3>
                <p>{t(`${c.key}.desc`)}</p>
                <span className="z-pick__go">{t(`${c.key}.go`)} <Icon name="arrow_forward" /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
