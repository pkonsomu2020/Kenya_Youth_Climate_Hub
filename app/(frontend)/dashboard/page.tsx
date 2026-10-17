"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Bot, BookOpen, DollarSign, Calendar, Trophy, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const quickLinks = [
  { icon: DollarSign, key: "opportunities", href: "/opportunities" },
  { icon: BookOpen,   key: "library",       href: "/e-library"     },
  { icon: Calendar,   key: "events",        href: "/events"        },
  { icon: Trophy,     key: "programs",      href: "/programs"      },
];

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", { g: (c) => <span>{c}</span> })}
        subtitle={t("subtitle")}
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
                {t("aiTitle")}
              </div>
              <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,.55)", lineHeight: 1.5 }}>
                {t("aiBody")}
              </div>
            </div>
            <span style={{ fontSize: ".72rem", padding: ".3rem .8rem", background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.5)", borderRadius: 99, fontFamily: "var(--fm)", border: "1px solid rgba(255,255,255,.1)" }}>
              {t("comingSoon")}
            </span>
          </div>

          {/* Quick Links */}
          <div className="s-label" style={{ marginBottom: "1rem" }}>{t("quickAccess")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
            {quickLinks.map(({ icon: Icon, key, href }) => (
              <Link key={href} href={href as any} className="k-card" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div className="k-card-icon" style={{ marginBottom: 0, flexShrink: 0 }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="k-card-title" style={{ marginBottom: ".15rem" }}>{t(`links.${key}.label`)}</div>
                  <div className="k-card-desc">{t(`links.${key}.desc`)}</div>
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
