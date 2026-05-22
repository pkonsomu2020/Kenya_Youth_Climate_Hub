"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from "react";
import { X, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/about",         label: "About"         },
  { to: "/e-library",     label: "E-Library"     },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/programs",      label: "Programs"      },
  { to: "/events",        label: "Events"        },
  { to: "/news",          label: "News"          },
] as const;

export function Nav() {
  const [open, setOpen]       = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showNav, setShowNav]   = useState(true);
  const path     = usePathname() || '';
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setShowNav(!(y > lastY && y > 80));
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("nav-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("nav-open");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  /* ── Panel style: full-screen dark overlay ── */
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed", inset: 0, zIndex: 400,
        background: "#0d1a0f",
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform .45s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }
    : {
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 400,
        width: 480, maxWidth: "90vw",
        background: "#0d1a0f",
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform .45s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      };

  return (
    <>
      {/* ── Pill navbar ─────────────────────────────────── */}
      <nav className={`knav-pill ${showNav ? "" : "knav-hidden"}`}>
        <div className="n-left">
          <Link href="/" className="n-logo-pill">
            <img src="/kych_logo.png" alt="KYCH Logo" style={{ height: "80px", width: "auto" }} />
          </Link>
        </div>

        <ul className="n-links-pill">
          {links.map((l) => {
            const active = path === l.to || path.startsWith(l.to + "/");
            return (
              <li key={l.to}>
                <Link href={l.to as any} className={`n-link-item ${active ? "active" : ""}`}>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="n-right" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ThemeToggle />
          <button
            className="n-burger-pill"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} color="#fff" />
          </button>
        </div>
      </nav>

      {/* ── Backdrop ────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 399,
          background: open ? "rgba(0,0,0,.7)" : "rgba(0,0,0,0)",
          pointerEvents: open ? "all" : "none",
          transition: "background .4s ease",
        }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── Full-screen dark panel ───────────────────────── */}
      <div ref={panelRef} style={panelStyle}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.5rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          flexShrink: 0,
        }}>
          {/* Logo + brand */}
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <img src="/kych_logo.png" alt="KYCH" style={{ height: 44, width: "auto" }} />
            <span style={{
              fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1rem",
              color: "#fff", letterSpacing: "-.01em",
            }}>
              KYCH
            </span>
          </div>

          {/* Theme toggle + close */}
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <ThemeToggle />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.1)",
                cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#fff", transition: "all .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.15)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.08)")}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Big nav links ── */}
        <nav style={{ flex: 1, padding: "2rem 2rem 1rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: ".25rem", overflowY: "auto" }}>
          {links.map((l, i) => {
            const active = path === l.to || path.startsWith(l.to + "/");
            return (
              <Link
                key={l.to}
                href={l.to as any}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  fontFamily: "var(--fs)",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 6vw, 3rem)",
                  lineHeight: 1.15,
                  color: active ? "#059669" : "rgba(255,255,255,.92)",
                  textDecoration: "none",
                  padding: ".5rem 0",
                  borderBottom: "1px solid rgba(255,255,255,.06)",
                  transition: "color .2s, padding-left .2s",
                  animationDelay: open ? `${i * 0.05}s` : "0s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "#059669";
                  (e.currentTarget as HTMLElement).style.paddingLeft = "8px";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = active ? "#059669" : "rgba(255,255,255,.92)";
                  (e.currentTarget as HTMLElement).style.paddingLeft = "0";
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom padding ── */}
        <div style={{ padding: "1.5rem 2rem 2rem", flexShrink: 0 }} />
      </div>
    </>
  );
}
