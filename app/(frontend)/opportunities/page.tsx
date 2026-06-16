"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useOpportunities } from "@/lib/useOpportunities";
import { Clock, ExternalLink, Search, AlertCircle, ArrowRight, Bell } from "lucide-react";

const TYPES  = ["All", "Grant", "Fellowship", "Internship", "Competition", "Job", "Accelerator"];
const TOPICS = ["All", "Energy", "Water", "Agriculture", "Policy", "Finance", "Innovation", "Resilience", "Advocacy", "Waste"];

const TYPE_COLORS: Record<string, string> = {
  Grant: "#5dba2f", Fellowship: "#047857", Internship: "#10B981",
  Competition: "#34D399", Job: "#065F46", Accelerator: "#5dba2f",
};

function parseDeadline(str: string | null): Date | null {
  if (!str || str === "Open" || str === "Rolling") return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  return new Date(str.replace(/(\d+)(st|nd|rd|th)/gi, "$1"));
}
function getDaysUntil(s: string | null): number | null {
  const d = parseDeadline(s);
  if (!d || isNaN(d.getTime())) return null;
  const t = new Date(); t.setHours(0,0,0,0);
  return Math.ceil((d.getTime() - t.getTime()) / 86400000);
}

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  if (!deadline || deadline === "Open" || deadline === "Rolling") {
    return <span style={{ fontSize: "11px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "#5dba2f", display: "flex", alignItems: "center", gap: ".3rem" }}><Clock size={12} /> Open / Rolling</span>;
  }
  const days = getDaysUntil(deadline);
  if (days !== null && days < 0) return null;
  if (days !== null && days <= 7) return <span style={{ fontSize: "11px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "#dc2626", display: "flex", alignItems: "center", gap: ".3rem" }}><AlertCircle size={12} />{days === 0 ? "Closes TODAY" : `Closes in ${days}d`}</span>;
  if (days !== null && days <= 30) return <span style={{ fontSize: "11px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "#d97706", display: "flex", alignItems: "center", gap: ".3rem" }}><Clock size={12} />Closes: {deadline}</span>;
  return <span style={{ fontSize: "11px", fontFamily: "Montserrat, sans-serif", fontWeight: 600, color: "#5dba2f", display: "flex", alignItems: "center", gap: ".3rem" }}><Clock size={12} />Closes: {deadline}</span>;
}

function useInView(ref: React.RefObject<Element | null>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.05 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref]);
  return v;
}

function OppCard({ o, index }: { o: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  const days = getDaysUntil(o.deadline);
  const isUrgent = days !== null && days <= 7;
  const isSoon   = days !== null && days <= 30 && days > 7;
  const accentColor = isUrgent ? "#dc2626" : isSoon ? "#d97706" : (TYPE_COLORS[o.type] || "#5dba2f");

  return (
    <div
      ref={ref}
      style={{
        background: hov ? "rgba(93,186,47,.03)" : "var(--card-dark)",
        border: `1px solid ${hov ? "#5dba2f" : "var(--border)"}`,
        borderTop: `3px solid ${accentColor}`,
        borderRadius: 16, padding: "1.75rem",
        display: "flex", flexDirection: "column",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 0.07}s, transform 0.6s ease ${index * 0.07}s, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease`,
        boxShadow: hov ? `0 20px 40px -10px ${accentColor}25` : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Type + amount row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "9px", padding: "4px 10px", background: TYPE_COLORS[o.type] || "#5dba2f", color: "#fff", borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {o.type}
        </span>
        {o.amount && (
          <span style={{ fontSize: "11px", fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: "#5dba2f", background: "rgba(93,186,47,.1)", border: "1px solid rgba(93,186,47,.2)", padding: "3px 10px", borderRadius: 6 }}>
            {o.amount}
          </span>
        )}
      </div>

      {/* Title */}
      <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text-on-dark)", lineHeight: 1.4, marginBottom: ".35rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {o.name || o.title}
      </div>
      <div style={{ fontSize: "11px", color: "var(--muted-foreground)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, marginBottom: ".85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {o.provider || o.source}
      </div>

      {/* Description */}
      <p style={{ fontSize: ".82rem", color: "var(--muted-foreground)", lineHeight: 1.65, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: ".85rem" }}>
        {o.desc}
      </p>

      {/* Topic tag */}
      <div style={{ marginBottom: "1rem" }}>
        <span style={{ fontSize: "9px", padding: "3px 9px", background: "rgba(255,255,255,.06)", color: "var(--muted-foreground)", borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontWeight: 700, border: "1px solid var(--border)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {o.topic}
        </span>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1rem", gap: ".5rem", flexWrap: "wrap" }}>
        <DeadlineBadge deadline={o.deadline} />
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button title="Remind me" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#5dba2f"; (e.currentTarget as HTMLElement).style.color = "#5dba2f"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)"; }}
          ><Bell size={14} /></button>
          <a href={o.url} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: ".35rem", padding: ".45rem 1rem", borderRadius: 8, background: "#5dba2f", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "background .2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#4aa324")}
            onMouseLeave={e => (e.currentTarget.style.background = "#5dba2f")}
          >
            Apply <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "var(--card-dark)", borderRadius: 16, padding: "1.75rem", border: "1px solid var(--border)", borderTop: "3px solid var(--border)", display: "flex", flexDirection: "column", gap: ".75rem" }}>
      <div style={{ height: 20, borderRadius: 4, background: "rgba(255,255,255,.06)", width: "35%", animation: "shimmer 1.5s infinite" }} />
      <div style={{ height: 16, borderRadius: 4, background: "rgba(255,255,255,.06)", animation: "shimmer 1.5s infinite" }} />
      <div style={{ height: 16, borderRadius: 4, background: "rgba(255,255,255,.06)", width: "65%", animation: "shimmer 1.5s infinite" }} />
      <div style={{ height: 13, borderRadius: 4, background: "rgba(255,255,255,.06)", animation: "shimmer 1.5s infinite" }} />
      <div style={{ height: 13, borderRadius: 4, background: "rgba(255,255,255,.06)", width: "80%", animation: "shimmer 1.5s infinite" }} />
    </div>
  );
}

export default function Opportunities() {
  const [type, setType]   = useState("All");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const { opportunities, loading, error, refetch } = useOpportunities({ limit: 50, type, topic });
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef);

  const filtered = opportunities.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.name?.toLowerCase().includes(q) || o.provider?.toLowerCase().includes(q) || o.desc?.toLowerCase().includes(q);
  });

  return (
    <>
      <PageHeader
        eyebrow="Live Board"
        title={<>Funding & <span style={{ color: "#5dba2f" }}>Opportunities</span></>}
        subtitle="Grants, fellowships, internships and competitions open to young Kenyans — AI-curated and updated every 12 hours."
      />

      <section className="py-20 px-6 md:px-16" style={{ background: "var(--section-dark)", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Filters */}
          <div
            ref={headerRef}
            style={{ marginBottom: "2.5rem", opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: ".85rem" }}>
              {TYPES.map((t) => (
                <button key={t} onClick={() => setType(t)} style={{ padding: ".4rem .9rem", borderRadius: 99, fontSize: ".72rem", fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer", border: "1px solid", transition: "all .2s", borderColor: type === t ? "#5dba2f" : "var(--border)", background: type === t ? "#5dba2f" : "transparent", color: type === t ? "#fff" : "var(--muted-foreground)" }}>{t}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              {TOPICS.map((t) => (
                <button key={t} onClick={() => setTopic(t)} style={{ padding: ".35rem .8rem", borderRadius: 99, fontSize: ".68rem", fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer", border: "1px solid", transition: "all .2s", borderColor: topic === t ? "#5dba2f" : "var(--border)", background: topic === t ? "rgba(93,186,47,.15)" : "transparent", color: topic === t ? "#5dba2f" : "var(--muted-foreground)" }}>{t}</button>
              ))}
            </div>
            <div style={{ position: "relative", maxWidth: 320 }}>
              <Search size={13} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities…"
                onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
                style={{ paddingLeft: "2.3rem", paddingRight: "1rem", paddingTop: ".55rem", paddingBottom: ".55rem", border: `1px solid ${searchFocus ? "#5dba2f" : "var(--border)"}`, borderRadius: 10, fontSize: ".85rem", fontFamily: "Montserrat, sans-serif", width: "100%", background: "rgba(255,255,255,.05)", color: "var(--text-on-dark)", boxShadow: searchFocus ? "0 0 0 3px rgba(93,186,47,.15)" : "none", transition: "all .2s", outline: "none" }}
              />
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((o, i) => <OppCard key={o.id} o={o} index={i} />)}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
              <Clock size={48} color="rgba(93,186,47,.3)" style={{ margin: "0 auto 1.25rem", display: "block" }} />
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "var(--text-on-dark)", marginBottom: ".5rem" }}>No opportunities yet</div>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>Our AI is fetching climate opportunities. Check back soon.</p>
              <button onClick={refetch} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".85rem 1.75rem", borderRadius: 10, background: "#5dba2f", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: ".85rem", border: "none", cursor: "pointer" }}>
                Refresh Now <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
