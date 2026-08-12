"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Trophy, Droplets, Zap, Sprout, Calendar, Users, MapPin,
  CheckCircle2, ArrowLeft, ExternalLink,
} from "lucide-react";
import { NK, nkShadow, nkCard } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";

// ── Countdown ─────────────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

// ── Data ──────────────────────────────────────────────────────────────────────
const focusAreas = [
  {
    icon: Droplets,
    title: "Water, Sanitation & Hygiene (WASH)",
    description: "Develop sustainable solutions for clean water access, improved sanitation facilities, and hygiene promotion that are climate-resilient and affordable.",
    examples: ["Low-cost water filtration systems", "Community sanitation facilities", "Hygiene education programs"],
  },
  {
    icon: Zap,
    title: "Flood Resilience & Urban Drainage",
    description: "Create innovative approaches to manage stormwater, prevent flooding, and improve drainage systems in densely populated informal settlements.",
    examples: ["Permeable pavement solutions", "Rainwater harvesting systems", "Early warning flood systems"],
  },
  {
    icon: Sprout,
    title: "Renewable Energy & Sustainable Infrastructure",
    description: "Design affordable, clean energy solutions and sustainable building practices that reduce carbon footprints while improving living conditions.",
    examples: ["Solar home systems", "Biogas digesters", "Green building materials"],
  },
];

const eligibility = [
  "Must have an active yoma.world profile",
  "Kenyan youth aged 18–35 years",
  "Individuals or teams of up to 4 members",
  "Solutions must address at least one focus area",
  "Innovations must include climate education components",
  "Proposed solutions should be implementable within 12 months",
  "Previous climate action experience is a plus but not required",
];

const steps = [
  { n: 1, title: "Register Online",       desc: "Complete the online registration form with your personal details and a brief description of your innovation idea." },
  { n: 2, title: "Develop Your Concept",  desc: "Work on your innovation, focusing on feasibility, sustainability, and impact. Utilize available resources and mentorship." },
  { n: 3, title: "Submit Your Proposal",  desc: "Submit a detailed proposal including implementation plan, budget, and expected outcomes." },
  { n: 4, title: "Pitch & Showcase",      desc: "Selected finalists will present their innovations to a panel of judges during the Climate Innovation Summit." },
];

const keyDates = [
  { icon: Calendar, label: "Application Deadline", value: "June 9, 2025" },
  { icon: Users,    label: "Shortlist Announced",   value: "June 23, 2025" },
  { icon: Trophy,   label: "Pitch Day (KICC Nairobi)", value: "July 23, 2025" },
];

function SectionHeader({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 3rem" }}>
      <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
        {eyebrow}
      </span>
      <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(28px,3.6vw,46px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
        {children}
      </GrowHeading>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function YCICPage() {
  const deadline = new Date("June 09, 2025 23:59:59");
  const cd = useCountdown(deadline);
  const isClosed = Date.now() > deadline.getTime();

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
            Empowering Young Kenyans to Develop Innovative Climate Solutions
          </span>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(38px,5vw,72px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}>
            Youth Climate Innovation <span style={{ color: NK.green }}>Challenge</span>
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.15rem", color: NK.muted, lineHeight: 1.7, marginTop: "1.5rem", maxWidth: 640 }}>
            For informal settlements — creating sustainable and resilient communities through innovative approaches.
          </p>
        </div>
      </section>

      {/* ── Back link ── */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 2.5rem 1.5rem" }}>
        <Link href="/programs" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem", color: NK.muted, textDecoration: "none", fontFamily: "var(--fs)", fontWeight: 600 }}>
          <ArrowLeft size={14} /> Back to Programs
        </Link>
      </div>

      {/* ── Info bar ── */}
      <section style={{ background: NK.bg, borderTop: `2px solid ${NK.ink}`, borderBottom: `2px solid ${NK.ink}` }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "2rem 2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1.5rem", textAlign: "center" }}>
          {[
            { icon: <Calendar size={30} color={NK.green} />, label: "Deadline",     value: "9th June, 2025" },
            { icon: <Users    size={30} color={NK.green} />, label: "Participants", value: "300 Young Innovators" },
            { icon: <MapPin   size={30} color={NK.green} />, label: "Location",     value: "Kenya (Nationwide)" },
            { icon: <Trophy   size={30} color={NK.green} />, label: "Prize Pool",   value: "KES 500,000" },
          ].map(({ icon, label, value }) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: ".75rem" }}>{icon}</div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: NK.ink, marginBottom: ".25rem" }}>{label}</div>
              <div style={{ fontSize: ".82rem", color: NK.muted }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Countdown ── */}
      <section style={{ background: NK.green, padding: "2.5rem", color: NK.navyDeep }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(1.4rem,3vw,2rem)", marginBottom: "1.5rem" }}>
            {isClosed ? "Application Period Has Closed" : "Time Remaining to Apply"}
          </h2>
          {!isClosed ? (
            <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", flexWrap: "wrap" }}>
              {[["Days", cd.days], ["Hours", cd.hours], ["Minutes", cd.minutes], ["Seconds", cd.seconds]].map(([l, v]) => (
                <div key={l} style={{ background: NK.navyDeep, color: "#fff", padding: "1.25rem 1.75rem", minWidth: 90, border: `2px solid ${NK.navyDeep}` }}>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "2.2rem", lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".1em", marginTop: ".4rem", opacity: 0.7 }}>{l}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", background: NK.navyDeep, color: "#fff", padding: ".6rem 1.5rem", fontSize: ".9rem", fontWeight: 600, border: `2px solid ${NK.navyDeep}` }}>
              <Calendar size={16} /> Applications closed — check back for future cycles
            </div>
          )}
        </div>
      </section>

      {/* ── Overview ── */}
      <section style={{ background: NK.bg, padding: "6.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <SectionHeader eyebrow="Challenge Overview">
            Empowering Youth to Create <span style={{ color: NK.green }}>Climate Solutions</span>
          </SectionHeader>
          <p style={{ textAlign: "center", maxWidth: 760, margin: "-2rem auto 3rem", color: NK.muted, fontSize: "1rem", lineHeight: 1.75 }}>
            The 2025 Youth Climate Innovation Challenge aims to empower young Kenyans to develop climate solutions for informal settlements, focusing on creating sustainable and resilient communities through innovative approaches.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.25rem" }}>
            {[
              { icon: Trophy,  title: "Seed Funding",       desc: "Win up to KES 500,000 to kickstart your climate innovation and bring your solution to life." },
              { icon: Users,   title: "Mentorship",         desc: "Get 6 months of expert guidance from climate professionals and successful entrepreneurs." },
              { icon: Sprout,  title: "Incubation",         desc: "Access resources, networks, and support to scale your solution across Kenya." },
              { icon: MapPin,  title: "National Platform",  desc: "Showcase your innovation at the Climate Innovation Summit in Nairobi." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ ...nkCard, textAlign: "center", padding: "2rem 1.5rem" }}>
                <div style={{ width: 52, height: 52, background: NK.green, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <Icon size={24} color={NK.navyDeep} />
                </div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".95rem", color: NK.ink, marginBottom: ".5rem" }}>{title}</div>
                <div style={{ fontSize: ".82rem", color: NK.muted, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Focus Areas ── */}
      <section style={{ background: NK.navyDeep, padding: "6.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 3rem" }}>
            <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.offWhiteOnDark, marginBottom: "1rem" }}>
              Focus Areas
            </span>
            <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(28px,3.6vw,46px)", color: "#fff", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
              Innovation Themes for <span style={{ color: NK.green }}>Informal Settlements</span>
            </GrowHeading>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" }}>
            {focusAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <div key={area.title} style={{ background: NK.panelNavy, border: `1px solid ${NK.borderNavy}` }}>
                  <div style={{ height: 150, background: NK.green, display: "flex", alignItems: "center", justifyContent: "center", color: NK.navyDeep, position: "relative", borderBottom: `2px solid ${NK.ink}` }}>
                    <Icon size={52} />
                    <div style={{ position: "absolute", top: "1rem", left: "1rem", background: NK.navyDeep, color: "#fff", padding: ".3rem .8rem", fontSize: ".7rem", fontWeight: 700, fontFamily: "var(--fm)" }}>
                      Focus Area {idx + 1}
                    </div>
                  </div>
                  <div style={{ padding: "1.75rem" }}>
                    <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.05rem", color: NK.green, marginBottom: ".75rem" }}>{area.title}</h3>
                    <p style={{ color: NK.mutedOnDark, lineHeight: 1.65, fontSize: ".88rem", marginBottom: "1.25rem" }}>{area.description}</p>
                    <div style={{ background: NK.navyDeep, border: `1px solid ${NK.borderNavy}`, padding: ".9rem 1rem" }}>
                      <div style={{ fontSize: ".68rem", fontWeight: 700, color: NK.green, marginBottom: ".4rem", textTransform: "uppercase", letterSpacing: ".05em", fontFamily: "var(--fm)" }}>Example Solutions</div>
                      <ul style={{ fontSize: ".82rem", color: NK.mutedOnDark, lineHeight: 1.8, paddingLeft: "1.1rem", margin: 0 }}>
                        {area.examples.map((e) => <li key={e}>{e}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Eligibility + Key Dates ── */}
      <section style={{ background: NK.bg, padding: "6.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <SectionHeader eyebrow="Eligibility">
            Who Can <span style={{ color: NK.green }}>Participate?</span>
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: 1000, margin: "-1rem auto 0" }} className="eligibility-grid">
            {/* Eligibility list */}
            <div style={{ border: `2px solid ${NK.ink}`, padding: "2rem" }}>
              <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: NK.green, marginBottom: "1.25rem" }}>Eligibility Requirements</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".85rem", padding: 0, margin: 0 }}>
                {eligibility.map((e, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".75rem" }}>
                    <CheckCircle2 size={18} color={NK.green} style={{ flexShrink: 0, marginTop: ".15rem" }} />
                    <span style={{ color: NK.ink, lineHeight: 1.6, fontSize: ".88rem" }}>
                      {e.includes("yoma.world") ? (
                        <>Must have an active <a href="https://yoma.world" target="_blank" rel="noopener noreferrer" style={{ color: NK.green, fontWeight: 700 }}>yoma.world</a> profile</>
                      ) : e}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key dates + prize */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ background: NK.white, border: `2px solid ${NK.green}`, padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: NK.green, marginBottom: "1.25rem" }}>Key Dates</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
                  {keyDates.map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: ".85rem", padding: ".85rem 1rem", background: NK.tintGreen }}>
                      <Icon size={20} color={NK.green} />
                      <div>
                        <div style={{ fontSize: ".7rem", color: NK.muted }}>{label}</div>
                        <div style={{ fontWeight: 700, color: NK.ink, fontSize: ".88rem" }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: NK.green, padding: "1.75rem", color: NK.navyDeep, textAlign: "center" }}>
                <Trophy size={40} style={{ margin: "0 auto .75rem" }} />
                <div style={{ fontSize: ".82rem", opacity: 0.85, marginBottom: ".35rem" }}>Total Prize Pool</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "2.2rem", lineHeight: 1 }}>KES 500,000</div>
                <div style={{ fontSize: ".82rem", opacity: 0.75, marginTop: ".4rem" }}>+ 6 Months Mentorship</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Application Process ── */}
      <section style={{ background: NK.tintGreen, padding: "6.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
              How to Participate
            </span>
            <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(28px,3.6vw,46px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
              Application <span style={{ color: NK.green }}>Process</span>
            </GrowHeading>
            {isClosed && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", marginTop: "1rem", background: NK.white, border: "2px solid #B91C1C", color: "#B91C1C", padding: ".5rem 1.25rem", fontSize: ".85rem", fontWeight: 700, fontFamily: "var(--fs)" }}>
                <Calendar size={14} /> Application Period Closed
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
            {steps.map((s) => (
              <div key={s.n} style={{ background: NK.white, border: `2px solid ${NK.ink}`, padding: "1.75rem", position: "relative", opacity: isClosed ? 0.7 : 1 }}>
                {isClosed && <CheckCircle2 size={20} color={NK.green} style={{ position: "absolute", top: "1rem", right: "1rem" }} />}
                <div style={{ width: 38, height: 38, background: isClosed ? "#e5e7eb" : NK.green, color: isClosed ? "#6b7280" : NK.navyDeep, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
                  {s.n}
                </div>
                <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: NK.ink, marginBottom: ".6rem" }}>{s.title}</h3>
                <p style={{ color: NK.muted, lineHeight: 1.65, fontSize: ".85rem", margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            {!isClosed && (
              <a href="https://yoma.world" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: ".6rem", fontSize: ".95rem", padding: "16px 32px", textDecoration: "none", background: NK.green, color: NK.navyDeep, fontFamily: "var(--fs)", fontWeight: 700 }}>
                Apply on Yoma <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
