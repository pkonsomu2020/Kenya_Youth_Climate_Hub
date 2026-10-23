"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";

const socials = [
  {
    key: "facebook",
    href: "https://www.facebook.com/profile.php?id=61581202055325",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    href: "https://www.instagram.com/kych_ke/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    href: "https://www.linkedin.com/company/kenya-youth-climate-hub/posts/?feedView=all",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  const openChat = () => window.dispatchEvent(new CustomEvent("kych:open-chat"));

  return (
    <footer className="z-footer">
      <div className="z-wrap">
        <div className="z-footer__cols">
          <div>
            <div className="z-footer__big">
              Kenya Youth<br /><span className="z-serif">Climate Hub.</span>
            </div>
            <p style={{ marginTop: 16, maxWidth: 320 }}>{t("blurb")}</p>
            <div className="z-footer__social">
              {socials.map((s) => (
                <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={t(`social.${s.key}`)}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2>{t("explore")}</h2>
            <Link href="/opportunities">{tn("opportunities")}</Link>
            <Link href="/programs">{tn("programs")}</Link>
            <Link href="/events">{tn("events")}</Link>
            <Link href="/success-stories">{tn("successStories")}</Link>
            <Link href="/about">{tn("about")}</Link>
          </div>

          <div>
            <h2>{t("tools")}</h2>
            <Link href="/weather">{tn("climateWatch")}</Link>
            <Link href="/e-library">{tn("eLibrary")}</Link>
            <Link href="/news">{tn("news")}</Link>
            <button
              type="button"
              onClick={openChat}
              style={{ background: "none", border: "none", padding: 0, color: "inherit", font: "inherit", cursor: "pointer", textAlign: "left" }}
            >
              {t("climateAI")}
            </button>
          </div>

          <div>
            <h2>{t("contactUs")}</h2>
            <a href="mailto:info@kenyayouthclimatehub.org">info@kenyayouthclimatehub.org</a>
            <a href="tel:+254115963306">(+254) 0115963306</a>
            <p style={{ margin: "0 0 10px" }}>Manga House, Kiambere Rd<br />Upper Hill, Nairobi</p>
            <Link href="/contact">{t("contactForm")}</Link>
          </div>
        </div>

        <div className="z-footer__bottom">
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
          <span>{t("poweredByAfosi")} · English · Kiswahili · Français</span>
        </div>
      </div>
    </footer>
  );
}
