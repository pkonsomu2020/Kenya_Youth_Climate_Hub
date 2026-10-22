"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CarbonCalculator } from "@/components/tools/CarbonCalculator";
import { ClimateQuiz } from "@/components/tools/ClimateQuiz";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { Icon } from "@/components/zine/Icon";

type Resource = {
  id: string; title: string; description?: string; use_case?: string; url: string; source?: string;
  category?: string; topic?: string; difficulty?: string; is_free?: boolean;
};

// Folder order and tab colours; the label is the category name through the taxonomy messages.
const FOLDERS = [
  { key: "Toolkit", icon: "handyman", tab: "var(--z-green)" },
  { key: "Dataset", icon: "database", tab: "var(--z-sun)" },
  { key: "AI Tool", icon: "smart_toy", tab: "var(--z-sky)" },
  { key: "Report", icon: "description", tab: "var(--z-pink)" },
  { key: "Calculator", icon: "calculate", tab: "var(--z-green-l)" },
] as const;

function split(r: Resource) {
  const i = r.title.lastIndexOf(" - ");
  return {
    title: i > 20 ? r.title.slice(0, i) : r.title,
    publisher: i > 20 ? r.title.slice(i + 3) : (r.source || "").replace(/\s*\[.*?\]\s*/g, "").trim(),
  };
}

export default function ELibrary() {
  const t = useTranslations("library");
  const tax = useTaxonomy();
  const locale = useLocale();
  const [openTool, setOpenTool] = useState<"calculator" | "quiz" | null>(null);
  const [folder, setFolder] = useState<string>("Toolkit");
  const [items, setItems] = useState<Resource[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/library?limit=50&lang=${locale}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => { if (!cancelled) { setItems(j.data ?? []); setFailed(false); setLoadedFor(locale); } })
      .catch(() => { if (!cancelled) { setFailed(true); setLoadedFor(locale); } });
    return () => { cancelled = true; };
  }, [locale]);
  const loading = loadedFor !== locale;

  const seen = new Set<string>();
  const unique = items.filter((r) => { const k = split(r).title.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
  const count = (k: string) => unique.filter((r) => r.category === k).length;
  const folders = FOLDERS.filter((f) => count(f.key) > 0);
  const active = folders.find((f) => f.key === folder) ?? folders[0];
  const docs = active ? unique.filter((r) => r.category === active.key) : [];
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;

  const tools = [
    { id: "calculator" as const, icon: "footprint", tone: "green", title: t("calcTitle"), desc: t("calcDesc"), tags: t.raw("calcTags") as string[] },
    { id: "quiz" as const, icon: "psychology", tone: "navy", title: t("quizTitle"), desc: t("quizDesc"), tags: t.raw("quizTags") as string[] },
  ];

  return (
    <div className="z-page z-lib">
      <header className="z-lib__head">
        <div className="z-wrap">
          <span className="z-mono z-eyebrow">{t("eyebrow")}</span>
          <h1 className="z-h2 z-balance">{t.rich("title", { s })}</h1>
          <p className="z-lead">{t("intro")}</p>
        </div>
      </header>

      {/* the tool shelf */}
      <div className="z-tear z-tear--top" aria-hidden="true" />
      <section className="z-dark z-lib__shelfsec" aria-labelledby="lib-tools">
        <div className="z-wrap">
          <h2 id="lib-tools" className="z-fund__h3"><Icon name="apps" /> {t("toolsTitle")}</h2>
          <ul className="z-shelf">
            {tools.map((tool) => (
              <li key={tool.id}>
                <button type="button" className={`z-app z-app--${tool.tone}`} onClick={() => setOpenTool(tool.id)}>
                  <span className="z-app__icon"><Icon name={tool.icon} fill size={40} /></span>
                  <span className="z-app__body">
                    <b>{tool.title}</b>
                    <span className="z-app__desc">{tool.desc}</span>
                    <span className="z-app__tags">{tool.tags.map((tag) => <span key={tag}>{tag}</span>)}</span>
                  </span>
                  <span className="z-app__go">{t("launch")} <Icon name="arrow_forward" /></span>
                </button>
              </li>
            ))}
          </ul>
          <div className="z-shelf__plank" aria-hidden="true" />
        </div>
      </section>
      <div className="z-tear z-tear--bottom" aria-hidden="true" />

      {/* resources as file folders */}
      <section className="z-lib__filesec" aria-labelledby="lib-files">
        <div className="z-wrap">
          <div className="z-sec-head">
            <div>
              <span className="z-mono z-kicker">{t("filesKicker", { count: unique.length })}</span>
              <h2 id="lib-files" className="z-h2">{t.rich("filesTitle", { s })}</h2>
            </div>
            <p className="z-lib__filesnote">{t("filesNote")}</p>
          </div>

          {loading ? (
            <div className="z-folder z-skel" style={{ height: 360 }} aria-hidden="true" />
          ) : failed || !active ? (
            <div className="z-fund__empty"><Icon name="folder_off" size={44} /><p>{failed ? t("loadError") : t("empty")}</p></div>
          ) : (
            <div className="z-folder">
              <div className="z-folder__tabs" role="group" aria-label={t("foldersLabel")}>
                {folders.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={f.key === active.key}
                    style={{ "--tab": f.tab } as React.CSSProperties}
                    onClick={() => setFolder(f.key)}
                  >
                    <Icon name={f.icon} /> {tax(f.key)} <small>{count(f.key)}</small>
                  </button>
                ))}
              </div>
              <div className="z-folder__body" style={{ "--tab": active.tab } as React.CSSProperties}>
                <ul className="z-docs">
                  {docs.map((r) => {
                    const { title, publisher } = split(r);
                    return (
                      <li key={r.id}>
                        <a className="z-doc" href={r.url} target="_blank" rel="noopener noreferrer">
                          <span className="z-doc__meta z-mono">
                            {r.topic && <span>{tax(r.topic)}</span>}
                            {r.is_free && <span className="z-doc__free">{t("free")}</span>}
                          </span>
                          <b>{title}</b>
                          {(r.use_case || r.description) && <span className="z-doc__desc">{r.use_case || r.description}</span>}
                          <span className="z-doc__foot">
                            <span>{publisher}</span>
                            {r.difficulty && <span className="z-mono">{tax(r.difficulty)}</span>}
                            <Icon name="open_in_new" />
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="z-lib__cta">
        <div className="z-wrap">
          <article className="z-index-card z-lib__card">
            <span className="z-tape z-tape--sun" style={{ top: -12, left: 34, transform: "rotate(-4deg)" }} aria-hidden="true" />
            <h2 className="z-mono">{t("ctaKicker")}</h2>
            <p>{t.rich("ctaTitle", { s })}</p>
            <span className="z-lib__cardbody">{t("ctaBody")}</span>
            <a className="z-btn z-btn--navy" href="mailto:info@kenyayouthclimatehub.org?subject=Resource%20for%20the%20E-Library">
              <Icon name="upload_file" /> {t("ctaButton")}
            </a>
          </article>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />

      {openTool === "calculator" && <CarbonCalculator onClose={() => setOpenTool(null)} />}
      {openTool === "quiz" && <ClimateQuiz onClose={() => setOpenTool(null)} />}
    </div>
  );
}
