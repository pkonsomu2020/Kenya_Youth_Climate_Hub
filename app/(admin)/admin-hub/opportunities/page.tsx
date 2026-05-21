"use client";

import { PageHead } from "@/components/admin/AdminUI";
import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw, ExternalLink, Check, X, Pencil,
  Trash2, Search, Wifi, WifiOff, Save, Clock, DollarSign, Plus,
} from "lucide-react";

type Opportunity = {
  id: string;
  name: string;
  title: string;
  desc: string;
  url: string;
  source: string;
  provider: string;
  type: string;
  topic: string;
  deadline: string;
  amount: string | null;
  climate_score: number;
  color: string;
  is_approved: boolean;
};

const TYPES  = ["All", "Grant", "Fellowship", "Internship", "Competition", "Job", "Accelerator"];
const TOPICS = ["All", "Energy", "Water", "Agriculture", "Policy", "Finance", "Innovation", "Resilience", "Advocacy"];

const TYPE_COLORS: Record<string, string> = {
  Grant: "#059669", Fellowship: "#047857", Internship: "#10B981",
  Competition: "#34D399", Job: "#065F46", Accelerator: "#059669",
};

// ── Add Manual Opportunity Modal ─────────────────────────────
function AddModal({ onSave, onClose }: { onSave: (data: any) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState({
    title: "", desc: "", provider: "", url: "", type: "Grant",
    topic: "Energy", deadline: "", amount: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title || !form.desc || !form.provider) {
      alert("Title, Description and Provider are required.");
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
            <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: "var(--dark)" }}>Add Opportunity Manually</h2>
            <p style={{ fontSize: ".78rem", color: "var(--muted-foreground)", marginTop: ".2rem" }}>This will be saved to the database and shown on the public site immediately.</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {field("Title", "title", "text", undefined, true)}
          {field("Description", "desc", "textarea", undefined, true)}
          {field("Provider / Organization", "provider", "text", undefined, true)}
          {field("Application URL", "url", "url")}
          {field("Type", "type", "select", TYPES.filter((t) => t !== "All"))}
          {field("Topic", "topic", "select", TOPICS.filter((t) => t !== "All"))}
          {field("Deadline (e.g. Dec 31, 2026)", "deadline")}
          {field("Amount / Stipend (e.g. KES 500,000)", "amount")}
        </div>
        <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn-g">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-green" style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
            <Save size={14} /> {saving ? "Saving…" : "Add Opportunity"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────
function EditModal({ opp, onSave, onClose }: { opp: Opportunity; onSave: (u: Partial<Opportunity>) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState({
    title: opp.name || opp.title,
    desc: opp.desc || "",
    provider: opp.provider || "",
    type: opp.type,
    topic: opp.topic,
    deadline: opp.deadline || "",
    amount: opp.amount || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ title: form.title, desc: form.desc, provider: form.provider, type: form.type, topic: form.topic, deadline: form.deadline, amount: form.amount || null });
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
          <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem" }}>Edit Opportunity</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {field("Title", "title")}
          {field("Description", "desc", "textarea")}
          {field("Provider / Organization", "provider")}
          {field("Type", "type", "select", TYPES.filter((t) => t !== "All"))}
          {field("Topic", "topic", "select", TOPICS.filter((t) => t !== "All"))}
          {field("Deadline", "deadline")}
          {field("Amount / Stipend", "amount")}
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
export default function OppsAdmin() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [editOpp, setEditOpp] = useState<Opportunity | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  const loadOpps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (type !== "All") params.set("type", type);
      const res = await fetch(`/api/opportunities?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setOpps(json.data || []);
      setBackendOnline(true);
    } catch (err: any) {
      setError(err.message);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => { loadOpps(); }, [loadOpps]);

  const addManual = async (data: any) => {
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "manual", is_approved: true, climate_score: 9.99 }),
      });
      if (!res.ok) throw new Error("Failed to add");
      const json = await res.json();
      setOpps((prev) => [json.data, ...prev]);
    } catch (err: any) { alert("Failed to add: " + err.message); }
  };

  const triggerFetch = async () => {
    setFetching(true);
    try {
      await fetch(`/api/opportunities/fetch`, { method: "POST" });
      setTimeout(() => { loadOpps(); setFetching(false); }, 5000);
    } catch { setFetching(false); }
  };

  const updateOpp = async (id: string, changes: Partial<Opportunity>) => {
    try {
      const res = await fetch(`/api/opportunities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error("Update failed");
      setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, ...changes } : o)));
    } catch (err: any) { alert("Failed to update: " + err.message); }
  };

  const toggleApprove = (opp: Opportunity) => updateOpp(opp.id, { is_approved: !opp.is_approved });

  const deleteOpp = async (id: string) => {
    if (!confirm("Delete this opportunity permanently?")) return;
    try {
      await fetch(`/api/opportunities/${id}`, { method: "DELETE" });
      setOpps((prev) => prev.filter((o) => o.id !== id));
    } catch (err: any) { alert("Failed to delete: " + err.message); }
  };

  const filtered = opps.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (o.name || o.title)?.toLowerCase().includes(q) || o.provider?.toLowerCase().includes(q) || o.desc?.toLowerCase().includes(q);
  });

  const approved = filtered.filter((o) => o.is_approved);
  const hidden   = filtered.filter((o) => !o.is_approved);

  return (
    <>
      <PageHead
        title="Opportunities Board"
        sub="Live climate opportunities scraped automatically every 12 hours. Edit, approve or hide."
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

      {/* Status bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".75rem", color: backendOnline ? "var(--green)" : "#dc2626", fontFamily: "var(--fm)" }}>
          {backendOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          {backendOnline ? `Backend online · ${opps.length} opportunities` : "Backend offline — start with npm run dev in backend/"}
        </span>
        <span style={{ fontSize: ".75rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>
          ✅ {approved.length} visible · 🚫 {hidden.length} hidden
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
          {TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)}
              style={{ padding: ".3rem .75rem", borderRadius: 20, fontSize: ".72rem", fontFamily: "var(--fs)", fontWeight: 600, cursor: "pointer", border: "1px solid", borderColor: type === t ? "var(--green)" : "var(--border)", background: type === t ? "var(--green)" : "#fff", color: type === t ? "#fff" : "var(--muted-foreground)", transition: "all .15s" }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <Search size={14} style={{ position: "absolute", left: ".6rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
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
          Loading opportunities…
        </div>
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
          {filtered.map((opp) => (
            <div key={opp.id} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: ".9rem 1rem", background: "var(--card)", border: `1px solid ${opp.is_approved ? "var(--border)" : "#FECACA"}`, borderRadius: 10, opacity: opp.is_approved ? 1 : 0.65 }}>
              {/* Color dot */}
              <div style={{ flexShrink: 0, width: 10, height: 10, borderRadius: "50%", background: TYPE_COLORS[opp.type] || "#059669", marginTop: 6 }} />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap", marginBottom: ".25rem" }}>
                  <span style={{ fontSize: ".65rem", padding: ".15rem .45rem", background: TYPE_COLORS[opp.type] || "#059669", color: "#fff", borderRadius: 4, fontFamily: "var(--fm)", fontWeight: 600 }}>{opp.type}</span>
                  <span style={{ fontSize: ".65rem", padding: ".15rem .45rem", background: "var(--cd)", color: "var(--muted-foreground)", borderRadius: 4, fontFamily: "var(--fm)", border: "1px solid var(--border)" }}>{opp.topic}</span>
                  {opp.amount && (
                    <span style={{ fontSize: ".65rem", color: "var(--green)", fontWeight: 700, fontFamily: "var(--fs)", display: "flex", alignItems: "center", gap: ".2rem" }}>
                      <DollarSign size={11} />{opp.amount}
                    </span>
                  )}
                  {!opp.is_approved && <span style={{ fontSize: ".6rem", padding: ".1rem .4rem", background: "#FEF2F2", color: "#991B1B", borderRadius: 4, fontFamily: "var(--fm)" }}>Hidden</span>}
                </div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: "var(--dark)", lineHeight: 1.3 }}>{opp.name || opp.title}</div>
                <div style={{ fontSize: ".72rem", color: "var(--muted-foreground)", marginTop: ".15rem" }}>{opp.provider}</div>
                {opp.desc && (
                  <div style={{ fontSize: ".75rem", color: "var(--muted-foreground)", marginTop: ".25rem", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {opp.desc}
                  </div>
                )}
                {opp.deadline && (
                  <div style={{ fontSize: ".7rem", color: "var(--green)", fontWeight: 600, marginTop: ".3rem", display: "flex", alignItems: "center", gap: ".25rem" }}>
                    <Clock size={11} /> {opp.deadline}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: ".4rem", flexShrink: 0, alignItems: "center" }}>
                <a href={opp.url} target="_blank" rel="noopener noreferrer" title="Open" style={{ padding: ".35rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-foreground)", display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => setEditOpp(opp)} title="Edit" style={{ padding: ".35rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => toggleApprove(opp)} title={opp.is_approved ? "Hide" : "Show"}
                  style={{ padding: ".35rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", border: "1px solid", borderColor: opp.is_approved ? "#A7F3D0" : "#FECACA", background: opp.is_approved ? "#ECFDF5" : "#FEF2F2", color: opp.is_approved ? "#065F46" : "#991B1B" }}>
                  {opp.is_approved ? <Check size={14} /> : <X size={14} />}
                </button>
                <button onClick={() => deleteOpp(opp.id)} title="Delete" style={{ padding: ".35rem", borderRadius: 6, border: "1px solid #FECACA", background: "#FEF2F2", color: "#991B1B", cursor: "pointer", display: "flex", alignItems: "center" }}>
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
          <div style={{ fontFamily: "var(--fs)", fontWeight: 700, marginBottom: ".5rem" }}>No opportunities found</div>
          <div style={{ fontSize: ".85rem", marginBottom: "1.25rem" }}>
            {backendOnline ? "Click 'Scrape New Opportunities' to fetch the latest." : "Start the backend server first."}
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
        <AddModal
          onSave={addManual}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Edit modal */}
      {editOpp && (
        <EditModal
          opp={editOpp}
          onSave={(changes) => updateOpp(editOpp.id, changes)}
          onClose={() => setEditOpp(null)}
        />
      )}
    </>
  );
}
