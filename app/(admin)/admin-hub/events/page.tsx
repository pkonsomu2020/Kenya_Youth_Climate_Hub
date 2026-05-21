"use client";

import { PageHead } from "@/components/admin/AdminUI";
import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw, ExternalLink, Check, X, Pencil,
  Trash2, Search, Wifi, WifiOff, Save, Calendar, MapPin, Monitor, Users, Plus,
} from "lucide-react";

type LiveEvent = {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  event_type: string;
  format: string;
  event_date: string | null;
  location: string;
  topic: string;
  climate_score: number;
  color: string;
  is_approved: boolean;
};

const EVENT_TYPES = ["All", "Conference", "Summit", "Hackathon", "Webinar", "Workshop", "Competition", "Bootcamp", "Dialogue"];
const FORMATS     = ["All", "In-person", "Online", "Hybrid"];
const TOPICS      = ["Energy", "Water", "Agriculture", "Policy", "Finance", "Innovation", "Resilience", "Advocacy", "Biodiversity"];

const TYPE_COLORS: Record<string, string> = {
  Conference: "#059669", Summit: "#047857", Hackathon: "#10B981",
  Webinar: "#34D399", Workshop: "#065F46", Competition: "#059669",
  Bootcamp: "#047857", Dialogue: "#10B981",
};

// ── Add Manual Event Modal ────────────────────────────────────
function AddEventModal({ onSave, onClose }: { onSave: (data: any) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState({
    title: "", description: "", url: "", event_type: "Workshop",
    format: "In-person", event_date: "", location: "", topic: "Energy",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title || !form.event_date || !form.location) {
      alert("Title, Date and Location are required.");
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  const field = (label: string, key: keyof typeof form, type = "text", options?: string[], required = false) => (
    <div>
      <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--dark)", display: "block", marginBottom: ".3rem" }}>
        {label}{required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      {options ? (
        <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit", background: "var(--card)", color: "var(--dark)" }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} rows={3}
          style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit", resize: "vertical", background: "var(--card)", color: "var(--dark)" }} />
      ) : (
        <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit", background: "var(--card)", color: "var(--dark)" }} />
      )}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "var(--card)", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: "var(--dark)" }}>Add Event Manually</h2>
            <p style={{ fontSize: ".78rem", color: "var(--muted-foreground)", marginTop: ".2rem" }}>This will be saved to the database and shown on the public site immediately.</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {field("Event Title", "title", "text", undefined, true)}
          {field("Description", "description", "textarea")}
          {field("Event URL / Registration Link", "url", "url")}
          {field("Event Type", "event_type", "select", EVENT_TYPES.filter((t) => t !== "All"))}
          {field("Format", "format", "select", ["In-person", "Online", "Hybrid"])}
          {field("Event Date (e.g. Jun 15, 2026)", "event_date", "text", undefined, true)}
          {field("Location", "location", "text", undefined, true)}
          {field("Topic", "topic", "select", TOPICS)}
        </div>
        <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn-g">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-green" style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
            <Save size={14} /> {saving ? "Saving…" : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────
function EditModal({ event, onSave, onClose }: { event: LiveEvent; onSave: (u: Partial<LiveEvent>) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState({
    title: event.title,
    description: event.description || "",
    event_type: event.event_type,
    format: event.format,
    event_date: event.event_date || "",
    location: event.location || "",
    topic: event.topic,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...form, event_date: form.event_date || null });
    setSaving(false);
    onClose();
  };

  const field = (label: string, key: keyof typeof form, type = "text", options?: string[]) => (
    <div>
      <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--dark)", display: "block", marginBottom: ".3rem" }}>{label}</label>
      {options ? (
        <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit" }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} rows={3}
          style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit", resize: "vertical" }} />
      ) : (
        <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit" }} />
      )}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "var(--card)", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem" }}>Edit Event</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {field("Title", "title")}
          {field("Description", "description", "textarea")}
          {field("Event Type", "event_type", "select", EVENT_TYPES.filter((t) => t !== "All"))}
          {field("Format", "format", "select", ["In-person", "Online", "Hybrid"])}
          {field("Event Date (e.g. Jun 15, 2026)", "event_date")}
          {field("Location", "location")}
          {field("Topic", "topic", "select", TOPICS)}
        </div>
        <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn-g">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-green" style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
            <Save size={14} /> {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function EventsAdmin() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editEvent, setEditEvent] = useState<LiveEvent | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (typeFilter !== "All") params.set("type", typeFilter);
      const res = await fetch(`/api/events?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setEvents(json.data || []);
      setBackendOnline(true);
    } catch (err: any) {
      setError(err.message);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const addManual = async (data: any) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "manual", is_approved: true, climate_score: 9.99 }),
      });
      if (!res.ok) throw new Error("Failed to add");
      const json = await res.json();
      setEvents((prev) => [json.data, ...prev]);
    } catch (err: any) { alert("Failed to add: " + err.message); }
  };

  const triggerFetch = async () => {
    setFetching(true);
    try {
      await fetch(`/api/events/fetch`, { method: "POST" });
      setTimeout(() => { loadEvents(); setFetching(false); }, 5000);
    } catch { setFetching(false); }
  };

  const updateEvent = async (id: string, changes: Partial<LiveEvent>) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error("Update failed");
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...changes } : e)));
    } catch (err: any) { alert("Failed to update: " + err.message); }
  };

  const toggleApprove = (event: LiveEvent) => updateEvent(event.id, { is_approved: !event.is_approved });

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event permanently?")) return;
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) { alert("Failed to delete: " + err.message); }
  };

  const filtered = events.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q);
  });

  const approved = filtered.filter((e) => e.is_approved);
  const hidden   = filtered.filter((e) => !e.is_approved);

  return (
    <>
      <PageHead
        title="Events Management"
        sub="Live climate events scraped every 12 hours — Kenya and international. Edit, approve or hide."
        action={
          <div style={{ display: "flex", gap: ".6rem" }}>
            <button onClick={() => setShowAdd(true)} className="btn-g"
              style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".82rem" }}>
              <Plus size={14} /> Add Manually
            </button>
            <button onClick={triggerFetch} disabled={fetching || !backendOnline} className="btn-green"
              style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".82rem" }}>
              <RefreshCw size={14} style={{ animation: fetching ? "spin 1s linear infinite" : "none" }} />
              {fetching ? "Scraping…" : "Scrape New"}
            </button>
          </div>
        }
      />

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".75rem", color: backendOnline ? "var(--green)" : "#dc2626", fontFamily: "var(--fm)" }}>
          {backendOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          {backendOnline ? `Backend online · ${events.length} events` : "Backend offline — start with npm run dev in backend/"}
        </span>
        <span style={{ fontSize: ".75rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>
          ✅ {approved.length} visible · 🚫 {hidden.length} hidden
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
          {EVENT_TYPES.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{ padding: ".3rem .75rem", borderRadius: 20, fontSize: ".72rem", fontFamily: "var(--fs)", fontWeight: 600, cursor: "pointer", border: "1px solid", borderColor: typeFilter === t ? "var(--green)" : "var(--border)", background: typeFilter === t ? "var(--green)" : "#fff", color: typeFilter === t ? "#fff" : "var(--muted-foreground)", transition: "all .15s" }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <Search size={14} style={{ position: "absolute", left: ".6rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events…"
            style={{ paddingLeft: "2rem", paddingRight: ".75rem", paddingTop: ".4rem", paddingBottom: ".4rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".82rem", fontFamily: "inherit", width: 200 }} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "1rem", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, marginBottom: "1rem", fontSize: ".85rem", color: "#991B1B" }}>
          <strong>API error:</strong> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
          <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto .75rem", display: "block" }} />
          Loading events…
        </div>
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
          {filtered.map((event) => (
            <div key={event.id} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: ".9rem 1rem", background: "var(--card)", border: `1px solid ${event.is_approved ? "var(--border)" : "#FECACA"}`, borderRadius: 10, opacity: event.is_approved ? 1 : 0.65 }}>
              {/* Color dot */}
              <div style={{ flexShrink: 0, width: 10, height: 10, borderRadius: "50%", background: TYPE_COLORS[event.event_type] || "#059669", marginTop: 6 }} />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap", marginBottom: ".25rem" }}>
                  <span style={{ fontSize: ".65rem", padding: ".15rem .45rem", background: TYPE_COLORS[event.event_type] || "#059669", color: "#fff", borderRadius: 4, fontFamily: "var(--fm)", fontWeight: 600 }}>{event.event_type}</span>
                  <span style={{ fontSize: ".65rem", padding: ".15rem .45rem", background: event.format === "Online" ? "#EFF6FF" : "#ECFDF5", color: event.format === "Online" ? "#1D4ED8" : "#065F46", borderRadius: 4, fontFamily: "var(--fm)", display: "flex", alignItems: "center", gap: ".2rem" }}>
                    {event.format === "Online" ? <Monitor size={10} /> : <Users size={10} />}{event.format}
                  </span>
                  <span style={{ fontSize: ".65rem", padding: ".15rem .45rem", background: "var(--cd)", color: "var(--muted-foreground)", borderRadius: 4, fontFamily: "var(--fm)", border: "1px solid var(--border)" }}>{event.topic}</span>
                  {!event.is_approved && <span style={{ fontSize: ".6rem", padding: ".1rem .4rem", background: "#FEF2F2", color: "#991B1B", borderRadius: 4, fontFamily: "var(--fm)" }}>Hidden</span>}
                </div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: "var(--dark)", lineHeight: 1.3 }}>{event.title}</div>
                {event.description && (
                  <div style={{ fontSize: ".75rem", color: "var(--muted-foreground)", marginTop: ".2rem", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {event.description}
                  </div>
                )}
                <div style={{ display: "flex", gap: ".75rem", marginTop: ".35rem", flexWrap: "wrap" }}>
                  {event.event_date && (
                    <span style={{ fontSize: ".7rem", color: "var(--green)", fontWeight: 600, display: "flex", alignItems: "center", gap: ".25rem" }}>
                      <Calendar size={11} /> {event.event_date}
                    </span>
                  )}
                  {event.location && (
                    <span style={{ fontSize: ".7rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: ".25rem" }}>
                      <MapPin size={11} /> {event.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: ".4rem", flexShrink: 0, alignItems: "center" }}>
                <a href={event.url} target="_blank" rel="noopener noreferrer" title="Open" style={{ padding: ".35rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-foreground)", display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => setEditEvent(event)} title="Edit" style={{ padding: ".35rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => toggleApprove(event)} title={event.is_approved ? "Hide" : "Show"}
                  style={{ padding: ".35rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", border: "1px solid", borderColor: event.is_approved ? "#A7F3D0" : "#FECACA", background: event.is_approved ? "#ECFDF5" : "#FEF2F2", color: event.is_approved ? "#065F46" : "#991B1B" }}>
                  {event.is_approved ? <Check size={14} /> : <X size={14} />}
                </button>
                <button onClick={() => deleteEvent(event.id)} title="Delete" style={{ padding: ".35rem", borderRadius: 6, border: "1px solid #FECACA", background: "#FEF2F2", color: "#991B1B", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted-foreground)" }}>
          <div style={{ fontFamily: "var(--fs)", fontWeight: 700, marginBottom: ".5rem" }}>No events found</div>
          <div style={{ fontSize: ".85rem", marginBottom: "1.25rem" }}>
            {backendOnline ? "Click 'Scrape New Events' to fetch the latest." : "Start the backend server first."}
          </div>
          {backendOnline && (
            <button onClick={triggerFetch} className="btn-green" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
              <RefreshCw size={14} /> Scrape Now
            </button>
          )}
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <AddEventModal
          onSave={addManual}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Edit modal */}
      {editEvent && (
        <EditModal
          event={editEvent}
          onSave={(changes) => updateEvent(editEvent.id, changes)}
          onClose={() => setEditEvent(null)}
        />
      )}
    </>
  );
}
