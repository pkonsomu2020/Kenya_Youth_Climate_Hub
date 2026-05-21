"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useNews } from "@/lib/useNews";
import * as Icons from "lucide-react";
import { Globe, RefreshCw, ExternalLink, Wifi, WifiOff } from "lucide-react";



const CATS = ["All", "News", "Climate Insights", "Success Stories", "Events Recap", "Partner Updates"];

const GRADIENT_MAP: Record<string, string> = {
  News: "#059669",
  "Climate Insights": "#047857",
  "Success Stories": "#10B981",
  "Events Recap": "#10B981",
  "Partner Updates": "#059669",
};

function renderIcon(iconName: string, size = 48) {
  const Icon = (Icons as any)[iconName];
  return Icon ? <Icon size={size} strokeWidth={1.5} /> : <Globe size={size} strokeWidth={1.5} />;
}

// Skeleton card shown while loading
export function SkeletonCard() {
  return (
    <div className="k-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ height: 175, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
      <div style={{ padding: ".8rem 1.1rem 1.2rem", display: "flex", flexDirection: "column", gap: ".6rem" }}>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <div style={{ width: 60, height: 20, borderRadius: 6, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
          <div style={{ width: 80, height: 20, borderRadius: 6, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
        </div>
        <div style={{ height: 16, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 16, borderRadius: 4, background: "var(--border)", width: "80%", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 13, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 13, borderRadius: 4, background: "var(--border)", width: "65%", animation: "shimmer 1.5s infinite" }} />
      </div>
    </div>
  );
}

export default function News() {
  const [cat, setCat] = useState("All");
  const { articles, loading, error, refetch } = useNews({ limit: 30, category: cat });

  return (
    <>
      <PageHeader
        eyebrow="News & Stories"
        title={<>Latest from the <span>Hub</span></>}
        subtitle="Live climate news from across Kenya and Africa — AI-filtered for relevance and updated every 3 hours."
      />

      <section className="sec">
        <div className="sec-in">

          {/* Header row: filters + live badge + refresh */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
              {CATS.map((c) => (
                <button key={c} className={`f-pill ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>
                  {c}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              {/* Live / Offline indicator */}
              {error ? (
                <span style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".7rem", color: "#dc2626", fontFamily: "var(--fm)" }}>
                  <WifiOff size={13} /> Backend offline
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".7rem", color: "var(--green)", fontFamily: "var(--fm)" }}>
                  <Wifi size={13} /> Live · Updated every 3h
                </span>
              )}

              {/* Refresh button */}
              <button
                onClick={refetch}
                disabled={loading}
                style={{
                  display: "flex", alignItems: "center", gap: ".3rem",
                  fontSize: ".72rem", fontFamily: "var(--fs)", fontWeight: 600,
                  color: "var(--green)", background: "transparent", border: "1px solid var(--green)",
                  borderRadius: 6, padding: ".3rem .7rem", cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1, transition: "all .2s",
                }}
              >
                <RefreshCw size={12} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
                Refresh
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              padding: "1rem 1.25rem", marginBottom: "1.5rem",
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 10, fontSize: ".85rem", color: "#991B1B",
              display: "flex", alignItems: "center", gap: ".6rem",
            }}>
              <WifiOff size={16} />
              <span>
                <strong>Backend not running.</strong> Start it with <code style={{ background: "#FEE2E2", padding: ".1rem .4rem", borderRadius: 4 }}>npm run dev</code> inside the <code style={{ background: "#FEE2E2", padding: ".1rem .4rem", borderRadius: 4 }}>backend/</code> folder, then click Refresh.
              </span>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.1rem" }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Articles grid */}
          {!loading && articles.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.1rem" }}>
              {articles.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="k-card"
                  style={{ padding: 0, textDecoration: "none", display: "block", cursor: "pointer" }}
                >
                  {/* Card image / color banner */}
                  {article.image_url ? (
                    <div style={{ height: 175, overflow: "hidden", position: "relative" }}>
                      <img
                        src={article.image_url}
                        alt={article.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          // Fallback to gradient if image fails
                          const parent = (e.target as HTMLImageElement).parentElement!;
                          parent.style.background = GRADIENT_MAP[article.category] || "#059669";
                          parent.innerHTML = `<div style="height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.35)">${renderIconHTML(article.icon)}</div>`;
                        }}
                      />
                      {/* Source badge */}
                      <span style={{
                        position: "absolute", bottom: ".5rem", right: ".5rem",
                        background: "rgba(0,0,0,.55)", color: "#fff",
                        fontSize: ".6rem", padding: ".2rem .5rem", borderRadius: 4,
                        fontFamily: "var(--fm)", backdropFilter: "blur(4px)",
                      }}>
                        {article.source}
                      </span>
                    </div>
                  ) : (
                    <div style={{
                      height: 175,
                      background: GRADIENT_MAP[article.category] || article.gradient || "#059669",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "rgba(255,255,255,.35)", position: "relative",
                    }}>
                      {renderIcon(article.icon || "Globe", 48)}
                      <span style={{
                        position: "absolute", bottom: ".5rem", right: ".5rem",
                        background: "rgba(0,0,0,.3)", color: "rgba(255,255,255,.8)",
                        fontSize: ".6rem", padding: ".2rem .5rem", borderRadius: 4,
                        fontFamily: "var(--fm)",
                      }}>
                        {article.source}
                      </span>
                    </div>
                  )}

                  {/* Meta row */}
                  <div style={{ padding: ".8rem 1.1rem 0", display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
                    <span className="k-tag t-news">{article.category}</span>
                    <span style={{ fontSize: ".67rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>
                      {article.date}
                    </span>
                    {article.relevance === "High" && (
                      <span style={{
                        fontSize: ".6rem", padding: ".15rem .45rem",
                        background: "#ECFDF5", color: "#065F46",
                        borderRadius: 4, fontFamily: "var(--fm)", fontWeight: 600,
                      }}>
                        High Relevance
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: ".8rem 1.1rem 1.2rem" }}>
                    <div style={{
                      fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".95rem",
                      lineHeight: 1.3, color: "var(--dark)", marginBottom: ".4rem",
                      display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: ".5rem",
                    }}>
                      <span>{article.title}</span>
                      <ExternalLink size={13} style={{ flexShrink: 0, marginTop: 2, color: "var(--muted-foreground)" }} />
                    </div>
                    <div style={{ fontSize: ".78rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>
                      {article.excerpt}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && articles.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted-foreground)" }}>
              <Globe size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".5rem" }}>
                No articles yet
              </div>
              <div style={{ fontSize: ".85rem", marginBottom: "1.5rem" }}>
                The backend hasn't fetched any news yet. Click Refresh to trigger a fetch.
              </div>
              <button onClick={refetch} className="btn-green" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
                <RefreshCw size={14} /> Fetch News Now
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

// Helper for inline HTML fallback (not used in JSX, just for onError)
function renderIconHTML(_iconName: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
}
