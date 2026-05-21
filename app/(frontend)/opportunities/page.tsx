"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useOpportunities } from "@/lib/useOpportunities";
import { Clock, Bell, ExternalLink, RefreshCw, Wifi, WifiOff, Search, AlertCircle } from "lucide-react";



const TYPES  = ["All", "Grant", "Fellowship", "Internship", "Competition", "Job", "Accelerator"];
const TOPICS = ["All", "Energy", "Water", "Agriculture", "Policy", "Finance", "Innovation", "Resilience", "Advocacy", "Waste"];

const TYPE_STYLES: Record<string, string> = {
  Grant: "t-grant",
  Fellowship: "t-fellow",
  Internship: "t-event",
  Competition: "t-news",
  Job: "t-res",
  Accelerator: "t-grant",
};

// ── Deadline helpers ──────────────────────────────────────────
function parseDeadline(str: string | null): Date | null {
  if (!str || str === "Open" || str === "Rolling") return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  const d2 = new Date(str.replace(/(\d+)(st|nd|rd|th)/gi, "$1"));
  return isNaN(d2.getTime()) ? null : d2;
}

function getDaysUntil(deadlineStr: string | null): number | null {
  const d = parseDeadline(deadlineStr);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  if (!deadline || deadline === "Open" || deadline === "Rolling") {
    return (
      <div style={{ fontSize: ".72rem", color: "var(--green)", fontWeight: 600, fontFamily: "var(--fs)", display: "flex", alignItems: "center", gap: ".3rem" }}>
        <Clock size={14} /> Open / Rolling
      </div>
    );
  }

  const days = getDaysUntil(deadline);

  // Past deadline — shouldn't show but just in case
  if (days !== null && days < 0) return null;

  // Closing very soon (≤ 7 days)
  if (days !== null && days <= 7) {
    return (
      <div style={{ fontSize: ".72rem", color: "#dc2626", fontWeight: 700, fontFamily: "var(--fs)", display: "flex", alignItems: "center", gap: ".3rem" }}>
        <AlertCircle size={14} />
        {days === 0 ? "Closes TODAY!" : `Closes in ${days} day${days === 1 ? "" : "s"}`}
      </div>
    );
  }

  // Closing soon (≤ 30 days)
  if (days !== null && days <= 30) {
    return (
      <div style={{ fontSize: ".72rem", color: "#d97706", fontWeight: 600, fontFamily: "var(--fs)", display: "flex", alignItems: "center", gap: ".3rem" }}>
        <Clock size={14} /> Closes: {deadline}
      </div>
    );
  }

  // Normal deadline
  return (
    <div style={{ fontSize: ".72rem", color: "var(--green)", fontWeight: 600, fontFamily: "var(--fs)", display: "flex", alignItems: "center", gap: ".3rem" }}>
      <Clock size={14} /> Closes: {deadline}
    </div>
  );
}

// Skeleton card while loading
function SkeletonCard() {
  return (
    <div className="k-card" style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: 70, height: 22, borderRadius: 6, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ width: 60, height: 22, borderRadius: 6, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
      </div>
      <div style={{ height: 16, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
      <div style={{ height: 16, borderRadius: 4, background: "var(--border)", width: "70%", animation: "shimmer 1.5s infinite" }} />
      <div style={{ height: 13, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
      <div style={{ height: 13, borderRadius: 4, background: "var(--border)", width: "80%", animation: "shimmer 1.5s infinite" }} />
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: ".75rem", display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: 100, height: 18, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ width: 70, height: 28, borderRadius: 6, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
      </div>
    </div>
  );
}

export default function Opportunities() {
  const [type, setType]   = useState("All");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");

  const { opportunities, loading, error, refetch } = useOpportunities({ limit: 50, type, topic });

  // Client-side search filter
  const filtered = opportunities.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.name?.toLowerCase().includes(q) ||
      o.provider?.toLowerCase().includes(q) ||
      o.desc?.toLowerCase().includes(q) ||
      o.topic?.toLowerCase().includes(q)
    );
  });

  const isOnline = !error;

  return (
    <>
      <PageHeader
        eyebrow="Live Board"
        title={<>Funding & <span>Opportunities</span></>}
        subtitle="Grants, fellowships, internships and competitions open to young Kenyans — AI-curated and updated every 12 hours."
      />

      <section className="sec">
        <div className="sec-in">

          {/* Status + Refresh row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".75rem", marginBottom: "1.5rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".75rem", color: isOnline ? "var(--green)" : "#dc2626", fontFamily: "var(--fm)" }}>
              {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
              {isOnline
                ? `Live · ${opportunities.length} opportunities · Updated every 12h`
                : "Backend offline — start with npm run dev in backend/"}
            </span>
            <button
              onClick={refetch}
              disabled={loading}
              style={{
                display: "flex", alignItems: "center", gap: ".3rem",
                fontSize: ".72rem", fontFamily: "var(--fs)", fontWeight: 600,
                color: "var(--green)", background: "transparent",
                border: "1px solid var(--green)", borderRadius: 6,
                padding: ".3rem .7rem", cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              <RefreshCw size={12} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
              Refresh
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, fontSize: ".85rem", color: "#991B1B", display: "flex", alignItems: "center", gap: ".6rem" }}>
              <WifiOff size={16} />
              <span>
                <strong>Backend not running.</strong> Start it with{" "}
                <code style={{ background: "#FEE2E2", padding: ".1rem .4rem", borderRadius: 4 }}>npm run dev</code>{" "}
                inside the <code style={{ background: "#FEE2E2", padding: ".1rem .4rem", borderRadius: 4 }}>backend/</code> folder, then click Refresh.
              </span>
            </div>
          )}

          {/* Filters */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "2rem" }}>
            <div>
              <div className="s-label" style={{ marginBottom: ".5rem" }}>Type</div>
              <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                {TYPES.map((t) => (
                  <button key={t} className={`f-pill ${type === t ? "on" : ""}`} onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="s-label" style={{ marginBottom: ".5rem" }}>Topic</div>
              <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                {TOPICS.map((t) => (
                  <button key={t} className={`f-pill ${topic === t ? "on" : ""}`} onClick={() => setTopic(t)}>{t}</button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div style={{ position: "relative", maxWidth: 320 }}>
              <Search size={14} style={{ position: "absolute", left: ".65rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search opportunities…"
                style={{ paddingLeft: "2rem", paddingRight: ".75rem", paddingTop: ".45rem", paddingBottom: ".45rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".82rem", fontFamily: "inherit", width: "100%" }}
              />
            </div>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: "1.1rem" }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Opportunities grid */}
          {!loading && filtered.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: "1.1rem" }}>
              {filtered.map((o) => (
                <div key={o.id} className="k-card" style={{ display: "flex", flexDirection: "column" }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: ".75rem", flexWrap: "wrap" }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span className={`k-tag ${TYPE_STYLES[o.type] || "t-grant"}`}>{o.type}</span>
                      <div className="k-card-title" style={{ marginTop: ".5rem" }}>{o.name || o.title}</div>
                      <div style={{ fontSize: ".7rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)", marginTop: ".2rem" }}>
                        {o.provider || o.source}
                      </div>
                    </div>
                    {o.amount && (
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontFamily: "var(--fs)", fontWeight: 800, color: "var(--green)", fontSize: ".9rem" }}>
                          {o.amount}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="k-card-desc" style={{ flex: 1 }}>{o.desc}</div>

                  {/* Topic tag */}
                  <div style={{ marginTop: ".6rem" }}>
                    <span style={{ fontSize: ".65rem", padding: ".15rem .5rem", background: "var(--cd)", color: "var(--muted-foreground)", borderRadius: 4, fontFamily: "var(--fm)", border: "1px solid var(--border)" }}>
                      {o.topic}
                    </span>
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "1rem", gap: ".5rem", flexWrap: "wrap" }}>
                    <DeadlineBadge deadline={o.deadline} />
                    <div style={{ display: "flex", gap: ".4rem" }}>
                      <button
                        className="btn-g"
                        style={{ padding: ".4rem .8rem", fontSize: ".72rem", display: "flex", alignItems: "center", gap: ".3rem" }}
                        title="Set reminder"
                      >
                        <Bell size={14} />
                      </button>
                      <a
                        href={o.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-a"
                        style={{ padding: ".4rem .9rem", fontSize: ".72rem", display: "flex", alignItems: "center", gap: ".3rem", textDecoration: "none" }}
                      >
                        Apply <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted-foreground)" }}>
              <RefreshCw size={40} style={{ margin: "0 auto 1rem", opacity: 0.3, display: "block" }} />
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".5rem" }}>
                No opportunities yet
              </div>
              <div style={{ fontSize: ".85rem", marginBottom: "1.5rem" }}>
                The backend is fetching climate opportunities. Click Refresh to check.
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
