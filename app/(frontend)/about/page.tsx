"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";

// Timeline entries: text lives in about.timeline.<key>; figures come from the programme pages.
const TIMELINE = [
  { key: "founded", year: "2020", photo: null },
  { key: "begreen", year: "2023", photo: { src: "/nk/hero4.jpg", altKey: "begreenAlt" } },
  { key: "ycic", year: "2025", photo: { src: "/YCIC_Photos/web/violet.jpg", altKey: "ycicAlt" } },
  { key: "results", year: "2025", photo: null },
  { key: "languages", year: "2026", photo: null },
] as const;

const VALUES = [
  { key: "justice", icon: "balance" },
  { key: "inclusion", icon: "groups" },
  { key: "gender", icon: "diversity_3" },
  { key: "innovation", icon: "lightbulb" },
  { key: "evidence", icon: "query_stats" },
  { key: "systems", icon: "account_tree" },
] as const;

export default function AboutPage() {
  const t = useTranslations("about");
  const tv = useTranslations("home.values");
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;
  const b = (c: React.ReactNode) => <b>{c}</b>;

  return (
    <div className="z-page z-ab">
      <header className="z-ab__head">
        <div className="z-wrap z-ab__headgrid">
          <div>
            <span className="z-mono z-eyebrow">{t("eyebrow")}</span>
            <h1 className="z-h2 z-balance">{t.rich("title", { s })}</h1>
            <p className="z-lead">{t.rich("story1", { b })}</p>
            <p className="z-lead">{t("story2")}</p>
          </div>
          <figure className="z-st__photo z-ab__photo">
            <span className="z-tape z-tape--orange" style={{ top: -12, left: "50%", marginLeft: -46, transform: "rotate(-4deg)" }} aria-hidden="true" />
            <img src="/nk/hero3.jpg" alt={t("imgAlt")} width={480} height={400} />
            <figcaption className="z-marker">{t("photoCaption")}</figcaption>
          </figure>
        </div>
      </header>

      {/* mission + vision as index cards */}
      <section className="z-ab__cards" aria-label={t("cardsLabel")}>
        <div className="z-wrap z-ab__cardgrid">
          {(["mission", "vision"] as const).map((k, i) => (
            <article key={k} className={`z-index-card${i ? " z-index-card--b" : ""}`}>
              <span className={`z-tape${i ? " z-tape--sun" : ""}`} style={{ top: -12, left: 30, transform: `rotate(${i ? 4 : -5}deg)` }} aria-hidden="true" />
              <h2 className="z-mono">{t(k)}</h2>
              <p>{t(`${k}Text`)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* scrapbook timeline */}
      <section className="z-sec z-ab__tlsec" aria-labelledby="ab-tl">
        <div className="z-wrap">
          <div className="z-sec-head">
            <div>
              <span className="z-mono z-kicker">{t("tlKicker")}</span>
              <h2 id="ab-tl" className="z-h2">{t.rich("tlTitle", { s })}</h2>
            </div>
          </div>
          <ol className="z-tl">
            {TIMELINE.map((e, i) => (
              <li key={e.key} className={i % 2 ? "z-tl__item z-tl__item--r" : "z-tl__item"}>
                <span className="z-tl__dot" aria-hidden="true" />
                <div className="z-tl__side">
                  <span className="z-tl__year">{e.year}</span>
                  {e.photo && (
                    <figure className="z-tl__snap">
                      <span className="z-tape z-tape--sun" style={{ top: -10, left: 34, transform: "rotate(-6deg)" }} aria-hidden="true" />
                      <img src={e.photo.src} alt={t(`timeline.${e.key}.${e.photo.altKey}`)} loading="lazy" width={200} height={150} />
                    </figure>
                  )}
                </div>
                <div className="z-tl__card">
                  <h3>{t(`timeline.${e.key}.title`)}</h3>
                  <p>{t(`timeline.${e.key}.body`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* values */}
      <div className="z-tear z-tear--top" aria-hidden="true" />
      <section className="z-dark z-ab__values" aria-labelledby="ab-values">
        <div className="z-wrap">
          <div className="z-sec-head">
            <div>
              <span className="z-mono z-kicker">{t("valuesKicker")}</span>
              <h2 id="ab-values" className="z-h2">{t.rich("valuesTitle", { s })}</h2>
            </div>
          </div>
          <ul className="z-ab__vgrid">
            {VALUES.map((v) => (
              <li key={v.key}>
                <span className="z-ab__vicon"><Icon name={v.icon} size={30} /></span>
                <h3>{tv(`${v.key}.title`)}</h3>
                <p>{tv(`${v.key}.desc`)}</p>
              </li>
            ))}
          </ul>
          <blockquote className="z-ab__quote">
            <Icon name="format_quote" fill size={44} />
            <p>{t("quote")}</p>
            <cite className="z-mono">{t("quoteCite")}</cite>
          </blockquote>
        </div>
      </section>
      <div className="z-tear z-tear--bottom" aria-hidden="true" />

      <section className="z-st__next">
        <div className="z-wrap">
          <div className="z-fund__ctagrid">
            <span className="z-tape" style={{ top: -13, right: "12%", transform: "rotate(5deg)" }} aria-hidden="true" />
            <div>
              <span className="z-mono z-kicker">{t("ctaKicker")}</span>
              <h2 className="z-h2 z-balance">{t.rich("ctaTitle", { s })}</h2>
              <p className="z-fund__ctabody">{t("ctaBody")}</p>
            </div>
            <div className="z-fund__ctas">
              <Link href="/register" className="z-btn z-btn--navy">{t("ctaButton")} <Icon name="arrow_forward" /></Link>
              <Link href="/contact" className="z-btn z-btn--white">{t("contactButton")} <Icon name="mail" /></Link>
            </div>
          </div>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
