"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useNews } from "@/lib/useNews";
import * as Icons from "lucide-react";
import { Globe, ExternalLink, ArrowRight } from "lucide-react";

const CATS = ["All", "News", "Climate Insights", "Success Stories", "Events Recap", "Partner Updates"];

const GRADIENT_MAP: Record<string, string> = {
  News: "#059669",
  "Climate Insights": "#047857",
  "Success Stories": "#10B981",
  "Events Recap": "#10B981",
  "Partner Updates": "#059669",
};

function renderIcon(iconName: string, size = 40) {
  const Icon = (Icons as any)[iconName];
  return Icon ? <Icon size={size} strokeWidth={1.5} /> : <Globe size={size} strokeWidth={1.5} />;
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

function NewsCard({ article, index }: { article: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);

  return (
    <a
      ref={ref as any}
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: "none", display: "flex", flexDirection: "column",
        background: "var(--card-dark)",
        border: `1px solid ${hov ? "#5dba2f" : "var(--border)"}`,
        borderRadius: 16, overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s, border-color 0.25s ease, box-shadow 0.25s ease`,
        boxShadow: hov ? "0 20px 40px -10px rgba(93,186,47,0.2)" : "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Image / gradient banner */}
      <div style={{ height: 200, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease", transform: hov ? "scale(1.05)" : "scale(1)" }}
            onError={(e) => {
              const p = (e.target as HTMLImageElement).parentElement!;
              p.style.background = GRADIENT_MAP[article.category] || "#059669";
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: GRADIENT_MAP[article.category] || "#059669", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.3)" }}>
            {renderIcon(article.icon || "Globe", 44)}
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,.7) 0%, transparent 50%)" }} />
        {/* Category badge */}
        <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "#5dba2f", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 4 }}>
          {article.category}
        </span>
        {/* Source badge */}
        <span style={{ position: "absolute", bottom: ".75rem", right: ".75rem", background: "rgba(0,0,0,.55)", color: "#fff", fontSize: ".6rem", padding: ".2rem .55rem", borderRadius: 4, fontFamily: "Montserrat, sans-serif", backdropFilter: "blur(4px)" }}>
          {article.source}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: ".7rem", color: "var(--muted-foreground)", fontFamily: "Montserrat, sans-serif", marginBottom: ".75rem" }}>{article.date}</div>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: ".95rem", lineHeight: 1.4, color: "var(--text-on-dark)", marginBottom: ".6rem", flex: 1 }}>
          {article.title}
        </div>
        <div style={{ fontSize: ".78rem", color: "var(--muted-foreground)", lineHeight: 1.65, marginBottom: "1.25rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.excerpt}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".4rem", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "0.08em", color: hov ? "#5dba2f" : "var(--muted-foreground)", transition: "color .2s", textTransform: "uppercase" }}>
          Read Article <ExternalLink size={12} />
        </div>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "var(--card-dark)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
      <div style={{ height: 200, background: "rgba(255,255,255,0.05)", animation: "shimmer 1.5s infinite" }} />
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
        <div style={{ height: 12, borderRadius: 4, background: "rgba(255,255,255,.06)", width: "40%", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 16, borderRadius: 4, background: "rgba(255,255,255,.06)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 16, borderRadius: 4, background: "rgba(255,255,255,.06)", width: "75%", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 12, borderRadius: 4, background: "rgba(255,255,255,.06)", animation: "shimmer 1.5s infinite" }} />
      </div>
    </div>
  );
}

export default function News() {
  const [cat, setCat] = useState("All");
  const { articles, loading, error, refetch } = useNews({ limit: 30, category: cat });
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef);

  return (
    <>
      <PageHeader
        eyebrow="News & Stories"
        title={<>Latest from the <span style={{ color: "#5dba2f" }}>Hub</span></>}
        subtitle="Live climate news from across Kenya and Africa — AI-filtered for relevance and updated every 3 hours."
      />

      <section className="py-20 px-6 md:px-16" style={{ background: "var(--section-dark)", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Filter bar */}
          <div
            ref={headerRef}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem", opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  style={{
                    padding: ".4rem .9rem", borderRadius: 99, fontSize: ".72rem",
                    fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer",
                    border: "1px solid", transition: "all .2s",
                    borderColor: cat === c ? "#5dba2f" : "var(--border)",
                    background: cat === c ? "#5dba2f" : "transparent",
                    color: cat === c ? "#fff" : "var(--muted-foreground)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: "11px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: error ? "#dc2626" : "#5dba2f", background: error ? "rgba(220,38,38,.1)" : "rgba(93,186,47,.1)", padding: ".35rem .85rem", borderRadius: 99, border: `1px solid ${error ? "rgba(220,38,38,.2)" : "rgba(93,186,47,.2)"}` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: error ? "#dc2626" : "#5dba2f", animation: error ? "none" : "pulse-glow 2s infinite" }} />
                {error ? "Offline" : "Live · Every 3h"}
              </span>
            </div>
          </div>

          {/* Grid */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((a, i) => <NewsCard key={a.id} article={a} index={i} />)}
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
              <Globe size={48} color="rgba(93,186,47,.3)" style={{ margin: "0 auto 1.25rem", display: "block" }} />
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "var(--text-on-dark)", marginBottom: ".5rem" }}>No articles yet</div>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>Click below to trigger a fresh fetch from our climate RSS feeds.</p>
              <button onClick={refetch} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".85rem 1.75rem", borderRadius: 10, background: "#5dba2f", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: ".85rem", border: "none", cursor: "pointer" }}>
                Fetch News Now <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
