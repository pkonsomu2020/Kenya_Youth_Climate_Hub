"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";

// Figures come from the programme pages (programs.ycic / programs.begreen) and their sources.
const SPREADS = [
  {
    id: "ycic",
    num: "01",
    image: "/nk/sheria.jpg",
    href: "/programs/ycic",
    figs: [
      { value: "KES 500K", key: "figPrize" },
      { value: "300", key: "figInnovators" },
      { value: "6", key: "figMentorship" },
    ],
    second: { href: "/success-stories", key: "meetFounders" },
  },
  {
    id: "begreen",
    num: "02",
    image: "/nk/hero4.jpg",
    href: "/programs/begreen",
    figs: [
      { value: "846", key: "figJobs" },
      { value: "~7×", key: "figRevenue" },
      { value: "29.9M", key: "figWaste" },
    ],
    second: null,
  },
] as const;

const PILLARS = ["leadership", "innovation", "finance", "capacity", "partnerships"] as const;

export default function ProgramsPage() {
  const t = useTranslations("programs");
  const tp = useTranslations("home.pillars");
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;

  return (
    <div className="z-page z-pg">
      <header className="z-pg__head">
        <div className="z-wrap">
          <span className="z-mono z-eyebrow">{t("eyebrow")}</span>
          <h1 className="z-h2 z-balance">{t.rich("title", { s })}</h1>
          <p className="z-lead">{t("intro")}</p>
        </div>
      </header>

      {SPREADS.map((p, i) => {
        const tl = (k: string) => t(`list.${p.id}.${k}`);
        return (
          <section key={p.id} className={`z-spread${i % 2 ? " z-spread--flip" : ""}`} aria-labelledby={`pg-${p.id}`}>
            <div className="z-wrap">
              <div className="z-spread__in">
                <figure className="z-spread__ph">
                  <img src={p.image} alt={t(`${p.id}Alt`)} loading={i ? "lazy" : "eager"} />
                  <span className="z-spread__num" aria-hidden="true">{p.num}</span>
                </figure>
                <div className="z-spread__tx">
                  <span className="z-mono z-spread__kick">{t(`${p.id}Kicker`)}</span>
                  <h2 id={`pg-${p.id}`} className="z-spread__h">{t.rich(`${p.id}Title`, { s })}</h2>
                  <p className="z-spread__drop">{tl("description")}</p>
                  <dl className="z-spread__figs">
                    {p.figs.map((f) => (
                      <div key={f.key}><dt>{t(f.key)}</dt><dd>{f.value}</dd></div>
                    ))}
                  </dl>
                  {p.id === "begreen" ? (
                    <blockquote className="z-spread__pull">{t("begreenPull")}</blockquote>
                  ) : (
                    <ul className="z-spread__areas" aria-label={t("focusLabel")}>
                      {(t.raw(`list.${p.id}.focusAreas`) as string[]).map((a) => <li key={a}>{a}</li>)}
                    </ul>
                  )}
                  <div className="z-ctas" style={{ marginTop: 24 }}>
                    <Link href={p.href} className="z-btn z-btn--green">{t("readProgramme")} <Icon name="arrow_forward" /></Link>
                    {p.second && <Link href={p.second.href} className="z-ghost">{t(p.second.key)} <Icon name="photo_library" /></Link>}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <div className="z-tear z-tear--top" aria-hidden="true" />
      <section className="z-dark z-pg__pillars" aria-labelledby="pg-pillars">
        <div className="z-wrap">
          <div className="z-sec-head">
            <div>
              <span className="z-mono z-kicker">{t("pillarsKicker")}</span>
              <h2 id="pg-pillars" className="z-h2 z-balance">{t.rich("pillarsTitle", { s })}</h2>
            </div>
            <p className="z-pg__pbody">{t("pillarsBody")}</p>
          </div>
          <ol className="z-contents">
            {PILLARS.map((p, i) => (
              <li key={p}>
                <span className="z-contents__n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{tp(`${p}.title`)}</h3>
                  <p>{tp(`${p}.desc`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <div className="z-tear z-tear--bottom" aria-hidden="true" />

      <section className="z-st__next">
        <div className="z-wrap">
          <div className="z-fund__ctagrid">
            <span className="z-tape" style={{ top: -13, left: "14%", transform: "rotate(-4deg)" }} aria-hidden="true" />
            <div>
              <span className="z-mono z-kicker">{t("ctaKicker")}</span>
              <h2 className="z-h2 z-balance">{t.rich("ctaTitle", { s })}</h2>
              <p className="z-fund__ctabody">{t("ctaBody")}</p>
            </div>
            <div className="z-fund__ctas">
              <Link href="/opportunities" className="z-btn z-btn--navy">{t("ctaButton")} <Icon name="arrow_forward" /></Link>
            </div>
          </div>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
