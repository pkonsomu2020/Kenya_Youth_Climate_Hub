"use client";
import { Bot } from "lucide-react";

export function AIFab() {
  return (
    <a href="#" className="ai-fab" onClick={(e) => { e.preventDefault(); alert("Climate AI Assistant — coming soon!"); }}>
      <div className="ai-icon"><Bot size={20} /></div>Climate AI
    </a>
  );
}
