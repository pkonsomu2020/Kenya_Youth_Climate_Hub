"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight, Users, Globe, Lightbulb, Handshake } from "lucide-react";

function useInView(ref: React.RefObject<Element | null>, threshold = 0.1) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

const TEAM = [
  { name: "Adelaide Wairimu", role: "Founder & Executive Director", bio: "Climate justice advocate with a decade in youth-centred development across East Africa.", initials: "AW" },
  { name: "Brian Kipkoech", role: "Programs Director", bio: "Designs KYCH's incubation, capacity-building and challenge programs.", initials: "BK" },
  { name: "Faith Achieng", role: "Head of Partnerships", bio: "Builds bridges between youth, government and development partners.", initials: "FA" },
  { name: "Daniel Mwangi", role: "Innovation Lead", bio: "Mentors green-tech founders from prototype to early revenue.", initials: "DM" },
];

const VALUES = [
  { icon: <Globe size={22} />, title: "Climate Justice", desc: "Fair outcomes for frontline communities most affected by climate change." },
  { icon: <Users size={22} />, title: "Youth Inclusion", desc: "Ages 15–35 at the centre of every decision and program design." },
  { icon: <Lightbulb size={22} />, title: "Innovation", desc: "Kenyan solutions built for Kenyan challenges and contexts." },
  { icon: <Handshake size={22} />, title: "Systems Change", desc: "Beyond symptoms — addressing root causes for lasting transformation." },
];

function TeamCard({ member, index }: { member: typeof TEAM[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      style={{
        background: "var(--card-dark)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "2rem 1.75rem",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
      }}
    >
      <div style={{
        width: 60, height: 60, borderRadius: "50%",
        background: "linear-gradient(135deg, #5dba2f, #047857)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 900, fontSize: "1.1rem",
        fontFamily: "Montserrat, sans-serif", marginBottom: "1.25rem",
      }}>
        {member.initials}
      </div>
      <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text-on-dark)", marginBottom: ".3rem" }}>{member.name}</div>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "#5dba2f", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: ".75rem" }}>{member.role}</div>
      <p style={{ fontSize: ".85rem", color: "var(--muted-foreground)", lineHeight: 1.65 }}>{member.bio}</p>
    </div>
  );
}

function ValueCard({ item, index }: { item: typeof VALUES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      style={{
        background: hovered ? "#5dba2f" : "var(--card-dark)",
        border: `1px solid ${hovered ? "#5dba2f" : "var(--border)"}`,
        borderRadius: 14, padding: "1.75rem",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s, background 0.3s ease, border-color 0.3s ease`,
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: hovered ? "rgba(255,255,255,.2)" : "rgba(93,186,47,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: hovered ? "#fff" : "#5dba2f", marginBottom: "1rem" }}>
        {item.icon}
      </div>
      <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: ".95rem", color: "var(--text-on-dark)", marginBottom: ".5rem" }}>{item.title}</div>
      <p style={{ fontSize: ".82rem", color: hovered ? "rgba(255,255,255,.85)" : "var(--muted-foreground)", lineHeight: 1.65 }}>{item.desc}</p>
    </div>
  );
}

export default function About() {
  const missionRef  = useRef<HTMLDivElement>(null);
  const valuesRef   = useRef<HTMLDivElement>(null);
  const teamRef     = useRef<HTMLDivElement>(null);
  const missionInView = useInView(missionRef);
  const valuesInView  = useInView(valuesRef);
  const teamInView    = useInView(teamRef);

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title={<>Anchored in <span style={{ color: "#5dba2f" }}>Afosi</span>.<br />Powered by youth.</>}
        subtitle="KYCH is the digital headquarters of Kenya's youth climate movement — a national platform turning ambition into systems change."
      />

      {/* ── Mission / Vision ── */}
      <section className="py-32 px-6 md:px-16" style={{ background: "var(--section-light)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            ref={missionRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
            style={{ opacity: missionInView ? 1 : 0, transform: missionInView ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}
          >
            <div>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dba2f" }}>Mission</span>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--foreground)", letterSpacing: "-0.03em", lineHeight: 1.08, marginTop: "1rem", marginBottom: "1.5rem" }}>
                Equip every young Kenyan to <span style={{ color: "#5dba2f" }}>lead climate action.</span>
              </h2>
              <p style={{ fontSize: "1.05rem", color: "var(--muted-foreground)", lineHeight: 1.75, marginBottom: "1rem" }}>
                We exist to close the gap between youth energy and the resources, networks and policy spaces needed to turn that energy into lasting change. Anchored within <strong style={{ color: "var(--foreground)" }}>Afosi — Action for Sustainability Initiative</strong> — we combine over a decade of evidence-based development experience with a youth-first product and program design.
              </p>
              <p style={{ fontSize: "1rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontStyle: "italic" }}>
                Afosi generates the evidence. Youth generate the solutions. The Hub connects them to scale.
              </p>
            </div>

            {/* Vision card */}
            <div style={{ background: "#0f172a", borderRadius: 20, padding: "3rem", border: "1px solid rgba(93,186,47,0.2)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #5dba2f, transparent)" }} />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dba2f" }}>Vision</span>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem,3vw,2.2rem)", color: "#fff", lineHeight: 1.2, marginTop: "1.25rem", letterSpacing: "-0.02em" }}>
                A Kenya where young people don't just adapt to climate change — they <span style={{ color: "#5dba2f" }}>lead the response.</span>
              </h3>
              <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                {[["2020", "Founded"], ["47", "Counties"], ["12,500+", "Youth"]].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#5dba2f" }}>{n}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-32 px-6 md:px-16" style={{ background: "var(--section-dark)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            ref={valuesRef}
            style={{ marginBottom: "3rem", opacity: valuesInView ? 1 : 0, transform: valuesInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}
          >
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dba2f" }}>What We Stand For</span>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--text-on-dark)", letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: "1rem" }}>
              OUR <span style={{ color: "#5dba2f" }}>VALUES</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => <ValueCard key={v.title} item={v} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-32 px-6 md:px-16" style={{ background: "var(--section-light)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            ref={teamRef}
            style={{ marginBottom: "3rem", opacity: teamInView ? 1 : 0, transform: teamInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}
          >
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dba2f" }}>The Team</span>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--foreground)", letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: "1rem" }}>
              PEOPLE BEHIND <span style={{ color: "#5dba2f" }}>THE HUB</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM.map((m, i) => <TeamCard key={m.name} member={m} index={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}
