"use client";

import { PageHead } from "@/components/admin/AdminUI";
import { useState, useEffect, useCallback } from "react";
import {
  Globe, RefreshCw, ExternalLink, Check, X, Pencil,
  Trash2, Search, Wifi, WifiOff, Save,
} from "lucide-react";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: string;
  date: string;
  published_at: string;
  category: string;
  relevance: string;
  ai_score: number;
  image_url: string | null;
  gradient: string;
  icon: string;
  is_approved: boolean;
};

const CATS = ["All", "News", "Climate Insights", "Success Stories", "Events Recap", "Partner Updates"];

const GRADIENTS: Record<string, string> = {
  News: "#059669",
  "Climate Insights": "#047857",
  "Success Stories": "#10B981",
  "Events Recap": "#10B981",
  "Partner Updates": "#059669",
};

// ── Edit Modal ────────────────────────────────────────────────
function EditModal({
  article,
  onSave,
  onClose,
}: {
  article: Article;
  onSave: (updated: Partial<Article>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: article.title,
    excerpt: article.excerpt || "",
    category: article.category,
    source: article.source,
    image_url: article.image_url || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      title: form.title,
      excerpt: form.excerpt,
      category: form.category,
      source: form.source,
      image_url: form.image_url || null,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        background: "var(--card)", borderRadius: 14, padding: "1.75rem",
        width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem" }}>Edit Article</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--dark)", display: "block", marginBottom: ".3rem" }}>Title</label>
            <textarea
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              rows={2}
              style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit", resize: "vertical" }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--dark)", display: "block", marginBottom: ".3rem" }}>Excerpt / Summary</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
              style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit", resize: "vertical" }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--dark)", display: "block", marginBottom: ".3rem" }}>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit" }}
            >
              {CATS.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--dark)", display: "block", marginBottom: ".3rem" }}>Source</label>
            <input
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit" }}
            />
          </div>

          {/* Image URL */}
          <div>
            <label style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--dark)", display: "block", marginBottom: ".3rem" }}>Thumbnail Image URL</label>
            <input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              style={{ width: "100%", padding: ".6rem .8rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".88rem", fontFamily: "inherit" }}
            />
            {form.image_url && (
              <img
                src={form.image_url}
                alt="preview"
                style={{ marginTop: ".5rem", width: "100%", height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn-g">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-green"
            style={{ display: "flex", alignItems: "center", gap: ".4rem" }}
          >
            <Save size={14} /> {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function NewsAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);

  // ── Fetch articles from backend ───────────────────────────
  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (cat !== "All") params.set("category", cat);
      const res = await fetch(`/api/news?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setArticles(json.data || []);
      setBackendOnline(true);
    } catch (err: any) {
      setError(err.message);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, [cat]);

  useEffect(() => { loadArticles(); }, [loadArticles]);

  // ── Trigger a fresh fetch from RSS ───────────────────────
  const triggerFetch = async () => {
    setFetching(true);
    try {
      await fetch(`/api/news/fetch`, { method: "POST" });
      // Wait a moment then reload
      setTimeout(() => { loadArticles(); setFetching(false); }, 3000);
    } catch {
      setFetching(false);
    }
  };

  // ── Update article in Supabase ────────────────────────────
  const updateArticle = async (id: string, changes: Partial<Article>) => {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error("Update failed");
      setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...changes } : a)));
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    }
  };

  // ── Toggle approve/hide ───────────────────────────────────
  const toggleApprove = async (article: Article) => {
    await updateArticle(article.id, { is_approved: !article.is_approved });
  };

  // ── Delete article ────────────────────────────────────────
  const deleteArticle = async (id: string) => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    try {
      await fetch(`/api/news/${id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  // ── Filter by search ──────────────────────────────────────
  const filtered = articles.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.source.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q);
  });

  const approved = filtered.filter((a) => a.is_approved);
  const hidden = filtered.filter((a) => !a.is_approved);

  return (
    <>
      <PageHead
        title="News Management"
        sub="Live climate news fetched automatically every 3 hours. Edit, approve or hide articles."
        action={
          <button
            onClick={triggerFetch}
            disabled={fetching || !backendOnline}
            className="btn-green"
            style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".82rem" }}
          >
            <RefreshCw size={14} style={{ animation: fetching ? "spin 1s linear infinite" : "none" }} />
            {fetching ? "Fetching…" : "Fetch New Articles"}
          </button>
        }
      />

      {/* Status bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".75rem", color: backendOnline ? "var(--green)" : "#dc2626", fontFamily: "var(--fm)" }}>
          {backendOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          {backendOnline ? `Backend online · ${articles.length} articles` : "Backend offline — start with npm run dev in backend/"}
        </span>
        <span style={{ fontSize: ".75rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>
          ✅ {approved.length} visible · 🚫 {hidden.length} hidden
        </span>
      </div>

      {/* Filters row */}
      <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        {/* Category pills */}
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                padding: ".3rem .75rem", borderRadius: 20, fontSize: ".72rem",
                fontFamily: "var(--fs)", fontWeight: 600, cursor: "pointer",
                border: "1px solid",
                borderColor: cat === c ? "var(--green)" : "var(--border)",
                background: cat === c ? "var(--green)" : "#fff",
                color: cat === c ? "#fff" : "var(--muted-foreground)",
                transition: "all .15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <Search size={14} style={{ position: "absolute", left: ".6rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            style={{
              paddingLeft: "2rem", paddingRight: ".75rem", paddingTop: ".4rem", paddingBottom: ".4rem",
              border: "1px solid var(--border)", borderRadius: 8, fontSize: ".82rem",
              fontFamily: "inherit", width: 220,
            }}
          />
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
          Loading articles…
        </div>
      )}

      {/* Articles table */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
          {filtered.map((article) => (
            <div
              key={article.id}
              style={{
                display: "flex", gap: "1rem", alignItems: "flex-start",
                padding: ".9rem 1rem", background: "var(--card)",
                border: `1px solid ${article.is_approved ? "var(--border)" : "#FECACA"}`,
                borderRadius: 10,
                opacity: article.is_approved ? 1 : 0.65,
                transition: "all .2s",
              }}
            >
              {/* Thumbnail */}
              <div style={{ flexShrink: 0, width: 72, height: 52, borderRadius: 8, overflow: "hidden", background: GRADIENTS[article.category] || "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <Globe size={20} color="rgba(255,255,255,.5)" />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: ".5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: ".65rem", padding: ".15rem .45rem", background: GRADIENTS[article.category] || "#059669", color: "#fff", borderRadius: 4, fontFamily: "var(--fm)", fontWeight: 600, flexShrink: 0 }}>
                    {article.category}
                  </span>
                  <span style={{ fontSize: ".65rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>
                    {article.source} · {article.date}
                  </span>
                  {article.ai_score >= 0.85 && (
                    <span style={{ fontSize: ".6rem", padding: ".1rem .4rem", background: "#ECFDF5", color: "#065F46", borderRadius: 4, fontFamily: "var(--fm)" }}>
                      AI {(article.ai_score * 100).toFixed(0)}%
                    </span>
                  )}
                  {!article.is_approved && (
                    <span style={{ fontSize: ".6rem", padding: ".1rem .4rem", background: "#FEF2F2", color: "#991B1B", borderRadius: 4, fontFamily: "var(--fm)" }}>
                      Hidden
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".88rem", color: "var(--dark)", marginTop: ".3rem", lineHeight: 1.3 }}>
                  {article.title}
                </div>
                {article.excerpt && (
                  <div style={{ fontSize: ".75rem", color: "var(--muted-foreground)", marginTop: ".2rem", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {article.excerpt}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: ".4rem", flexShrink: 0, alignItems: "center" }}>
                {/* Open article */}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open article"
                  style={{ padding: ".35rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-foreground)", display: "flex", alignItems: "center", cursor: "pointer", textDecoration: "none" }}
                >
                  <ExternalLink size={14} />
                </a>

                {/* Edit */}
                <button
                  onClick={() => setEditArticle(article)}
                  title="Edit article"
                  style={{ padding: ".35rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  <Pencil size={14} />
                </button>

                {/* Approve / Hide toggle */}
                <button
                  onClick={() => toggleApprove(article)}
                  title={article.is_approved ? "Hide from site" : "Show on site"}
                  style={{
                    padding: ".35rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center",
                    border: "1px solid",
                    borderColor: article.is_approved ? "#A7F3D0" : "#FECACA",
                    background: article.is_approved ? "#ECFDF5" : "#FEF2F2",
                    color: article.is_approved ? "#065F46" : "#991B1B",
                  }}
                >
                  {article.is_approved ? <Check size={14} /> : <X size={14} />}
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteArticle(article.id)}
                  title="Delete permanently"
                  style={{ padding: ".35rem", borderRadius: 6, border: "1px solid #FECACA", background: "#FEF2F2", color: "#991B1B", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
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
          <Globe size={40} style={{ margin: "0 auto 1rem", opacity: 0.3, display: "block" }} />
          <div style={{ fontFamily: "var(--fs)", fontWeight: 700, marginBottom: ".5rem" }}>No articles found</div>
          <div style={{ fontSize: ".85rem", marginBottom: "1.25rem" }}>
            {backendOnline ? "Click 'Fetch New Articles' to pull the latest climate news." : "Start the backend server first."}
          </div>
          {backendOnline && (
            <button onClick={triggerFetch} className="btn-green" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
              <RefreshCw size={14} /> Fetch Now
            </button>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editArticle && (
        <EditModal
          article={editArticle}
          onSave={(changes) => updateArticle(editArticle.id, changes)}
          onClose={() => setEditArticle(null)}
        />
      )}
    </>
  );
}
