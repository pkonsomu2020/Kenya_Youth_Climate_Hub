"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useOpportunities } from "@/lib/useOpportunities";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { NoticeCard, daysUntil, cleanTitle } from "@/components/funding/NoticeCard";
import { Icon } from "@/components/zine/Icon";

const TYPES = ["All", "Grant", "Fellowship", "Internship", "Competition", "Job", "Accelerator"];
const TOPICS = ["All", "Energy", "Water", "Agriculture", "Policy", "Finance", "Innovation", "Resilience", "Advocacy", "Waste"];
const SOON_DAYS = 14;

export default function Opportunities() {
  const t = useTranslations("opportunitiesPage");
  const tax = useTaxonomy();
  const [type, setType] = useState("All");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");
  const { opportunities, loading, error, refetch } = useOpportunities({ limit: 100, type, topic });

  const q = search.trim().toLowerCase();
  const filtered = opportunities.filter((o) =>
    !q || cleanTitle(o).toLowerCase().includes(q) || o.provider?.toLowerCase().includes(q) || o.desc?.toLowerCase().includes(q));

  // Anything with a real deadline in the next two weeks is pinned above the board, soonest first.
  const soon = filtered
    .map((o) => ({ o, d: daysUntil(o.deadline) }))
    .filter((x): x is { o: typeof x.o; d: number } => x.d !== null && x.d >= 0 && x.d <= SOON_DAYS)
    .sort((a, b) => a.d - b.d)
    .map((x) => x.o);
  const soonIds = new Set(soon.map((o) => o.id));
  const rest = filtered.filter((o) => !soonIds.has(o.id));
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;

  return (
    <div className="z-page z-fund">
      <header className="z-fund__head">
        <div className="z-wrap">
          <span className="z-mono z-eyebrow">
            {loading ? t("eyebrow") : t("onBoard", { count: opportunities.length })}
          </span>
          <h1 className="z-h2 z-balance">{t.rich("title", { s })}</h1>
          <p className="z-lead">{t("intro")}</p>
        </div>
      </header>

      <section className="z-fund__filters" aria-label={t("filters")}>
        <div className="z-wrap">
          <div className="z-fund__types" role="group" aria-label={t("typeLabel")}>
            {TYPES.map((v) => (
              <button key={v} type="button" aria-pressed={type === v} onClick={() => setType(v)}>
                {tax(v)}
              </button>
            ))}
          </div>
          <div className="z-fund__row">
            <label className="z-fund__field">
              <Icon name="search" />
              <span className="z-sr">{t("search")}</span>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search")} />
            </label>
            <label className="z-fund__field z-fund__field--select">
              <Icon name="sell" />
              <span className="z-sr">{t("topicLabel")}</span>
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                {TOPICS.map((v) => <option key={v} value={v}>{v === "All" ? t("allTopics") : tax(v)}</option>)}
              </select>
              <Icon name="expand_more" />
            </label>
          </div>
        </div>
      </section>

      <section className="z-fund__boardsec" aria-labelledby="fund-board" aria-busy={loading}>
        <div className="z-wrap">
          {loading && (
            <div className="z-board">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="z-note-card z-note-card--skel" aria-hidden="true" />)}
            </div>
          )}

          {!loading && soon.length > 0 && (
            <div className="z-fund__soon">
              <div className="z-fund__boardhead">
                <h2 className="z-fund__h3"><Icon name="timer" /> {t("soonTitle")}</h2>
                <span className="z-note">{t("soonNote", { days: SOON_DAYS })}</span>
              </div>
              <ul className="z-board z-board--soon">
                {soon.map((o) => <li key={o.id}><NoticeCard o={o} /></li>)}
              </ul>
            </div>
          )}

          {!loading && rest.length > 0 && (
            <>
              <div className="z-fund__boardhead">
                <h2 id="fund-board" className="z-fund__h3"><Icon name="push_pin" /> {t("boardTitle")}</h2>
                <span className="z-mono">{t("showing", { count: filtered.length })}</span>
              </div>
              <ul className="z-board">
                {rest.map((o) => <li key={o.id}><NoticeCard o={o} /></li>)}
              </ul>
            </>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="z-fund__empty">
              <Icon name="search_off" size={44} />
              <h2 className="z-fund__h3">{opportunities.length ? t("noMatchTitle") : t("emptyTitle")}</h2>
              <p>{opportunities.length ? t("noMatchBody") : t("emptyBody")}</p>
              {opportunities.length ? (
                <button type="button" className="z-btn z-btn--white" onClick={() => { setSearch(""); setType("All"); setTopic("All"); }}>
                  <Icon name="filter_alt_off" /> {t("clearFilters")}
                </button>
              ) : (
                <button type="button" className="z-btn z-btn--green" onClick={refetch}>
                  <Icon name="refresh" /> {t("refresh")}
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="z-fund__empty" role="alert">
              <Icon name="cloud_off" size={44} />
              <p>{t("loadError")}</p>
              <button type="button" className="z-btn z-btn--green" onClick={refetch}><Icon name="refresh" /> {t("refresh")}</button>
            </div>
          )}
        </div>
      </section>

      <section className="z-fund__cta">
        <div className="z-wrap">
          <div className="z-fund__ctagrid">
            <span className="z-tape" style={{ top: -13, left: "12%", transform: "rotate(-5deg)" }} aria-hidden="true" />
            <span className="z-tape z-tape--orange" style={{ top: -13, right: "10%", transform: "rotate(4deg)" }} aria-hidden="true" />
            <div>
              <span className="z-mono z-kicker">{t("ctaKicker")}</span>
              <h2 className="z-h2 z-balance">{t.rich("ctaTitle", { s })}</h2>
              <p className="z-fund__ctabody">{t("ctaBody")}</p>
            </div>
            <div className="z-fund__ctas">
              <a className="z-btn z-btn--green" href="mailto:info@kenyayouthclimatehub.org?subject=Deadline%20alerts">
                <Icon name="notifications" /> {t("ctaButton")}
              </a>
              <a className="z-btn z-btn--white" href="mailto:info@kenyayouthclimatehub.org?subject=Opportunity%20to%20add">
                <Icon name="add_link" /> {t("suggestButton")}
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
