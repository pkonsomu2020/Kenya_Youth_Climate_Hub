"use client";

import Link from "next/link";
import {
  ArrowLeft, Leaf, Users, TrendingUp, Recycle,
  CheckCircle2, Globe, Lightbulb, Building2,
} from "lucide-react";
import { NK, nkCard } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { useTranslations } from "next-intl";

// ── Key stats ─────────────────────────────────────────────────────────────────
// Labels / subtitles: programs.begreen.stats[i]
const statValues = ["846", "8.1x", "~7x", "29.9M", "146", "74–90%"];

// ── Focus areas ───────────────────────────────────────────────────────────────
// Text: programs.begreen.focus[i]
const focusIcons = [Recycle, Leaf, Globe, Lightbulb];

function SectionHeader({ eyebrow, children, dark = false }: { eyebrow: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 3rem" }}>
      <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: dark ? NK.offWhiteOnDark : NK.greenAlt, marginBottom: "1rem" }}>
        {eyebrow}
      </span>
      <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(28px,3.6vw,46px)", color: dark ? "#fff" : NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
        {children}
      </GrowHeading>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
type Pair = { title: string; desc: string };

export default function BeGreenPage() {
  const t = useTranslations("programs.begreen");
  const g = (c: React.ReactNode) => <span style={{ color: NK.green }}>{c}</span>;
  const b = (c: React.ReactNode) => <strong style={{ color: NK.ink }}>{c}</strong>;
  const stats = t.raw("stats") as { label: string; sub: string }[];
  const phases = t.raw("phases") as { title: string; outcome: string }[];
  const focus = t.raw("focus") as Pair[];
  const problem = t.raw("problem") as string[];
  const outcomes = t.raw("outcomes") as { title: string; items: string[] }[];
  const inclusion = t.raw("inclusionStats") as [string, string][];
  const partners = t.raw("partners") as { name: string; role: string }[];
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
            {t("eyebrow")}
          </span>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(38px,5vw,72px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}>
            {t.rich("title", { g })}
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.15rem", color: NK.muted, lineHeight: 1.7, marginTop: "1.5rem", maxWidth: 660 }}>
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Back link */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 2.5rem 1.5rem" }}>
        <Link href="/programs" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem", color: NK.muted, textDecoration: "none", fontFamily: "var(--fs)", fontWeight: 600 }}>
          <ArrowLeft size={14} /> {t("back")}
        </Link>
      </div>

      {/* ── Partner badges ── */}
      <div style={{ background: NK.bg, borderTop: `2px solid ${NK.ink}`, borderBottom: `2px solid ${NK.ink}`, padding: "1.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: ".7rem", fontWeight: 700, fontFamily: "var(--fm)", letterSpacing: ".08em", textTransform: "uppercase", color: NK.muted }}>{t("implementing")}</span>
          {["UNICEF / GenU", "Tony Elumelu Foundation", "IKEA Foundation", "KNBS"].map((p) => (
            <span key={p} style={{ fontSize: ".75rem", padding: ".3rem .9rem", background: NK.white, border: `1.5px solid ${NK.ink}`, fontFamily: "var(--fs)", fontWeight: 600, color: NK.ink }}>{p}</span>
          ))}
        </div>
      </div>

      {/* ── Impact stats ── */}
      <section style={{ background: NK.navyDeep, padding: "3.5rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "var(--fm)", fontSize: ".7rem", letterSpacing: ".14em", color: NK.mutedOnDark, textTransform: "uppercase", marginBottom: ".5rem" }}>{t("resultsEyebrow")}</div>
            <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "#fff", letterSpacing: "-.02em" }}>
              {t("resultsTitle")}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem" }}>
            {statValues.map((value, i) => ({ value, ...stats[i] })).map(({ value, label, sub }) => (
              <div key={value} style={{ textAlign: "center", padding: "1.5rem 1rem", background: NK.panelNavy, border: `1px solid ${NK.borderNavy}` }}>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "2rem", color: NK.green, letterSpacing: "-.03em", lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".82rem", color: "#fff", marginTop: ".4rem" }}>{label}</div>
                <div style={{ fontSize: ".68rem", color: NK.mutedOnDark, fontFamily: "var(--fm)", marginTop: ".2rem" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Overview ── */}
      <section style={{ background: NK.bg, padding: "6.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "3rem", alignItems: "start" }}>
            <div>
              <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>{t("aboutEyebrow")}</span>
              <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(28px,3.6vw,46px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
                {t.rich("aboutTitle", { g })}
              </GrowHeading>
              <p style={{ color: NK.muted, marginTop: "1.25rem", lineHeight: 1.75, fontSize: ".95rem" }}>
                {t.rich("about1", { b })}
              </p>
              <p style={{ color: NK.muted, marginTop: ".75rem", lineHeight: 1.75, fontSize: ".95rem" }}>
                {t.rich("about2", { b })}
              </p>
              <p style={{ color: NK.muted, marginTop: ".75rem", lineHeight: 1.75, fontSize: ".95rem" }}>
                {t.rich("about3", { b })}
              </p>
            </div>
            <div style={{ border: `2px solid ${NK.ink}`, padding: "2rem" }}>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: NK.ink, marginBottom: "1.25rem" }}>{t("problemTitle")}</div>
              {["22,000", "39%", "39.8%", "75%"].map((stat, i) => ({ stat, desc: problem[i] })).map(({ stat, desc }) => (
                <div key={stat} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.3rem", color: NK.green, flexShrink: 0, lineHeight: 1, minWidth: 66 }}>{stat}</div>
                  <div style={{ fontSize: ".82rem", color: NK.muted, lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Focus areas ── */}
      <section style={{ background: NK.tintGreen, padding: "6.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <SectionHeader eyebrow={t("focusEyebrow")}>
            {t.rich("focusTitle", { g })}
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
            {focus.map(({ title, desc }, i) => ({ icon: focusIcons[i] ?? Leaf, title, desc })).map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ ...nkCard, padding: "1.75rem" }}>
                <div style={{ width: 48, height: 48, background: NK.green, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.1rem" }}>
                  <Icon size={22} color={NK.navyDeep} />
                </div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".95rem", color: NK.ink, marginBottom: ".4rem" }}>{title}</div>
                <div style={{ fontSize: ".8rem", color: NK.muted, lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programme phases ── */}
      <section style={{ background: NK.bg, padding: "6.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <SectionHeader eyebrow={t("phasesEyebrow")}>
            {t.rich("phasesTitle", { g })}
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1rem" }}>
            {phases.map(({ title, outcome }, i) => ({ n: i + 1, title, outcome })).map(({ n, title, outcome }) => (
              <div key={n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.1rem 1.25rem", background: NK.white, border: `1.5px solid ${NK.ink}` }}>
                <div style={{ width: 36, height: 36, background: NK.green, color: NK.navyDeep, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".9rem", flexShrink: 0 }}>{n}</div>
                <div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: NK.ink, marginBottom: ".25rem" }}>{title}</div>
                  <div style={{ fontSize: ".75rem", color: NK.greenAlt, fontWeight: 600, fontFamily: "var(--fm)" }}>{outcome}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key outcomes ── */}
      <section style={{ background: NK.navyDeep, padding: "6.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <SectionHeader eyebrow={t("outcomesEyebrow")} dark>
            {t.rich("outcomesTitle", { g })}
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" }}>
            {outcomes.map((o, i) => ({ icon: [Users, TrendingUp, Recycle][i] ?? Users, ...o })).map(({ icon: Icon, title, items }) => (
              <div key={title} style={{ background: NK.panelNavy, border: `1px solid ${NK.borderNavy}`, padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
                  <div style={{ width: 40, height: 40, background: NK.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={20} color={NK.navyDeep} /></div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: "#fff" }}>{title}</div>
                </div>
                {items.map((item) => (
                  <div key={item} style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", marginBottom: ".6rem" }}>
                    <CheckCircle2 size={14} color={NK.green} style={{ flexShrink: 0, marginTop: ".15rem" }} />
                    <span style={{ fontSize: ".82rem", color: NK.mutedOnDark, lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inclusion ── */}
      <section style={{ background: NK.bg, padding: "6.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "3rem", alignItems: "start" }}>
            <div>
              <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>{t("inclusionEyebrow")}</span>
              <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(28px,3.6vw,46px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
                {t.rich("inclusionTitle", { g })}
              </GrowHeading>
              <p style={{ color: NK.muted, marginTop: "1.25rem", lineHeight: 1.75, fontSize: ".95rem" }}>
                {t.rich("inclusionBody", { b })}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginTop: "1.5rem" }}>
                {inclusion.map(([n, l]) => (
                  <div key={n} style={{ background: NK.tintGreen, padding: ".85rem 1rem", border: `1px solid ${NK.ink}` }}>
                    <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: NK.green }}>{n}</div>
                    <div style={{ fontSize: ".72rem", color: NK.muted, marginTop: ".2rem" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: NK.green, padding: "2rem", color: NK.navyDeep }}>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", marginBottom: "1.25rem", opacity: 0.9 }}>{t("conclusionTitle")}</div>
              <p style={{ fontSize: ".9rem", lineHeight: 1.75, opacity: 0.85, marginBottom: "1rem" }}>
                {t("conclusion1")}
              </p>
              <p style={{ fontSize: ".9rem", lineHeight: 1.75, opacity: 0.85 }}>
                {t.rich("conclusion2", { b: (c) => <strong>{c}</strong> })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section style={{ background: NK.tintGreen, padding: "6.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <SectionHeader eyebrow={t("partnersEyebrow")}>
            {t.rich("partnersTitle", { g })}
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" }}>
            {partners.map(({ name, role }) => (
              <div key={name} style={{ display: "flex", gap: ".85rem", alignItems: "flex-start", padding: "1.1rem 1.25rem", background: NK.white, border: `1.5px solid ${NK.ink}` }}>
                <div style={{ width: 36, height: 36, background: NK.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Building2 size={16} color={NK.navyDeep} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".85rem", color: NK.ink, marginBottom: ".2rem" }}>{name}</div>
                  <div style={{ fontSize: ".75rem", color: NK.muted, lineHeight: 1.5 }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Back link ── */}
      <section style={{ padding: "3rem 2.5rem", textAlign: "center" }}>
        <Link href="/programs" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".75rem 1.75rem", background: NK.bg, border: `2px solid ${NK.ink}`, fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: NK.ink, textDecoration: "none" }}>
          <ArrowLeft size={14} /> {t("backAll")}
        </Link>
      </section>
    </>
  );
}
