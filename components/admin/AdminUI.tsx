"use client";

import { useContent } from "@/lib/contentStore";
import React from "react";

export function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="ah-stat">
      <div className="ah-stat-l">{label}</div>
      <div className="ah-stat-v" style={accent ? { color: accent } : undefined}>{value}</div>
    </div>
  );
}

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="ah-pagehead">
      <div>
        <h1 className="ah-h1">{title}</h1>
        {sub && <p className="ah-sub">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function useAdmin() { return useContent(); }
