"use client";

import { useState, useRef, useEffect } from "react";
import { useNews } from "@/lib/useNews";
import * as Icons from "lucide-react";
import { Globe, ArrowRight } from "lucide-react";
import { NK, nkShadow, nkCard, nkBadgeForKey } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { CTABand } from "@/components/CTABand";

const CATS = ["All", "News", "Climate Insights", "Success Stories", "Events Recap", "Partner Updates"];

function useInView(ref: React.RefObject<Element | null>, threshold = 0.1) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref, threshold]);
  return v;
}

function renderIcon(iconName: string, size = 40) {
  const Icon = (Icons as any)[iconName];
  return Icon ? <Icon size={size} strokeWidth={1.5} /> : <Globe size={size} strokeWidth={1.5} />;
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

function NewsCard({ article, index }: { article: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  const badge = nkBadgeForKey(article.category || "News");

  return (
    <a
      ref={ref as any}
      href={article.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...nkCard, display: "flex", flexDirection: "column", textDecoration: "none",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity .5s ease ${index * 0.06}s, transform .5s ease ${index * 0.06}s, box-shadow .2s, translate .2s`,
        boxShadow: hov ? nkShadow(NK.green) : nkShadow(NK.ink),
        translate: hov ? "0 -4px" : "0 0",
      }}
    >
      <div style={{ height: 170, overflow: "hidden", borderBottom: `2px solid ${NK.ink}`, position: "relative", background: badge.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {article.image_url ? (
          <img src={article.image_url} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ color: badge.fg, opacity: 0.5 }}>{renderIcon(article.icon || "Globe", 40)}</span>
        )}
        <span style={{ position: "absolute", top: 12, left: 12, fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 9px", background: badge.bg, color: badge.fg }}>
          {article.category}
        </span>
      </div>
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedLabel, marginBottom: ".75rem" }}>{article.date} · {article.source}</div>
        <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem", color: NK.ink, marginBottom: ".6rem", lineHeight: 1.3 }}>{article.title}</div>
        <p style={{ fontSize: ".85rem", color: NK.muted, lineHeight: 1.6, flex: 1, marginBottom: "1.1rem" }}>{article.excerpt}</p>
        <span style={{ alignSelf: "flex-start", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13.5, color: NK.ink, borderBottom: `2px solid ${NK.green}`, paddingBottom: 2 }}>
          Read more →
        </span>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div style={{ ...nkCard, boxShadow: nkShadow(NK.ink) }}>
      <div style={{ height: 170, background: "rgba(16,28,51,0.06)", borderBottom: `2px solid ${NK.ink}` }} />
      <div style={{ padding: "1.5rem" }}>
        <div style={{ height: 10, width: "40%", background: "rgba(16,28,51,0.06)", marginBottom: 12 }} />
        <div style={{ height: 16, background: "rgba(16,28,51,0.08)", marginBottom: 10 }} />
        <div style={{ height: 12, background: "rgba(16,28,51,0.06)" }} />
      </div>
    </div>
  );
}

export default function News() {
  const [cat, setCat] = useState("All");
  const { articles, loading, error, refetch } = useNews({ limit: 30, category: cat });

  return (
    <>
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
            Latest
          </span>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(44px,5.6vw,86px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.02, margin: 0 }}>
            News, events <span style={{ color: NK.green }}>&amp; resources.</span>
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.25rem", color: NK.muted, lineHeight: 1.7, marginTop: "1.5rem", maxWidth: 660 }}>
            Stay informed on the youth climate movement in Kenya, from platform updates to new funding calls.
          </p>
        </div>
      </section>

      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "1.5rem 2.5rem 5.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              {CATS.map((c) => <FilterPill key={c} label={c} active={cat === c} onClick={() => setCat(c)} />)}
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontFamily: "var(--fm)", fontSize: 11, fontWeight: 700, color: error ? "#B91C1C" : NK.greenAlt, padding: "6px 14px", border: `1.5px solid ${error ? "#B91C1C" : NK.green}` }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: error ? "#B91C1C" : NK.green }} />
              {error ? "Offline" : "Live · Every 3h"}
            </span>
          </div>

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
              {articles.map((a, i) => <NewsCard key={a.id} article={a} index={i} />)}
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 2rem", border: `2px solid ${NK.ink}` }}>
              <Globe size={40} color={NK.green} style={{ margin: "0 auto 1rem", display: "block" }} />
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: NK.ink, marginBottom: ".5rem" }}>No articles yet</div>
              <p style={{ color: NK.muted, marginBottom: "1.5rem" }}>Click below to trigger a fresh fetch from our climate RSS feeds.</p>
              <button onClick={refetch} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: "12px 24px", background: NK.green, color: NK.navyDeep, fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
                Fetch News Now <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      <CTABand title="Stay in the loop." buttonLabel="Subscribe →" href="mailto:info@kenyayouthclimatehub.org" external />
    </>
  );
}
