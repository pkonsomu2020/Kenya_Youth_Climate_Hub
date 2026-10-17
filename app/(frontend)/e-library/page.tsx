"use client";

import { useState, useRef, useEffect } from "react";
import { CarbonCalculator } from "@/components/tools/CarbonCalculator";
import { ClimateQuiz } from "@/components/tools/ClimateQuiz";
import { Globe, Brain } from "lucide-react";
import { NK, nkShadow } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { CTABand } from "@/components/CTABand";
import { useTranslations } from "next-intl";

function useInView(ref: React.RefObject<Element | null>, threshold = 0.1) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref, threshold]);
  return v;
}

function ToolCard({ gradient, icon, title, desc, tags, onClick, index }: {
  gradient: string; icon: React.ReactNode; title: string; desc: string; tags: string[]; onClick: () => void; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  const t = useTranslations("library");
  return (
    <button
      ref={ref as any}
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: gradient, border: `2px solid ${NK.ink}`, padding: "2rem", cursor: "pointer", textAlign: "left",
        boxShadow: hov ? nkShadow(NK.green) : nkShadow(NK.ink),
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity .6s ease ${index * 0.1}s, transform .6s ease ${index * 0.1}s, box-shadow .2s`,
      }}
    >
      <div style={{ width: 50, height: 50, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", color: "#fff" }}>
        {icon}
      </div>
      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.2rem", color: "#fff", marginBottom: ".6rem" }}>{title}</div>
      <div style={{ fontSize: ".88rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.65, marginBottom: "1.5rem" }}>{desc}</div>
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem", flexWrap: "wrap" }}>
        {tags.map((tag) => (
          <span key={tag} style={{ fontSize: ".68rem", padding: "3px 10px", background: "rgba(255,255,255,0.15)", color: "#fff", fontFamily: "var(--fb)", fontWeight: 600 }}>{tag}</span>
        ))}
        <span style={{ marginLeft: "auto", fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".8rem", color: "#fff" }}>{t("launch")} →</span>
      </div>
    </button>
  );
}

export default function ELibrary() {
  const t = useTranslations("library");
  const [openTool, setOpenTool] = useState<"calculator" | "quiz" | null>(null);

  return (
    <>
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
            {t("eyebrow")}
          </span>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(44px,5.6vw,86px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.02, margin: 0 }}>
            {t.rich("title", { g: (c) => <span style={{ color: NK.green }}>{c}</span> })}
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.25rem", color: NK.muted, lineHeight: 1.7, marginTop: "1.5rem", maxWidth: 660 }}>
            {t("intro")}
          </p>
        </div>
      </section>

      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "1.5rem 2.5rem 5.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="nk-2col">
            <ToolCard
              gradient="linear-gradient(135deg, #059669 0%, #047857 60%, #065f46 100%)"
              icon={<Globe size={24} />}
              title={t("calcTitle")}
              desc={t("calcDesc")}
              tags={t.raw("calcTags") as string[]}
              onClick={() => setOpenTool("calculator")}
              index={0}
            />
            <ToolCard
              gradient={`linear-gradient(135deg, ${NK.navyDeep} 0%, ${NK.panelNavy} 60%, ${NK.navyDeep} 100%)`}
              icon={<Brain size={24} />}
              title={t("quizTitle")}
              desc={t("quizDesc")}
              tags={t.raw("quizTags") as string[]}
              onClick={() => setOpenTool("quiz")}
              index={1}
            />
          </div>
        </div>
      </section>

      <CTABand title={t("ctaTitle")} buttonLabel={`${t("ctaButton")} →`} href="/programs" />

      {openTool === "calculator" && <CarbonCalculator onClose={() => setOpenTool(null)} />}
      {openTool === "quiz" && <ClimateQuiz onClose={() => setOpenTool(null)} />}
    </>
  );
}
