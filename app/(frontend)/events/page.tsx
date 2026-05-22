"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useEvents } from "@/lib/useEvents";
import {
  MapPin, Calendar, ExternalLink, RefreshCw,
  Search, Globe, Monitor, Users, AlertCircle,
} from "lucide-react";



const EVENT_TYPES = ["All", "Conference", "Summit", "Hackathon", "Webinar", "Workshop", "Competition", "Bootcamp", "Dialogue"];
const FORMATS     = ["All", "In-person", "Online", "Hybrid"];

const TYPE_COLORS: Record<string, string> = {
  Conference:  "#059669",
  Summit:      "#047857",
  Hackathon:   "#10B981",
  Webinar:     "#34D399",
  Workshop:    "#065F46",
  Competition: "#059669",
  Bootcamp:    "#047857",
  Dialogue:    "#10B981",
};

// ── Date helpers ──────────────────────────────────────────────
function parseDate(str: string | null): Date | null {
  if (!str) return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  const d2 = new Date(str.replace(/(\d+)(st|nd|rd|th)/gi, "$1"));
  return isNaN(d2.getTime()) ? null : d2;
}

function getDaysUntil(dateStr: string | null): number | null {
  const d = parseDate(dateStr);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatEventDate(dateStr: string | null): string {
  if (!dateStr) return "Date TBA";
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function getMonthDay(dateStr: string | null): { month: string; day: string } {
  const d = parseDate(dateStr);
  if (!d) return { month: "TBA", day: "?" };
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()),
  };
}

// ── Urgency badge ─────────────────────────────────────────────
function UrgencyBadge({ dateStr }: { dateStr: string | null }) {
  const days = getDaysUntil(dateStr);
  if (days === null) return null;
  if (days <= 7)  return <span style={{ fontSize: ".62rem", padding: ".15rem .45rem", background: "#FEF2F2", color: "#dc2626", borderRadius: 4, fontFamily: "var(--fm)", fontWeight: 700 }}>In {days}d</span>;
  if (days <= 30) return <span style={{ fontSize: ".62rem", padding: ".15rem .45rem", background: "#FEF9C3", color: "#92400E", borderRadius: 4, fontFamily: "var(--fm)", fontWeight: 600 }}>In {days}d</span>;
  return null;
}

// ── Skeleton card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="k-card event-row" style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
      <div style={{ width: 56, height: 64, borderRadius: 10, background: "var(--border)", flexShrink: 0, animation: "shimmer 1.5s infinite" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <div style={{ height: 14, borderRadius: 4, background: "var(--border)", width: "60%", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 18, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 13, borderRadius: 4, background: "var(--border)", width: "80%", animation: "shimmer 1.5s infinite" }} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function Events() {
  const [type, setType]     = useState("All");
  const [format, setFormat] = useState("All");
  const [search, setSearch] = useState("");

  const { events, loading, error, refetch } = useEvents({ limit: 60, type, format });

  const filtered = events.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.topic?.toLowerCase().includes(q)
    );
  });

  const isOnline = !error;

  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        title={<>Events & <span>Workshops</span></>}
        subtitle="Climate conferences, hackathons, summits and webinars — Kenya and worldwide."
      />

      <section className="sec">
        <div className="sec-in">

          {/* Filters */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "2rem" }}>
            <div>
              <div className="s-label" style={{ marginBottom: ".5rem" }}>Event Type</div>
              <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                {EVENT_TYPES.map((t) => (
                  <button key={t} className={`f-pill ${type === t ? "on" : ""}`} onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div>
                <div className="s-label" style={{ marginBottom: ".5rem" }}>Format</div>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  {FORMATS.map((f) => (
                    <button key={f} className={`f-pill ${format === f ? "on" : ""}`} onClick={() => setFormat(f)}>
                      {f === "Online" ? <><Monitor size={11} style={{ marginRight: 3 }} />{f}</> : f === "In-person" ? <><Users size={11} style={{ marginRight: 3 }} />{f}</> : f}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ position: "relative", marginLeft: "auto" }}>
                <Search size={14} style={{ position: "absolute", left: ".65rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events…"
                  style={{ paddingLeft: "2rem", paddingRight: ".75rem", paddingTop: ".45rem", paddingBottom: ".45rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".82rem", fontFamily: "inherit", width: 240 }}
                />
              </div>
            </div>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Events list */}
          {!loading && filtered.length > 0 && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {filtered.map((event) => {
                const { month, day } = getMonthDay(event.event_date);
                const days = getDaysUntil(event.event_date);
                const isUrgent = days !== null && days <= 7;
                const isSoon   = days !== null && days <= 30 && days > 7;

                return (
                  <article
                    key={event.id}
                    className={`k-card flex flex-col sm:flex-row gap-4 sm:gap-5 items-start p-4 sm:p-5 border-l-[3px] ${isUrgent ? 'border-red-600' : isSoon ? 'border-amber-600' : 'border-[var(--green)]'}`}
                  >
                    {/* Date block */}
                    <div style={{
                      flexShrink: 0, width: 56, textAlign: "center",
                      background: TYPE_COLORS[event.event_type] || "var(--green)",
                      borderRadius: 10, padding: ".5rem .25rem", color: "#fff",
                    }}>
                      <div style={{ fontFamily: "var(--fm)", fontSize: ".55rem", letterSpacing: ".1em", opacity: 0.8, textTransform: "uppercase" }}>{month}</div>
                      <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.6rem", lineHeight: 1 }}>{day}</div>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Tags row */}
                      <div style={{ display: "flex", gap: ".4rem", alignItems: "center", flexWrap: "wrap", marginBottom: ".4rem" }}>
                        <span style={{ fontSize: ".65rem", padding: ".15rem .5rem", background: TYPE_COLORS[event.event_type] || "#059669", color: "#fff", borderRadius: 4, fontFamily: "var(--fm)", fontWeight: 600 }}>
                          {event.event_type}
                        </span>
                        <span style={{ fontSize: ".65rem", padding: ".15rem .5rem", background: event.format === "Online" ? "#EFF6FF" : "#ECFDF5", color: event.format === "Online" ? "#1D4ED8" : "#065F46", borderRadius: 4, fontFamily: "var(--fm)", display: "flex", alignItems: "center", gap: ".2rem" }}>
                          {event.format === "Online" ? <Monitor size={10} /> : <Users size={10} />}
                          {event.format}
                        </span>
                        <span style={{ fontSize: ".65rem", padding: ".15rem .5rem", background: "var(--cd)", color: "var(--muted-foreground)", borderRadius: 4, fontFamily: "var(--fm)", border: "1px solid var(--border)" }}>
                          {event.topic}
                        </span>
                        <UrgencyBadge dateStr={event.event_date} />
                      </div>

                      {/* Title */}
                      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: "var(--dark)", lineHeight: 1.3, marginBottom: ".35rem" }}>
                        {event.title}
                      </div>

                      {/* Description */}
                      {event.description && (
                        <div style={{ fontSize: ".8rem", color: "var(--muted-foreground)", lineHeight: 1.55, marginBottom: ".5rem" }}>
                          {event.description}
                        </div>
                      )}

                      {/* Meta row */}
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: ".72rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: ".3rem", fontFamily: "var(--fm)" }}>
                          <Calendar size={12} /> {formatEventDate(event.event_date)}
                        </span>
                        <span style={{ fontSize: ".72rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: ".3rem", fontFamily: "var(--fm)" }}>
                          {event.format === "Online" ? <Globe size={12} /> : <MapPin size={12} />}
                          {event.location}
                        </span>
                        <span style={{ fontSize: ".65rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>
                          via {event.source}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-green w-full sm:w-auto mt-2 sm:mt-0"
                      style={{ flexShrink: 0, height: "fit-content", display: "flex", alignItems: "center", justifyContent: "center", gap: ".35rem", textDecoration: "none", fontSize: ".78rem", padding: ".5rem 1rem" }}
                    >
                      {event.format === "Online" ? "Join" : "Register"} <ExternalLink size={12} />
                    </a>
                  </article>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted-foreground)" }}>
              <Calendar size={40} style={{ margin: "0 auto 1rem", opacity: 0.3, display: "block" }} />
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".5rem" }}>No events found</div>
              <div style={{ fontSize: ".85rem", marginBottom: "1.5rem" }}>
                {isOnline ? "Click Refresh to fetch the latest climate events." : "Start the backend server first."}
              </div>
              <button onClick={refetch} className="btn-green" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
                <RefreshCw size={14} /> Refresh Now
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
