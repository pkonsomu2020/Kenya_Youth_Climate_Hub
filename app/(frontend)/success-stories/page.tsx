"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { useLocalizedStories } from "@/lib/data/useLocalizedStories";
import { Clothesline, storyCategory } from "@/components/stories/Clothesline";
import { Icon } from "@/components/zine/Icon";

const FILTERS = ["All", "Renewable Energy", "WASH"];

export default function SuccessStoriesPage() {
  const t = useTranslations("storiesPage");
  const tax = useTaxonomy();
  const stories = useLocalizedStories();
  const [filter, setFilter] = useState("All");
  const [focusId, setFocusId] = useState<string | null>(null);
  const filtered = filter === "All" ? stories : stories.filter((s) => storyCategory(s.id) === filter);
  const focus = filtered.find((s) => s.id === focusId) ?? filtered[0];
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;

  return (
    <div className="z-page z-st">
      <header className="z-st__head">
        <div className="z-wrap">
          <span className="z-mono z-eyebrow">{t("eyebrow")}</span>
          <h1 className="z-h2 z-balance">{t.rich("title", { s })}</h1>
          <p className="z-lead">{t("intro")}</p>
          <div className="z-fund__types" role="group" aria-label={t("filterLabel")} style={{ marginTop: 26 }}>
            {FILTERS.map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => { setFilter(f); setFocusId(null); }}>
                {tax(f)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="z-st__linesec" aria-label={t("lineLabel")}>
        <div className="z-wrap">
          {filtered.length ? (
            <>
              <Clothesline stories={filtered} label={t("lineLabel")} />
              <p className="z-note z-st__hint"><Icon name="swipe" /> {t("hint")}</p>
            </>
          ) : (
            <p className="z-fund__empty">{t("empty")}</p>
          )}
        </div>
      </section>

      {focus && (
        <>
          <div className="z-tear z-tear--top" aria-hidden="true" />
          <section className="z-dark z-st__focus" aria-labelledby="st-focus">
            <div className="z-wrap">
              <div className="z-sec-head">
                <div>
                  <span className="z-mono z-kicker">{t("focusKicker")}</span>
                  <h2 id="st-focus" className="z-h2">{focus.company}</h2>
                </div>
                <div className="z-st__pick" role="group" aria-label={t("pickLabel")}>
                  {filtered.map((x) => (
                    <button key={x.id} type="button" aria-pressed={x.id === focus.id} onClick={() => setFocusId(x.id)}>
                      {x.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="z-st__spread">
                <figure className="z-st__photo">
                  <span className="z-tape z-tape--sun" style={{ top: -12, left: "50%", marginLeft: -46, transform: "rotate(-3deg)" }} aria-hidden="true" />
                  {focus.photo && <img src={focus.photo} alt={focus.name} width={440} height={520} />}
                  <figcaption className="z-marker">{focus.name}</figcaption>
                </figure>
                <div className="z-st__text">
                  <span className="z-st__tag">{tax(storyCategory(focus.id))}</span>
                  <p className="z-st__excerpt">{focus.excerpt}</p>
                  <p className="z-st__full">{focus.fullText}</p>
                  <Link href={`/success-stories/${focus.id}`} className="z-btn z-btn--green">
                    {t("readStory")} <Icon name="arrow_forward" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <div className="z-tear z-tear--bottom" aria-hidden="true" />
        </>
      )}

      <section className="z-st__next">
        <div className="z-wrap z-st__nextgrid">
          <Link href="/opportunities" className="z-pol z-pol--empty" aria-label={t("ctaButton")}>
            <span className="z-pol__peg" style={{ background: "var(--z-green)" }} aria-hidden="true" />
            <span className="z-pol__blank"><Icon name="add_a_photo" size={48} /></span>
            <span className="z-pol__cap">{t("blankCaption")}</span>
          </Link>
          <div>
            <span className="z-mono z-kicker">{t("ctaKicker")}</span>
            <h2 className="z-h2 z-balance">{t.rich("ctaTitle", { s })}</h2>
            <p className="z-lead">{t("ctaBody")}</p>
            <div className="z-ctas">
              <Link href="/opportunities" className="z-btn z-btn--navy">{t("ctaButton")} <Icon name="arrow_forward" /></Link>
            </div>
          </div>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
