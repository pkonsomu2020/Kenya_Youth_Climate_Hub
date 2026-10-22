"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { KENYA_COUNTIES_WEATHER } from "@/lib/data/kenyaCountiesWeather";
import { Icon } from "@/components/zine/Icon";
import { postForm, useFormGuard, type SendState } from "@/components/zine/FormGuard";

const INBOX = "info@kenyayouthclimatehub.org";
// Stored / sent in English; labels come from the taxonomy messages.
const INTERESTS = ["Energy", "Water", "Agriculture", "Policy", "Finance", "Innovation", "Resilience", "Advocacy", "Waste"];

export default function RegisterPage() {
  const t = useTranslations("register");
  const tax = useTranslations("taxonomy");
  const [form, setForm] = useState({ name: "", email: "", county: "", age: "", interests: [] as string[], other: "" });
  const locale = useLocale();
  const { honeypot, guard } = useFormGuard();
  const [state, setState] = useState<SendState>("idle");
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;

  const toggle = (v: string) =>
    setForm((f) => ({ ...f, interests: f.interests.includes(v) ? f.interests.filter((x) => x !== v) : [...f.interests, v] }));

  // Fallback when the request fails: the same profile, ready in the visitor's email app.
  const mailtoBody = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `County: ${form.county}`,
    `Age: ${form.age}`,
    `Interests: ${[...form.interests, form.other].filter(Boolean).join(", ") || "-"}`,
  ].join("\n");
  const mailto = `mailto:${INBOX}?subject=${encodeURIComponent(`KYCH registration: ${form.name}`)}&body=${encodeURIComponent(mailtoBody)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setState(await postForm("/api/register", { ...form, age: Number(form.age), ...guard(), locale }));
  };

  const failed = state === "failed" || state === "rate_limited";

  return (
    <div className="z-page z-form">
      <header className="z-form__head z-form__head--center">
        <div className="z-wrap">
          <span className="z-mono z-eyebrow">{t("eyebrow")}</span>
          <h1 className="z-h2 z-balance">{t.rich("title", { s })}</h1>
          <p className="z-lead">{t("subtitle")}</p>
        </div>
      </header>

      <section className="z-form__sec">
        <div className="z-wrap">
          <article className="z-formcard z-formcard--solo">
            <span className="z-tape z-tape--orange" style={{ top: -12, left: "50%", marginLeft: -46, transform: "rotate(-3deg)" }} aria-hidden="true" />
            {state === "sent" ? (
              <div className="z-formcard__done" role="status">
                <Icon name="how_to_reg" size={48} />
                <h2>{t("doneTitle")}</h2>
                <p>{t("doneBody", { name: form.name, email: form.email })}</p>
              </div>
            ) : failed ? (
              <div className="z-formcard__done" role="alert">
                <Icon name="forward_to_inbox" size={48} />
                <h2>{t("failTitle")}</h2>
                <p>{t(state === "rate_limited" ? "tooMany" : "failBody", { email: INBOX })}</p>
                <div className="z-ctas" style={{ justifyContent: "center" }}>
                  <a className="z-btn z-btn--green z-btn--sm" href={mailto}><Icon name="mail" /> {t("openEmail")}</a>
                  <button type="button" className="z-btn z-btn--white z-btn--sm" onClick={() => setState("idle")}><Icon name="edit" /> {t("edit")}</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {honeypot}
                <h2 className="z-formcard__title z-mono">{t("formTitle")}</h2>
                <div className="z-field">
                  <label htmlFor="reg-name">{t("name")}</label>
                  <input id="reg-name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("namePh")} />
                </div>
                <div className="z-field">
                  <label htmlFor="reg-email">{t("email")}</label>
                  <input id="reg-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("emailPh")} />
                </div>
                <div className="z-field__row">
                  <div className="z-field">
                    <label htmlFor="reg-county">{t("county")}</label>
                    <select id="reg-county" required value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })}>
                      <option value="" disabled>{t("countyPh")}</option>
                      {KENYA_COUNTIES_WEATHER.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="z-field">
                    <label htmlFor="reg-age">{t("age")}</label>
                    <input id="reg-age" type="number" inputMode="numeric" min={15} max={35} required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="15–35" aria-describedby="reg-age-hint" />
                    <small id="reg-age-hint" className="z-field__hint">{t("ageHint")}</small>
                  </div>
                </div>
                <fieldset className="z-field z-field--chips">
                  <legend>{t("interests")}</legend>
                  <div>
                    {INTERESTS.map((v) => (
                      <label key={v} className="z-chip">
                        <input type="checkbox" checked={form.interests.includes(v)} onChange={() => toggle(v)} />
                        <span>{tax(v)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="z-field">
                  <label htmlFor="reg-other">{t("other")}</label>
                  <input id="reg-other" value={form.other} onChange={(e) => setForm({ ...form, other: e.target.value })} placeholder={t("interestsPh")} />
                </div>
                <button type="submit" className="z-btn z-btn--navy z-formcard__submit" disabled={state === "sending"} aria-busy={state === "sending"}>
                  {state === "sending" ? t("sending") : t("submit")} <Icon name="arrow_forward" />
                </button>
                <p className="z-formcard__note">{t("formNote")}</p>
              </form>
            )}
          </article>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
