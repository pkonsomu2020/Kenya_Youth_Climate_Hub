"use client";

import { useRef, useEffect, useState } from "react";
import { NK } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { CTABand } from "@/components/CTABand";
import { useTranslations } from "next-intl";

function useInView(ref: React.RefObject<Element | null>, threshold = 0.12) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
      {children}
    </span>
  );
}

// Shared with the homepage: home.values.*
const VALUES = ["justice", "inclusion", "gender", "innovation", "evidence", "systems"] as const;

export default function About() {
  const t = useTranslations("about");
  const tv = useTranslations("home.values");
  const g = (c: React.ReactNode) => <span style={{ color: NK.green }}>{c}</span>;
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(44px,5.6vw,86px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.02, margin: 0 }}>
            {t.rich("title", { g })}
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.25rem", color: NK.muted, lineHeight: 1.7, marginTop: "1.5rem", maxWidth: 660 }}>
            {t("intro")}
          </p>
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      <section style={{ background: NK.bg }}>
        <Reveal>
          <div style={{ position: "relative" }}>
            <img src="/nk/hero3.jpg" alt={t("imgAlt")} style={{ width: "100%", height: 460, objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, left: "2.5rem", background: NK.navyDeep, color: NK.offWhiteOnDark, padding: "1rem 1.4rem" }}>
              <span style={{ fontFamily: "var(--fm)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("badge")}</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── OUR STORY ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "4.5rem 2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4.75rem", alignItems: "start" }} className="nk-2col">
          <Reveal>
            <Eyebrow>{t("storyEyebrow")}</Eyebrow>
            <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(32px,3.6vw,50px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 1.5rem" }}>
              {t("storyTitle")}
            </GrowHeading>
            <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.muted, lineHeight: 1.8, marginBottom: "1rem" }}>
              {t.rich("story1", { b: (c) => <strong style={{ color: NK.ink }}>{c}</strong> })}
            </p>
            <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.muted, lineHeight: 1.8 }}>
              {t("story2")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: NK.green, color: NK.navyDeep, padding: "2.25rem" }}>
                <div style={{ fontFamily: "var(--fm)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: ".75rem" }}>{t("mission")}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(22px,2.4vw,30px)", lineHeight: 1.25 }}>{t("missionText")}</div>
              </div>
              <div style={{ background: NK.ink, color: NK.offWhiteOnDark, padding: "2.25rem" }}>
                <div style={{ fontFamily: "var(--fm)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: NK.green, marginBottom: ".75rem" }}>{t("vision")}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 600, fontSize: "clamp(19px,2vw,25px)", lineHeight: 1.3 }}>{t("visionText")}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CORE VALUES (dark) ── */}
      <section style={{ background: NK.navyDeep }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "6.25rem 2.5rem" }}>
          <Reveal>
            <div style={{ maxWidth: 640, marginBottom: "3rem" }}>
              <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.offWhiteOnDark, marginBottom: "1rem" }}>
                {tv("eyebrow")}
              </span>
              <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(34px,4vw,56px)", color: "#fff", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
                {t("valuesTitle")}
              </GrowHeading>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
            {VALUES.map((v, i) => (
              <div key={v} style={{ border: `1px solid ${NK.borderNavy}`, background: NK.panelNavy, padding: "2rem", transition: "border-color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = NK.green)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = NK.borderNavy)}
              >
                <div style={{ fontFamily: "var(--fm)", fontSize: 12, color: NK.green, marginBottom: ".75rem" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.3rem", color: "#fff", marginBottom: ".5rem" }}>{tv(`${v}.title`)}</div>
                <p style={{ fontSize: ".9rem", color: NK.mutedOnDark, lineHeight: 1.6, margin: 0 }}>{tv(`${v}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "5.5rem 2.5rem", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: 90, color: NK.green, lineHeight: 0.5, marginBottom: "1rem" }}>&ldquo;</div>
            <p style={{ fontFamily: "var(--fs)", fontWeight: 500, fontSize: "clamp(24px,3vw,38px)", color: NK.ink, lineHeight: 1.3, margin: "0 0 1.5rem" }}>
              {t("quote")}
            </p>
            <div style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: NK.mutedLabel }}>
              Kenya Youth Climate Hub
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand title={t("ctaTitle")} buttonLabel={`${t("ctaButton")} →`} href="/opportunities" />
    </>
  );
}

