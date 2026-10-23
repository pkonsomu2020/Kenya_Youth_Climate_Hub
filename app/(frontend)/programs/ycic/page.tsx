"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";

const DEADLINE = new Date("June 09, 2025 23:59:59");

// Live countdown for an open cycle (the 2025 cycle has closed; this switches itself on for the next one).
function useCountdown(target: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);
  const diff = now === null ? 0 : Math.max(0, target.getTime() - now);
  return {
    ready: now !== null,
    closed: now !== null && diff === 0,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

// Text lives in messages under programs.ycic.*; only icons are kept here.
const INFO_ICONS = ["event", "groups", "location_on", "emoji_events"];
const FOCUS_ICONS = ["water_drop", "flood", "solar_power"];
const DATE_ICONS = ["event", "checklist", "mic"];
const BENEFIT_ICONS = ["payments", "support_agent", "rocket_launch", "campaign"];

export default function YCICPage() {
  const t = useTranslations("programs.ycic");
  const cd = useCountdown(DEADLINE);
  const isClosed = !cd.ready || cd.closed;
  const g = (c: React.ReactNode) => <span className="z-serif">{c}</span>;
  const info = t.raw("info") as { label: string; value: string }[];
  const benefits = t.raw("benefits") as { title: string; desc: string }[];
  const focus = t.raw("focus") as { title: string; description: string; examples: string[] }[];
  const eligibility = t.raw("eligibility") as string[];
  const keyDates = t.raw("keyDates") as { label: string; value: string }[];
  const steps = t.raw("steps") as { title: string; desc: string }[];

  return (
    <div className="z-page z-lr">
      {/* opening spread */}
      <header className="z-lr__open">
        <div className="z-wrap">
          <Link href="/programs" className="z-ghost z-lr__back"><Icon name="arrow_back" /> {t("back")}</Link>
          <div className="z-spread__in z-lr__spread">
            <figure className="z-spread__ph">
              <img src="/nk/sheria.jpg" alt="" />
              <span className="z-spread__num" aria-hidden="true">01</span>
            </figure>
            <div className="z-spread__tx">
              <span className="z-mono z-spread__kick">{t("eyebrow")}</span>
              <h1 className="z-spread__h">{t.rich("title", { g })}</h1>
              <p className="z-lr__standfirst">{t("intro")}</p>
              <dl className="z-lr__info">
                {info.map((it, i) => (
                  <div key={it.label}><dt><Icon name={INFO_ICONS[i] ?? "info"} /> {it.label}</dt><dd>{it.value}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </header>

      {/* the cycle: status + key dates */}
      <div className="z-tear z-tear--top" aria-hidden="true" />
      <section className="z-dark z-lr__cycle" aria-labelledby="ycic-cycle">
        <div className="z-wrap">
          <div className="z-sec-head">
            <div>
              <span className="z-mono z-kicker">{t("keyDatesTitle")}</span>
              <h2 id="ycic-cycle" className="z-h2">{isClosed ? t("closedTitle") : t("remaining")}</h2>
            </div>
            {isClosed ? (
              <span className="z-lr__status"><Icon name="event_busy" /> {t("closedNote")}</span>
            ) : (
              <div className="z-lr__count" role="timer">
                {([["days", cd.days], ["hours", cd.hours], ["minutes", cd.minutes], ["seconds", cd.seconds]] as const).map(([k, v]) => (
                  <span key={k}><b>{v}</b><small className="z-mono">{t(k)}</small></span>
                ))}
              </div>
            )}
          </div>
          <ol className="z-lr__dates">
            {keyDates.map((d, i) => (
              <li key={d.label}>
                <span className="z-lr__dateicon"><Icon name={DATE_ICONS[i] ?? "event"} /></span>
                <b>{d.value}</b>
                <span>{d.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <div className="z-tear z-tear--bottom" aria-hidden="true" />

      {/* the article */}
      <article className="z-lr__article" aria-labelledby="ycic-overview">
        <div className="z-wrap z-lr__cols">
          <div className="z-lr__main">
            <span className="z-mono z-kicker">{t("overviewEyebrow")}</span>
            <h2 id="ycic-overview" className="z-lr__h2">{t.rich("overviewTitle", { g })}</h2>
            <p className="z-lr__drop">{t("overviewBody")}</p>
          </div>
          <aside className="z-lr__side" aria-label={t("prizeTitle")}>
            <ul className="z-lr__benefits">
              {benefits.map((b, i) => (
                <li key={b.title}>
                  <Icon name={BENEFIT_ICONS[i] ?? "star"} />
                  <span><b>{b.title}</b>{b.desc}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </article>

      {/* focus areas as chapters */}
      <section className="z-lr__chapters" aria-labelledby="ycic-focus">
        <div className="z-wrap">
          <span className="z-mono z-kicker">{t("focusEyebrow")}</span>
          <h2 id="ycic-focus" className="z-lr__h2">{t.rich("focusTitle", { g })}</h2>
          <ol className="z-lr__chapterlist">
            {focus.map((f, i) => (
              <li key={f.title} className="z-lr__chapter">
                <span className="z-lr__chapnum" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="z-lr__chapicon"><Icon name={FOCUS_ICONS[i] ?? "eco"} size={34} /></span>
                <div>
                  <span className="z-mono">{t("focusArea", { n: i + 1 })}</span>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                  <p className="z-lr__examples"><b className="z-mono">{t("examples")}</b> {f.examples.join(" · ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* eligibility card + prize */}
      <section className="z-lr__elig" aria-labelledby="ycic-elig">
        <div className="z-wrap">
          <span className="z-mono z-kicker">{t("eligibilityEyebrow")}</span>
          <h2 id="ycic-elig" className="z-lr__h2">{t.rich("eligibilityTitle", { g })}</h2>
          <div className="z-lr__eliggrid">
            <article className="z-index-card">
              <span className="z-tape" style={{ top: -12, left: 34, transform: "rotate(-4deg)" }} aria-hidden="true" />
              <h3 className="z-mono">{t("eligibilityHeading")}</h3>
              <ul className="z-lr__checks">
                {eligibility.map((e, i) => (
                  <li key={i}>
                    <Icon name="check_box" fill />
                    <span>
                      {e.includes("<yoma>")
                        ? t.rich(`eligibility.${i}`, { yoma: (c) => <a href="https://yoma.world" target="_blank" rel="noopener noreferrer">{c}</a> })
                        : e}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
            <div className="z-lr__prize">
              <Icon name="emoji_events" fill size={44} />
              <span className="z-mono">{t("prizeTitle")}</span>
              <b>KES 500,000</b>
              <span>{t("prizeExtra")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="z-lr__process" aria-labelledby="ycic-process">
        <div className="z-wrap">
          <div className="z-sec-head">
            <div>
              <span className="z-mono z-kicker">{t("processEyebrow")}</span>
              <h2 id="ycic-process" className="z-lr__h2">{t.rich("processTitle", { g })}</h2>
            </div>
            {isClosed && <span className="z-lr__status z-lr__status--light"><Icon name="lock_clock" /> {t("periodClosed")}</span>}
          </div>
          <ol className="z-lr__steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="z-lr__stepn">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
          <div className="z-ctas">
            {!isClosed && (
              <a href="https://yoma.world" target="_blank" rel="noopener noreferrer" className="z-btn z-btn--green">{t("apply")} <Icon name="open_in_new" /></a>
            )}
            <Link href="/success-stories" className="z-btn z-btn--white"><Icon name="photo_library" /> {t("meetFounders")}</Link>
            <Link href="/programs" className="z-ghost z-lr__back"><Icon name="arrow_back" /> {t("back")}</Link>
          </div>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
