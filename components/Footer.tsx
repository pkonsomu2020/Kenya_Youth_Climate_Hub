"use client";
import Link from "next/link";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { useState } from "react";

const socials = [
  {
    label: "FB",
    href: "https://www.facebook.com/profile.php?id=61581202055325",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "IG",
    href: "https://www.instagram.com/kych_ke/",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Events", href: "/events" },
  { label: "Success Stories", href: "/success-stories" },
];

const resourceLinks = [
  { label: "E-Library", href: "/e-library" },
  { label: "News & Updates", href: "/news" },
  { label: "Climate Reports", href: "/opportunities" },
  { label: "Privacy Policy", href: "#" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <footer style={{ background: "#0f172a", color: "#fff" }}>

      {/* ── Big CTA Strip ── */}
      <div
        style={{ padding: "5rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          style={{
            maxWidth: 1280, margin: "0 auto",
            display: "flex", flexDirection: "row",
            alignItems: "flex-end", justifyContent: "space-between",
            gap: "3rem", flexWrap: "wrap",
          }}
        >
          <div>
            <span
              style={{
                display: "block", marginBottom: "1rem",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.25em", textTransform: "uppercase",
                color: "#5dba2f",
              }}
            >
              Stay in the Loop
            </span>
            <h2
              style={{
                fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                fontSize: "clamp(36px, 5.5vw, 72px)",
                color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.05,
              }}
            >
              READY TO<br />JOIN THE{" "}
              <span style={{ color: "#5dba2f" }}>MOVEMENT?</span>
            </h2>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif", fontSize: "15px",
                color: "#64748b", marginTop: "1rem", maxWidth: "440px", lineHeight: "1.7",
              }}
            >
              Weekly climate opportunities, news, challenge updates — straight to your inbox.
            </p>
          </div>
          <Link
            href="/opportunities"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              background: "#5dba2f", color: "#fff",
              padding: "18px 36px", borderRadius: "4px",
              fontFamily: "Montserrat, sans-serif", fontWeight: 800,
              fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase",
              textDecoration: "none", flexShrink: 0, transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#4aa324"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5dba2f"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Get Started Today <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── 4-column grid ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "5rem 2.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "#5dba2f", display: "flex", alignItems: "center",
                  justifyContent: "center", fontFamily: "Montserrat, sans-serif",
                  fontWeight: 900, fontSize: "13px", color: "#fff",
                }}
              >
                KY
              </div>
              <img src="/kych_logo.png" alt="KYCH Logo" style={{ height: 36, width: "auto" }} />
            </div>
            <p
              style={{
                color: "#64748b", fontFamily: "Montserrat, sans-serif",
                fontSize: "13px", lineHeight: "1.7", marginBottom: "1.25rem",
              }}
            >
              Empowering youth, one climate solution at a time. Kenya's national digital platform for the youth climate movement.
            </p>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 38, height: 38, borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#5dba2f", textDecoration: "none", transition: "all 0.2s",
                    fontFamily: "Montserrat, sans-serif", fontSize: "9px", fontWeight: 700,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#5dba2f"; el.style.color = "#fff";
                    el.style.borderColor = "#5dba2f"; el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "transparent"; el.style.color = "#5dba2f";
                    el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.transform = "translateY(0)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase",
                color: "#fff", marginBottom: "1.5rem",
              }}
            >
              Contact Us
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <li style={{ display: "flex", gap: "0.75rem" }}>
                <MapPin size={14} style={{ color: "#5dba2f", flexShrink: 0, marginTop: 3 }} />
                <span style={{ color: "#64748b", fontFamily: "Montserrat, sans-serif", fontSize: "13px", lineHeight: "1.6" }}>
                  Manga House, Kiambere RD,<br />Upper Hill, Nairobi, Kenya
                </span>
              </li>
              <li style={{ display: "flex", gap: "0.75rem" }}>
                <Mail size={14} style={{ color: "#5dba2f", flexShrink: 0, marginTop: 2 }} />
                <a
                  href="mailto:info@kenyayouthclimatehub.org"
                  style={{ color: "#64748b", fontFamily: "Montserrat, sans-serif", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#5dba2f"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
                >
                  info@kenyayouthclimatehub.org
                </a>
              </li>
              <li style={{ display: "flex", gap: "0.75rem" }}>
                <Phone size={14} style={{ color: "#5dba2f", flexShrink: 0, marginTop: 2 }} />
                <a
                  href="tel:+254115963306"
                  style={{ color: "#64748b", fontFamily: "Montserrat, sans-serif", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#5dba2f"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
                >
                  (+254) 0115963306
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase",
                color: "#fff", marginBottom: "1.5rem",
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    style={{ color: "#64748b", fontFamily: "Montserrat, sans-serif", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#5dba2f"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              style={{
                fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase",
                color: "#fff", marginBottom: "0.75rem",
              }}
            >
              Newsletter
            </h4>
            <p style={{ color: "#64748b", fontFamily: "Montserrat, sans-serif", fontSize: "13px", lineHeight: "1.6", marginBottom: "1rem" }}>
              Weekly climate opportunities, news, and challenge updates straight to your inbox.
            </p>
            {submitted ? (
              <div
                style={{ padding: "1rem 1.25rem", borderRadius: 6, background: "rgba(93,186,47,0.1)", border: "1px solid rgba(93,186,47,0.3)" }}
              >
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "13px", fontWeight: 700, color: "#5dba2f", margin: 0 }}>
                  You're subscribed! ✓
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 4,
                    background: "#1e2536", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "Montserrat, sans-serif", fontSize: "13px",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "100%", padding: "12px", borderRadius: 4,
                    background: "#5dba2f", color: "#fff", border: "none",
                    fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                    fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase",
                    cursor: "pointer", transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#4aa324"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5dba2f"; }}
                >
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "1.5rem 2.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1280, margin: "0 auto",
            display: "flex", flexDirection: "row",
            justifyContent: "space-between", alignItems: "center",
            gap: "1rem", flexWrap: "wrap",
          }}
        >
          <p
            style={{
              color: "#334155", fontFamily: "Montserrat, sans-serif",
              fontSize: "11px", letterSpacing: "0.05em", margin: 0,
            }}
          >
            © 2026 Kenya Youth Climate Hub. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  color: "#334155", fontFamily: "Montserrat, sans-serif",
                  fontSize: "11px", letterSpacing: "0.05em", textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#334155"; }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
