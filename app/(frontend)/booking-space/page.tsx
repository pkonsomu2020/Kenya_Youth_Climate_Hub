"use client";

import { useState, useEffect } from "react";
import {
  Calendar, Clock, MapPin, CheckCircle2,
  AlertCircle, Send, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import Link from "next/link";

const SPACE_TYPES = ["Conference Room", "Workshop Area", "Studio", "Hot Desk", "Event Space"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── helpers ──────────────────────────────────────────────────────────────────
function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function today() {
  const t = new Date();
  return toISO(t.getFullYear(), t.getMonth(), t.getDate());
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BookingSpacePage() {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  // Dates already booked — fetched from API
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

  // Selected date opens the modal
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "", email: "", phone: "", organization: "",
    start_time: "", end_time: "", space_type: SPACE_TYPES[0], purpose: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch booked dates on mount
  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((json) => {
        const dates = (json.data ?? []).map((b: any) => b.date as string);
        setBookedDates(new Set(dates));
      })
      .catch(() => {}); // silently fail — calendar still works
  }, []);

  // ── Calendar navigation ───────────────────────────────────────────────────
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Can't go back before current month
  const canGoPrev = viewYear > now.getFullYear() || viewMonth > now.getMonth();

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayISO = today();

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, date: selectedDate }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to submit booking");
      }
      setStatus("success");
      // Mark date as booked in the calendar
      if (selectedDate) setBookedDates(prev => new Set([...prev, selectedDate]));
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setStatus("idle");
    setErrorMsg("");
    setForm({ name: "", email: "", phone: "", organization: "", start_time: "", end_time: "", space_type: SPACE_TYPES[0], purpose: "" });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>

      {/* ── Hero video ── */}
      <section style={{ position: "relative", width: "100%", background: "#000" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video src="/bookings_video.mp4" autoPlay loop muted playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,.85), rgba(15,23,42,.3))" }} />
        </div>
        <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "12rem 2rem 6rem", textAlign: "center", color: "#fff" }}>
          <h1 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-.03em", marginBottom: ".75rem" }}>
            National Climate Change <span style={{ color: "#059669" }}>Resource Center</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,.7)", maxWidth: 560, margin: "0 auto 2rem", lineHeight: 1.7 }}>
            Reserve one of our tech-enabled spaces designed for youth climate changemakers. Located along Ngong Road, Nairobi.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#calendar" style={{ padding: ".85rem 2rem", borderRadius: 100, background: "#059669", color: "#fff", fontFamily: "var(--fs)", fontWeight: 700, textDecoration: "none", fontSize: ".9rem" }}>
              Check Availability
            </a>
            <Link href="/" style={{ padding: ".85rem 2rem", borderRadius: 100, background: "rgba(255,255,255,.1)", color: "#fff", fontFamily: "var(--fs)", fontWeight: 600, textDecoration: "none", fontSize: ".9rem", border: "1px solid rgba(255,255,255,.15)" }}>
              Back Home
            </Link>
          </div>
        </div>
      </section>

      {/* ── Info strip ── */}
      <div style={{ background: "var(--cd)", borderBottom: "1px solid var(--border)", padding: "2.5rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Feature cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
            {[
              { icon: <MapPin size={20} color="#059669" />, title: "Prime Location", desc: "National Climate Change Resource Centre, Along Ngong Road, Nairobi" },
              { icon: <Clock size={20} color="#059669" />, title: "Flexible Hours", desc: "Hourly, half-day or full-day bookings" },
              { icon: <Calendar size={20} color="#059669" />, title: "Easy Scheduling", desc: "Pick a date on the calendar below" },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: ".75rem", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, marginTop: ".1rem" }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: "var(--dark)", marginBottom: ".2rem" }}>{title}</div>
                  <div style={{ fontSize: ".78rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* NCCRC About card */}
          <div style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "2rem",
            alignItems: "flex-start",
          }} className="nccrc-card">

            {/* Logo */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: ".6rem" }}>
              <img
                src="/MIN_OF_ENV_CLIM_FORE_LOGO.jpg"
                alt="Ministry of Environment, Climate Change & Forestry"
                style={{ height: 110, width: "auto", objectFit: "contain" }}
              />
              <div style={{
                fontSize: ".6rem", fontWeight: 700, fontFamily: "var(--fm)",
                letterSpacing: ".08em", textTransform: "uppercase",
                color: "#059669", textAlign: "center", lineHeight: 1.4,
              }}>
                Hosted Facility
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.05rem", color: "var(--dark)", marginBottom: ".75rem", lineHeight: 1.3 }}>
                About the National Climate Change Resource Centre (NCCRC)
              </div>
              <p style={{ fontSize: ".85rem", color: "var(--muted-foreground)", lineHeight: 1.75, marginBottom: ".6rem" }}>
                Kenya's National Climate Change Resource Centre (NCCRC) is a dedicated physical and digital repository established under the Climate Change Act. It serves as a central hub for climate-related information, providing facilities and training rooms for capacity building, webinars, and knowledge exchange.
              </p>
              <p style={{ fontSize: ".85rem", color: "var(--muted-foreground)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
                The NCCRC works alongside the Climate Change Directorate (CCD) and manages data to help bridge information gaps for sectoral and county-level action.
              </p>

              {/* CTA */}
              <div style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: ".85rem 1.1rem",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: 10,
                flexWrap: "wrap",
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".82rem", color: "#065f46", marginBottom: ".15rem" }}>
                    Planning a climate-related activity?
                  </div>
                  <div style={{ fontSize: ".75rem", color: "#047857" }}>
                    Book the Resource Centre for your training, webinar, or knowledge exchange session.
                  </div>
                </div>
                <a href="#calendar" style={{
                  display: "inline-flex", alignItems: "center", gap: ".4rem",
                  padding: ".6rem 1.25rem", borderRadius: 100,
                  background: "#059669", color: "#fff",
                  fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".8rem",
                  textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                  transition: "background .2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#047857")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#059669")}
                >
                  <Calendar size={14} /> Check Availability
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Calendar ── */}
      <section id="calendar" style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="s-label" style={{ justifyContent: "center" }}>Availability Calendar</div>
          <h2 className="s-title" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
            Pick an <span>Available Date</span>
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: ".88rem", marginTop: ".5rem" }}>
            Click any available date to open the booking form. Greyed-out dates are already booked or in the past.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { color: "#059669", label: "Available" },
            { color: "#e5e7eb", label: "Past / Unavailable", text: "#9ca3af" },
            { color: "#fef3c7", label: "Booked", border: "#fbbf24", text: "#92400e" },
          ].map(({ color, label, border, text }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".75rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: color, border: border ? `1px solid ${border}` : "none" }} />
              {label}
            </div>
          ))}
        </div>

        {/* Calendar card */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>

          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
            <button onClick={prevMonth} disabled={!canGoPrev}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--card)", cursor: canGoPrev ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", color: canGoPrev ? "var(--dark)" : "var(--border)", transition: "all .2s" }}
              onMouseEnter={e => canGoPrev && ((e.currentTarget as HTMLElement).style.background = "var(--cd)")}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--card)"}
            >
              <ChevronLeft size={16} />
            </button>
            <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.1rem", color: "var(--dark)" }}>
              {MONTHS[viewMonth]} {viewYear}
            </div>
            <button onClick={nextMonth}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dark)", transition: "all .2s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--cd)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--card)")}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: ".75rem 1rem 0" }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: ".7rem", fontWeight: 700, color: "var(--muted-foreground)", fontFamily: "var(--fm)", letterSpacing: ".06em", padding: ".4rem 0" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: ".5rem 1rem 1.25rem", gap: ".25rem" }}>
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const iso = toISO(viewYear, viewMonth, day);
              const isPast    = iso < todayISO;
              const isBooked  = bookedDates.has(iso);
              const isToday   = iso === todayISO;
              const disabled  = isPast || isBooked;

              let bg = "transparent";
              let color = "var(--dark)";
              let border = "transparent";
              let cursor = "pointer";

              if (isPast) { bg = "transparent"; color = "#d1d5db"; cursor = "not-allowed"; }
              else if (isBooked) { bg = "#fef3c7"; color = "#92400e"; border = "#fbbf24"; cursor = "not-allowed"; }
              else if (isToday) { border = "#059669"; }

              return (
                <button
                  key={day}
                  disabled={disabled}
                  onClick={() => !disabled && setSelectedDate(iso)}
                  style={{
                    aspectRatio: "1", borderRadius: 10,
                    background: bg, color, border: `1px solid ${border}`,
                    cursor, fontFamily: "var(--fs)", fontWeight: 600,
                    fontSize: ".88rem", transition: "all .15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  onMouseEnter={e => {
                    if (!disabled) {
                      (e.currentTarget as HTMLElement).style.background = "#059669";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                      (e.currentTarget as HTMLElement).style.borderColor = "#059669";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!disabled) {
                      (e.currentTarget as HTMLElement).style.background = bg;
                      (e.currentTarget as HTMLElement).style.color = color;
                      (e.currentTarget as HTMLElement).style.borderColor = border;
                    }
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Booking modal ── */}
      {selectedDate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div style={{ background: "var(--card)", borderRadius: 20, width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,.3)" }}>

            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 1.75rem 1rem", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.15rem", color: "var(--dark)", display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <Calendar size={20} color="#059669" /> Request a Reservation
                </div>
                <div style={{ fontSize: ".8rem", color: "var(--muted-foreground)", marginTop: ".25rem" }}>
                  📅 {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
              <button onClick={closeModal} style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--cd)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dark)" }}>
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "1.5rem 1.75rem 2rem" }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                  <CheckCircle2 size={56} color="#059669" style={{ margin: "0 auto 1rem" }} />
                  <h3 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.3rem", color: "var(--dark)", marginBottom: ".5rem" }}>Booking Requested!</h3>
                  <p style={{ color: "var(--muted-foreground)", fontSize: ".88rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    We'll confirm your booking for <strong>{selectedDate}</strong> shortly.
                  </p>
                  <button onClick={closeModal} style={{ padding: ".65rem 1.5rem", borderRadius: 10, background: "var(--cd)", border: "1px solid var(--border)", cursor: "pointer", fontFamily: "var(--fs)", fontWeight: 600, fontSize: ".85rem", color: "var(--dark)" }}>
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {status === "error" && (
                    <div style={{ padding: ".85rem 1rem", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", display: "flex", gap: ".5rem", alignItems: "flex-start" }}>
                      <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: ".1rem" }} />
                      <p style={{ fontSize: ".82rem", color: "#991B1B" }}>{errorMsg}</p>
                    </div>
                  )}

                  <div className="booking-modal-grid">
                    <div>
                      <label className="k-label">Full Name *</label>
                      <input required type="text" name="name" value={form.name} onChange={handleChange} className="k-input" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="k-label">Email Address *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} className="k-input" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="booking-modal-grid">
                    <div>
                      <label className="k-label">Mobile Phone *</label>
                      <input required type="tel" name="phone" value={form.phone} onChange={handleChange} className="k-input" placeholder="+254..." />
                    </div>
                    <div>
                      <label className="k-label">Organization (Optional)</label>
                      <input type="text" name="organization" value={form.organization} onChange={handleChange} className="k-input" placeholder="Climate Youth Org" />
                    </div>
                  </div>

                  <div>
                    <label className="k-label">Space Type *</label>
                    <select required name="space_type" value={form.space_type} onChange={handleChange} className="k-input">
                      {SPACE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="booking-modal-grid">
                    <div>
                      <label className="k-label">Start Time *</label>
                      <input required type="time" name="start_time" value={form.start_time} onChange={handleChange} className="k-input" />
                    </div>
                    <div>
                      <label className="k-label">End Time *</label>
                      <input required type="time" name="end_time" value={form.end_time} onChange={handleChange} className="k-input" />
                    </div>
                  </div>

                  <div>
                    <label className="k-label">Purpose of Booking *</label>
                    <textarea required name="purpose" value={form.purpose} onChange={handleChange} rows={3} className="k-input" style={{ resize: "none" }} placeholder="Briefly describe what you will use the space for..." />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn-green"
                    style={{ width: "100%", justifyContent: "center", marginTop: ".25rem", opacity: status === "submitting" ? .6 : 1 }}
                  >
                    {status === "submitting" ? "Submitting…" : <><Send size={16} /> Submit Booking Request</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
