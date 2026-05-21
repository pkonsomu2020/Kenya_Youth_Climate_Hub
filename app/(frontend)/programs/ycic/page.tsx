"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  Trophy, Droplets, Zap, Sprout, Calendar, Users, MapPin,
  CheckCircle2, Bell, ArrowLeft, ExternalLink,
} from "lucide-react";

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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function YCICPage() {
  const deadline = new Date("June 09, 2025 23:59:59");
  const cd = useCountdown(deadline);
  const isClosed = Date.now() > deadline.getTime();

  const handleNotify = () => {
    alert("Thank you! We'll notify you when the next Youth Climate Innovation Challenge opens for applications.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Youth Climate Innovation Challenge"
        title={<>Empowering Young Kenyans to Develop <span>Innovative Climate Solutions</span></>}
        subtitle="For informal settlements — creating sustainable and resilient communities through innovative approaches."
      />

      {/* ── Back link ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 2.5rem 0" }}>
        <Link href="/programs" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: ".82rem", color: "var(--muted-foreground)", textDecoration: "none", fontFamily: "var(--fs)", fontWeight: 600, transition: "color .2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--green)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-foreground)")}
        >
          <ArrowLeft size={14} /> Back to Programs
        </Link>
      </div>

      {/* ── Info bar ── */}
      <section style={{ background: "var(--cd)", padding: "2rem 2.5rem", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1.5rem", textAlign: "center" }}>
          {[
            { icon: <Calendar size={32} color="var(--green)" />, label: "Deadline",     value: "9th June, 2025" },
            { icon: <Users    size={32} color="var(--green)" />, label: "Participants", value: "300 Young Innovators" },
            { icon: <MapPin   size={32} color="var(--green)" />, label: "Location",     value: "Kenya (Nationwide)" },
            { icon: <Trophy   size={32} color="var(--green)" />, label: "Prize Pool",   value: "KES 500,000" },
          ].map(({ icon, label, value }) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: ".75rem" }}>{icon}</div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: "var(--dark)", marginBottom: ".25rem" }}>{label}</div>
              <div style={{ fontSize: ".82rem", color: "var(--muted-foreground)" }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Countdown ── */}
      <section style={{ background: "var(--green)", padding: "2.5rem", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "clamp(1.4rem,3vw,2rem)", marginBottom: "1.5rem" }}>
            {isClosed ? "Application Period Has Closed" : "Time Remaining to Apply"}
          </h2>
          {!isClosed ? (
            <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", flexWrap: "wrap" }}>
              {[["Days", cd.days], ["Hours", cd.hours], ["Minutes", cd.minutes], ["Seconds", cd.seconds]].map(([l, v]) => (
                <div key={l} style={{ background: "rgba(255,255,255,.12)", borderRadius: 12, padding: "1.25rem 1.75rem", minWidth: 90, border: "2px solid rgba(255,255,255,.2)" }}>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "2.2rem", lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".1em", marginTop: ".4rem", opacity: 0.7 }}>{l}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", borderRadius: 99, padding: ".6rem 1.5rem", fontSize: ".9rem", fontWeight: 600 }}>
              <Calendar size={16} /> Applications closed — Next cycle opens in 2026
            </div>
          )}
        </div>
      </section>

      {/* ── Overview ── */}
      <section className="sec">
        <div className="sec-in">
          <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 3rem" }}>
            <div className="s-label" style={{ justifyContent: "center" }}>Challenge Overview</div>
            <h2 className="s-title">Empowering Youth to Create <span>Climate Solutions</span></h2>
            <p style={{ marginTop: "1.25rem", color: "var(--muted-foreground)", fontSize: "1rem", lineHeight: 1.75 }}>
              The 2025 Youth Climate Innovation Challenge aims to empower young Kenyans to develop climate solutions for informal settlements, focusing on creating sustainable and resilient communities through innovative approaches.
            </p>
          </div>

          {/* What we offer */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.25rem" }}>
            {[
              { icon: Trophy,  title: "Seed Funding",       desc: "Win up to KES 500,000 to kickstart your climate innovation and bring your solution to life." },
              { icon: Users,   title: "Mentorship",         desc: "Get 6 months of expert guidance from climate professionals and successful entrepreneurs." },
              { icon: Sprout,  title: "Incubation",         desc: "Access resources, networks, and support to scale your solution across Kenya." },
              { icon: MapPin,  title: "National Platform",  desc: "Showcase your innovation at the Climate Innovation Summit in Nairobi." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="k-card" style={{ textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,var(--green),var(--green-light))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <Icon size={26} color="#fff" />
                </div>
                <div className="k-card-title" style={{ marginBottom: ".5rem" }}>{title}</div>
                <div className="k-card-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Focus Areas ── */}
      <section className="sec" style={{ background: "var(--cd)" }}>
        <div className="sec-in">
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 3rem" }}>
            <div className="s-label" style={{ justifyContent: "center" }}>Focus Areas</div>
            <h2 className="s-title">Innovation Themes for <span>Informal Settlements</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" }}>
            {focusAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <div key={area.title} className="k-card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ height: 160, background: "linear-gradient(135deg,var(--green),var(--green-light))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", position: "relative" }}>
                    <Icon size={56} />
                    <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "rgba(255,255,255,.2)", padding: ".35rem .85rem", borderRadius: 20, fontSize: ".7rem", fontWeight: 600, backdropFilter: "blur(8px)" }}>
                      Focus Area {idx + 1}
                    </div>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: "var(--green)", marginBottom: ".75rem" }}>{area.title}</h3>
                    <p style={{ color: "var(--muted-foreground)", lineHeight: 1.65, fontSize: ".88rem", marginBottom: "1.25rem" }}>{area.description}</p>
                    <div style={{ background: "var(--cd)", borderRadius: 8, padding: ".85rem 1rem" }}>
                      <div style={{ fontSize: ".68rem", fontWeight: 700, color: "var(--green)", marginBottom: ".4rem", textTransform: "uppercase", letterSpacing: ".05em" }}>Example Solutions</div>
                      <ul style={{ fontSize: ".82rem", color: "var(--muted-foreground)", lineHeight: 1.8, paddingLeft: "1.1rem", margin: 0 }}>
                        {area.examples.map(e => <li key={e}>{e}</li>)}
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
      <section className="sec">
        <div className="sec-in">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="s-label" style={{ justifyContent: "center" }}>Eligibility</div>
            <h2 className="s-title">Who Can <span>Participate?</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: 1000, margin: "0 auto" }} className="eligibility-grid">

            {/* Eligibility list */}
            <div style={{ background: "var(--cd)", borderRadius: 14, padding: "2rem" }}>
              <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: "var(--green)", marginBottom: "1.25rem" }}>Eligibility Requirements</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".85rem", padding: 0, margin: 0 }}>
                {eligibility.map((e, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".75rem" }}>
                    <CheckCircle2 size={18} color="var(--green)" style={{ flexShrink: 0, marginTop: ".15rem" }} />
                    <span style={{ color: "var(--dark)", lineHeight: 1.6, fontSize: ".88rem" }}>
                      {e.includes("yoma.world") ? (
                        <>Must have an active <a href="https://yoma.world" target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)", fontWeight: 600 }}>yoma.world</a> profile</>
                      ) : e}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key dates + prize */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ background: "var(--card)", border: "2px solid var(--green)", borderRadius: 14, padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: "var(--green)", marginBottom: "1.25rem" }}>Key Dates</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
                  {keyDates.map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: ".85rem", padding: ".85rem 1rem", background: "var(--cd)", borderRadius: 8 }}>
                      <Icon size={20} color="var(--green)" />
                      <div>
                        <div style={{ fontSize: ".7rem", color: "var(--muted-foreground)", marginBottom: ".15rem" }}>{label}</div>
                        <div style={{ fontWeight: 700, color: "var(--dark)", fontSize: ".88rem" }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg,var(--green),var(--green-light))", borderRadius: 14, padding: "1.75rem", color: "#fff", textAlign: "center" }}>
                <Trophy size={44} style={{ margin: "0 auto .75rem" }} />
                <div style={{ fontSize: ".82rem", opacity: 0.85, marginBottom: ".35rem" }}>Total Prize Pool</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "2.2rem", lineHeight: 1 }}>KES 500,000</div>
                <div style={{ fontSize: ".82rem", opacity: 0.75, marginTop: ".4rem" }}>+ 6 Months Mentorship</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Application Process ── */}
      <section style={{ background: "var(--cd)", padding: "4rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="s-label" style={{ justifyContent: "center" }}>How to Participate</div>
            <h2 className="s-title">Application <span>Process</span></h2>
            {isClosed && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", marginTop: "1rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: ".5rem 1.25rem", borderRadius: 99, fontSize: ".85rem", fontWeight: 600 }}>
                <Calendar size={14} /> Application Period Closed
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
            {steps.map((s, idx) => (
              <div key={s.n} style={{ background: isClosed ? "var(--card)" : "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "1.75rem", position: "relative", opacity: isClosed ? 0.75 : 1 }}>
                {isClosed && <CheckCircle2 size={20} color="#22c55e" style={{ position: "absolute", top: "1rem", right: "1rem" }} />}
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: isClosed ? "#e5e7eb" : "var(--green)", color: isClosed ? "#6b7280" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.1rem", marginBottom: "1rem" }}>
                  {s.n}
                </div>
                <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: "var(--dark)", marginBottom: ".6rem" }}>{s.title}</h3>
                <p style={{ color: "var(--muted-foreground)", lineHeight: 1.65, fontSize: ".85rem", margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            {!isClosed && (
              <a href="https://yoma.world" target="_blank" rel="noopener noreferrer" className="btn-green" style={{ display: "inline-flex", alignItems: "center", gap: ".6rem", fontSize: ".95rem", padding: ".9rem 2rem", textDecoration: "none" }}>
                Apply on Yoma <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
