"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";

// Figures (values) stay here; labels and sources are in programs.begreen.*.
const STAT_VALUES = ["846", "8.1x", "~7x", "29.9M", "146", "74–90%"];
const PROBLEM_VALUES = ["22,000", "39%", "39.8%", "75%"];
const FOCUS_ICONS = ["recycling", "compost", "memory", "autorenew"];
const OUTCOME_ICONS = ["work", "trending_up", "delete_sweep"];
const PARTNERS_SHORT = ["UNICEF / GenU", "Tony Elumelu Foundation", "IKEA Foundation", "KNBS"];

// First number in a phase outcome ("759 trained; 502 completed" -> 759), for the funnel bars.
// Thousands separators differ by language: "2,264" (en/sw) vs "2 264" (fr, often a no-break space).
const firstNumber = (s: string) =>
  Number((s.match(/\d{1,3}(?:[,.\s  ]\d{3})+|\d+/)?.[0] ?? "0").replace(/\D/g, ""));

export default function BeGreenPage() {
  const t = useTranslations("programs.begreen");
  const g = (c: React.ReactNode) => <span className="z-serif">{c}</span>;
  const b = (c: React.ReactNode) => <b>{c}</b>;
  const stats = t.raw("stats") as { label: string; sub: string }[];
  const problem = t.raw("problem") as string[];
  const focus = t.raw("focus") as { title: string; desc: string }[];
  const phases = t.raw("phases") as { title: string; outcome: string }[];
  const outcomes = t.raw("outcomes") as { title: string; items: string[] }[];
  const inclusion = t.raw("inclusionStats") as [string, string][];
  const partners = t.raw("partners") as { name: string; role: string }[];
  const maxPhase = Math.max(...phases.map((p) => firstNumber(p.outcome)), 1);

  return (
    <div className="z-page z-lr">
      {/* opening spread */}
      <header className="z-lr__open">
        <div className="z-wrap">
          <Link href="/programs" className="z-ghost z-lr__back"><Icon name="arrow_back" /> {t("back")}</Link>
          <div className="z-spread__in z-spread--flip z-lr__spread">
            <figure className="z-spread__ph">
              <img src="/nk/hero4.jpg" alt="" />
              <span className="z-spread__num" aria-hidden="true">02</span>
            </figure>
            <div className="z-spread__tx">
              <span className="z-mono z-spread__kick">{t("eyebrow")}</span>
              <h1 className="z-spread__h">{t.rich("title", { g })}</h1>
              <p className="z-lr__standfirst">{t("intro")}</p>
              <p className="z-lr__partners">
                <span className="z-mono">{t("implementing")}</span>
                {PARTNERS_SHORT.map((p) => <span key={p}>{p}</span>)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* results */}
      <div className="z-tear z-tear--top" aria-hidden="true" />
      <section className="z-dark z-lr__cycle" aria-labelledby="bg-results">
        <div className="z-wrap">
          <span className="z-mono z-kicker">{t("resultsEyebrow")}</span>
          <h2 id="bg-results" className="z-h2">{t("resultsTitle")}</h2>
          <dl className="z-lr__results">
            {stats.map((s, i) => (
              <div key={s.label}>
                <dd>{STAT_VALUES[i]}</dd>
                <dt>{s.label}<small className="z-mono">{s.sub}</small></dt>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <div className="z-tear z-tear--bottom" aria-hidden="true" />

      {/* article + problem sidebar */}
      <article className="z-lr__article" aria-labelledby="bg-about">
        <div className="z-wrap z-lr__cols">
          <div className="z-lr__main">
            <span className="z-mono z-kicker">{t("aboutEyebrow")}</span>
            <h2 id="bg-about" className="z-lr__h2">{t.rich("aboutTitle", { g })}</h2>
            <p className="z-lr__drop">{t.rich("about1", { b })}</p>
            <p>{t.rich("about2", { b })}</p>
            <p>{t.rich("about3", { b })}</p>
          </div>
          <aside className="z-lr__side z-lr__problem" aria-labelledby="bg-problem">
            <h3 id="bg-problem" className="z-mono">{t("problemTitle")}</h3>
            <dl>
              {problem.map((p, i) => (
                <div key={i}><dt>{PROBLEM_VALUES[i]}</dt><dd>{p}</dd></div>
              ))}
            </dl>
          </aside>
        </div>
      </article>

      {/* focus areas */}
      <section className="z-lr__chapters" aria-labelledby="bg-focus">
        <div className="z-wrap">
          <span className="z-mono z-kicker">{t("focusEyebrow")}</span>
          <h2 id="bg-focus" className="z-lr__h2">{t.rich("focusTitle", { g })}</h2>
          <ul className="z-lr__focus4">
            {focus.map((f, i) => (
              <li key={f.title}>
                <span className="z-lr__chapicon"><Icon name={FOCUS_ICONS[i] ?? "eco"} size={30} /></span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* phases as a funnel: each bar is that phase's headline number against the 2,264 applicants */}
      <section className="z-lr__funnelsec" aria-labelledby="bg-phases">
        <div className="z-wrap">
          <span className="z-mono z-kicker">{t("phasesEyebrow")}</span>
          <h2 id="bg-phases" className="z-lr__h2">{t.rich("phasesTitle", { g })}</h2>
          <ol className="z-funnel">
            {phases.map((p, i) => (
              <li key={p.title}>
                <span className="z-funnel__n">{i + 1}</span>
                <div className="z-funnel__body">
                  <div className="z-funnel__head"><b>{p.title}</b><span>{p.outcome}</span></div>
                  <div className="z-funnel__track" aria-hidden="true">
                    <i style={{ width: `${Math.max(3, (firstNumber(p.outcome) / maxPhase) * 100)}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* outcomes */}
      <div className="z-tear z-tear--top" aria-hidden="true" />
      <section className="z-dark z-lr__outcomes" aria-labelledby="bg-outcomes">
        <div className="z-wrap">
          <span className="z-mono z-kicker">{t("outcomesEyebrow")}</span>
          <h2 id="bg-outcomes" className="z-h2">{t.rich("outcomesTitle", { g })}</h2>
          <div className="z-lr__outgrid">
            {outcomes.map((o, i) => (
              <section key={o.title} aria-label={o.title}>
                <h3><Icon name={OUTCOME_ICONS[i] ?? "check"} /> {o.title}</h3>
                <ul>{o.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </section>
            ))}
          </div>
        </div>
      </section>
      <div className="z-tear z-tear--bottom" aria-hidden="true" />

      {/* inclusion + conclusion */}
      <section className="z-lr__article" aria-labelledby="bg-inclusion">
        <div className="z-wrap z-lr__cols">
          <div className="z-lr__main">
            <span className="z-mono z-kicker">{t("inclusionEyebrow")}</span>
            <h2 id="bg-inclusion" className="z-lr__h2">{t.rich("inclusionTitle", { g })}</h2>
            <p>{t.rich("inclusionBody", { b })}</p>
            <dl className="z-lr__incl">
              {inclusion.map(([n, l]) => <div key={n}><dt>{n}</dt><dd>{l}</dd></div>)}
            </dl>
          </div>
          <aside className="z-lr__side">
            <figure className="z-lr__pull">
              <span className="z-mono">{t("conclusionTitle")}</span>
              <p>{t("conclusion1")}</p>
              <blockquote>{t.rich("conclusion2", { b })}</blockquote>
            </figure>
          </aside>
        </div>
      </section>

      {/* partners */}
      <section className="z-lr__partnersec" aria-labelledby="bg-partners">
        <div className="z-wrap">
          <span className="z-mono z-kicker">{t("partnersEyebrow")}</span>
          <h2 id="bg-partners" className="z-lr__h2">{t.rich("partnersTitle", { g })}</h2>
          <dl className="z-lr__partnerlist">
            {partners.map((p) => <div key={p.name}><dt>{p.name}</dt><dd>{p.role}</dd></div>)}
          </dl>
          <div className="z-ctas">
            <Link href="/programs" className="z-btn z-btn--white"><Icon name="arrow_back" /> {t("backAll")}</Link>
          </div>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
