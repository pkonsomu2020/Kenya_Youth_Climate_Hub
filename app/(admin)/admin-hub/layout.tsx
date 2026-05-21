"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, BookOpen, Target, Calendar, Newspaper, LogOut, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logout } from "./login/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./admin-styles.css";

const NAV = [
  { to: "/admin-hub",              label: "Dashboard",     icon: BarChart3, exact: true },
  { to: "/admin-hub/resources",    label: "E-Library",     icon: BookOpen },
  { to: "/admin-hub/opportunities",label: "Opportunities", icon: Target },
  { to: "/admin-hub/events",       label: "Events",        icon: Calendar },
  { to: "/admin-hub/news",         label: "News",          icon: Newspaper },
  { to: "/admin-hub/booking-space",label: "Space Bookings",icon: MapPin },
] as Array<{ to: string; label: string; icon: LucideIcon; exact?: boolean }>;

export default function AdminHubLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  if (path === "/admin-hub/login") {
    return <>{children}</>;
  }

  return (
    <div className="ah-shell">
      <aside className={`ah-side ${open ? "ah-open" : ""}`}>
        <Link href="/admin-hub" className="ah-brand" onClick={() => setOpen(false)}>
          <img src="/kych_logo.png" alt="KYCH Logo" style={{ height: "110px", width: "auto", marginBottom: "4px" }} />
          <div>
            <div className="ah-brand-t">Admin Hub</div>
            <div className="ah-brand-s">KYCH CMS</div>
          </div>
        </Link>
        <nav className="ah-nav">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path === n.to || path.startsWith(n.to + "/");
            const IconComponent = n.icon;
            return (
              <Link key={n.to} href={n.to} onClick={() => setOpen(false)} className={`ah-nav-i ${active ? "on" : ""}`}>
                <span className="ah-ic"><IconComponent size={18} /></span>
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="ah-main">
        <header className="ah-top">
          <button className="ah-burger" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
          <div className="ah-top-t">Admin Dashboard</div>
          <div className="ah-top-r" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span className="ah-pill">Live</span>
            <ThemeToggle />
            <button onClick={() => logout()} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", display: "flex", alignItems: "center" }} title="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="ah-content">
          {children}
        </main>
      </div>

      {open && <div className="ah-overlay" onClick={() => setOpen(false)} />}
    </div>
  );
}
