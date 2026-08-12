"use client";

import { useState, useRef, useEffect } from "react";
import { useOpportunities } from "@/lib/useOpportunities";
import { Clock, Search, ArrowRight } from "lucide-react";
import { NK, nkShadow, nkCard, nkBadgeForKey } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { CTABand } from "@/components/CTABand";

const TYPES = ["All", "Grant", "Fellowship", "Internship", "Competition", "Job", "Accelerator"];
const TOPICS = ["All", "Energy", "Water", "Agriculture", "Policy", "Finance", "Innovation", "Resilience", "Advocacy", "Waste"];

function useInView(ref: React.RefObject<Element | null>, threshold = 0.1) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref, threshold]);
  return v;
}

function parseDeadline(str: string | null): Date | null {
  if (!str || str === "Open" || str === "Rolling") return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  const d2 = new Date(str.replace(/(\d+)(st|nd|rd|th)/gi, "$1"));
  return isNaN(d2.getTime()) ? null : d2;
}
function getDaysUntil(s: string | null): number | null {
  const d = parseDeadline(s);
  if (!d) return null;
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - t.getTime()) / 86400000);
}
function ctaLabel(type: string): string {
  return type === "Grant" ? "Apply now →" : "View details →";
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px", fontFamily: "var(--fs)", fontWeight: 600, fontSize: 12.5,
        border: `2px solid ${active ? NK.green : NK.ink}`,
        background: active ? NK.green : "transparent",
        color: active ? NK.navyDeep : NK.ink,
        cursor: "pointer", transition: "all .2s",
      }}
    >
      {label}
    </button>
  );
}

function OppCard({ o, index }: { o: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  const badge = nkBadgeForKey(o.type || "Opportunity");
  const days = getDaysUntil(o.deadline);

  let deadlineText: string;
  if (!o.deadline || o.deadline === "Open" || o.deadline === "Rolling") deadlineText = "Open / Rolling";
  else if (days !== null && days >= 0 && days <= 7) deadlineText = days === 0 ? "Closes TODAY" : `Closes in ${days}d`;
  else deadlineText = `Closes: ${o.deadline}`;

  return (
    <a
      ref={ref as any}
      href={o.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...nkCard, display: "flex", flexDirection: "column", padding: "1.75rem", textDecoration: "none",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity .5s ease ${index * 0.06}s, transform .5s ease ${index * 0.06}s, box-shadow .2s, translate .2s`,
        boxShadow: hov ? nkShadow(NK.green) : nkShadow(NK.ink),
        translate: hov ? "0 -4px" : "0 0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".75rem", marginBottom: "1.1rem" }}>
        <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 9px", background: badge.bg, color: badge.fg }}>
          {o.type}
        </span>
        {o.amount && (
          <span style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12.5, color: NK.greenAlt }}>{o.amount}</span>
        )}
      </div>
      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.15rem", color: NK.ink, marginBottom: ".35rem", lineHeight: 1.25 }}>{o.name || o.title}</div>
      <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedLabel, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: ".9rem" }}>{o.provider || o.source}</div>
      <p style={{ fontSize: ".88rem", color: NK.muted, lineHeight: 1.6, flex: 1, marginBottom: "1.1rem" }}>{o.desc}</p>
      <div style={{ fontFamily: "var(--fm)", fontSize: 11.5, color: NK.mutedLabel, marginBottom: "1rem" }}>{deadlineText}</div>
      <span style={{ alignSelf: "flex-start", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 14, color: NK.ink, borderBottom: `2px solid ${NK.green}`, paddingBottom: 2 }}>
        {ctaLabel(o.type)}
      </span>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div style={{ ...nkCard, boxShadow: nkShadow(NK.ink), padding: "1.75rem" }}>
      <div style={{ height: 20, width: 70, background: "rgba(16,28,51,0.08)", marginBottom: "1.1rem" }} />
      <div style={{ height: 20, background: "rgba(16,28,51,0.08)", marginBottom: 8 }} />
      <div style={{ height: 12, width: "50%", background: "rgba(16,28,51,0.06)", marginBottom: 16 }} />
      <div style={{ height: 14, background: "rgba(16,28,51,0.06)" }} />
    </div>
  );
}

export default function Opportunities() {
  const [type, setType] = useState("All");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");
  const { opportunities, loading, error, refetch } = useOpportunities({ limit: 50, type, topic });

  const filtered = opportunities.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.name?.toLowerCase().includes(q) || o.provider?.toLowerCase().includes(q) || o.desc?.toLowerCase().includes(q);
  });

  return (
    <>
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
            Funding &amp; Opportunities
          </span>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(44px,5.6vw,86px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.02, margin: 0 }}>
            Find your <span style={{ color: NK.green }}>next opportunity.</span>
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.25rem", color: NK.muted, lineHeight: 1.7, marginTop: "1.5rem", maxWidth: 660 }}>
            A live board of grants, fellowships, competitions and internships, with deadline alerts, matched to your climate ambitions.
          </p>
        </div>
      </section>

      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "1.5rem 2.5rem 5.5rem" }}>
          <div style={{ marginBottom: ".85rem", display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            {TYPES.map((t) => <FilterPill key={t} label={t} active={type === t} onClick={() => setType(t)} />)}
          </div>
          <div style={{ marginBottom: "1rem", display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            {TOPICS.map((t) => <FilterPill key={t} label={t} active={topic === t} onClick={() => setTopic(t)} />)}
          </div>
          <div style={{ position: "relative", maxWidth: 320, marginBottom: "2rem" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: NK.mutedLabel }} />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search opportunities…"
              style={{ width: "100%", padding: "10px 12px 10px 34px", border: `2px solid ${NK.ink}`, fontFamily: "var(--fb)", fontSize: 13.5, outline: "none", background: NK.white, color: NK.ink }}
            />
          </div>

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
              {filtered.map((o, i) => <OppCard key={o.id} o={o} index={i} />)}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 2rem", border: `2px solid ${NK.ink}` }}>
              <Clock size={40} color={NK.green} style={{ margin: "0 auto 1rem", display: "block" }} />
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: NK.ink, marginBottom: ".5rem" }}>No opportunities yet</div>
              <p style={{ color: NK.muted, marginBottom: "1.5rem" }}>Our AI is fetching climate opportunities. Check back soon.</p>
              <button onClick={refetch} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: "12px 24px", background: NK.green, color: NK.navyDeep, fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
                Refresh Now <ArrowRight size={14} />
              </button>
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "3rem 2rem", color: NK.muted, fontFamily: "var(--fb)" }}>{error}</div>
          )}
        </div>
      </section>

      <CTABand title="Never miss a deadline." buttonLabel="Subscribe for alerts →" href="mailto:info@kenyayouthclimatehub.org" external />
    </>
  );
}
