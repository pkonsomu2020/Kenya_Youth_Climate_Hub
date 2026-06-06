"use client";

import { PageHeader } from "@/components/PageHeader";
import { successStories } from "@/lib/data/successStories";
import { notFound } from "next/navigation";
import { Trees, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const story = successStories.find((s) => s.id === id);

  if (!story) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow="Success Story"
        title={story.company}
        subtitle={`By ${story.name}`}
      />

      <section className="sec" style={{ background: "var(--cream)", paddingBottom: "6rem" }}>
        <div className="sec-in" style={{ maxWidth: 900, margin: "0 auto" }}>
          <Link href="/success-stories" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--green)", textDecoration: "none", fontWeight: 700, marginBottom: "2rem", transition: "all 0.3s" }} className="animate-on-scroll">
            <ArrowLeft size={18} /> Back to all stories
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr]" style={{ gap: "2rem", alignItems: "start", marginBottom: "3rem" }}>
            {/* Photo */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "1/1.2", borderRadius: 16, overflow: "hidden", background: story.gradient }}>
              {story.photo ? (
                <img src={story.photo} alt={story.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trees size={80} color="rgba(255,255,255,0.3)" />
                </div>
              )}
              <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--green)", color: "#fff", padding: "0.5rem 1rem", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                {story.tag}
              </span>
            </div>

            {/* Content */}
            <div>
              <h1 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--dark)", marginBottom: "0.5rem", lineHeight: 1.1 }}>
                {story.company}
              </h1>
              <div style={{ fontSize: "0.95rem", color: "var(--green)", fontFamily: "var(--fm)", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "0.02em" }}>
                FOUNDED BY <strong>{story.name.toUpperCase()}</strong>
              </div>

              <p style={{ color: "var(--muted-foreground)", fontSize: "1.05rem", lineHeight: 1.8, margin: 0 }}>
                {story.fullText}
              </p>
            </div>
          </div>

          {/* Related Stories */}
          <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.5rem", color: "var(--dark)", marginBottom: "2rem" }}>
              Other Success Stories
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {successStories.filter((s) => s.id !== id).map((s) => (
                <Link
                  key={s.id}
                  href={`/success-stories/${s.id}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "white",
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px rgba(5, 150, 105, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ height: 200, background: s.gradient, overflow: "hidden" }}>
                    {s.photo ? (
                      <img src={s.photo} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
                    ) : null}
                  </div>
                  <div style={{ padding: "1.2rem" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--green)", fontWeight: 700, marginBottom: "0.4rem", letterSpacing: "0.05em" }}>
                      {s.tag.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1rem", color: "var(--dark)", marginBottom: "0.5rem", lineHeight: 1.2 }}>
                      {s.company}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "0.8rem" }}>
                      By {s.name}
                    </div>
                    <div style={{ color: "var(--green)", fontWeight: 700, fontSize: "0.9rem" }}>
                      Read story →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
