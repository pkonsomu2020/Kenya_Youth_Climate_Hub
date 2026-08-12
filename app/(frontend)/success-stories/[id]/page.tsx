"use client";

import { successStories } from "@/lib/data/successStories";
import { notFound } from "next/navigation";
import { Trees, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { NK, nkShadow, nkCard } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { CTABand } from "@/components/CTABand";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

function normalizeTag(tag: string): string {
  if (/renew/i.test(tag)) return "Renewable Energy";
  return tag;
}

function RelatedCard({ story }: { story: typeof successStories[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={`/success-stories/${story.id}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...nkCard, display: "flex", flexDirection: "column", textDecoration: "none",
        boxShadow: hov ? nkShadow(NK.green) : nkShadow(NK.ink),
        translate: hov ? "0 -4px" : "0 0",
        transition: "box-shadow .2s, translate .2s",
      }}
    >
      {story.photo && (
        <div style={{ height: 180, overflow: "hidden", borderBottom: `2px solid ${NK.ink}` }}>
          <img src={story.photo} alt={story.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
        </div>
      )}
      <div style={{ padding: "1.5rem" }}>
        <span style={{ display: "inline-block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 9px", background: NK.green, color: NK.navyDeep, marginBottom: ".75rem" }}>
          {normalizeTag(story.tag)}
        </span>
        <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.05rem", color: NK.ink, marginBottom: ".3rem" }}>{story.company}</div>
        <div style={{ fontSize: ".82rem", color: NK.muted, marginBottom: ".85rem" }}>By {story.name}</div>
        <span style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".85rem", color: NK.ink, borderBottom: `2px solid ${NK.green}`, paddingBottom: 2 }}>
          Read story →
        </span>
      </div>
    </Link>
  );
}

export default function StoryPage({ params }: StoryPageProps) {
  const { id } = use(params);
  const story = successStories.find((s) => s.id === id);

  if (!story) {
    notFound();
  }

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3.5rem 2.5rem 1.75rem" }}>
          <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "1rem" }}>
            Success Story
          </span>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(38px,5vw,72px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}>
            {story.company}
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "1.15rem", color: NK.muted, marginTop: "1rem" }}>
            By {story.name}
          </p>
        </div>
      </section>

      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2.5rem 5.5rem" }}>
          <Link href="/success-stories" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", color: NK.ink, textDecoration: "none", fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".85rem", marginBottom: "2.5rem" }}>
            <ArrowLeft size={16} /> Back to all stories
          </Link>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem", alignItems: "start", marginBottom: "4rem" }} className="nk-2col">
            {/* Photo */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "1/1.2", overflow: "hidden", border: `2px solid ${NK.ink}`, background: story.gradient }}>
              {story.photo ? (
                <img src={story.photo} alt={story.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trees size={80} color="rgba(255,255,255,0.3)" />
                </div>
              )}
              <span style={{ position: "absolute", top: "1rem", left: "1rem", background: NK.green, color: NK.navyDeep, padding: "6px 12px", fontSize: ".7rem", fontWeight: 700, fontFamily: "var(--fm)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {normalizeTag(story.tag)}
              </span>
            </div>

            {/* Content */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: ".85rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 44, height: 44, background: NK.ink, color: NK.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".9rem", flexShrink: 0 }}>
                  {story.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: NK.mutedLabel, textTransform: "uppercase", letterSpacing: "0.1em" }}>Founder</div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".95rem", color: NK.ink }}>{story.name}</div>
                </div>
              </div>
              <p style={{ color: NK.muted, fontSize: "1.05rem", lineHeight: 1.8, margin: 0 }}>
                {story.fullText}
              </p>
            </div>
          </div>

          {/* Related Stories */}
          <div style={{ paddingTop: "2.5rem", borderTop: `2px solid ${NK.ink}` }}>
            <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.6rem", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.01em", marginBottom: "2rem" }}>
              Other Success Stories
            </GrowHeading>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {successStories.filter((s) => s.id !== id).map((s) => <RelatedCard key={s.id} story={s} />)}
            </div>
          </div>
        </div>
      </section>

      <CTABand title="Your solution could be next." buttonLabel="Apply to the challenge →" href="/opportunities" />
    </>
  );
}
