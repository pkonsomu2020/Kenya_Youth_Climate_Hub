"use client";
import Link from "next/link";
import { useState } from "react";
import { NK } from "@/lib/nkTheme";

const socials = [
  {
    label: "FB",
    href: "https://www.facebook.com/profile.php?id=61581202055325",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "IG",
    href: "https://www.instagram.com/kych_ke/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LI",
    href: "https://www.linkedin.com/company/kenya-youth-climate-hub/posts/?feedView=all",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Events", href: "/events" },
  { label: "Success Stories", href: "/success-stories" },
];

const platformLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "E-Library", href: "/e-library" },
  { label: "News", href: "/news" },
  { label: "Powered by Afosi", href: "https://afosi.org", external: true },
];

const colH: React.CSSProperties = {
  fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12,
  letterSpacing: "0.15em", textTransform: "uppercase", color: NK.green, marginBottom: "1.25rem",
};
const colLink: React.CSSProperties = {
  color: NK.linkMuted, fontFamily: "var(--fb)", fontSize: 13.5, textDecoration: "none", transition: "color .2s",
};

export function Footer() {
  return (
    <footer style={{ background: NK.navyDeep, color: "#fff", position: "relative", overflow: "hidden" }}>
      {/* Decorative glow */}
      <div style={{
        position: "absolute", top: -120, right: -120, width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(76,184,44,0.12), transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0, opacity: 0.5,
        backgroundImage: `radial-gradient(${NK.green}14 1.2px, transparent 1.6px)`,
        backgroundSize: "26px 26px", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "80px 40px 40px", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
          gap: "48px",
        }} className="nk-footer-grid">
          {/* Brand */}
          <div>
            <img src="/kych_logo.png" alt="Kenya Youth Climate Hub" style={{ height: 96, width: "auto", marginBottom: "1.25rem" }} />
            <p style={{ color: NK.mutedOnDark, fontFamily: "var(--fb)", fontSize: 13, lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 320 }}>
              Empowering youth, one climate solution at a time. Kenya's national digital platform for the youth climate movement.
            </p>
            <div style={{ display: "flex", gap: ".5rem" }}>
              {socials.map((s) => (
                <SocialIcon key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={colH}>Quick Links</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".9rem" }}>
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href} label={l.label} />
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 style={colH}>Platform</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".9rem" }}>
              {platformLinks.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" style={colLink}
                      onMouseEnter={(e) => (e.currentTarget.style.color = NK.green)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = NK.linkMuted)}>
                      {l.label}
                    </a>
                  ) : (
                    <FooterLink href={l.href} label={l.label} />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={colH}>Contact Us</h4>
            <div style={{ color: NK.linkMuted, fontFamily: "var(--fb)", fontSize: 13, lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Manga House, Kiambere RD<br />Upper Hill, Nairobi, Kenya
            </div>
            <a href="mailto:info@kenyayouthclimatehub.org" style={{ ...colLink, display: "block", marginBottom: ".6rem" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = NK.green)}
              onMouseLeave={(e) => (e.currentTarget.style.color = NK.linkMuted)}>
              info@kenyayouthclimatehub.org
            </a>
            <a href="tel:+254115963306" style={{ ...colLink, display: "block", marginBottom: "1.5rem" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = NK.green)}
              onMouseLeave={(e) => (e.currentTarget.style.color = NK.linkMuted)}>
              (+254) 0115963306
            </a>
            <GetStartedButton />
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${NK.dividerNavy}`, marginTop: "3.5rem", paddingTop: "1.6rem",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap",
        }}>
          <p style={{ color: NK.faint, fontFamily: "var(--fb)", fontSize: 11, letterSpacing: "0.05em", margin: 0 }}>
            © 2026 Kenya Youth Climate Hub. All rights reserved.
          </p>
          <p style={{ color: "#fff", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
            Youth-led climate action.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ label, href, icon }: { label: string; href: string; icon: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center",
        background: hov ? NK.green : "rgba(255,255,255,0.06)",
        color: hov ? NK.navyDeep : NK.green,
        border: `1px solid ${hov ? NK.green : "rgba(255,255,255,0.12)"}`,
        transition: "all .2s", textDecoration: "none",
      }}
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href as any} style={colLink}
      onMouseEnter={(e) => (e.currentTarget.style.color = NK.green)}
      onMouseLeave={(e) => (e.currentTarget.style.color = NK.linkMuted)}>
      {label}
    </Link>
  );
}

function GetStartedButton() {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href="/opportunities"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: ".5rem",
        background: hov ? "#fff" : NK.green,
        color: NK.navyDeep,
        padding: ".7rem 1.25rem",
        fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13,
        textDecoration: "none", transition: "background .2s",
      }}
    >
      Get started →
    </Link>
  );
}
