"use client";

import { useState, useRef, useEffect } from "react";
import { useEvents } from "@/lib/useEvents";
import { Calendar, MapPin, Search, ArrowRight } from "lucide-react";
import { NK, nkShadow, nkCard, nkBadgeForKey } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { CTABand } from "@/components/CTABand";

const EVENT_TYPES = ["All", "Conference", "Summit", "Hackathon", "Webinar", "Workshop", "Competition", "Bootcamp", "Dialogue"];
const FORMATS = ["All", "In-person", "Online", "Hybrid"];

function useInView(ref: React.RefObject<Element | null>, threshold = 0.1) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref, threshold]);
  return v;
}

function parseDate(str: string | null): Date | null {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}
function formatEventDate(s: string | null): string {
  if (!s) return "Date TBA";
  const d = parseDate(s);
  return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : s;
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 18px", fontFamily: "var(--fs)", fontWeight: 600, fontSize: 13,
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

function EventCard({ event, index }: { event: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  const badge = nkBadgeForKey(event.event_type || "Event");

  return (
    <a
      ref={ref as any}
      href={event.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...nkCard, display: "flex", flexDirection: "column", padding: "1.75rem", textDecoration: "none",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity .5s ease ${index * 0.06}s, transform .5s ease ${index * 0.06}s, box-shadow .2s, translate .2s`,
        boxShadow: hov ? nkShadow(NK.green) : nkShadow(NK.ink),
        translate: hov ? "0 -4px" : "0 0",
      }}
    >
      <span style={{ alignSelf: "flex-start", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 9px", background: badge.bg, color: badge.fg }}>
        {event.event_type}
      </span>
      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.3rem", color: NK.ink, margin: "1.1rem 0 .5rem", lineHeight: 1.2 }}>{event.title}</div>
      <p style={{ fontSize: ".9rem", color: NK.muted, lineHeight: 1.6, flex: 1, marginBottom: "1.1rem" }}>{event.description}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: ".4rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontFamily: "var(--fm)", fontSize: 11.5, color: NK.mutedLabel }}>
          <Calendar size={13} color={NK.green} /> {formatEventDate(event.event_date)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontFamily: "var(--fm)", fontSize: 11.5, color: NK.mutedLabel }}>
          <MapPin size={13} color={NK.green} /> {event.location} · {event.format}
        </div>
      </div>
      <span style={{ alignSelf: "flex-start", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 14, color: NK.ink, borderBottom: `2px solid ${NK.green}`, paddingBottom: 2 }}>
        Register →
      </span>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div style={{ ...nkCard, boxShadow: nkShadow(NK.ink), padding: "1.75rem" }}>
      <div style={{ height: 20, width: 80, background: "rgba(16,28,51,0.08)" }} />
      <div style={{ height: 22, background: "rgba(16,28,51,0.08)", margin: "1.1rem 0 .5rem" }} />
      <div style={{ height: 14, background: "rgba(16,28,51,0.06)", marginBottom: 6 }} />
      <div style={{ height: 14, width: "70%", background: "rgba(16,28,51,0.06)" }} />
    </div>
  );
}

export default function Events() {
  const [type, setType] = useState("All");
  const [format, setFormat] = useState("All");
  const [search, setSearch] = useState("");
  const { events, loading, error, refetch } = useEvents({ limit: 60, type, format });

  const filtered = events.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q);
  });

  return (
    <>
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
            Events &amp; Workshops
          </span>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(44px,5.6vw,86px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.02, margin: 0 }}>
            Show up, <span style={{ color: NK.green }}>skill up.</span>
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.25rem", color: NK.muted, lineHeight: 1.7, marginTop: "1.5rem", maxWidth: 660 }}>
            Register for bootcamps, policy dialogues and webinars from KYCH and our partners across Kenya.
          </p>
        </div>
      </section>

      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "1.5rem 2.5rem 5.5rem" }}>
          <div style={{ marginBottom: "1rem", display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            {EVENT_TYPES.map((t) => <FilterPill key={t} label={t} active={type === t} onClick={() => setType(t)} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              {FORMATS.map((f) => <FilterPill key={f} label={f} active={format === f} onClick={() => setFormat(f)} />)}
            </div>
            <div style={{ position: "relative", maxWidth: 280, flex: 1, minWidth: 220 }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: NK.mutedLabel }} />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events…"
                style={{ width: "100%", padding: "10px 12px 10px 34px", border: `2px solid ${NK.ink}`, fontFamily: "var(--fb)", fontSize: 13.5, outline: "none", background: NK.white, color: NK.ink }}
              />
            </div>
          </div>

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
              {filtered.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 2rem", border: `2px solid ${NK.ink}` }}>
              <Calendar size={40} color={NK.green} style={{ margin: "0 auto 1rem", display: "block" }} />
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: NK.ink, marginBottom: ".5rem" }}>No events found</div>
              <p style={{ color: NK.muted, marginBottom: "1.5rem" }}>Try different filters or check back soon for new events.</p>
              <button onClick={refetch} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: "12px 24px", background: NK.green, color: NK.navyDeep, fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
                Refresh <ArrowRight size={14} />
              </button>
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "3rem 2rem", color: NK.muted, fontFamily: "var(--fb)" }}>{error}</div>
          )}
        </div>
      </section>

      <CTABand title="Bring your county to the table." buttonLabel="Get in touch →" href="mailto:info@kenyayouthclimatehub.org" external />
    </>
  );
}
