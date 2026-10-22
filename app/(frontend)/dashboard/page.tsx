"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useHomeFeed } from "@/lib/useHomeFeed";
import { Icon } from "@/components/zine/Icon";
import { cleanTitle } from "@/components/funding/NoticeCard";
import type { Opportunity } from "@/lib/useOpportunities";

const KEY = "kych:dashboard-pins";
const EVENT = "kych:pins";

const SHORTCUTS = [
  { key: "funding", href: "/opportunities", icon: "payments", bg: "var(--z-green)" },
  { key: "events", href: "/events", icon: "event", bg: "var(--z-pink)" },
  { key: "learn", href: "/e-library", icon: "psychology", bg: "var(--z-sun)" },
  { key: "safe", href: "/weather", icon: "rainy", bg: "var(--z-sky)" },
  { key: "programs", href: "/programs", icon: "rocket_launch", bg: "var(--z-green-l)" },
  { key: "stories", href: "/success-stories", icon: "photo_library", bg: "var(--z-paper-2)" },
] as const;
type Key = (typeof SHORTCUTS)[number]["key"];

// Pins live in this browser only (a per-device convenience); reads/writes never throw.
function readPins(): string {
  try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; }
}
function writePins(keys: Key[]) {
  try { localStorage.setItem(KEY, keys.join(",")); } catch { /* storage blocked: pins just won't persist */ }
  window.dispatchEvent(new Event(EVENT));
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", cb); };
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tp = useTranslations("home.picker");
  const feed = useHomeFeed();
  const raw = useSyncExternalStore(subscribe, readPins, () => "");
  const pins = raw.split(",").filter((k): k is Key => SHORTCUTS.some((s) => s.key === k));
  const toggle = (k: Key) => writePins(pins.includes(k) ? pins.filter((p) => p !== k) : [...pins, k]);
  const ordered = [...SHORTCUTS].sort((a, b) => Number(pins.includes(b.key)) - Number(pins.includes(a.key)));
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;

  const title = (k: Key) => (k === "programs" || k === "stories" ? t(`cards.${k}.title`) : tp(`${k}.title`));
  const desc = (k: Key) => (k === "programs" || k === "stories" ? t(`cards.${k}.desc`) : tp(`${k}.desc`));

  // One live line per card, from the same feed as the homepage board.
  const live = (k: Key): string | null => {
    if (feed.loading) return null;
    switch (k) {
      case "funding":
        if (feed.closing) return t("live.closing", { days: feed.closing.daysLeft, title: cleanTitle({ ...feed.closing, name: feed.closing.title } as unknown as Opportunity) });
        return feed.counts.opportunities !== null ? tp("funding.count", { n: feed.counts.opportunities }) : null;
      case "events":
        if (feed.nextEvent) return t("live.nextEvent", { days: feed.nextEvent.daysUntil, title: feed.nextEvent.title });
        return null;
      case "learn":
        return feed.counts.library !== null ? t("live.library", { n: feed.counts.library }) : null;
      case "safe":
        return t("live.safe");
      case "programs":
        return t("live.programs");
      case "stories":
        return t("live.stories");
    }
  };

  return (
    <div className="z-page z-dash">
      <header className="z-dash__head">
        <div className="z-wrap">
          <span className="z-mono z-eyebrow">{t("eyebrow")}</span>
          <h1 className="z-h2 z-balance">{t.rich("title", { s })}</h1>
          <p className="z-lead">{t("subtitle")}</p>

          <fieldset className="z-dash__pick">
            <legend className="z-mono">{t("pickLabel")}</legend>
            <div>
              {SHORTCUTS.map((sc) => (
                <label key={sc.key} className="z-chip">
                  <input type="checkbox" checked={pins.includes(sc.key)} onChange={() => toggle(sc.key)} />
                  <span><Icon name={pins.includes(sc.key) ? "push_pin" : sc.icon} fill={pins.includes(sc.key)} /> {title(sc.key)}</span>
                </label>
              ))}
            </div>
            <p className="z-dash__hint">{pins.length ? t("pinnedNote", { n: pins.length }) : t("pickHint")}</p>
          </fieldset>
        </div>
      </header>

      <section className="z-dash__board" aria-label={t("boardLabel")}>
        <div className="z-wrap">
          <ul className="z-dash__grid">
            {ordered.map((sc) => {
              const pinned = pins.includes(sc.key);
              const line = live(sc.key);
              return (
                <li key={sc.key} className={pinned ? "z-dash__item z-dash__item--pinned" : "z-dash__item"}>
                  <Link href={sc.href} className="z-dash__card">
                    {pinned && <span className="z-dash__pin" aria-hidden="true"><Icon name="push_pin" fill /></span>}
                    <span className="z-dash__ico" style={{ background: sc.bg }}><Icon name={sc.icon} /></span>
                    <span className="z-dash__body">
                      <b>{title(sc.key)}</b>
                      <span className="z-dash__desc">{desc(sc.key)}</span>
                      <span className="z-dash__live z-mono" aria-live="polite">{line ?? "…"}</span>
                    </span>
                    <span className="z-dash__go" aria-hidden="true"><Icon name="arrow_forward" /></span>
                    {pinned && <span className="z-sr">{t("pinned")}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="z-tear z-tear--top" aria-hidden="true" />
      <section className="z-dark z-dash__ai" aria-labelledby="dash-ai">
        <div className="z-wrap z-dash__aigrid">
          <span className="z-dash__aiicon"><Icon name="forum" fill size={40} /></span>
          <div>
            <span className="z-mono z-kicker">{t("aiKicker")}</span>
            <h2 id="dash-ai" className="z-h2">{t.rich("aiTitle", { s })}</h2>
            <p>{t("aiBody")}</p>
          </div>
          <button type="button" className="z-btn z-btn--green" onClick={() => window.dispatchEvent(new CustomEvent("kych:open-chat"))}>
            <Icon name="chat" /> {t("aiButton")}
          </button>
        </div>
      </section>
      <div className="z-tear z-tear--bottom" aria-hidden="true" />

      <section className="z-dash__join">
        <div className="z-wrap">
          <p>{t("joinText")}</p>
          <Link href="/register" className="z-btn z-btn--navy z-btn--sm">{t("joinButton")} <Icon name="arrow_forward" /></Link>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
