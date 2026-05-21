"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useContent, newId } from "@/lib/contentStore";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { content, update } = useContent();
  const [form, setForm] = useState({ name: "", email: "", type: "Young Kenyan", body: "" });
  return (
    <>
      <PageHeader eyebrow="Get In Touch" title={<>We'd love to <span>hear from you</span></>} subtitle="Partner with us, post an opportunity, share a resource, or ask anything." />
      <section className="sec">
        <div className="sec-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem" }}>
          <div>
            <h3 className="kfont-display" style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>Contact details</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".75rem", color: "var(--muted-foreground)", fontSize: ".9rem" }}>
              <li>📧 <a href="mailto:info@kenyayouthclimatehub.org" style={{ color: "var(--green)" }}>info@kenyayouthclimatehub.org</a></li>
              <li>📍 Nairobi, Kenya</li>
              <li>🌐 Anchored within Afosi — Action for Sustainability Initiative</li>
            </ul>
            <h3 className="kfont-display" style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "2rem", marginBottom: ".5rem" }}>For donors & media</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: ".88rem", lineHeight: 1.6 }}>
              Drop us a line above and our partnerships team will be in touch within 2 business days. Press kit available on request.
            </p>
          </div>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            const newMsg = {
              id: newId(),
              from: form.name,
              email: form.email,
              subject: `Message from ${form.type}`,
              body: form.body,
              date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              read: false
            };
            update("messages", [newMsg, ...(content.messages || [])]);
            setSent(true); 
          }} className="k-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: ".9rem" }}>
            {sent ? (
              <div style={{ padding: "1rem", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, color: "#065F46", fontSize: ".9rem" }}>
                ✅ Message sent. We'll be in touch soon.
              </div>
            ) : (
              <>
                <div><label className="k-label">Name</label><input className="k-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div><label className="k-label">Email</label><input type="email" className="k-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                <div><label className="k-label">I am a…</label>
                  <select className="k-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option>Young Kenyan</option><option>Partner Organization</option><option>Donor / Funder</option><option>Media / Press</option><option>Other</option>
                  </select>
                </div>
                <div><label className="k-label">Message</label><textarea className="k-input" rows={5} value={form.body} onChange={e => setForm({...form, body: e.target.value})} required /></div>
                <button type="submit" className="btn-green">Send Message →</button>
              </>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
