"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { X, Menu } from "lucide-react";
import { NK } from "@/lib/nkTheme";

const links = [
  { to: "/about",           label: "About"           },
  { to: "/e-library",       label: "E-Library"       },
  { to: "/opportunities",   label: "Opportunities"   },
  { to: "/programs",        label: "Programs"        },
  { to: "/events",          label: "Events"          },
  { to: "/news",            label: "News"            },
  { to: "/success-stories", label: "Success Stories" },
] as const;

function isActive(path: string, to: string) {
  return path === to || path.startsWith(to + "/");
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [ctaHov, setCtaHov] = useState(false);
  const [burgerHov, setBurgerHov] = useState(false);
  const path = usePathname() || "";
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? Math.min(1, y / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 300,
          background: "rgba(246,248,244,0.9)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(16,28,51,0.12)",
        }}
      >
        {/* Scroll progress bar */}
        <div style={{ height: 4, background: "rgba(76,184,44,0.18)" }}>
          <div style={{ height: "100%", width: `${scrollPct}%`, background: NK.green, transition: "width 0.1s linear" }} />
        </div>

        <div style={{
          maxWidth: 1320, margin: "0 auto", padding: "14px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem",
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center" }}>
            <img src="/kych_logo.png" alt="Kenya Youth Climate Hub" style={{ height: 76, width: "auto" }} />
          </Link>

          {/* Desktop links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "1.75rem" }} className="nk-nav-links">
            <Link
              href="/"
              style={{
                fontFamily: "var(--fs)", fontWeight: 600, fontSize: 14, textDecoration: "none",
                color: isActive(path, "/") && path === "/" ? NK.green : NK.ink,
              }}
            >
              Home
            </Link>
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to as any}
                style={{
                  fontFamily: "var(--fs)", fontWeight: 600, fontSize: 14, textDecoration: "none",
                  color: isActive(path, l.to) ? NK.green : NK.ink,
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              href="/opportunities"
              className="nk-nav-cta"
              onMouseEnter={() => setCtaHov(true)}
              onMouseLeave={() => setCtaHov(false)}
              style={{
                fontFamily: "var(--fs)", fontWeight: 700, fontSize: 14, textDecoration: "none",
                padding: "11px 20px",
                background: ctaHov ? NK.green : NK.ink,
                color: ctaHov ? NK.navyDeep : "#F6F8F4",
                transition: "background .2s, color .2s",
                whiteSpace: "nowrap",
              }}
            >
              Find funding
            </Link>

            <button
              className="nk-nav-burger"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              onMouseEnter={() => setBurgerHov(true)}
              onMouseLeave={() => setBurgerHov(false)}
              style={{
                display: "none",
                width: 44, height: 44,
                border: `2px solid ${NK.ink}`,
                background: burgerHov ? NK.green : "transparent",
                borderColor: burgerHov ? NK.green : NK.ink,
                cursor: "pointer",
                flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                transition: "background .2s, border-color .2s",
              }}
            >
              <span style={{ width: 20, height: 2, background: NK.ink }} />
              <span style={{ width: 20, height: 2, background: NK.ink }} />
              <span style={{ width: 12, height: 2, background: NK.green }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 399,
          background: open ? "rgba(16,28,51,0.4)" : "rgba(16,28,51,0)",
          pointerEvents: open ? "all" : "none",
          transition: "background .3s ease",
        }}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        ref={panelRef}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 400,
          width: 380, maxWidth: "90vw",
          background: NK.bg, borderLeft: `2px solid ${NK.ink}`,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .4s cubic-bezier(0.4,0,0.2,1)",
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem" }}>
          <img src="/kych_logo.png" alt="Kenya Youth Climate Hub" style={{ height: 52, width: "auto" }} />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{ width: 40, height: 40, border: `2px solid ${NK.ink}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: NK.ink }}
          >
            <X size={18} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: "0.5rem 1.5rem", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          {[{ to: "/", label: "Home" }, ...links].map((l, i) => {
            const active = l.to === "/" ? path === "/" : isActive(path, l.to);
            return (
              <Link
                key={l.to}
                href={l.to as any}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(16,28,51,0.1)",
                  fontFamily: "var(--fs)", fontWeight: 700, fontSize: 19,
                  color: active ? NK.green : NK.ink,
                  textDecoration: "none",
                  animation: open ? `slide-in-up 0.3s ease ${i * 0.04}s both` : "none",
                }}
              >
                {l.label}
                <span style={{ width: 18, height: 2, background: active ? NK.green : "rgba(16,28,51,0.25)" }} />
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid rgba(16,28,51,0.1)" }}>
          <span style={{ fontFamily: "var(--fm)", fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: NK.muted }}>
            Youth-led climate action
          </span>
        </div>
      </div>
    </>
  );
}
