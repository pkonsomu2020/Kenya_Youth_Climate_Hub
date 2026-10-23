"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";

type Alert = { type: "rain" | "heat" | "flood" | "closing" | "event"; params: Record<string, string | number>; href: string };

const ICON: Record<Alert["type"], string> = { rain: "rainy_heavy", heat: "thermostat", flood: "flood", closing: "timer", event: "event" };
const ROTATE_MS = 7000;
const REGION_KEYS: Record<string, string> = {
  Western: "western", "Rift Valley": "rift", "Coastal Belt": "coast", "North Eastern": "northEast", Central: "central", "Nairobi & Eastern": "nairobiEast",
};

/**
 * Automated alert strip: rotates through alerts built from live data (/api/alerts).
 * Pauses on hover/focus and has a pause button (WCAG 2.2.2); no auto-rotation
 * for people who prefer reduced motion. Rotation itself is not announced.
 */
export function AlertTicker({ className = "" }: { className?: string }) {
  const t = useTranslations("alerts");
  const locale = useLocale();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false); // hover or focus inside
  const [reduced, setReduced] = useState(false);
  const [manual, setManual] = useState(false); // user moved it: announce changes

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/alerts?lang=${locale}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (!cancelled && Array.isArray(j?.alerts)) { setAlerts(j.alerts); setI(0); } })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [locale]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const running = alerts.length > 1 && !paused && !held && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setI((n) => (n + 1) % alerts.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [running, alerts.length]);

  if (!alerts.length) return null;
  const a = alerts[i % alerts.length];
  const regions = String(a.params.regions ?? "").split("|").filter(Boolean).map((r) => (REGION_KEYS[r] ? t(`regions.${REGION_KEYS[r]}`) : r)).join(", ");
  const body = t(`${a.type}.body`, { ...a.params, regions });
  const go = (d: number) => { setManual(true); setI((n) => (n + d + alerts.length) % alerts.length); };

  return (
    <section
      className={`z-alerts ${className}`}
      aria-label={t("label")}
      aria-roledescription={t("roledescription")}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false); }}
    >
      <div className="z-alerts__pill">
        <Link href={a.href} className="z-alerts__link" aria-live={manual ? "polite" : "off"}>
          <b className={`z-alerts__badge z-alerts__badge--${a.type}`}><Icon name={ICON[a.type]} fill /> {t(`${a.type}.badge`)}</b>
          <span className="z-alerts__body">{body}</span>
          <i className="z-alerts__cta">{t(`${a.type}.cta`)} <Icon name="arrow_forward" /></i>
        </Link>
        {alerts.length > 1 && (
          <div className="z-alerts__ctrl">
            <button type="button" onClick={() => go(-1)} aria-label={t("prev")}><Icon name="chevron_left" /></button>
            <span className="z-mono" aria-hidden="true">{(i % alerts.length) + 1}/{alerts.length}</span>
            <button type="button" onClick={() => go(1)} aria-label={t("next")}><Icon name="chevron_right" /></button>
            {!reduced && (
              <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? t("play") : t("pause")} aria-pressed={paused}>
                <Icon name={paused ? "play_arrow" : "pause"} fill />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
