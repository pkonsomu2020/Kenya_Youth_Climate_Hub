"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Trophy, Leaf, Users } from "lucide-react";
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

function Eyebrow({ children, color = NK.greenAlt }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color, marginBottom: "1rem" }}>
      {children}
    </span>
  );
}

const PROGRAMS = [
  {
    // Text (tag, status, participants, prizeLabel, description, focusAreas) lives in programs.list.ycic
    id: "ycic",
    icon: Trophy,
    title: "Youth Climate Innovation Challenge",
    year: "2025",
    prize: "KES 500,000",
    image: "/nk/sheria.jpg",
    href: "/programs/ycic",
  },
  {
    id: "begreen",
    icon: Leaf,
    title: "BeGreen Africa Initiative",
    year: "2023–2025",
    prize: "USD 5,000",
    image: "/nk/hero4.jpg",
    href: "/programs/begreen",
  },
];

// Shared with the homepage: home.pillars.*
const PILLARS = ["leadership", "innovation", "finance", "capacity", "partnerships"] as const;

function ProgramBanner({ p, index }: { p: typeof PROGRAMS[0]; index: number }) {
  const [hov, setHov] = useState(false);
  const t = useTranslations(`programs.list.${p.id}`);
  const tp = useTranslations("programs");
  const Icon = p.icon;
  return (
    <Reveal delay={index * 0.1}>
      <div style={{
        background: NK.ink, color: NK.offWhiteOnDark,
        display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "3.5rem",
        padding: "3rem", alignItems: "center",
      }} className="nk-2col">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".65rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 40, height: 40, background: NK.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={20} color={NK.navyDeep} />
            </div>
            <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: NK.green }}>{t("tag")}</span>
          </div>
          <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(28px,3.4vw,44px)", color: "#fff", lineHeight: 1.15, margin: "0 0 1rem" }}>{p.title}</h2>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.mutedOnDark, lineHeight: 1.7, marginBottom: "1.5rem" }}>{t("description")}</p>

          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {(t.raw("focusAreas") as string[]).map((f) => (
              <span key={f} style={{ fontSize: ".7rem", fontFamily: "var(--fm)", padding: "5px 10px", border: `1px solid ${NK.borderNavy}`, color: NK.mutedOnDark }}>{f}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
            <div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: NK.mutedOnDark, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t("prizeLabel")}</div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.3rem", color: NK.green }}>{p.prize}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".4rem", fontFamily: "var(--fm)", fontSize: ".8rem", color: NK.mutedOnDark }}>
              <Users size={13} /> {t("participants")}
            </div>
            <div style={{ fontFamily: "var(--fm)", fontSize: ".8rem", color: NK.mutedOnDark }}>{t("status")}</div>
          </div>

          <Link
            href={p.href as any}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: ".5rem",
              padding: "14px 28px", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase",
              background: hov ? NK.bg : NK.green, color: NK.navyDeep, textDecoration: "none", transition: "background .2s",
            }}
          >
            {tp("viewProgram")} →
          </Link>
        </div>
        <div style={{ height: 300, overflow: "hidden" }}>
          <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </Reveal>
  );
}

export default function ProgramsPage() {
  const t = useTranslations("programs");
  const th = useTranslations("home.pillars");
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

      {/* ── PROGRAM BANNERS ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "1.5rem 2.5rem 5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {PROGRAMS.map((p, i) => <ProgramBanner key={p.id} p={p} index={i} />)}
        </div>
      </section>

      {/* ── FIVE PILLARS ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "1.5rem 2.5rem 5rem" }}>
          <Reveal>
            <div style={{ marginBottom: "2.5rem" }}>
              <Eyebrow>{th("eyebrow")}</Eyebrow>
              <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(34px,4vw,56px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
                {th.rich("title", { g })}
              </GrowHeading>
              <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.muted, marginTop: ".75rem", maxWidth: 640 }}>
                {t("pillarsBody")}
              </p>
            </div>
          </Reveal>
          <div>
            {PILLARS.map((p, i) => (
              <PillarRow key={p} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CTABand title={t("ctaTitle")} buttonLabel={`${t("ctaButton")} →`} href="/opportunities" />
    </>
  );
}

function PillarRow({ p, index }: { p: typeof PILLARS[number]; index: number }) {
  const t = useTranslations("home.pillars");
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", gap: "2rem", padding: "1.9rem 0", alignItems: "flex-start",
        borderTop: `2px solid ${NK.ink}`,
        borderBottom: index === PILLARS.length - 1 ? `2px solid ${NK.ink}` : "none",
        background: hov ? NK.tintGreen : "transparent",
        transition: "background .2s",
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "2.75rem", color: NK.green, minWidth: 80, lineHeight: 1 }}>{String(index + 1).padStart(2, "0")}</div>
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.4rem", color: NK.ink, marginBottom: ".5rem" }}>{t(`${p}.title`)}</div>
        <p style={{ fontSize: ".92rem", color: NK.muted, lineHeight: 1.65, margin: 0, maxWidth: 640 }}>{t(`${p}.desc`)}</p>
      </div>
      <div style={{ fontFamily: "var(--fm)", fontSize: 11.5, color: NK.mutedLabel, alignSelf: "center", whiteSpace: "nowrap" }}>
        {t("counter", { n: String(index + 1).padStart(2, "0"), total: "05" })}
      </div>
    </div>
  );
}
