"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { UserPlus, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", county: "", age: "", interests: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <PageHeader
        eyebrow="Join the Movement"
        title={<>Create Your <span>Youth Profile</span></>}
        subtitle="Register to access funding opportunities, events, resources and the KYCH community — all in one place."
      />

      <section className="sec">
        <div className="sec-in" style={{ maxWidth: 560, margin: "0 auto" }}>
          {sent ? (
            <div className="k-card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
              <CheckCircle2 size={56} color="var(--green)" style={{ margin: "0 auto 1rem" }} />
              <h2 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.5rem", color: "var(--dark)", marginBottom: ".5rem" }}>
                You're on the list!
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                Thanks for registering. We'll be in touch with your profile details and next steps shortly.
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
                  Youth Registration
                </h2>
              </div>

              <div>
                <label className="k-label">Full Name</label>
                <input className="k-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div>
                <label className="k-label">Email Address</label>
                <input type="email" className="k-input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
              </div>
              <div>
                <label className="k-label">County</label>
                <input className="k-input" required value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })} placeholder="e.g. Nairobi, Kisumu, Mombasa…" />
              </div>
              <div>
                <label className="k-label">Age</label>
                <input type="number" min={15} max={35} className="k-input" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="15–35" />
              </div>
              <div>
                <label className="k-label">Climate Interests</label>
                <textarea className="k-input" rows={3} value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="e.g. Clean energy, water, agriculture, policy…" />
              </div>

              <button type="submit" className="btn-green" style={{ marginTop: ".5rem" }}>
                Create My Profile →
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
