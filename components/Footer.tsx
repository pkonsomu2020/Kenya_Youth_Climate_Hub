"use client";
import Link from "next/link";
import { MapPin, Mail, Phone, MessageCircle, Globe, Share2, Camera } from "lucide-react";

const socials = [
  { icon: Globe,         href: "#", label: "Facebook"  },
  { icon: MessageCircle, href: "#", label: "Twitter"   },
  { icon: Camera,        href: "#", label: "Instagram" },
  { icon: Share2,        href: "#", label: "LinkedIn"  },
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
            {socials.map(({ icon: Icon, href, label }) => (
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
                <Icon size={19} />
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
