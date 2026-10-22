"use client";

import { PageHead } from "@/components/admin/AdminUI";
import { useContactMessages } from "@/lib/useContactMessages";

export default function MessagesAdmin() {
  const { messages, error, toggleRead, remove: removeMessage } = useContactMessages();

  const toggle = (id: string) => { void toggleRead(id); };
  const remove = (id: string) => { if (confirm("Delete message?")) void removeMessage(id); };

  return (
    <>
      <PageHead title="Messages" sub="Inquiries from the public contact form." />
      <div style={{ display: "grid", gap: ".75rem" }}>
        {messages.map((m) => (
          <div key={m.id} className="ah-msg">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                  {!m.read && <span className="ah-dot-red" />}
                  <strong style={{ fontFamily: "var(--fs)" }}>{m.subject}</strong>
                </div>
                <div style={{ fontSize: ".78rem", color: "var(--muted-foreground)", marginTop: ".15rem" }}>{m.from} ({m.email}) · {m.date}</div>
                <p style={{ marginTop: ".6rem", fontSize: ".88rem" }}>{m.body}</p>
              </div>
              <div style={{ display: "flex", gap: ".4rem" }}>
                <button className="ah-btn-sm" onClick={() => toggle(m.id)}>{m.read ? "Mark unread" : "Mark read"}</button>
                <button className="ah-btn-sm ah-btn-danger" onClick={() => remove(m.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {error && <div style={{ color: "var(--red)" }}>Could not load messages: {error}</div>}
        {messages.length === 0 && !error && <div style={{ color: "var(--muted-foreground)" }}>No messages.</div>}
      </div>
    </>
  );
}
