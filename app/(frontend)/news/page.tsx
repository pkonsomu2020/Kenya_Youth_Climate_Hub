"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useNews, type NewsArticle } from "@/lib/useNews";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { intlLocale, type Locale } from "@/i18n/config";
import { Icon } from "@/components/zine/Icon";

const CATS = ["All", "News", "Climate Insights", "Success Stories", "Events Recap", "Partner Updates"];
const BRIEFS = 6;

// Scraped headlines end in " - Publisher"; split that off so the byline can carry it.
function split(a: NewsArticle) {
  const i = a.title.lastIndexOf(" - ");
  const publisher = i > 20 ? a.title.slice(i + 3).replace(/^news - /i, "") : (a.source || "").replace(/\s*\[.*?\]\s*/g, "").trim();
  // some feeds also leave a section label ("- news", "- opinion") on the end
  const headline = (i > 20 ? a.title.slice(0, i) : a.title).replace(/\s+-\s+(news|opinion|analysis|blog)$/i, "");
  return { headline, publisher };
}

// Generic stock fallbacks (no real photo from the publisher) are skipped: the page is text-first then.
const realImage = (url: string | null) => (url && !/images\.unsplash\.com/.test(url) ? url : null);

export default function News() {
  const t = useTranslations("newsPage");
  const tax = useTaxonomy();
  const locale = useLocale() as Locale;
  const [cat, setCat] = useState("All");
  // one clock reading per visit, so relative times stay stable across re-renders
  const [now] = useState(() => Date.now());
  const { articles, loading, error, refetch } = useNews({ limit: 40, category: cat });

  // the feed sometimes repeats an article (same story, different link); keep the first copy
  const seen = new Set<string>();
  const items = articles.filter((a) => {
    const k = split(a).headline.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const [lead, ...rest] = items;
  const briefs = rest.slice(0, BRIEFS);
  const more = rest.slice(BRIEFS);

  const rtf = new Intl.RelativeTimeFormat(intlLocale[locale], { numeric: "auto" });
  const ago = (iso: string) => {
    const mins = Math.round((Date.parse(iso) - now) / 60000);
    if (isNaN(mins)) return "";
    if (Math.abs(mins) < 60) return rtf.format(mins, "minute");
    const hrs = Math.round(mins / 60);
    if (Math.abs(hrs) < 24) return rtf.format(hrs, "hour");
    return rtf.format(Math.round(hrs / 24), "day");
  };
  const today = new Intl.DateTimeFormat(intlLocale[locale], { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(now));
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;

  return (
    <div className="z-page z-nw">
      <header className="z-nw__mast">
        <div className="z-wrap">
          <div className="z-nw__strip z-mono">
            <span>{today}</span>
            <span className={error ? "z-nw__status z-nw__status--off" : "z-nw__status"}>
              <i aria-hidden="true" /> {error ? t("offline") : t("live")}
            </span>
          </div>
          <h1 className="z-nw__title">{t.rich("title", { s })}</h1>
          <p className="z-nw__intro">{t("intro")}</p>
          <nav className="z-nw__tabs" aria-label={t("sections")}>
            {CATS.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{tax(c)}</button>
            ))}
          </nav>
        </div>
      </header>

      <section className="z-nw__front" aria-busy={loading} aria-label={t("frontPage")}>
        <div className="z-wrap">
          {loading ? (
            <div className="z-nw__grid" aria-hidden="true">
              <div className="z-nw__lead"><div className="z-skel" style={{ height: 320 }} /></div>
              <div className="z-nw__briefs"><div className="z-skel" style={{ height: 320 }} /></div>
            </div>
          ) : error ? (
            <div className="z-fund__empty" role="alert">
              <Icon name="cloud_off" size={44} />
              <p>{t("loadError")}</p>
              <button type="button" className="z-btn z-btn--green" onClick={refetch}><Icon name="refresh" /> {t("retry")}</button>
            </div>
          ) : !lead ? (
            <div className="z-fund__empty">
              <Icon name="newspaper" size={44} />
              <h2 className="z-fund__h3">{t("emptyTitle")}</h2>
              <p>{t("emptyBody")}</p>
              <button type="button" className="z-btn z-btn--green" onClick={refetch}><Icon name="refresh" /> {t("retry")}</button>
            </div>
          ) : (
            <>
              <div className="z-nw__grid">
                {(() => {
                  const { headline, publisher } = split(lead);
                  const img = realImage(lead.image_url);
                  return (
                    <article className="z-nw__lead">
                      <span className="z-nw__kicker z-mono">{tax(lead.category)} · {ago(lead.published_at)}</span>
                      <h2><a href={lead.url} target="_blank" rel="noopener noreferrer">{headline}</a></h2>
                      {img && <img src={img} alt="" loading="eager" />}
                      <p className="z-nw__standfirst">{lead.excerpt}</p>
                      <p className="z-nw__byline">
                        <span>{t("via", { publisher })}</span>
                        <a href={lead.url} target="_blank" rel="noopener noreferrer" className="z-nw__read">
                          {t("readAt", { publisher })} <Icon name="open_in_new" />
                        </a>
                      </p>
                    </article>
                  );
                })()}

                <aside className="z-nw__briefs" aria-labelledby="nw-briefs">
                  <h2 id="nw-briefs" className="z-nw__colhead z-mono">{t("briefs")}</h2>
                  <ol>
                    {briefs.map((a) => {
                      const { headline, publisher } = split(a);
                      return (
                        <li key={a.id}>
                          <a href={a.url} target="_blank" rel="noopener noreferrer">
                            <span className="z-mono">{tax(a.category)} · {ago(a.published_at)}</span>
                            <b>{headline}</b>
                            <small>{publisher}</small>
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </aside>
              </div>

              {more.length > 0 && (
                <>
                  <h2 className="z-nw__colhead z-nw__colhead--wide z-mono">{t("moreStories")}</h2>
                  <ul className="z-nw__more">
                    {more.map((a) => {
                      const { headline, publisher } = split(a);
                      const img = realImage(a.image_url);
                      return (
                        <li key={a.id}>
                          <a href={a.url} target="_blank" rel="noopener noreferrer">
                            {img && <img src={img} alt="" loading="lazy" />}
                            <span className="z-mono">{tax(a.category)} · {ago(a.published_at)}</span>
                            <b>{headline}</b>
                            {a.excerpt && <p>{a.excerpt}</p>}
                            <small>{publisher}</small>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <section className="z-nw__adsec">
        <div className="z-wrap">
          <div className="z-nw__ad">
            <span className="z-mono z-kicker">{t("ctaKicker")}</span>
            <h2 className="z-h2 z-balance">{t.rich("ctaTitle", { s })}</h2>
            <p>{t("ctaBody")}</p>
            <a className="z-btn z-btn--navy" href="mailto:info@kenyayouthclimatehub.org?subject=News%20digest">
              <Icon name="mail" /> {t("ctaButton")}
            </a>
          </div>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
