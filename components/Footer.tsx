"use client";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61581202055325",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/kych_ke/",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/kenya-youth-climate-hub/posts/?feedView=all",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,.05)", fontFamily: "var(--fb)" }}>

      {/* ── 4-column contact row ── */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "4rem 2.5rem 3rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "2.5rem",
      }}>

        {/* Address */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <MapPin size={26} color="#059669" style={{ flexShrink: 0, marginTop: ".15rem" }} />
          <div>
            <div style={{ fontSize: ".95rem", fontWeight: 700, color: "#fff", marginBottom: ".5rem", letterSpacing: ".02em" }}>Address</div>
            <div style={{ fontSize: ".9rem", color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>
              Manga House, Kiambere RD, Upper Hill, Nairobi, Kenya
            </div>
          </div>
        </div>

        {/* Email */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <Mail size={26} color="#059669" style={{ flexShrink: 0, marginTop: ".15rem" }} />
          <div>
            <div style={{ fontSize: ".95rem", fontWeight: 700, color: "#fff", marginBottom: ".5rem", letterSpacing: ".02em" }}>Email</div>
            <a
              href="mailto:info@kenyayouthclimatehub.org"
              style={{ fontSize: ".9rem", color: "#059669", textDecoration: "none", lineHeight: 1.7, display: "block", wordBreak: "break-all" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = ".7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              info@kenyayouthclimatehub.org
            </a>
          </div>
        </div>

        {/* Phone */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <Phone size={26} color="#059669" style={{ flexShrink: 0, marginTop: ".15rem" }} />
          <div>
            <div style={{ fontSize: ".95rem", fontWeight: 700, color: "#fff", marginBottom: ".5rem", letterSpacing: ".02em" }}>Phone</div>
            <a
              href="tel:+254712345678"
              style={{ fontSize: ".9rem", color: "#059669", textDecoration: "none", lineHeight: 1.7, display: "block" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = ".7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              (+254) 0115963306
            </a>
          </div>
        </div>

        {/* Follow Us */}
        <div>
          <div style={{ fontSize: ".95rem", fontWeight: 700, color: "#fff", marginBottom: ".85rem", letterSpacing: ".02em" }}>Follow Us</div>
          <div style={{ display: "flex", gap: ".65rem" }}>
            {socials.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(255,255,255,.07)",
                  border: "1px solid rgba(255,255,255,.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,.55)", textDecoration: "none", transition: "all .2s",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "#059669";
                  el.style.borderColor = "#059669";
                  el.style.color = "#fff";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,.07)";
                  el.style.borderColor = "rgba(255,255,255,.1)";
                  el.style.color = "rgba(255,255,255,.55)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,.07)",
        padding: "1.25rem 2rem",
        textAlign: "center",
        fontSize: ".72rem",
        color: "rgba(255,255,255,.3)",
        wordBreak: "break-word",
      }}>
        © 2026 Kenya Youth Climate Hub. All rights reserved.
      </div>

    </footer>
  );
}
