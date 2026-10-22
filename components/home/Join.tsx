"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";

// Flat sunburst: solid wedges every 18°, no gradients.
const RAYS = Array.from({ length: 20 }, (_, i) => {
  const a = (i * 18 * Math.PI) / 180, b = ((i * 18 + 7) * Math.PI) / 180;
  const p = (ang: number) => `${(300 + 420 * Math.cos(ang)).toFixed(0)} ${(300 + 420 * Math.sin(ang)).toFixed(0)}`;
  return `M300 300 L${p(a)} L${p(b)} Z`;
}).join(" ");

/** Newsletter sign-up card. Same behaviour as before: confirms locally (no mailing backend yet). */
export function Join() {
  const t = useTranslations("home.join");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="z-join" aria-labelledby="z-join-title">
      <div className="z-wrap">
        <div className="z-join__card">
          <svg className="z-join__rays" viewBox="0 0 600 600" aria-hidden="true"><path d={RAYS} fill="#FFFDF8" /></svg>
          <span className="z-tape z-tape--sun" aria-hidden="true" />
          <span className="z-tape z-tape--orange" aria-hidden="true" />
          <h2 id="z-join-title" className="z-h2">{t.rich("title", { br: () => <br />, s: (c) => <span className="z-serif">{c}</span> })}</h2>
          <p className="z-join__sub">{t("sub")}</p>
          {done ? (
            <p className="z-join__done" role="status"><Icon name="check_circle" fill /> {t("done")}</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}>
              <label htmlFor="z-join-email" className="sr-only">{t("label")}</label>
              <input id="z-join-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("placeholder")} />
              <button type="submit" className="z-btn z-btn--navy">{t("submit")} <Icon name="arrow_forward" /></button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
