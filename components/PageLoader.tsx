"use client";

import { useEffect, useState, useRef } from "react";
import { NK } from "@/lib/nkTheme";

/**
 * Intro splash — ported from NEW_KYCH's `#k-loader`. Runs once when the
 * frontend layout first mounts (Next.js keeps the layout mounted across
 * client-side navigation, so this shows on initial load, not on every
 * page transition). Respects prefers-reduced-motion.
 *
 * Uses the real KYCH logo rather than a text wordmark — the original
 * design's green "reveal mask" was built for plain colored text, which
 * doesn't translate to a multi-color raster logo, so this uses a
 * brutalist offset accent block behind the logo instead (same visual
 * language as the offset shadows used everywhere else in this design).
 */
export function PageLoader() {
  const [pct, setPct] = useState(0);
  const [hiding, setHiding] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [dot, setDot] = useState({ x: 0, y: 0 });
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setPct(100);
      setRemoved(true);
      return;
    }

    let raf: number;
    const DURATION = 2100;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(1, elapsed / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      setPct(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const revealTimer = setTimeout(() => setReveal(true), 150);
    const hideTimer = setTimeout(() => setHiding(true), 2700);
    const removeTimer = setTimeout(() => setRemoved(true), 3400);

    const onMove = (e: MouseEvent) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      setDot({ x: cx * 60, y: cy * 60 });
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(revealTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: NK.bg,
        backgroundImage: `radial-gradient(${NK.green}18 1.3px, transparent 1.6px)`,
        backgroundSize: "26px 26px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: hiding ? 0 : 1,
        visibility: hiding ? "hidden" : "visible",
        transition: "opacity 0.7s ease, visibility 0.7s ease",
        pointerEvents: hiding ? "none" : "auto",
      }}
    >
      <div style={{ width: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src="/kych_logo.png"
          alt="Kenya Youth Climate Hub"
          style={{
            width: "100%", height: "auto",
            opacity: reveal ? 1 : 0,
            transform: reveal ? "scale(1) rotate(0deg)" : "scale(0.55) rotate(-8deg)",
            transition: "opacity 0.5s ease, transform 0.8s cubic-bezier(.34,1.56,.64,1)",
            animation: reveal ? "float 3s ease-in-out 0.8s infinite" : "none",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "2.5rem" }}>
        <div style={{ width: 230, height: 2, background: "rgba(16,28,51,0.14)", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: NK.ink, transition: "width 0.1s linear" }} />
        </div>
        <div style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, color: NK.ink }}>{pct}%</div>
      </div>

      {/* Decorative parallax dot */}
      <div
        style={{
          position: "absolute", right: "18%", bottom: "28%",
          width: 14, height: 14, background: NK.navyDeep,
          transform: `translate(${dot.x}px, ${dot.y}px)`,
          transition: "transform 0.2s ease-out",
        }}
      />
    </div>
  );
}
