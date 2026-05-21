"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { PageHeader } from "@/components/PageHeader";



const TEAM = [
  { name: "Adelaide Wairimu", role: "Founder & Lead", bio: "Climate justice advocate with a decade in youth-centred development." },
  { name: "Brian Kipkoech", role: "Programs Director", bio: "Designs KYCH's incubation, capacity-building and challenge programs." },
  { name: "Faith Achieng", role: "Head of Partnerships", bio: "Builds bridges between youth, government and development partners." },
  { name: "Daniel Mwangi", role: "Innovation Lead", bio: "Mentors green-tech founders from prototype to early revenue." },
];

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Our Story" title={<>Anchored in <span>Afosi</span>. Powered by youth.</>} subtitle="KYCH is the digital headquarters of Kenya's youth climate movement — a national platform turning ambition into systems change." />

      <section className="sec">
        <div className="sec-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "start" }}>
          <div>
            <div className="s-label">Mission</div>
            <h2 className="s-title">Equip every young Kenyan to <span>lead climate action</span>.</h2>
            <p style={{ color: "var(--muted-foreground)", marginTop: "1.25rem", lineHeight: 1.7 }}>
              We exist to close the gap between youth energy and the resources, networks and policy spaces needed to turn that energy into lasting change. Anchored within <strong>Afosi — Action for Sustainability Initiative</strong> — we combine over a decade of evidence-based development experience with a youth-first product and program design.
            </p>
            <p style={{ color: "var(--muted-foreground)", marginTop: ".75rem", lineHeight: 1.7, fontStyle: "italic" }}>
              Afosi generates the evidence. Youth generate the solutions. The Hub connects them to scale.
            </p>
          </div>
          <div className="k-card" style={{ background: "var(--green)", color: "#fff", padding: "2rem", border: "none" }}>
            <div className="s-label" style={{ color: "rgba(255,255,255,.4)" }}>Vision</div>
            <h3 className="kfont-display" style={{ fontSize: "1.6rem", fontWeight: 800, lineHeight: 1.15, marginTop: ".5rem" }}>
              A Kenya where young people don't just adapt to climate change — they lead the response.
            </h3>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: "var(--cd)" }}>
        <div className="sec-in">
          <div className="s-label">Impact So Far</div>
          <h2 className="s-title">Numbers behind <span>the movement</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "1rem", marginTop: "2rem" }}>
            {[["5,200", "Youth Reached"], ["38", "Solutions Incubated"], ["120", "Partner Orgs"], ["47", "Counties Covered"], ["60+", "Opportunities Listed"]].map(([n, l]) => (
              <div key={l} className="k-card" style={{ textAlign: "center" }}>
                <div className="kfont-display" style={{ fontWeight: 800, fontSize: "2.2rem", color: "var(--green)" }}>{n}</div>
                <div className="kfont-mono" style={{ fontSize: ".68rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: ".4rem" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-in">
          <div className="s-label">The Team</div>
          <h2 className="s-title">People behind <span>the Hub</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.1rem", marginTop: "2.25rem" }}>
            {TEAM.map((m) => (
              <div key={m.name} className="k-card">
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "1.2rem", fontFamily: "var(--fs)", marginBottom: "1rem" }}>
                  {m.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="k-card-title">{m.name}</div>
                <div className="kfont-mono" style={{ fontSize: ".68rem", color: "var(--green)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".5rem" }}>{m.role}</div>
                <div className="k-card-desc">{m.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: "var(--green)", color: "#fff", textAlign: "center" }}>
        <div className="sec-in" style={{ maxWidth: 640 }}>
          <h2 className="kfont-display" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, lineHeight: 1.1 }}>Ready to join Kenya's youth climate movement?</h2>
          <p style={{ color: "rgba(255,255,255,.7)", marginTop: "1rem", marginBottom: "1.75rem" }}>Create a free profile in under a minute and get matched to opportunities, events and resources.</p>
          <Link href={"/register" as any} className="btn-a">Create Youth Profile →</Link>
        </div>
      </section>
    </>
  );
}
