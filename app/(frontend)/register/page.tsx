"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("register");
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", county: "", age: "", interests: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", { g: (c) => <span>{c}</span> })}
        subtitle={t("subtitle")}
      />

      <section className="sec">
        <div className="sec-in" style={{ maxWidth: 560, margin: "0 auto" }}>
          {sent ? (
            <div className="k-card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
              <CheckCircle2 size={56} color="var(--green)" style={{ margin: "0 auto 1rem" }} />
              <h2 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.5rem", color: "var(--dark)", marginBottom: ".5rem" }}>
                {t("doneTitle")}
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                {t("doneBody")}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="k-card"
              style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".5rem" }}>
                <UserPlus size={22} color="var(--green)" />
                <h2 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.2rem", color: "var(--dark)" }}>
                  {t("formTitle")}
                </h2>
              </div>

              <div>
                <label className="k-label" htmlFor="reg-name">{t("name")}</label>
                <input id="reg-name" className="k-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("namePh")} />
              </div>
              <div>
                <label className="k-label" htmlFor="reg-email">{t("email")}</label>
                <input id="reg-email" type="email" className="k-input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("emailPh")} />
              </div>
              <div>
                <label className="k-label" htmlFor="reg-county">{t("county")}</label>
                <input id="reg-county" className="k-input" required value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })} placeholder={t("countyPh")} />
              </div>
              <div>
                <label className="k-label" htmlFor="reg-age">{t("age")}</label>
                <input id="reg-age" type="number" min={15} max={35} className="k-input" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="15–35" />
              </div>
              <div>
                <label className="k-label" htmlFor="reg-interests">{t("interests")}</label>
                <textarea id="reg-interests" className="k-input" rows={3} value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder={t("interestsPh")} />
              </div>

              <button type="submit" className="btn-green" style={{ marginTop: ".5rem" }}>
                {t("submit")} →
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
