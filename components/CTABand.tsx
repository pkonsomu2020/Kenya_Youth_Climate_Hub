"use client";

import Link from "next/link";
import { useState } from "react";
import { NK } from "@/lib/nkTheme";

interface Props {
  title: string;
  buttonLabel: string;
  href: string;
  external?: boolean;
}

/** Full-bleed green CTA banner — reused at the bottom of every redesigned page. */
export function CTABand({ title, buttonLabel, href, external }: Props) {
  const [hov, setHov] = useState(false);

  const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    background: hov ? NK.bg : NK.navyDeep,
    color: hov ? NK.navyDeep : "#F6F8F4",
    padding: "22px 44px",
    fontFamily: "var(--fs)",
    fontWeight: 700,
    fontSize: "18px",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    transition: "background .2s, color .2s",
    flexShrink: 0,
  };

  return (
    <section style={{ background: NK.green, color: NK.navyDeep }}>
      <div
        style={{
          maxWidth: 1320, margin: "0 auto", padding: "100px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "2.5rem", flexWrap: "wrap",
        }}
      >
        <h2 style={{
          fontFamily: "var(--fs)", fontWeight: 700,
          fontSize: "clamp(40px, 5vw, 74px)", textTransform: "uppercase",
          letterSpacing: "-0.02em", lineHeight: 1.05, maxWidth: 720, margin: 0,
        }}>
          {title}
        </h2>
        {external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" style={buttonStyle} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {buttonLabel}
          </a>
        ) : (
          <Link href={href as any} style={buttonStyle} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {buttonLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
