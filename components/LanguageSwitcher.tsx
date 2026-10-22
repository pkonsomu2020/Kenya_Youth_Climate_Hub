"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LOCALE_COOKIE, localeLabels, locales, localeShort, type Locale } from "@/i18n/config";
import { Icon } from "@/components/zine/Icon";

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
    <div ref={rootRef} className="z-lang nk-lang-switch">
      <button
        type="button"
        className="z-lang__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        style={{ opacity: pending ? 0.6 : 1 }}
      >
        <Icon name="language" />
        {localeShort[locale]}
        <Icon name={open ? "expand_less" : "expand_more"} />
      </button>

      {open && (
        <ul role="listbox" aria-label={t("language")} className="z-lang__list">
          {locales.map((l) => {
            const active = l === locale;
            return (
              <li key={l} role="option" aria-selected={active}>
                <button
                  type="button"
                  lang={l}
                  data-active={active}
                  onClick={() => { setOpen(false); if (!active) setLocale(l); }}
                >
                  {localeLabels[l]}
                  {active && <Icon name="check" />}
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
    <div role="radiogroup" aria-label={t("language")} className="z-lang-seg">
      {locales.map((l) => {
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
          >
            {localeLabels[l]}
          </button>
        );
      })}
    </div>
  );
}
