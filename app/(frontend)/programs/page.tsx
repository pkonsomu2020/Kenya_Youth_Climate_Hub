"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Trophy, Leaf, ArrowRight, Calendar, Users, MapPin, CheckCircle2, Clock } from "lucide-react";

// ── Program data ──────────────────────────────────────────────────────────────
const programs = [
  {
    id: "ycic",
    tag: "FLAGSHIP PROGRAM",
    tagColor: "#059669",
    title: "Youth Climate Innovation Challenge",
    short: "YCIC",
    icon: Trophy,
    iconBg: "linear-gradient(135deg,#059669,#10B981)",
    status: "Applications Closed",
    statusColor: "#dc2626",
    statusBg: "#fef2f2",
    year: "2025",
    location: "Kenya (Nationwide)",
    participants: "300 Young Innovators",
    deadline: "June 9, 2025",
    prize: "KES 500,000",
    description: "The Youth Climate Innovation Challenge (YCIC) empowers young Kenyans to develop climate solutions for informal settlements — focusing on creating sustainable and resilient communities through innovative approaches.",
    highlights: [
      "Seed funding up to KES 500,000",
      "6 months expert mentorship",
      "National incubation support",
      "Showcase at Climate Innovation Summit, Nairobi",
    ],
    focusAreas: ["Water, Sanitation & Hygiene (WASH)", "Flood Resilience & Urban Drainage", "Renewable Energy & Sustainable Infrastructure"],
    gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    href: "/programs/ycic",
  },
  {
    id: "begreen",
    tag: "COMING SOON",
    tagColor: "#0ea5e9",
    title: "BeGreen Program",
    short: "BeGreen",
    icon: Leaf,
    iconBg: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    status: "Opening Soon",
    statusColor: "#0ea5e9",
    statusBg: "#f0f9ff",
    year: "2026",
    location: "Kenya",
    participants: "TBA",
    deadline: "TBA",
    prize: "TBA",
    description: "BeGreen is an upcoming KYCH program focused on green skills, sustainable livelihoods, and environmental stewardship for young Kenyans. Full details and application information will be shared soon.",
    highlights: [
      "Green skills training",
      "Sustainable livelihood support",
      "Environmental stewardship",
      "Community-led action",
    ],
    focusAreas: ["Green Skills & Training", "Sustainable Livelihoods", "Environmental Stewardship"],
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    href: "#",
  },
];

// ── Program Card ──────────────────────────────────────────────────────────────
function ProgramCard({ p }: { p: typeof programs[0] }) {
  const [hovered, setHovered] = useState(false);
  const Icon = p.icon;
  const isComingSoon = p.id === "begreen";

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        overflow: "hidden",
        transition: "transform .3s, box-shadow .3s",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,.12)" : "0 2px 12px rgba(0,0,0,.04)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card hero banner */}
      <div style={{
        background: p.gradient,
        padding: "2.5rem 2rem 2rem",
        position: "relative",
        overflow: "hidden",
        minHeight: 180,
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
        <div style={{ position: "absolute", right: 40, bottom: -60, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Tag */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: ".4rem",
            background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)",
            borderRadius: 99, padding: ".25rem .75rem",
            fontSize: ".62rem", fontWeight: 700, fontFamily: "var(--fm)",
            letterSpacing: ".1em", color: "#fff", textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            {p.tag}
          </div>

          {/* Icon + title */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "rgba(255,255,255,.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon size={26} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.35rem", color: "#fff", lineHeight: 1.2, letterSpacing: "-.02em" }}>
                {p.title}
              </div>
              <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.65)", marginTop: ".3rem", fontFamily: "var(--fm)" }}>
                {p.year} · {p.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "1.5rem 2rem 1.75rem" }}>

        {/* Status + meta row */}
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
          <span style={{
            fontSize: ".68rem", fontWeight: 700, fontFamily: "var(--fm)",
            padding: ".25rem .65rem", borderRadius: 99,
            background: p.statusBg, color: p.statusColor,
            border: `1px solid ${p.statusColor}30`,
          }}>
            {p.status}
          </span>
          <span style={{ fontSize: ".72rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: ".3rem", fontFamily: "var(--fm)" }}>
            <Users size={12} /> {p.participants}
          </span>
        </div>

        {/* Short description — 2 lines max */}
        <p style={{ fontSize: ".85rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "1.25rem",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {p.description}
        </p>

        {/* Focus area tags */}
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {p.focusAreas.map((f) => (
            <span key={f} style={{
              fontSize: ".65rem", padding: ".2rem .55rem", borderRadius: 99,
              background: "var(--cd)", color: "var(--dark)",
              border: "1px solid var(--border)", fontFamily: "var(--fm)",
            }}>
              {f}
            </span>
          ))}
        </div>

        {/* Prize + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.1rem", borderTop: "1px solid var(--border)", gap: "1rem", flexWrap: "wrap" }}>
          {p.prize !== "TBA" ? (
            <div>
              <div style={{ fontSize: ".62rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)", textTransform: "uppercase", letterSpacing: ".06em" }}>Prize Pool</div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.2rem", color: "#059669", letterSpacing: "-.02em" }}>{p.prize}</div>
            </div>
          ) : (
            <div style={{ fontSize: ".8rem", color: "var(--muted-foreground)", fontStyle: "italic" }}>Details coming soon</div>
          )}

          {isComingSoon ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: ".4rem",
              padding: ".55rem 1.1rem", borderRadius: 100,
              background: "var(--cd)", color: "var(--muted-foreground)",
              fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".78rem",
              border: "1px solid var(--border)",
            }}>
              <Clock size={13} /> Coming Soon
            </div>
          ) : (
            <Link href={p.href as any} style={{
              display: "inline-flex", alignItems: "center", gap: ".4rem",
              padding: ".55rem 1.1rem", borderRadius: 100,
              background: "#059669", color: "#fff",
              fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".78rem",
              textDecoration: "none", transition: "background .2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#047857")}
              onMouseLeave={e => (e.currentTarget.style.background = "#059669")}
            >
              View Program <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        eyebrow="KYCH Programs"
        title={<>Our <span>Programs</span></>}
        subtitle="Flagship initiatives empowering young Kenyans to develop climate solutions, build green skills, and lead community action."
      />

      <section className="sec">
        <div className="sec-in">

          {/* Stats bar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
            padding: "1.5rem 2rem",
            background: "var(--cd)",
            borderRadius: 16,
            border: "1px solid var(--border)",
          }}>
            {[
              ["2", "Active Programs"],
              ["300+", "Youth Participants"],
              ["KES 500K", "Prize Pool"],
              ["47", "Counties Reached"],
            ].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.5rem", color: "#059669", letterSpacing: "-.02em" }}>{n}</div>
                <div style={{ fontSize: ".68rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: ".2rem" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Program cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {programs.map((p) => (
              <ProgramCard key={p.id} p={p} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
