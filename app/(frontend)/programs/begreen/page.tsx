"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import {
  ArrowLeft, Leaf, Users, TrendingUp, Recycle,
  CheckCircle2, Globe, Lightbulb, Target, Award,
  Building2, ExternalLink,
} from "lucide-react";

// ── Key stats ─────────────────────────────────────────────────────────────────
const stats = [
  { value: "846",    label: "Jobs Created",         sub: "Nov 2023 – Jul 2025" },
  { value: "8.1x",  label: "Avg Jobs / Enterprise", sub: "vs. 2.6 benchmark"  },
  { value: "~7x",   label: "Revenue Growth",        sub: "Nov 2023 → Jul 2025" },
  { value: "29.9M", label: "Kg Waste Managed",      sub: "Plastic + Organic"   },
  { value: "146",   label: "Youth Funded",          sub: "Up to USD 5,000 each"},
  { value: "74–90%","label": "Marginalized Youth",  sub: "Intentionally reached"},
];

// ── Programme phases ──────────────────────────────────────────────────────────
const phases = [
  { n: 1, title: "Application Drive",           outcome: "2,264 youth applied across Kenya" },
  { n: 2, title: "Business Management Training","outcome": "759 trained; 502 completed" },
  { n: 3, title: "Green Entrepreneurship Training","outcome": "502 completed both BMT & GET" },
  { n: 4, title: "Business Plan Development",   outcome: "320 business plans submitted" },
  { n: 5, title: "Pitching Events",             outcome: "207 youth pitched (Nairobi, Kisumu, Mombasa)" },
  { n: 6, title: "Seed Funding Disbursement",   outcome: "146 received grants up to USD 5,000" },
  { n: 7, title: "Incubation & Mentorship",     outcome: "146 innovations supported" },
  { n: 8, title: "Acceleration Funds",          outcome: "112 received USD 1,000–3,000 additional" },
];

// ── Focus areas ───────────────────────────────────────────────────────────────
const focusAreas = [
  { icon: Recycle,    title: "Plastic Waste Management",  desc: "Youth enterprises processing and recycling plastic waste across urban and rural Kenya." },
  { icon: Leaf,       title: "Organic Waste & Biogas",    desc: "Converting organic waste into biogas and compost, creating circular economy value chains." },
  { icon: Globe,      title: "E-Waste Enterprises",       desc: "Highest-earning sub-sector — responsible collection and processing of electronic waste." },
  { icon: Lightbulb,  title: "Waste-to-Value Innovation", desc: "Transforming waste streams into marketable products, creating jobs and reducing landfill pressure." },
];

// ── Partners ──────────────────────────────────────────────────────────────────
const partners = [
  { name: "UNICEF / Generation Unlimited",  role: "Lead implementation, youth engagement, curriculum development" },
  { name: "Tony Elumelu Foundation",        role: "Entrepreneurship content, mentorship structures, seed funding" },
  { name: "IKEA Foundation",                role: "Principal donor, strategic oversight and financing" },
  { name: "Kenya National Bureau of Statistics (KNBS)", role: "Technical backstopping, data integration and validation" },
  { name: "Government Agencies (SDYA, Ministry of Youth & Environment)", role: "Policy alignment, endorsement and local integration" },
  { name: "Private Sector (UBA Bank, recyclers, investors)", role: "Market linkages, funding pathways, business model vetting" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BeGreenPage() {
  return (
    <>
      <PageHeader
        eyebrow="Green Entrepreneurship for Kenya's Youth"
        title={<>BeGreen Africa <span>Initiative</span></>}
        subtitle="A multi-partner programme building green entrepreneurship in waste management — simultaneously addressing youth unemployment and environmental degradation."
      />

      {/* Back link */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 2.5rem 0" }}>
        <Link href="/programs" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: ".82rem", color: "var(--muted-foreground)", textDecoration: "none", fontFamily: "var(--fs)", fontWeight: 600, transition: "color .2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--green)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-foreground)")}
        >
          <ArrowLeft size={14} /> Back to Programs
        </Link>
      </div>

      {/* ── Partner badges ── */}
      <div style={{ background: "var(--cd)", borderBottom: "1px solid var(--border)", padding: "1.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: ".7rem", fontWeight: 700, fontFamily: "var(--fm)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Implementing Partners</span>
          {["UNICEF / GenU", "Tony Elumelu Foundation", "IKEA Foundation", "KNBS"].map(p => (
            <span key={p} style={{ fontSize: ".75rem", padding: ".25rem .75rem", borderRadius: 99, background: "var(--card)", border: "1px solid var(--border)", fontFamily: "var(--fs)", fontWeight: 600, color: "var(--dark)" }}>{p}</span>
          ))}
        </div>
      </div>

      {/* ── Impact stats ── */}
      <section style={{ background: "#0A0A0A", padding: "3rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "var(--fm)", fontSize: ".65rem", letterSpacing: ".12em", color: "rgba(255,255,255,.4)", textTransform: "uppercase", marginBottom: ".4rem" }}>Programme Results</div>
            <h2 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "#fff", letterSpacing: "-.02em" }}>
              Exceeding Every Target
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem" }}>
            {stats.map(({ value, label, sub }) => (
              <div key={label} style={{ textAlign: "center", padding: "1.5rem 1rem", background: "rgba(255,255,255,.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,.07)" }}>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "2rem", color: "#059669", letterSpacing: "-.03em", lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".82rem", color: "#fff", marginTop: ".4rem" }}>{label}</div>
                <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.4)", fontFamily: "var(--fm)", marginTop: ".2rem" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Overview ── */}
      <section className="sec">
        <div className="sec-in">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "3rem", alignItems: "start" }}>
            <div>
              <div className="s-label">About BeGreen</div>
              <h2 className="s-title">What is the <span>BeGreen Initiative?</span></h2>
              <p style={{ color: "var(--muted-foreground)", marginTop: "1.25rem", lineHeight: 1.75, fontSize: ".92rem" }}>
                The <strong style={{ color: "var(--dark)" }}>BeGreen Africa Initiative</strong> is a multi-partner programme implemented in Kenya by UNICEF/Generation Unlimited, the Tony Elumelu Foundation, and the IKEA Foundation, with incubation support from STEM Impact Center Kenya.
              </p>
              <p style={{ color: "var(--muted-foreground)", marginTop: ".75rem", lineHeight: 1.75, fontSize: ".92rem" }}>
                It targets youth aged <strong style={{ color: "var(--dark)" }}>18–35 years</strong> to build green entrepreneurship in the waste management sector — simultaneously addressing youth unemployment and environmental degradation.
              </p>
              <p style={{ color: "var(--muted-foreground)", marginTop: ".75rem", lineHeight: 1.75, fontSize: ".92rem" }}>
                The programme aligns with <strong style={{ color: "var(--dark)" }}>Kenya Vision 2030</strong>, the Bottom-Up Economic Transformation Agenda (BETA), and national commitments under the Paris Agreement and multiple SDGs.
              </p>
            </div>
            <div style={{ background: "var(--cd)", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: "var(--dark)", marginBottom: "1.25rem" }}>Problem Context</div>
              {[
                { stat: "22,000", desc: "metric tons of waste generated daily in Kenya — less than 10% recycled" },
                { stat: "39%",    desc: "of youth aged 18–34 unemployed; 80% in the informal sector" },
                { stat: "39.8%",  desc: "of Kenyans live below the poverty line, disproportionately affecting youth" },
                { stat: "75%",    desc: "of Kenya's population is under 35 years" },
              ].map(({ stat, desc }) => (
                <div key={stat} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.3rem", color: "#059669", flexShrink: 0, lineHeight: 1, minWidth: 60 }}>{stat}</div>
                  <div style={{ fontSize: ".82rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Focus areas ── */}
      <section className="sec" style={{ background: "var(--cd)" }}>
        <div className="sec-in">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="s-label" style={{ justifyContent: "center" }}>Waste Sectors</div>
            <h2 className="s-title">Green Business <span>Focus Areas</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
            {focusAreas.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="k-card">
                <div className="k-card-icon"><Icon size={22} /></div>
                <div className="k-card-title">{title}</div>
                <div className="k-card-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programme phases ── */}
      <section className="sec">
        <div className="sec-in">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="s-label" style={{ justifyContent: "center" }}>Programme Structure</div>
            <h2 className="s-title">8 Phases of <span>Implementation</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1rem" }}>
            {phases.map(({ n, title, outcome }) => (
              <div key={n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.1rem 1.25rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,var(--green),var(--green-light))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fs)", fontWeight: 800, fontSize: ".9rem", flexShrink: 0 }}>{n}</div>
                <div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: "var(--dark)", marginBottom: ".25rem" }}>{title}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--green)", fontWeight: 600, fontFamily: "var(--fm)" }}>{outcome}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key outcomes ── */}
      <section className="sec" style={{ background: "var(--cd)" }}>
        <div className="sec-in">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="s-label" style={{ justifyContent: "center" }}>Impact</div>
            <h2 className="s-title">Key Programme <span>Outcomes</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" }}>

            {/* Employment */}
            <div className="k-card">
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
                <div className="k-card-icon" style={{ marginBottom: 0 }}><Users size={20} /></div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: "var(--dark)" }}>Employment Creation</div>
              </div>
              {[
                "846 total jobs created — far exceeding the 260 projected",
                "Average 8.1 jobs per enterprise vs. 2.6 benchmark",
                "Each entrepreneur supports ~4.6 household members",
                "Mentored enterprises created 531 jobs vs. 104 without mentorship",
              ].map(t => (
                <div key={t} style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", marginBottom: ".6rem" }}>
                  <CheckCircle2 size={14} color="var(--green)" style={{ flexShrink: 0, marginTop: ".15rem" }} />
                  <span style={{ fontSize: ".82rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Revenue */}
            <div className="k-card">
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
                <div className="k-card-icon" style={{ marginBottom: 0 }}><TrendingUp size={20} /></div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: "var(--dark)" }}>Revenue Generation</div>
              </div>
              {[
                "~7x revenue growth from Nov 2023 to Jul 2025",
                "Avg monthly revenue grew from KShs 81K to KShs 203K",
                "Annualized projection ~USD 2.7M vs. USD 1M target",
                "E-waste enterprises averaged KShs 679,000/month",
              ].map(t => (
                <div key={t} style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", marginBottom: ".6rem" }}>
                  <CheckCircle2 size={14} color="var(--green)" style={{ flexShrink: 0, marginTop: ".15rem" }} />
                  <span style={{ fontSize: ".82rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Environment */}
            <div className="k-card">
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
                <div className="k-card-icon" style={{ marginBottom: 0 }}><Recycle size={20} /></div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: "var(--dark)" }}>Environmental Impact</div>
              </div>
              {[
                "29.9 million kgs of waste managed total",
                "11.6M kgs plastic + 18.4M kgs organic waste diverted",
                "Incubated enterprises managed 27.9M kgs vs. 76K without",
                "Significant contribution to Kenya's circular economy",
              ].map(t => (
                <div key={t} style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", marginBottom: ".6rem" }}>
                  <CheckCircle2 size={14} color="var(--green)" style={{ flexShrink: 0, marginTop: ".15rem" }} />
                  <span style={{ fontSize: ".82rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>{t}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Inclusion ── */}
      <section className="sec">
        <div className="sec-in">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "3rem", alignItems: "start" }}>
            <div>
              <div className="s-label">Inclusion</div>
              <h2 className="s-title">Reaching <span>Marginalized Youth</span></h2>
              <p style={{ color: "var(--muted-foreground)", marginTop: "1.25rem", lineHeight: 1.75, fontSize: ".92rem" }}>
                Between <strong style={{ color: "var(--dark)" }}>74% and 90%</strong> of all participants were classified as marginalized — demonstrating the programme's strong inclusion focus. Even among funded youth, marginalization rates ranged from 74.3% to 82.4%.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginTop: "1.5rem" }}>
                {[
                  ["68.9% male", "30.9% female participants"],
                  ["40.5% female", "among funded youth"],
                  ["59% urban", "39.8% rural participants"],
                  ["57.6%", "aged 25–30 years"],
                ].map(([n, l]) => (
                  <div key={n} style={{ background: "var(--cd)", borderRadius: 10, padding: ".85rem 1rem", border: "1px solid var(--border)" }}>
                    <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1rem", color: "var(--green)" }}>{n}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--muted-foreground)", marginTop: ".2rem" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--green)", borderRadius: 16, padding: "2rem", color: "#fff" }}>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", marginBottom: "1.25rem", opacity: 0.9 }}>Conclusion</div>
              <p style={{ fontSize: ".9rem", lineHeight: 1.75, opacity: 0.85, marginBottom: "1rem" }}>
                The BeGreen Africa Kenya Initiative has significantly exceeded its core targets across all three programme pillars: employment creation (846 jobs vs. 260 projected), revenue generation (~USD 2.7M annually vs. USD 1M target), and waste management (29.9M kgs diverted).
              </p>
              <p style={{ fontSize: ".9rem", lineHeight: 1.75, opacity: 0.85 }}>
                As Kenya advances its climate goals, the BeGreen experience affirms that youth are not only beneficiaries but <strong>architects of sustainable development</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="sec" style={{ background: "var(--cd)" }}>
        <div className="sec-in">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="s-label" style={{ justifyContent: "center" }}>Collaboration</div>
            <h2 className="s-title">Key <span>Partners</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" }}>
            {partners.map(({ name, role }) => (
              <div key={name} style={{ display: "flex", gap: ".85rem", alignItems: "flex-start", padding: "1.1rem 1.25rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,var(--green),var(--green-light))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Building2 size={16} color="#fff" />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".85rem", color: "var(--dark)", marginBottom: ".2rem" }}>{name}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Back link ── */}
      <section style={{ padding: "3rem 2.5rem", textAlign: "center" }}>
        <Link href="/programs" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".75rem 1.75rem", borderRadius: 100, background: "var(--cd)", border: "1px solid var(--border)", fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: "var(--dark)", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to All Programs
        </Link>
      </section>
    </>
  );
}
