"use client";

import { PageHeader } from "@/components/PageHeader";
import { successStories } from "@/lib/data/successStories";
import { Trees } from "lucide-react";
import { useEffect } from "react";

export default function SuccessStoriesPage() {
  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <PageHeader
        eyebrow="YCIC Beneficiaries"
        title={<>Success <span>Stories</span></>}
        subtitle="Meet the young Kenyan innovators who turned their climate ideas into impact with the Youth Climate Innovation Challenge."
      />

      <section className="sec" style={{ background: "var(--cream)", paddingBottom: "6rem" }}>
        <div className="sec-in" style={{ display: "flex", flexDirection: "column", gap: "3.5rem", maxWidth: 1000, margin: "0 auto" }}>
          
          {successStories.map((story, idx) => (
            <div 
              key={story.id} 
              className={`animate-on-scroll stagger-${(idx % 3) + 1} grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-6 md:gap-10 bg-white p-6 md:p-8 rounded-2xl items-center`}
              style={{ 
                border: "1px solid var(--border)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              }}
            >
              {/* Photo Side */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "1/1.1", borderRadius: 12, overflow: "hidden", background: story.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {story.photo ? (
                  <img src={story.photo} alt={story.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                ) : (
                  <Trees size={64} color="rgba(255,255,255,0.4)" />
                )}
                <span className="k-tag" style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--green)", color: "#fff", padding: "0.4rem 0.8rem", fontSize: "0.7rem" }}>
                  {story.tag}
                </span>
              </div>

              {/* Content Side */}
              <div>
                <h2 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.8rem", color: "var(--dark)", marginBottom: "0.2rem", lineHeight: 1.1 }}>
                  {story.company}
                </h2>
                <div style={{ fontSize: "0.9rem", color: "var(--green)", fontFamily: "var(--fm)", fontWeight: 700, marginBottom: "1.2rem", letterSpacing: "0.02em" }}>
                  FOUNDED BY {story.name.toUpperCase()}
                </div>
                
                <p style={{ color: "var(--muted-foreground)", fontSize: "1rem", lineHeight: 1.75, margin: 0 }}>
                  {story.fullText}
                </p>
                
                <div style={{ marginTop: "1.5rem", height: 1, width: 40, background: "var(--border)" }} />
              </div>
            </div>
          ))}

        </div>
      </section>
    </>
  );
}
