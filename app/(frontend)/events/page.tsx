"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useEvents } from "@/lib/useEvents";
import { MapPin, Calendar, ExternalLink, Search, Globe, Monitor, Users, ArrowRight, AlertCircle } from "lucide-react";

const EVENT_TYPES = ["All", "Conference", "Summit", "Hackathon", "Webinar", "Workshop", "Competition", "Bootcamp", "Dialogue"];
const FORMATS     = ["All", "In-person", "Online", "Hybrid"];

const TYPE_COLORS: Record<string, string> = {
  Conference: "#5dba2f", Summit: "#047857", Hackathon: "#10B981",
  Webinar: "#34D399", Workshop: "#065F46", Competition: "#5dba2f",
  Bootcamp: "#047857", Dialogue: "#10B981",
};

function parseDate(str: string | null): Date | null {
  if (!str) return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  return null;
}
function getDaysUntil(s: string | null): number | null {
  const d = parseDate(s);
  if (!d) return null;
  const t = new Date(); t.setHours(0,0,0,0);
  return Math.ceil((d.getTime() - t.getTime()) / 86400000);
}
function formatEventDate(s: string | null): string {
  if (!s) return "Date TBA";
  const d = parseDate(s);
  return d ? d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : s;
}
function getMonthDay(s: string | null) {
  const d = parseDate(s);
  if (!d) return { month: "TBA", day: "?" };
  return { month: d.toLocaleDateString("en-US",{month:"short"}).toUpperCase(), day: String(d.getDate()) };
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

function EventRow({ event, index }: { event: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  const { month, day } = getMonthDay(event.event_date);
  const days = getDaysUntil(event.event_date);
  const isUrgent = days !== null && days <= 7;
  const isSoon   = days !== null && days <= 30 && days > 7;
  const accentColor = isUrgent ? "#dc2626" : isSoon ? "#d97706" : "#5dba2f";

  return (
    <div
      ref={ref}
      style={{
        display: "flex", gap: "1.25rem", alignItems: "flex-start",
        padding: "1.5rem",
        background: hov ? "rgba(93,186,47,.05)" : "var(--card-dark)",
        border: `1px solid ${hov ? "#5dba2f" : "var(--border)"}`,
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: 16,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-30px)",
        transition: `opacity 0.6s ease ${index * 0.07}s, transform 0.6s ease ${index * 0.07}s, background 0.2s ease, border-color 0.2s ease`,
        cursor: "pointer",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Premium ticket date block */}
      <div style={{
        flexShrink: 0, width: 64, borderRadius: 12, overflow: "hidden",
        background: TYPE_COLORS[event.event_type] || "#5dba2f",
        textAlign: "center", boxShadow: `0 8px 24px -4px ${accentColor}40`,
      }}>
        <div style={{ background: "rgba(0,0,0,.2)", padding: ".3rem 0" }}>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,.8)", textTransform: "uppercase" }}>{month}</div>
        </div>
        <div style={{ padding: ".4rem .25rem" }}>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "2rem", color: "#fff", lineHeight: 1 }}>{day}</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: ".4rem", alignItems: "center", flexWrap: "wrap", marginBottom: ".6rem" }}>
          <span style={{ fontSize: "9px", padding: "3px 8px", background: TYPE_COLORS[event.event_type] || "#5dba2f", color: "#fff", borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {event.event_type}
          </span>
          <span style={{ fontSize: "9px", padding: "3px 8px", background: event.format === "Online" ? "rgba(29,78,216,.15)" : "rgba(93,186,47,.1)", color: event.format === "Online" ? "#93c5fd" : "#5dba2f", borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontWeight: 700, display: "flex", alignItems: "center", gap: ".2rem" }}>
            {event.format === "Online" ? <Monitor size={10} /> : <Users size={10} />}
            {event.format}
          </span>
          {isUrgent && <span style={{ fontSize: "9px", padding: "3px 8px", background: "rgba(220,38,38,.15)", color: "#fca5a5", borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontWeight: 700, display: "flex", alignItems: "center", gap: ".2rem" }}><AlertCircle size={9} />In {days}d</span>}
          {isSoon && !isUrgent && <span style={{ fontSize: "9px", padding: "3px 8px", background: "rgba(217,119,6,.15)", color: "#fcd34d", borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>In {days}d</span>}
        </div>

        <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text-on-dark)", lineHeight: 1.3, marginBottom: ".4rem" }}>{event.title}</div>

        {event.description && (
          <div style={{ fontSize: ".82rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: ".6rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{event.description}</div>
        )}

        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: ".72rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: ".3rem", fontFamily: "Montserrat, sans-serif" }}>
            <Calendar size={11} /> {formatEventDate(event.event_date)}
          </span>
          <span style={{ fontSize: ".72rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: ".3rem", fontFamily: "Montserrat, sans-serif" }}>
            {event.format === "Online" ? <Globe size={11} /> : <MapPin size={11} />} {event.location}
          </span>
        </div>
      </div>

      {/* CTA */}
      <a
        href={event.url} target="_blank" rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        style={{
          flexShrink: 0, display: "flex", alignItems: "center", gap: ".35rem",
          padding: ".6rem 1.1rem", borderRadius: 10,
          background: hov ? "#5dba2f" : "transparent",
          border: `1px solid ${hov ? "#5dba2f" : "rgba(93,186,47,.3)"}`,
          color: hov ? "#fff" : "#5dba2f",
          fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "11px",
          letterSpacing: "0.08em", textDecoration: "none", textTransform: "uppercase",
          transition: "all .2s", whiteSpace: "nowrap",
        }}
      >
        {event.format === "Online" ? "Join" : "Register"} <ExternalLink size={11} />
      </a>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", padding: "1.5rem", background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 16, borderLeft: "4px solid var(--border)" }}>
      <div style={{ width: 64, height: 80, borderRadius: 12, background: "rgba(255,255,255,.06)", flexShrink: 0, animation: "shimmer 1.5s infinite" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".6rem" }}>
        <div style={{ height: 12, borderRadius: 4, background: "rgba(255,255,255,.06)", width: "40%", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 18, borderRadius: 4, background: "rgba(255,255,255,.06)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 13, borderRadius: 4, background: "rgba(255,255,255,.06)", width: "65%", animation: "shimmer 1.5s infinite" }} />
      </div>
    </div>
  );
}

export default function Events() {
  const [type, setType]   = useState("All");
  const [format, setFormat] = useState("All");
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const { events, loading, error, refetch } = useEvents({ limit: 60, type, format });
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef);

  const filtered = events.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q);
  });

  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        title={<>Events & <span style={{ color: "#5dba2f" }}>Workshops</span></>}
        subtitle="Climate conferences, hackathons, summits and webinars — Kenya and worldwide. AI-curated and updated every 12 hours."
      />

      <section className="py-20 px-6 md:px-16" style={{ background: "var(--section-dark)", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Filters */}
          <div
            ref={headerRef}
            style={{ marginBottom: "2.5rem", opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              {EVENT_TYPES.map((t) => (
                <button key={t} onClick={() => setType(t)} style={{ padding: ".4rem .9rem", borderRadius: 99, fontSize: ".72rem", fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer", border: "1px solid", transition: "all .2s", borderColor: type === t ? "#5dba2f" : "var(--border)", background: type === t ? "#5dba2f" : "transparent", color: type === t ? "#fff" : "var(--muted-foreground)" }}>{t}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", gap: ".4rem" }}>
                {FORMATS.map((f) => (
                  <button key={f} onClick={() => setFormat(f)} style={{ padding: ".4rem .9rem", borderRadius: 99, fontSize: ".72rem", fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer", border: "1px solid", transition: "all .2s", borderColor: format === f ? "#5dba2f" : "var(--border)", background: format === f ? "#5dba2f" : "transparent", color: format === f ? "#fff" : "var(--muted-foreground)", display: "flex", alignItems: "center", gap: ".3rem" }}>
                    {f === "Online" ? <Monitor size={11} /> : f === "In-person" ? <Users size={11} /> : null}{f}
                  </button>
                ))}
              </div>
              <div style={{ position: "relative", marginLeft: "auto", width: 280 }}>
                <Search size={13} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…"
                  onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
                  style={{ paddingLeft: "2.3rem", paddingRight: "1rem", paddingTop: ".55rem", paddingBottom: ".55rem", border: `1px solid ${searchFocus ? "#5dba2f" : "var(--border)"}`, borderRadius: 10, fontSize: ".85rem", fontFamily: "Montserrat, sans-serif", width: "100%", background: "rgba(255,255,255,.05)", color: "var(--text-on-dark)", boxShadow: searchFocus ? "0 0 0 3px rgba(93,186,47,.15)" : "none", transition: "all .2s", outline: "none" }}
                />
              </div>
            </div>
          </div>

          {loading && <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>{Array.from({length:4}).map((_,i)=><SkeletonRow key={i}/>)}</div>}

          {!loading && filtered.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
              {filtered.map((event, i) => <EventRow key={event.id} event={event} index={i} />)}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
              <Calendar size={48} color="rgba(93,186,47,.3)" style={{ margin: "0 auto 1.25rem", display: "block" }} />
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "var(--text-on-dark)", marginBottom: ".5rem" }}>No events found</div>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>Try different filters or check back soon for new events.</p>
              <button onClick={refetch} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".85rem 1.75rem", borderRadius: 10, background: "#5dba2f", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: ".85rem", border: "none", cursor: "pointer" }}>
                Refresh <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
