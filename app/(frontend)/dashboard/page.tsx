"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Bot, BookOpen, DollarSign, Calendar, Trophy, ArrowRight } from "lucide-react";

const quickLinks = [
  { icon: DollarSign, label: "Opportunities", desc: "Browse open grants & fellowships", href: "/opportunities" },
  { icon: BookOpen,   label: "E-Library",     desc: "Reports, toolkits & resources",   href: "/e-library"     },
  { icon: Calendar,   label: "Events",         desc: "Upcoming summits & workshops",    href: "/events"        },
  { icon: Trophy,     label: "Programs",       desc: "Apply to innovation programs",    href: "/programs"      },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your Dashboard"
        title={<>Welcome to <span>KYCH Platform</span></>}
        subtitle="Your personal hub for climate opportunities, resources, and tools."
      />

      <section className="sec">
        <div className="sec-in">

          {/* Climate AI Teaser */}
          <div style={{ background: "#0A0A0A", borderRadius: 16, padding: "2rem 2.5rem", marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--green), var(--green-light))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot size={28} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.1rem", color: "#fff", marginBottom: ".3rem" }}>
                Climate AI Assistant
              </div>
              <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,.55)", lineHeight: 1.5 }}>
                A 24/7 AI guide trained on Kenya's climate data, opportunities and resources. Coming soon.
              </div>
            </div>
            <span style={{ fontSize: ".72rem", padding: ".3rem .8rem", background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.5)", borderRadius: 99, fontFamily: "var(--fm)", border: "1px solid rgba(255,255,255,.1)" }}>
              Coming Soon
            </span>
          </div>

          {/* Quick Links */}
          <div className="s-label" style={{ marginBottom: "1rem" }}>Quick Access</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
            {quickLinks.map(({ icon: Icon, label, desc, href }) => (
              <Link key={href} href={href as any} className="k-card" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div className="k-card-icon" style={{ marginBottom: 0, flexShrink: 0 }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="k-card-title" style={{ marginBottom: ".15rem" }}>{label}</div>
                  <div className="k-card-desc">{desc}</div>
                </div>
                <ArrowRight size={16} style={{ marginLeft: "auto", color: "var(--muted-foreground)", flexShrink: 0 }} />
              </Link>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
