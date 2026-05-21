"use client";

import Link from "next/link";
import { useAdmin, StatCard, PageHead } from "@/components/admin/AdminUI";
import { BookOpen, Target, Calendar, Newspaper, Settings, Globe } from "lucide-react";

export default function Dashboard() {
  const { content, reset } = useAdmin();
  // Safe access — guard against undefined arrays from old localStorage data
  const messages = content.messages ?? [];
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHead
        title="Dashboard"
        sub="Overview of everything live on the public site."
      />

      <div className="ah-stats">
        <StatCard label="Resources"        value={(content.resources ?? []).length} />
        <StatCard label="Opportunities"    value={(content.opportunities ?? []).length || 0} accent="var(--green)" />
        <StatCard label="Events"           value={(content.events ?? []).length || 0} />
        <StatCard label="News posts"       value={(content.posts ?? []).length || 0} />
        <StatCard label="Unread messages"  value={unread} accent={unread ? "var(--red)" : undefined} />
        <StatCard label="Funding mobilised" value={content.settings?.impactFunding ?? "—"} accent="var(--green)" />
      </div>

      <div className="ah-grid-2">
        <div className="ah-panel">
          <div className="ah-panel-h">Quick actions</div>
          <div className="ah-quick">
            <Link href="/admin-hub/resources"    className="ah-quick-i"><BookOpen  size={16} /> Add resource</Link>
            <Link href="/admin-hub/opportunities" className="ah-quick-i"><Target   size={16} /> Post opportunity</Link>
            <Link href="/admin-hub/events"       className="ah-quick-i"><Calendar  size={16} /> Schedule event</Link>
            <Link href="/admin-hub/news"         className="ah-quick-i"><Newspaper size={16} /> Manage news</Link>
            <Link href="/admin-hub/settings"     className="ah-quick-i"><Settings  size={16} /> Site settings</Link>
          </div>
        </div>

        <div className="ah-panel">
          <div className="ah-panel-h">Recent messages</div>
          <ul className="ah-list">
            {messages.slice(0, 4).map((m) => (
              <li key={m.id} className="ah-list-i">
                <div>
                  <div style={{ fontWeight: 700, fontFamily: "var(--fs)" }}>{m.subject}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--muted-foreground)" }}>{m.from} · {m.date}</div>
                </div>
                {!m.read && <span className="ah-dot-red" />}
              </li>
            ))}
            {messages.length === 0 && (
              <li style={{ color: "var(--muted-foreground)", fontSize: ".85rem" }}>No messages yet.</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
