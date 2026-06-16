"use client";

import { useRef, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { successStories } from "@/lib/data/successStories";
import { Trees, ArrowRight } from "lucide-react";
import Link from "next/link";

function useInView(ref: React.RefObject<Element | null>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref]);
  return v;
}

function StoryRow({ story, index }: { story: typeof successStories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "3rem",
        alignItems: "center",
        padding: "3rem",
        background: "var(--card-dark)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`,
      }}
    >
      {/* Photo */}
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", aspectRatio: "1/1", background: story.gradient }}>
        {story.photo ? (
          <img src={story.photo} alt={story.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trees size={64} color="rgba(255,255,255,0.3)" />
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,.6) 0%, transparent 50%)" }} />
        {/* Tag */}
        <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "#5dba2f", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 4 }}>
          {story.tag}
        </span>
      </div>

      {/* Content */}
      <div>
        <div style={{ height: 3, width: 40, background: "#5dba2f", borderRadius: 2, marginBottom: "1.5rem" }} />
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem,3vw,2.2rem)", color: "var(--text-on-dark)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: ".5rem" }}>
          {story.company}
        </h2>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "11px", fontWeight: 700, color: "#5dba2f", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1.25rem" }}>
          Founded by {story.name}
        </div>
        <p style={{ fontSize: "1rem", color: "var(--muted-foreground)", lineHeight: 1.8, marginBottom: "2rem" }}>
          {story.fullText}
        </p>
        <Link
          href={`/success-stories/${story.id}`}
          style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#5dba2f", textDecoration: "none", borderBottom: "2px solid rgba(93,186,47,.3)", paddingBottom: "2px", transition: "border-color .2s" }}
          onMouseEnter={e => (e.currentTarget.style.borderBottomColor = "#5dba2f")}
          onMouseLeave={e => (e.currentTarget.style.borderBottomColor = "rgba(93,186,47,.3)")}
        >
          Read Full Story <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessStoriesPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef);

  return (
    <>
      <PageHeader
        eyebrow="YCIC Beneficiaries"
        title={<>Success <span style={{ color: "#5dba2f" }}>Stories</span></>}
        subtitle="Meet the young Kenyan innovators who turned their climate ideas into real impact."
      />

      <section className="py-32 px-6 md:px-16" style={{ background: "var(--section-dark)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            ref={headerRef}
            style={{ marginBottom: "4rem", opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}
          >
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dba2f" }}>Impact Stories</span>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--text-on-dark)", letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: "1rem" }}>
              YOUNG KENYANS <span style={{ color: "#5dba2f" }}>LEADING</span><br />CLIMATE ACTION
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {successStories.map((story, idx) => (
              <StoryRow key={story.id} story={story} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
