"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CarbonCalculator } from "@/components/tools/CarbonCalculator";
import { ClimateQuiz } from "@/components/tools/ClimateQuiz";
import { ChevronRight, Globe, Brain } from "lucide-react";

function useInView(ref: React.RefObject<Element | null>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref]);
  return v;
}

function ToolCard({ id, gradient, icon, title, desc, tags, onClick, index }: {
  id: string; gradient: string; icon: React.ReactNode; title: string;
  desc: string; tags: string[]; onClick: () => void; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);

  return (
    <button
      ref={ref as any}
      onClick={onClick}
      style={{
        background: gradient,
        border: `1px solid ${hov ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.1)"}`,
        borderRadius: 20, padding: "2rem",
        cursor: "pointer", textAlign: "left",
        position: "relative", overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
        transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s, box-shadow .3s ease`,
        boxShadow: hov ? "0 24px 60px -10px rgba(0,0,0,.35)" : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,.06)", transition: "transform .5s ease", transform: hov ? "scale(1.2)" : "scale(1)" }} />
      <div style={{ position: "absolute", right: 30, bottom: -40, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", color: "#fff", transition: "transform .3s ease", transform: hov ? "rotate(-5deg) scale(1.1)" : "none" }}>
          {icon}
        </div>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#fff", marginBottom: ".6rem", lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,.75)", lineHeight: 1.65, marginBottom: "1.5rem" }}>{desc}</div>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem", flexWrap: "wrap" }}>
          {tags.map(t => (
            <span key={t} style={{ fontSize: ".68rem", padding: ".2rem .65rem", background: "rgba(255,255,255,.15)", color: "#fff", borderRadius: 99, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>{t}</span>
          ))}
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: ".25rem", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: ".8rem", letterSpacing: "0.05em" }}>
            LAUNCH <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </button>
  );
}

export default function ELibrary() {
  const [openTool, setOpenTool] = useState<"calculator" | "quiz" | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <>
      <PageHeader
        eyebrow="Resource Hub"
        title={<>Climate <span style={{ color: "#5dba2f" }}>E-Library</span></>}
        subtitle="Interactive tools, reports, and resources built exclusively for young Kenyan climate changemakers."
      />

      <section className="py-32 px-6 md:px-16" style={{ background: "var(--section-dark)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            ref={ref}
            style={{ marginBottom: "3rem", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}
          >
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dba2f" }}>Interactive Tools</span>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--text-on-dark)", letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: "1rem", marginBottom: ".75rem" }}>
              BUILT FOR <span style={{ color: "#5dba2f" }}>KENYA'S</span><br />CHANGEMAKERS
            </h2>
            <p style={{ color: "var(--muted-foreground)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 560 }}>
              Exclusive tools designed to help you measure your impact, test your knowledge, and take action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToolCard
              id="calculator"
              gradient="linear-gradient(135deg, #059669 0%, #047857 60%, #065f46 100%)"
              icon={<Globe size={26} />}
              title="Carbon Footprint Calculator"
              desc="Calculate your personal CO₂ impact in 60 seconds using Kenya-specific emission factors. Get personalised tips."
              tags={["4 questions", "60 seconds", "Kenya data"]}
              onClick={() => setOpenTool("calculator")}
              index={0}
            />
            <ToolCard
              id="quiz"
              gradient="linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)"
              icon={<Brain size={26} />}
              title="Climate Readiness Quiz"
              desc="Test your climate knowledge. Earn a badge. Get personalised learning resources based on your results."
              tags={["8 questions", "3 minutes", "4 badge tiers"]}
              onClick={() => setOpenTool("quiz")}
              index={1}
            />
          </div>
        </div>
      </section>

      {openTool === "calculator" && <CarbonCalculator onClose={() => setOpenTool(null)} />}
      {openTool === "quiz"       && <ClimateQuiz      onClose={() => setOpenTool(null)} />}
    </>
  );
}
