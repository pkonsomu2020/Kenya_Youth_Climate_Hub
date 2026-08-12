"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { successStories } from "@/lib/data/successStories";
import { NK, nkShadow, nkCard } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { CTABand } from "@/components/CTABand";

function useInView(ref: React.RefObject<Element | null>, threshold = 0.12) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s` }}>
      {children}
    </div>
  );
}

// Normalize the data file's inconsistent tag casing ("Renewal energy" typo,
// "Renewable Energy") into one canonical label for filtering/display.
function normalizeTag(tag: string): string {
  if (/renew/i.test(tag)) return "Renewable Energy";
  return tag;
}

const FILTERS = ["All", "Renewable Energy", "WASH"];

const BADGE_COLORS = [
  { bg: NK.green, fg: NK.navyDeep },
  { bg: NK.ink, fg: NK.green },
];

function StoryCard({ story, index }: { story: typeof successStories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  const badge = normalizeTag(story.tag) === "WASH" ? { bg: NK.greenAlt, fg: NK.white } : BADGE_COLORS[index % 2];

  return (
    <Link
      ref={ref as any}
      href={`/success-stories/${story.id}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...nkCard, display: "flex", flexDirection: "column", textDecoration: "none", padding: "1.75rem",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity .5s ease ${index * 0.08}s, transform .5s ease ${index * 0.08}s, box-shadow .2s, translate .2s`,
        boxShadow: hov ? nkShadow(NK.green) : nkShadow(NK.ink),
        translate: hov ? "0 -4px" : "0 0",
      }}
    >
      {story.photo && (
        <div style={{ height: 160, overflow: "hidden", border: `2px solid ${NK.ink}`, marginBottom: "1.25rem" }}>
          <img src={story.photo} alt={story.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
        </div>
      )}
      <span style={{
        alignSelf: "flex-start", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
        padding: "5px 9px", background: badge.bg, color: badge.fg, marginBottom: "1rem",
      }}>
        {normalizeTag(story.tag)}
      </span>
      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.3rem", color: NK.ink, marginBottom: ".75rem" }}>{story.company}</div>
      <p style={{ fontSize: ".9rem", color: NK.muted, lineHeight: 1.6, flex: 1, marginBottom: "1.25rem" }}>{story.excerpt}</p>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", paddingTop: "1rem", borderTop: "1px solid rgba(16,28,51,0.1)" }}>
        <div style={{ width: 38, height: 38, background: NK.ink, color: NK.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".8rem", flexShrink: 0 }}>
          {story.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: NK.mutedLabel, textTransform: "uppercase", letterSpacing: "0.1em" }}>Founder</div>
          <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".9rem", color: NK.ink }}>{story.name}</div>
        </div>
      </div>
    </Link>
  );
}

export default function SuccessStoriesPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? successStories : successStories.filter((s) => normalizeTag(s.tag) === filter);

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
            Featured
          </span>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(44px,5.6vw,86px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.02, margin: 0 }}>
            Climate startup <span style={{ color: NK.green }}>stories.</span>
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.25rem", color: NK.muted, lineHeight: 1.7, marginTop: "1.5rem", maxWidth: 660 }}>
            Founders backed through the Youth Climate Innovation Challenge, turning Kenyan climate challenges into working businesses.
          </p>
        </div>
      </section>

      {/* ── FILTER + GRID ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "1.5rem 2.5rem 5.5rem" }}>
          <Reveal>
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "9px 18px", fontFamily: "var(--fs)", fontWeight: 600, fontSize: 13,
                      border: `2px solid ${active ? NK.green : NK.ink}`,
                      background: active ? NK.green : "transparent",
                      color: active ? NK.navyDeep : NK.ink,
                      cursor: "pointer", transition: "all .2s",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="nk-grid-3">
            {filtered.map((s, i) => <StoryCard key={s.id} story={s} index={i} />)}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: NK.muted, fontFamily: "var(--fb)" }}>
              No stories in this category yet.
            </div>
          )}
        </div>
      </section>

      <CTABand title="Your solution could be next." buttonLabel="Apply to the challenge →" href="/opportunities" />
    </>
  );
}
