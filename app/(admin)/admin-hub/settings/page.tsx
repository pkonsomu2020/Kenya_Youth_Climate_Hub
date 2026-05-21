"use client";

import { useState, useEffect } from "react";
import { PageHead, useAdmin } from "@/components/admin/AdminUI";

export default function SettingsAdmin() {
  const { content, update } = useAdmin();
  const [s, setS] = useState(content.settings);
  const [saved, setSaved] = useState(false);
  useEffect(() => setS(content.settings), [content.settings]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    update("settings", { ...s, impactProjects: Number(s.impactProjects), impactCounties: Number(s.impactCounties), impactYouth: Number(s.impactYouth) });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <PageHead title="Site Settings" sub="Hero copy and impact metrics shown on the homepage." />
      <form onSubmit={save} className="ah-panel" style={{ display: "grid", gap: "1rem", maxWidth: 720 }}>
        <div>
          <label className="k-label">Hero title</label>
          <input className="k-input" value={s.heroTitle} onChange={(e) => setS({ ...s, heroTitle: e.target.value })} />
        </div>
        <div>
          <label className="k-label">Hero subtitle</label>
          <textarea className="k-input" rows={2} value={s.heroSub} onChange={(e) => setS({ ...s, heroSub: e.target.value })} />
        </div>
        <div className="ah-grid-2">
          <div><label className="k-label">Projects</label><input className="k-input" type="number" value={s.impactProjects} onChange={(e) => setS({ ...s, impactProjects: Number(e.target.value) })} /></div>
          <div><label className="k-label">Counties reached</label><input className="k-input" type="number" value={s.impactCounties} onChange={(e) => setS({ ...s, impactCounties: Number(e.target.value) })} /></div>
          <div><label className="k-label">Youth engaged</label><input className="k-input" type="number" value={s.impactYouth} onChange={(e) => setS({ ...s, impactYouth: Number(e.target.value) })} /></div>
          <div><label className="k-label">Funding mobilised</label><input className="k-input" value={s.impactFunding} onChange={(e) => setS({ ...s, impactFunding: e.target.value })} /></div>
        </div>
        <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
          <button type="submit" className="btn-green">Save settings</button>
          {saved && <span style={{ color: "var(--green)", fontSize: ".82rem", fontWeight: 600 }}>✓ Saved</span>}
        </div>
      </form>
    </>
  );
}
