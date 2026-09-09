"use client";

import { useRef, useEffect, useState } from "react";
import { NK } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { CTABand } from "@/components/CTABand";

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

const VALUES = [
  { title: "Climate Justice", desc: "Fair outcomes for frontline communities" },
  { title: "Youth Inclusion", desc: "Ages 15–35 at the centre of every decision" },
  { title: "Gender Equity", desc: "Equal voice, equal access, equal impact" },
  { title: "Innovation", desc: "Kenyan solutions for Kenyan challenges" },
  { title: "Evidence-Based", desc: "Data-driven, research-backed action" },
  { title: "Systems Change", desc: "Beyond symptoms, changing root causes" },
];

export default function About() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <Eyebrow>About KYCH</Eyebrow>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(44px,5.6vw,86px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.02, margin: 0 }}>
            More than a hub, <span style={{ color: NK.green }}>a movement.</span>
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.25rem", color: NK.muted, lineHeight: 1.7, marginTop: "1.5rem", maxWidth: 660 }}>
            KYCH serves as a national digital platform for Kenya&apos;s youth climate movement, connecting ambition to systems change across all 47 counties.
          </p>
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      <section style={{ background: NK.bg }}>
        <Reveal>
          <div style={{ position: "relative" }}>
            <img src="/nk/hero3.jpg" alt="Kenya Youth Climate Hub team in action" style={{ width: "100%", height: 460, objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, left: "2.5rem", background: NK.navyDeep, color: NK.offWhiteOnDark, padding: "1rem 1.4rem" }}>
              <span style={{ fontFamily: "var(--fm)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Founded 2020 · Powered by Afosi</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── OUR STORY ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "4.5rem 2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4.75rem", alignItems: "start" }} className="nk-2col">
          <Reveal>
            <Eyebrow>Our Story</Eyebrow>
            <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(32px,3.6vw,50px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 1.5rem" }}>
              Ambition, connected to systems change.
            </GrowHeading>
            <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.muted, lineHeight: 1.8, marginBottom: "1rem" }}>
              KYCH operates under <strong style={{ color: NK.ink }}>Afosi, Action for Sustainability Initiative</strong>, blending over a decade of evidence-based development with youth-first design.
            </p>
            <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.muted, lineHeight: 1.8 }}>
              We connect young Kenyans aged 15 to 35 to climate finance, skills, policy spaces and innovation opportunities in every county.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: NK.green, color: NK.navyDeep, padding: "2.25rem" }}>
                <div style={{ fontFamily: "var(--fm)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: ".75rem" }}>Mission</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(22px,2.4vw,30px)", lineHeight: 1.25 }}>Equip every young Kenyan to lead climate action.</div>
              </div>
              <div style={{ background: NK.ink, color: NK.offWhiteOnDark, padding: "2.25rem" }}>
                <div style={{ fontFamily: "var(--fm)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: NK.green, marginBottom: ".75rem" }}>Vision</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 600, fontSize: "clamp(19px,2vw,25px)", lineHeight: 1.3 }}>A Kenya where young people don&apos;t just adapt to climate change, they lead the response.</div>
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
                What Drives Us
              </span>
              <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(34px,4vw,56px)", color: "#fff", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
                Our core values.
              </GrowHeading>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
            {VALUES.map((v, i) => (
              <div key={v.title} style={{ border: `1px solid ${NK.borderNavy}`, background: NK.panelNavy, padding: "2rem", transition: "border-color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = NK.green)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = NK.borderNavy)}
              >
                <div style={{ fontFamily: "var(--fm)", fontSize: 12, color: NK.green, marginBottom: ".75rem" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.3rem", color: "#fff", marginBottom: ".5rem" }}>{v.title}</div>
                <p style={{ fontSize: ".9rem", color: NK.mutedOnDark, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
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
              Afosi generates the evidence. Youth generate the solutions. The Hub connects them to scale.
            </p>
            <div style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: NK.mutedLabel }}>
              Kenya Youth Climate Hub
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand title="Ready to join the movement?" buttonLabel="Get started today →" href="/opportunities" />
    </>
  );
}

