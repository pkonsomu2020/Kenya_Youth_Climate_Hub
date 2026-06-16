"use client";
import { useRef, useEffect, useState } from "react";

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}

function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

export function PageHeader({ eyebrow, title, subtitle }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <header style={{
      background: "var(--section-dark)",
      padding: "8rem 2.5rem 5rem",
      borderBottom: "1px solid rgba(93,186,47,0.15)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, #5dba2f, #047857, transparent)",
      }} />
      {/* Background grid pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "radial-gradient(circle, var(--text-on-dark) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      <div
        ref={ref}
        style={{
          maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <span style={{
          display: "inline-block",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 900,
          fontSize: "11px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#5dba2f",
          marginBottom: "1.25rem",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(15px)",
          transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        }}>
          {eyebrow}
        </span>

        <h1 style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          color: "var(--text-on-dark)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          marginBottom: subtitle ? "1.25rem" : 0,
          maxWidth: 800,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
        }}>
          {title}
        </h1>

        {subtitle && (
          <p style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
            color: "var(--muted-foreground)",
            lineHeight: 1.7,
            maxWidth: 640,
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
