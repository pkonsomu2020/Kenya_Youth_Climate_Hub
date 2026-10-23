"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher, LanguageSwitcherInline } from "@/components/LanguageSwitcher";
import { Icon } from "@/components/zine/Icon";

// Labels are nav.* message keys.
const links = [
  { to: "/",                key: "homeLink"       },
  { to: "/about",           key: "about"          },
  { to: "/opportunities",   key: "opportunities"  },
  { to: "/programs",        key: "programs"       },
  { to: "/events",          key: "events"         },
  { to: "/weather",         key: "climateWatch"   },
  { to: "/e-library",       key: "eLibrary"       },
  { to: "/news",            key: "news"           },
  { to: "/success-stories", key: "successStories" },
] as const;

function isActive(path: string, to: string) {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(to + "/");
}

export function Nav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  // The bar floats over the page: it slides away while scrolling down and returns on the way up.
  const [hidden, setHidden] = useState(false);
  const path = usePathname() || "";

  // Close the mobile menu when the route changes (adjusting state during render, not in an effect).
  const [menuPath, setMenuPath] = useState(path);
  if (menuPath !== path) {
    setMenuPath(path);
    setOpen(false);
  }

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? Math.min(1, y / h) * 100 : 0);
      if (y < 120) setHidden(false);
      else if (y > lastY + 8) setHidden(true);
      else if (y < lastY - 8) setHidden(false);
      if (Math.abs(y - lastY) > 8) lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <a className="z-skip" href="#main">{t("skip")}</a>
      <header className={hidden && !open ? "z-nav z-nav--hidden" : "z-nav"}>
        <div className="z-nav__in">
          <Link href="/" className="z-nav__logo" aria-label={t("home")}>
            <img src="/kych_logo_wordmark.png" alt="Kenya Youth Climate Hub" width={384} height={168} />
          </Link>

          <nav className="z-nav__links" aria-label={t("main")}>
            {links.map((l) => (
              <Link key={l.to} href={l.to} aria-current={isActive(path, l.to) ? "page" : undefined}>
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <div className="z-nav__right">
            <LanguageSwitcher />
            <Link href="/opportunities" className="z-btn z-btn--navy z-btn--sm z-nav__cta nk-nav-cta">
              {t("findFunding")} <Icon name="arrow_forward" />
            </Link>
            <button
              type="button"
              className="z-nav__burger nk-nav-burger"
              aria-label={t("openMenu")}
              aria-expanded={open}
              aria-controls="z-menu"
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" />
            </button>
          </div>
          <span className="z-nav__track" aria-hidden="true"><i style={{ width: `${scrollPct}%` }} /></span>
        </div>
      </header>

      {open && <div className="z-menu-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}

      <div id="z-menu" className="z-menu" data-open={open} aria-hidden={!open} inert={!open}>
        <div className="z-menu__top">
          <img src="/kych_logo_wordmark.png" alt="Kenya Youth Climate Hub" width={384} height={168} className="z-menu__logo" />
          <button type="button" className="z-nav__burger" style={{ display: "inline-flex" }} aria-label={t("closeMenu")} onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>
        <nav className="z-menu__links" aria-label={t("main")}>
          {links.map((l) => (
            <Link key={l.to} href={l.to} aria-current={isActive(path, l.to) ? "page" : undefined} onClick={() => setOpen(false)}>
              {t(l.key)} <Icon name="arrow_forward" />
            </Link>
          ))}
        </nav>
        <div className="z-menu__foot">
          <LanguageSwitcherInline />
          <Link href="/opportunities" className="z-btn z-btn--green" style={{ justifyContent: "center" }} onClick={() => setOpen(false)}>
            {t("findFunding")} <Icon name="arrow_forward" />
          </Link>
        </div>
      </div>
    </>
  );
}
