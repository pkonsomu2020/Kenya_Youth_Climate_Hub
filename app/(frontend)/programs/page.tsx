"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Trophy, Leaf, Users } from "lucide-react";
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

function Eyebrow({ children, color = NK.greenAlt }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color, marginBottom: "1rem" }}>
      {children}
    </span>
  );
}

const PROGRAMS = [
  {
    id: "ycic",
    tag: "Flagship program",
    icon: Trophy,
    title: "Youth Climate Innovation Challenge",
    status: "Applications Closed",
    year: "2025",
    location: "Kenya (Nationwide)",
    participants: "300 Young Innovators",
    prize: "KES 500,000",
    prizeLabel: "Prize Pool",
    description: "An incubator for youth-led green startups, from clean energy to waste tech, focused on solutions for informal settlements. Winners receive seed funding, six months of expert mentorship and a route to market.",
    focusAreas: ["Water, Sanitation & Hygiene (WASH)", "Flood Resilience & Urban Drainage", "Renewable Energy & Sustainable Infrastructure"],
    image: "/nk/sheria.jpg",
    href: "/programs/ycic",
  },
  {
    id: "begreen",
    tag: "Active program",
    icon: Leaf,
    title: "BeGreen Africa Initiative",
    status: "Active — Kenya Pilot",
    year: "2023–2025",
    location: "Nairobi, Kisumu, Mombasa",
    participants: "2,264 Youth Applied",
    prize: "USD 5,000",
    prizeLabel: "Seed Funding",
    description: "A multi-partner green entrepreneurship programme for youth aged 18–35 in Kenya's waste management sector — 846 jobs created, ~USD 2.7M revenue generated, and 29.9M kgs of waste managed.",
    focusAreas: ["Plastic Waste Management", "Organic Waste & Biogas", "E-Waste Enterprises"],
    image: "/nk/hero4.jpg",
    href: "/programs/begreen",
  },
];

const PILLARS = [
  { title: "Youth Climate Leadership & Advocacy", desc: "Training Kenya's next climate negotiators, county advocates, and movement leaders to influence policy at every level." },
  { title: "Climate Innovation & Entrepreneurship", desc: "Incubating youth-led green startups, from clean energy to waste tech, through the Youth Climate Innovation Challenge." },
  { title: "Climate Finance & Opportunity Access", desc: "Connecting young Kenyans to grants, fellowships, competitions, and jobs that match their climate ambitions." },
  { title: "Capacity Building & Knowledge", desc: "Equipping young people with the skills, data, and tools to lead climate action through trainings and digital resources." },
  { title: "Partnerships & Ecosystem Building", desc: "Building bridges between youth, government, NGOs, development partners, and the private sector." },
];

function ProgramBanner({ p, index }: { p: typeof PROGRAMS[0]; index: number }) {
  const [hov, setHov] = useState(false);
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
            <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: NK.green }}>{p.tag}</span>
          </div>
          <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(28px,3.4vw,44px)", color: "#fff", lineHeight: 1.15, margin: "0 0 1rem" }}>{p.title}</h2>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.mutedOnDark, lineHeight: 1.7, marginBottom: "1.5rem" }}>{p.description}</p>

          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {p.focusAreas.map((f) => (
              <span key={f} style={{ fontSize: ".7rem", fontFamily: "var(--fm)", padding: "5px 10px", border: `1px solid ${NK.borderNavy}`, color: NK.mutedOnDark }}>{f}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
            <div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: NK.mutedOnDark, textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.prizeLabel}</div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.3rem", color: NK.green }}>{p.prize}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".4rem", fontFamily: "var(--fm)", fontSize: ".8rem", color: NK.mutedOnDark }}>
              <Users size={13} /> {p.participants}
            </div>
            <div style={{ fontFamily: "var(--fm)", fontSize: ".8rem", color: NK.mutedOnDark }}>{p.status}</div>
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
            View program →
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
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <Eyebrow>Programs &amp; Challenges</Eyebrow>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(44px,5.6vw,86px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.02, margin: 0 }}>
            Programs that <span style={{ color: NK.green }}>build leaders.</span>
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.25rem", color: NK.muted, lineHeight: 1.7, marginTop: "1.5rem", maxWidth: 660 }}>
            Apply for incubators, mentorship programs and challenges designed to accelerate youth-led climate action across all 47 counties.
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
              <Eyebrow>What We Do</Eyebrow>
              <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(34px,4vw,56px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
                Five pillars of <span style={{ color: NK.green }}>climate action.</span>
              </GrowHeading>
              <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.muted, marginTop: ".75rem", maxWidth: 640 }}>
                Focused strategic areas designed to accelerate climate action through youth-led innovation.
              </p>
            </div>
          </Reveal>
          <div>
            {PILLARS.map((p, i) => (
              <PillarRow key={p.title} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CTABand title="Build your climate solution with us." buttonLabel="View opportunities →" href="/opportunities" />
    </>
  );
}

function PillarRow({ p, index }: { p: typeof PILLARS[0]; index: number }) {
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
        <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.4rem", color: NK.ink, marginBottom: ".5rem" }}>{p.title}</div>
        <p style={{ fontSize: ".92rem", color: NK.muted, lineHeight: 1.65, margin: 0, maxWidth: 640 }}>{p.desc}</p>
      </div>
      <div style={{ fontFamily: "var(--fm)", fontSize: 11.5, color: NK.mutedLabel, alignSelf: "center", whiteSpace: "nowrap" }}>
        PILLAR {String(index + 1).padStart(2, "0")} / 05
      </div>
    </div>
  );
}
