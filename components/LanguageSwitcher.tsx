"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown, Globe } from "lucide-react";
import { NK, nkShadow } from "@/lib/nkTheme";
import { LOCALE_COOKIE, localeLabels, locales, localeShort, type Locale } from "@/i18n/config";

function useSetLocale() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setLocale = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // Re-render server components (root layout reads the cookie and loads the new messages).
    startTransition(() => router.refresh());
  };

  return { setLocale, pending };
}

/** Compact dropdown for the desktop header. */
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const { setLocale, pending } = useSetLocale();
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="nk-lang-switch" style={{ position: "relative" }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        disabled={pending}
        style={{
          height: 44, minWidth: 44, padding: "0 12px",
          display: "flex", alignItems: "center", gap: 6,
          border: `2px solid ${NK.ink}`,
          background: hov || open ? NK.ink : "transparent",
          color: hov || open ? "#fff" : NK.ink,
          fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13, letterSpacing: "0.04em",
          cursor: pending ? "wait" : "pointer", opacity: pending ? 0.6 : 1,
          transition: "background .2s, color .2s",
        }}
      >
        <Globe size={16} aria-hidden="true" />
        {localeShort[locale]}
        <ChevronDown size={14} aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language")}
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 320,
            minWidth: 170, margin: 0, padding: 0, listStyle: "none",
            background: NK.bg, border: `2px solid ${NK.ink}`,
            boxShadow: nkShadow(NK.green, 5),
          }}
        >
          {locales.map((l) => {
            const active = l === locale;
            return (
              <li key={l} role="option" aria-selected={active}>
                <button
                  type="button"
                  lang={l}
                  onClick={() => { setOpen(false); if (!active) setLocale(l); }}
                  style={{
                    width: "100%", minHeight: 44, padding: "0 14px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    border: "none", borderBottom: l === locales[locales.length - 1] ? "none" : "1px solid rgba(16,28,51,0.1)",
                    background: active ? NK.tintGreen : "transparent",
                    color: NK.ink, cursor: "pointer", textAlign: "left",
                    fontFamily: "var(--fs)", fontWeight: active ? 700 : 600, fontSize: 14,
                  }}
                >
                  {localeLabels[l]}
                  {active && <Check size={16} color={NK.greenAlt} aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Full-width segmented control for the mobile menu panel. */
export function LanguageSwitcherInline() {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const { setLocale, pending } = useSetLocale();

  return (
    <div role="radiogroup" aria-label={t("language")} style={{ display: "flex", border: `2px solid ${NK.ink}` }}>
      {locales.map((l, i) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={active}
            lang={l}
            disabled={pending}
            onClick={() => { if (!active) setLocale(l); }}
            style={{
              flex: 1, minHeight: 44, padding: "0 6px",
              border: "none", borderLeft: i === 0 ? "none" : `2px solid ${NK.ink}`,
              background: active ? NK.ink : "transparent",
              color: active ? "#fff" : NK.ink,
              fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13,
              cursor: pending ? "wait" : "pointer",
              transition: "background .2s, color .2s",
            }}
          >
            {localeLabels[l]}
          </button>
        );
      })}
    </div>
  );
}
