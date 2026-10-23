"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";
import { postForm, useFormGuard, type SendState } from "@/components/zine/FormGuard";

const INBOX = "info@kenyayouthclimatehub.org";

// Stored in English for the admin inbox; only the visible labels are translated.
const EMPTY = { name: "", email: "", type: "Young Kenyan", body: "" };

const SENDER_TYPES = [
  { value: "Young Kenyan", key: "youth" },
  { value: "Partner Organization", key: "partner" },
  { value: "Donor / Funder", key: "donor" },
  { value: "Media / Press", key: "media" },
  { value: "Other", key: "other" },
] as const;

export default function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const { honeypot, guard } = useFormGuard();
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState<SendState>("idle");
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;

  // Fallback when the request fails: the same message, ready in the visitor's email app.
  const mailto = `mailto:${INBOX}?subject=${encodeURIComponent(`KYCH contact: ${form.type} - ${form.name}`)}&body=${encodeURIComponent(`${form.body}\n\n${form.name}\n${form.email}`)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setState(await postForm("/api/contact", { ...form, ...guard(), locale }));
  };

  const failed = state === "failed" || state === "rate_limited";

  return (
    <div className="z-page z-form">
      <header className="z-form__head">
        <div className="z-wrap">
          <span className="z-mono z-eyebrow">{t("eyebrow")}</span>
          <h1 className="z-h2 z-balance">{t.rich("title", { s })}</h1>
          <p className="z-lead">{t("subtitle")}</p>
        </div>
      </header>

      <section className="z-form__sec">
        <div className="z-wrap z-form__grid">
          <article className="z-formcard">
            <span className="z-tape" style={{ top: -12, left: 40, transform: "rotate(-4deg)" }} aria-hidden="true" />
            <span className="z-tape z-tape--sun" style={{ top: -12, right: 40, transform: "rotate(5deg)" }} aria-hidden="true" />
            {state === "sent" ? (
              <div className="z-formcard__done" role="status">
                <Icon name="mark_email_read" size={48} />
                <h2>{t("sentTitle")}</h2>
                <p>{t("sentBody", { name: form.name, email: form.email })}</p>
                <div className="z-ctas" style={{ justifyContent: "center" }}>
                  <button type="button" className="z-btn z-btn--white z-btn--sm" onClick={() => { setState("idle"); setForm(EMPTY); }}>
                    <Icon name="edit_note" /> {t("another")}
                  </button>
                </div>
              </div>
            ) : failed ? (
              <div className="z-formcard__done" role="alert">
                <Icon name="forward_to_inbox" size={48} />
                <h2>{t("failTitle")}</h2>
                <p>{t(state === "rate_limited" ? "tooMany" : "failBody", { email: INBOX })}</p>
                <div className="z-ctas" style={{ justifyContent: "center" }}>
                  <a className="z-btn z-btn--green z-btn--sm" href={mailto}><Icon name="mail" /> {t("openEmail")}</a>
                  <button type="button" className="z-btn z-btn--white z-btn--sm" onClick={() => setState("idle")}>
                    <Icon name="refresh" /> {t("retry")}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {honeypot}
                <h2 className="z-formcard__title z-mono">{t("formTitle")}</h2>
                <div className="z-field">
                  <label htmlFor="contact-name">{t("nameLabel")}</label>
                  <input id="contact-name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("namePlaceholder")} />
                </div>
                <div className="z-field">
                  <label htmlFor="contact-email">{t("emailLabel")}</label>
                  <input id="contact-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("emailPlaceholder")} />
                </div>
                <fieldset className="z-field z-field--chips">
                  <legend>{t("typeLabel")}</legend>
                  <div>
                    {SENDER_TYPES.map((st) => (
                      <label key={st.key} className="z-chip">
                        <input type="radio" name="type" value={st.value} checked={form.type === st.value} onChange={() => setForm({ ...form, type: st.value })} />
                        <span>{t(`types.${st.key}`)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="z-field">
                  <label htmlFor="contact-body">{t("messageLabel")}</label>
                  <textarea id="contact-body" required rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder={t("messagePlaceholder")} />
                </div>
                <button type="submit" className="z-btn z-btn--navy z-formcard__submit" disabled={state === "sending"} aria-busy={state === "sending"}>
                  {state === "sending" ? t("sending") : t("send")} <Icon name="send" />
                </button>
                <p className="z-formcard__note">{t("formNote")}</p>
              </form>
            )}
          </article>

          <aside className="z-form__aside" aria-label={t("label")}>
            <a className="z-form__item" href={`mailto:${INBOX}`}>
              <Icon name="mail" />
              <span><small className="z-mono">{t("email")}</small>{INBOX}</span>
            </a>
            <div className="z-form__item">
              <Icon name="location_on" />
              <span><small className="z-mono">{t("location")}</small>{t("locationValue")}</span>
            </div>
            <div className="z-form__item z-form__item--note">
              <Icon name="schedule" />
              <span><small className="z-mono">{t("donorsTitle")}</small>{t("donorsBody")}</span>
            </div>
          </aside>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
