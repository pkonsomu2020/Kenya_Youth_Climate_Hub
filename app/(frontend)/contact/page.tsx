"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useContent, newId } from "@/lib/contentStore";
import { MapPin, Mail, Phone, ArrowRight, CheckCircle2 } from "lucide-react";

function useInView(ref: React.RefObject<Element | null>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref]);
  return v;
}

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { content, update } = useContent();
  const [form, setForm] = useState({ name: "", email: "", type: "Young Kenyan", body: "" });
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update("messages", [{ id: newId(), from: form.name, email: form.email, subject: `Message from ${form.type}`, body: form.body, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), read: false }, ...(content.messages || [])]);
    setSent(true);
  };

  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title={<>We'd love to <span style={{ color: "#5dba2f" }}>hear from you</span></>}
        subtitle="Partner with us, post an opportunity, share a resource, or ask anything."
      />

      <section className="py-32 px-6 md:px-16" style={{ background: "var(--section-light)" }}>
        <div
          ref={ref}
          style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "start" }}
        >
          {/* ── Contact info ── */}
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-40px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dba2f" }}>Contact</span>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3rem)", color: "var(--foreground)", letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: "1rem", marginBottom: "2.5rem" }}>
              LET'S BUILD <span style={{ color: "#5dba2f" }}>TOGETHER</span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { icon: <Mail size={20} />, label: "Email", value: "info@kenyayouthclimatehub.org", href: "mailto:info@kenyayouthclimatehub.org" },
                { icon: <Phone size={20} />, label: "Phone", value: "+254 712 345 678", href: "tel:+254712345678" },
                { icon: <MapPin size={20} />, label: "Location", value: "Ngong Road, Nairobi, Kenya", href: undefined },
              ].map(({ icon, label, value, href }) => (
                <div key={label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(93,186,47,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#5dba2f", flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: ".78rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: ".2rem" }}>{label}</div>
                    {href ? (
                      <a href={href} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--foreground)", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#5dba2f")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--foreground)")}
                      >{value}</a>
                    ) : (
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--foreground)" }}>{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "3rem", padding: "1.5rem 2rem", background: "var(--section-dark)", borderRadius: 16, border: "1px solid rgba(93,186,47,.15)" }}>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: ".9rem", color: "var(--text-on-dark)", marginBottom: ".5rem" }}>For donors & media</div>
              <p style={{ fontSize: ".85rem", color: "var(--muted-foreground)", lineHeight: 1.65 }}>
                Our partnerships team responds within 2 business days. Press kit available on request.
              </p>
            </div>
          </div>

          {/* ── Form ── */}
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(40px)", transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s" }}>
            <div style={{ background: "var(--section-dark)", borderRadius: 20, padding: "2.5rem", border: "1px solid rgba(93,186,47,0.15)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #5dba2f, transparent)" }} />

              {sent ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <CheckCircle2 size={56} color="#5dba2f" style={{ margin: "0 auto 1.25rem" }} />
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "var(--text-on-dark)", marginBottom: ".75rem" }}>Message sent!</div>
                  <p style={{ color: "var(--muted-foreground)", lineHeight: 1.65 }}>Thanks for reaching out. We'll be in touch within 2 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "var(--text-on-dark)", marginBottom: ".25rem" }}>Send us a message</div>

                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "Your name" },
                    { label: "Email Address", key: "email", type: "email", placeholder: "your@email.com" },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: ".75rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: ".4rem" }}>{label}</label>
                      <input
                        type={type} required placeholder={placeholder}
                        value={(form as any)[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={{ width: "100%", padding: ".85rem 1rem", borderRadius: 10, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "var(--text-on-dark)", fontFamily: "Montserrat, sans-serif", fontSize: ".9rem", outline: "none", boxSizing: "border-box" }}
                        onFocus={e => (e.target.style.borderColor = "#5dba2f")}
                        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: ".75rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: ".4rem" }}>I am a…</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                      style={{ width: "100%", padding: ".85rem 1rem", borderRadius: 10, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "var(--text-on-dark)", fontFamily: "Montserrat, sans-serif", fontSize: ".9rem", outline: "none" }}>
                      <option>Young Kenyan</option><option>Partner Organization</option><option>Donor / Funder</option><option>Media / Press</option><option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: ".75rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: ".4rem" }}>Message</label>
                    <textarea required rows={5} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Tell us how we can help..."
                      style={{ width: "100%", padding: ".85rem 1rem", borderRadius: 10, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "var(--text-on-dark)", fontFamily: "Montserrat, sans-serif", fontSize: ".9rem", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                      onFocus={e => (e.target.style.borderColor = "#5dba2f")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")}
                    />
                  </div>

                  <button type="submit"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", padding: "1rem 2rem", borderRadius: 10, background: "#5dba2f", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: ".9rem", letterSpacing: "0.05em", border: "none", cursor: "pointer", transition: "background .2s, transform .2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#4aa324"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#5dba2f"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                  >
                    Send Message <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
