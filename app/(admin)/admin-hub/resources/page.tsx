"use client";

import { PageHead } from "@/components/admin/AdminUI";
import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw, ExternalLink, Check, X, Pencil,
  Trash2, Search, Wifi, WifiOff, Save, Star, Code2, Flame,
} from "lucide-react";

type LibraryTool = {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  topic: string;
  use_case: string | null;
  difficulty: string;
  is_free: boolean;
  tech_stack: string | null;
  stars: string | null;
  trending_score: number;
  climate_score: number;
  color: string;
  badge: string;
  is_approved: boolean;
};

const CATEGORIES = ["All", "Open Source Tool", "Dataset", "Data Platform", "Calculator", "AI Tool", "API", "Framework", "Toolkit", "Report", "Guide"];
const TOPICS     = ["Carbon", "Energy", "Water", "Agriculture", "Climate Modeling", "Biodiversity", "Policy", "Finance", "Innovation"];
const DIFFS      = ["Beginner", "Intermediate", "Advanced"];

function EditModal({ tool, onSave, onClose }: { tool: LibraryTool; onSave: (u: Partial<LibraryTool>) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState({
    title: tool.title,
    description: tool.description || "",
    use_case: tool.use_case || "",
    category: tool.category,
    topic: tool.topic,
    difficulty: tool.difficulty,
    tech_stack: tool.tech_stack || "",
    is_free: tool.is_free,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...form, use_case: form.use_case || null, tech_stack: form.tech_stack || null });
    setSaving(false);
    onClose();
  };

  const field = (label: string, key: keyof typeof form, type = "text", options?: string[]) => (
    <div>
      <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--dark)", display: "block", marginBottom: ".3rem" }}>{label}</label>
      {options ? (
        <select value={String(form[key])} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit" }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={String(form[key])} onChange={(e) => setForm({ ...form, [key]: e.target.value })} rows={3}
          style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit", resize: "vertical" }} />
      ) : (
        <input value={String(form[key])} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit" }} />
      )}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "var(--card)", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem" }}>Edit Tool</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {field("Title", "title")}
          {field("Description", "description", "textarea")}
          {field("Use Case (what can users do with it?)", "use_case", "textarea")}
          {field("Category", "category", "select", CATEGORIES.filter((c) => c !== "All"))}
          {field("Topic", "topic", "select", TOPICS)}
          {field("Difficulty", "difficulty", "select", DIFFS)}
          {field("Tech Stack (e.g. Python, JavaScript)", "tech_stack")}
          <div>
            <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--dark)", display: "block", marginBottom: ".3rem" }}>Access</label>
            <div style={{ display: "flex", gap: ".75rem" }}>
              {[true, false].map((v) => (
                <label key={String(v)} style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem", cursor: "pointer" }}>
                  <input type="radio" checked={form.is_free === v} onChange={() => setForm({ ...form, is_free: v })} />
                  {v ? "Free / Open Source" : "Paid"}
                </label>
              ))}
            </div>
          </div>
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

export default function ResourcesAdmin() {
  const [tools, setTools] = useState<LibraryTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editTool, setEditTool] = useState<LibraryTool | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);

  const loadTools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "100", sort: "trending" });
      if (catFilter !== "All") params.set("category", catFilter);
      const res = await fetch(`/api/library?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setTools(json.data || []);
      setBackendOnline(true);
    } catch (err: any) {
      setError(err.message);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, [catFilter]);

  useEffect(() => { loadTools(); }, [loadTools]);

  const triggerFetch = async () => {
    setFetching(true);
    try {
      await fetch(`/api/library/fetch`, { method: "POST" });
      setTimeout(() => { loadTools(); setFetching(false); }, 5000);
    } catch { setFetching(false); }
  };

  const updateTool = async (id: string, changes: Partial<LibraryTool>) => {
    try {
      const res = await fetch(`/api/library/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error("Update failed");
      setTools((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    } catch (err: any) { alert("Failed to update: " + err.message); }
  };

  const toggleApprove = (tool: LibraryTool) => updateTool(tool.id, { is_approved: !tool.is_approved });

  const deleteTool = async (id: string) => {
    if (!confirm("Delete this tool permanently?")) return;
    try {
      await fetch(`/api/library/${id}`, { method: "DELETE" });
      setTools((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) { alert("Failed to delete: " + err.message); }
  };

  const filtered = tools.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.tech_stack?.toLowerCase().includes(q);
  });

  const approved = filtered.filter((t) => t.is_approved);
  const hidden   = filtered.filter((t) => !t.is_approved);

  return (
    <>
      <PageHead
        title="E-Library Tools"
        sub="Climate tools, datasets and libraries scraped daily from GitHub, data platforms and the web."
        action={
          <button onClick={triggerFetch} disabled={fetching || !backendOnline} className="btn-green"
            style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".82rem" }}>
            <RefreshCw size={14} style={{ animation: fetching ? "spin 1s linear infinite" : "none" }} />
            {fetching ? "Scraping…" : "Discover New Tools"}
          </button>
        }
      />

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".75rem", color: backendOnline ? "var(--green)" : "#dc2626", fontFamily: "var(--fm)" }}>
          {backendOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          {backendOnline ? `Backend online · ${tools.length} tools` : "Backend offline — start with npm run dev in backend/"}
        </span>
        <span style={{ fontSize: ".75rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>
          ✅ {approved.length} visible · 🚫 {hidden.length} hidden
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              style={{ padding: ".3rem .75rem", borderRadius: 20, fontSize: ".72rem", fontFamily: "var(--fs)", fontWeight: 600, cursor: "pointer", border: "1px solid", borderColor: catFilter === c ? "var(--green)" : "var(--border)", background: catFilter === c ? "var(--green)" : "#fff", color: catFilter === c ? "#fff" : "var(--muted-foreground)", transition: "all .15s" }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <Search size={14} style={{ position: "absolute", left: ".6rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools…"
            style={{ paddingLeft: "2rem", paddingRight: ".75rem", paddingTop: ".4rem", paddingBottom: ".4rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".82rem", fontFamily: "inherit", width: 200 }} />
        </div>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, marginBottom: "1rem", fontSize: ".85rem", color: "#991B1B" }}>
          <strong>API error:</strong> {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
          <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto .75rem", display: "block" }} />
          Loading tools…
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
          {filtered.map((tool) => (
            <div key={tool.id} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: ".9rem 1rem", background: "var(--card)", border: `1px solid ${tool.is_approved ? "var(--border)" : "#FECACA"}`, borderRadius: 10, opacity: tool.is_approved ? 1 : 0.65 }}>
              {/* Color dot */}
              <div style={{ flexShrink: 0, width: 10, height: 10, borderRadius: "50%", background: tool.color || "#059669", marginTop: 6 }} />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap", marginBottom: ".25rem" }}>
                  <span style={{ fontSize: ".65rem", padding: ".15rem .45rem", background: tool.color || "#059669", color: "#fff", borderRadius: 4, fontFamily: "var(--fm)", fontWeight: 600 }}>{tool.badge || tool.category}</span>
                  <span style={{ fontSize: ".65rem", padding: ".15rem .45rem", background: "var(--cd)", color: "var(--muted-foreground)", borderRadius: 4, fontFamily: "var(--fm)", border: "1px solid var(--border)" }}>{tool.topic}</span>
                  {tool.is_free && <span style={{ fontSize: ".6rem", padding: ".1rem .4rem", background: "#ECFDF5", color: "#065F46", borderRadius: 4, fontFamily: "var(--fm)" }}>Free</span>}
                  {tool.trending_score >= 8 && <span style={{ fontSize: ".6rem", padding: ".1rem .4rem", background: "#FEF9C3", color: "#92400E", borderRadius: 4, fontFamily: "var(--fm)", display: "flex", alignItems: "center", gap: ".2rem" }}><Flame size={9} />Trending</span>}
                  {!tool.is_approved && <span style={{ fontSize: ".6rem", padding: ".1rem .4rem", background: "#FEF2F2", color: "#991B1B", borderRadius: 4, fontFamily: "var(--fm)" }}>Hidden</span>}
                </div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: "var(--dark)", lineHeight: 1.3 }}>{tool.title}</div>
                {(tool.use_case || tool.description) && (
                  <div style={{ fontSize: ".75rem", color: "var(--muted-foreground)", marginTop: ".2rem", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {tool.use_case || tool.description}
                  </div>
                )}
                <div style={{ display: "flex", gap: ".75rem", marginTop: ".3rem", flexWrap: "wrap" }}>
                  {tool.tech_stack && <span style={{ fontSize: ".68rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: ".2rem" }}><Code2 size={10} />{tool.tech_stack}</span>}
                  {tool.stars && <span style={{ fontSize: ".68rem", color: "#d97706", display: "flex", alignItems: "center", gap: ".2rem" }}><Star size={10} />{tool.stars}</span>}
                  <span style={{ fontSize: ".68rem", color: "var(--muted-foreground)" }}>{tool.source}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: ".4rem", flexShrink: 0, alignItems: "center" }}>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" title="Open" style={{ padding: ".35rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-foreground)", display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => setEditTool(tool)} title="Edit" style={{ padding: ".35rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => toggleApprove(tool)} title={tool.is_approved ? "Hide" : "Show"}
                  style={{ padding: ".35rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", border: "1px solid", borderColor: tool.is_approved ? "#A7F3D0" : "#FECACA", background: tool.is_approved ? "#ECFDF5" : "#FEF2F2", color: tool.is_approved ? "#065F46" : "#991B1B" }}>
                  {tool.is_approved ? <Check size={14} /> : <X size={14} />}
                </button>
                <button onClick={() => deleteTool(tool.id)} title="Delete" style={{ padding: ".35rem", borderRadius: 6, border: "1px solid #FECACA", background: "#FEF2F2", color: "#991B1B", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted-foreground)" }}>
          <div style={{ fontFamily: "var(--fs)", fontWeight: 700, marginBottom: ".5rem" }}>No tools found</div>
          <div style={{ fontSize: ".85rem", marginBottom: "1.25rem" }}>
            {backendOnline ? "Click 'Discover New Tools' to scrape the latest." : "Start the backend server first."}
          </div>
          {backendOnline && (
            <button onClick={triggerFetch} className="btn-green" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
              <RefreshCw size={14} /> Discover Now
            </button>
          )}
        </div>
      )}

      {editTool && (
        <EditModal
          tool={editTool}
          onSave={(changes) => updateTool(editTool.id, changes)}
          onClose={() => setEditTool(null)}
        />
      )}
    </>
  );
}
