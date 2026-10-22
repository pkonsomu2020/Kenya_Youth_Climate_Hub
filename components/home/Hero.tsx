"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";
import { intlLocale, type Locale } from "@/i18n/config";
import type { HomeFeed } from "@/lib/useHomeFeed";

const openChat = () => window.dispatchEvent(new CustomEvent("kych:open-chat"));

export function Hero({ feed }: { feed: HomeFeed }) {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;
  const next = feed.nextEvent;
  const nextDate = next
    ? new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "short" }).format(new Date(next.event_date as string))
    : null;

  return (
    <>
      <div className="z-wrap z-alert">
        <Link href="/weather">
          <b>{t("alert.badge")}</b>
          <span>{t("alert.body")}</span>
          <i>{t("alert.cta")} →</i>
        </Link>
      </div>

      <header className="z-hero">
        <div className="z-wrap z-hero__grid">
          <div>
            <div className="z-eyebrow z-mono">{t("hero.eyebrow")}</div>
            <h1 className="z-h1">
              {t.rich("hero.title", {
                br: () => <br />,
                hl: (c) => <span className="z-h1__hl">{c}</span>,
                u: (c) => (
                  <span className="z-h1__u">
                    {c}
                    <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M3 14 C 50 4, 120 4, 197 10" fill="none" stroke="#FFB703" strokeWidth="7" strokeLinecap="round" />
                    </svg>
                  </span>
                ),
              })}
            </h1>
            <div className="z-langnote">
              <svg width="34" height="22" viewBox="0 0 34 22" aria-hidden="true">
                <path d="M2 2 C 4 14, 14 18, 30 16 M24 10 L31 16 L24 21" fill="none" stroke="#E8501E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("hero.langNote")}
            </div>
            <p className="z-lead">{t.rich("hero.lead", { b: (c) => <b>{c}</b> })}</p>
            <div className="z-ctas">
              <Link href="/opportunities" className="z-btn z-btn--green">
                {t("hero.ctaFunding")} <Icon name="arrow_forward" />
              </Link>
              <button type="button" className="z-btn z-btn--white" onClick={openChat}>
                <Icon name="auto_awesome" fill style={{ color: "var(--z-green-d)" }} /> {t("hero.ctaAI")}
              </button>
            </div>
            <div className="z-stats">
              <div>{feed.counts.opportunities ?? "—"}<small>{t("hero.statOpen")}</small></div>
              <div>47<small>{t("hero.statCounties")}</small></div>
              <div>500K<small>{t("hero.statYcic")}</small></div>
            </div>
          </div>

          <div className="z-collage">
            <div className="z-collage__disc" aria-hidden="true" />
            <div className="z-collage__ring" aria-hidden="true" />
            <div className="z-arch">
              <img src="/nk/hero1.jpg" alt={t("hero.imgMain")} width={340} height={450} />
            </div>
            <span className="z-tape" style={{ right: 150, top: 8, transform: "rotate(-8deg)" }} aria-hidden="true" />
            <svg className="z-sun" viewBox="0 0 100 100" aria-hidden="true">
              <g stroke="#FFB703" strokeWidth="6" strokeLinecap="round">
                <path d="M50 6v12M50 82v12M6 50h12M82 50h12M19 19l8 8M73 73l8 8M19 81l8-8M73 27l8-8" />
              </g>
              <circle cx="50" cy="50" r="22" fill="#FFB703" stroke="#101C33" strokeWidth="3" />
            </svg>
            <figure className="z-polaroid z-polaroid--b">
              <img src="/YCIC_Photos/VIOLET.jpeg" alt={t("hero.imgViolet")} width={130} height={150} />
              <figcaption>{t("hero.capViolet")}</figcaption>
            </figure>
            <figure className="z-polaroid z-polaroid--a">
              <img src="/nk/sheria.jpg" alt={t("hero.imgPitch")} width={240} height={172} />
              <figcaption>{t("hero.capPitch")}</figcaption>
            </figure>
            <span className="z-tape z-tape--sun" style={{ left: 84, bottom: 218, transform: "rotate(14deg)" }} aria-hidden="true" />
            {next && nextDate && (
              <Link href="/events" className="z-sticker" aria-label={t("hero.nextAria", { title: next.title, date: nextDate })}>
                <span className="z-mono">{t("hero.nextUp")}</span>
                {nextDate}
                <small>{next.event_type ?? t("hero.event")}</small>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
