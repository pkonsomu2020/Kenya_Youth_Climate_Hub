"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";

const openChat = () => window.dispatchEvent(new CustomEvent("kych:open-chat"));

/** Recycled pieces that orbit Simba (flat SVG, no gradients). */
function Bottle({ fill, stroke, cap }: { fill: string; stroke: string; cap: string }) {
  return (
    <svg viewBox="0 0 40 100" aria-hidden="true">
      <path d="M15 4h10v10c0 4 9 8 9 18v58c0 4-3 7-7 7H13c-4 0-7-3-7-7V32c0-10 9-14 9-18z" fill={fill} fillOpacity=".78" stroke={stroke} strokeWidth="2" />
      <rect x="14" y="0" width="12" height="7" rx="2" fill={cap} />
      <path d="M11 40v44" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" />
      <path d="M6 55h28M6 62h28" stroke={stroke} strokeOpacity=".5" strokeWidth="1.5" />
    </svg>
  );
}
function Can() {
  return (
    <svg viewBox="0 0 50 80" aria-hidden="true">
      <rect x="4" y="8" width="42" height="66" rx="6" fill="#c9ced3" stroke="#6f7780" strokeWidth="2" />
      <ellipse cx="25" cy="9" rx="20" ry="5" fill="#e3e7ea" stroke="#6f7780" strokeWidth="2" />
      <rect x="4" y="30" width="42" height="22" fill="#E8501E" />
      <path d="M12 14v54" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function Cap() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="#2B8526" stroke="#0f3d12" strokeWidth="2" />
      <circle cx="20" cy="20" r="11" fill="none" stroke="#bff59f" strokeDasharray="3 3" strokeWidth="2" />
    </svg>
  );
}

/** Simba, the mascot: breathes, sways, leans towards the pointer; hover wakes him up. */
export function Simba() {
  const t = useTranslations("home.simba");
  const stageRef = useRef<HTMLButtonElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState(false);

  // Speed the orbiting pieces up smoothly (no restart) while Simba is awake.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stage.querySelectorAll(".z-orbit, .z-orbit svg").forEach((el) =>
      el.getAnimations().forEach((a) => a.updatePlaybackRate(hot ? 3.5 : 1)),
    );
  }, [hot]);

  const onMove = (e: React.PointerEvent) => {
    const stage = stageRef.current, tilt = tiltRef.current;
    if (!stage || !tilt || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
    tilt.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
  };
  const reset = () => {
    setHot(false);
    tiltRef.current?.style.setProperty("--rx", "0deg");
    tiltRef.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <section className="z-sec z-dark z-simba" aria-labelledby="z-simba-title">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="z-sway" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.010 0.016" numOctaves={2} seed={7} result="n">
            <animate attributeName="baseFrequency" dur="9s" values="0.010 0.016;0.013 0.020;0.010 0.016" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .2 1;.4 0 .2 1" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="z-wrap z-grid2">
        <button
          ref={stageRef}
          type="button"
          className="z-stage"
          data-hot={hot}
          aria-label={t("stageLabel")}
          onClick={openChat}
          onPointerEnter={() => setHot(true)}
          onPointerMove={onMove}
          onPointerLeave={reset}
          onFocus={() => setHot(true)}
          onBlur={reset}
        >
          <span className="z-ring" aria-hidden="true" />
          <span className="z-ring z-ring--b" aria-hidden="true" />
          <span ref={tiltRef} className="z-tilt">
            <span className="z-frame" style={{ display: "block" }}>
              <img src="/mascot/simba.webp" alt="" width={1000} height={1474} />
              <img className="z-frame__mane" src="/mascot/simba.webp" alt="" width={1000} height={1474} />
              <span className="z-plate" aria-hidden="true">
                <span className="z-plate__a">SIMBA<small>KYCH · 2026</small></span>
                <span className="z-plate__b">{t("plateTop")}<small>CLIMATE AI</small></span>
              </span>
            </span>
          </span>
          <span className="z-orbit" style={{ ["--d" as string]: "70s" }} aria-hidden="true">
            <span className="z-orbit__item" style={{ ["--r" as string]: "255px", ["--s" as string]: "46px", ["--sd" as string]: "12s" }}><Bottle fill="#4CB82C" stroke="#1d5e17" cap="#0b3d8f" /></span>
          </span>
          <span className="z-orbit z-orbit--rev" style={{ ["--d" as string]: "85s" }} aria-hidden="true">
            <span className="z-orbit__item z-orbit__item--rev" style={{ ["--r" as string]: "285px", ["--s" as string]: "40px", ["--sd" as string]: "9s" }}><Bottle fill="#3a8ee8" stroke="#123f73" cap="#e8e8e8" /></span>
          </span>
          <span className="z-orbit" style={{ ["--d" as string]: "95s", animationDelay: "-40s" }} aria-hidden="true">
            <span className="z-orbit__item" style={{ ["--r" as string]: "240px", ["--s" as string]: "44px", ["--sd" as string]: "14s" }}><Can /></span>
          </span>
          <span className="z-orbit z-orbit--rev" style={{ ["--d" as string]: "60s", animationDelay: "-20s" }} aria-hidden="true">
            <span className="z-orbit__item" style={{ ["--r" as string]: "300px", ["--s" as string]: "26px", ["--sd" as string]: "6s" }}><Cap /></span>
          </span>
          <span className="z-stage__hint" aria-hidden="true">{t("hint")}</span>
        </button>

        <div>
          <span className="z-kicker z-mono">{t("kicker")}</span>
          <h2 id="z-simba-title" className="z-h2">{t.rich("title", { br: () => <br />, s: (c) => <span className="z-serif">{c}</span> })}</h2>
          <p className="z-lead" style={{ marginTop: 20 }}>{t.rich("body", { b: (c) => <b>{c}</b> })}</p>
          <ul className="z-facts">
            <li><Icon name="recycling" />{t("factMade")}</li>
            <li><Icon name="translate" />{t("factLang")}</li>
            <li><Icon name="schedule" />{t("factTime")}</li>
          </ul>
          <button type="button" className="z-btn z-btn--green" onClick={openChat}>
            <Icon name="auto_awesome" fill /> {t("cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
