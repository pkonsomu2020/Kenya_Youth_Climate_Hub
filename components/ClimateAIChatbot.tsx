"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { NK, nkShadow } from "@/lib/nkTheme";

// ============================================================
// Climate AI Chatbot — ported from NEW_KYCH's floating chat widget.
// Replaces the old "coming soon" AIFab placeholder with a real,
// working UI. Replies are canned/keyword-matched for now (same
// scope as the original design file, which also left the real LLM
// call commented out) — wiring this to a live model is a natural
// next step, not done here to keep this change reviewable.
// ============================================================

type Msg = { from: "bot" | "user"; text: string };

const QUICK_PROMPTS = [
  { label: "Find funding", query: "What funding is available?" },
  { label: "Programs", query: "Tell me about your programs" },
  { label: "Join KYCH", query: "How do I join?" },
];

function getCannedReply(text: string): string {
  const t = text.toLowerCase();
  if (/(fund|grant|money)/.test(t)) {
    return "Our Opportunities board carries live grants, fellowships and internships with deadline alerts. Head to the Opportunities page to filter by type and closing date.";
  }
  if (/(program|challenge)/.test(t)) {
    return "We run incubators and mentorship programs including the Youth Climate Innovation Challenge, plus trainings across our five pillars. See the Programs page to apply.";
  }
  if (/(join|member|start)/.test(t)) {
    return "Anyone aged 15 to 35 in Kenya can join. Start with the Opportunities board, then register for an upcoming event or workshop.";
  }
  if (/(librar|resource|report)/.test(t)) {
    return "The E-Library holds reports, toolkits, policy briefs and research papers, all free to browse and save to your dashboard.";
  }
  return "Thanks for your message! I will be connected to a live AI soon. In the meantime, reach us at info@kenyayouthclimatehub.org or (+254) 0115963306.";
}

export function ClimateAIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Karibu! I'm the KYCH Climate AI. Ask me about grants, fellowships, programs or the Youth Climate Innovation Challenge." },
  ]);
  const [hovToggle, setHovToggle] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    });
  };

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setMsgs((m) => [...m, { from: "user", text: value }]);
    setInput("");
    scrollToBottom();
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: getCannedReply(value) }]);
      scrollToBottom();
    }, 700);
  };

  useEffect(() => { if (open) scrollToBottom(); }, [open]);

  // Allow other components (e.g. the "Ask AI Now" platform tool card) to open this widget.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("kych:open-chat", handler);
    return () => window.removeEventListener("kych:open-chat", handler);
  }, []);

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 90 }}>
      {open && (
        <div
          style={{
            width: 384, maxWidth: "calc(100vw - 48px)",
            height: "min(560px, calc(100vh - 140px))",
            background: NK.bg, border: `2px solid ${NK.ink}`,
            boxShadow: nkShadow(NK.ink, 8),
            display: "flex", flexDirection: "column",
            marginBottom: "0.75rem",
          }}
        >
          {/* Header */}
          <div style={{ background: NK.ink, padding: "1rem 1.1rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
              <div style={{ width: 30, height: 30, background: NK.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={15} color={NK.navyDeep} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "15px", color: "#fff", lineHeight: 1.2 }}>Climate AI</div>
                <div style={{ display: "flex", alignItems: "center", gap: ".35rem", marginTop: 2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: NK.green, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--fm)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: NK.mutedOnDark }}>Online now</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 4, display: "flex" }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={bodyRef}
            style={{
              flex: 1, overflowY: "auto", padding: "1rem",
              display: "flex", flexDirection: "column", gap: ".65rem",
              backgroundImage: `radial-gradient(${NK.green}22 1.2px, transparent 1.6px)`,
              backgroundSize: "20px 20px",
            }}
          >
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: ".65rem .85rem",
                  fontFamily: "var(--fb)", fontSize: "13.5px", lineHeight: 1.5,
                  background: m.from === "user" ? NK.green : NK.white,
                  color: m.from === "user" ? NK.navyDeep : NK.ink,
                  fontWeight: m.from === "user" ? 700 : 400,
                  border: m.from === "user" ? "none" : `1.5px solid ${NK.ink}`,
                  boxShadow: m.from === "user" ? nkShadow("rgba(16,28,51,0.18)", 3) : nkShadow("rgba(16,28,51,0.12)", 3),
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick prompts */}
          <div style={{ display: "flex", gap: ".5rem", padding: "0 1rem .75rem", flexWrap: "wrap", flexShrink: 0 }}>
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.label}
                onClick={() => send(p.query)}
                style={{
                  padding: ".4rem .75rem", fontFamily: "var(--fs)", fontWeight: 600, fontSize: "11.5px",
                  background: NK.white, border: `1.5px solid ${NK.ink}`, color: NK.ink, cursor: "pointer",
                  transition: "background .2s, color .2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = NK.green; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = NK.white; }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div style={{ display: "flex", gap: ".5rem", padding: "0 1rem 1rem", flexShrink: 0 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Ask about climate funding..."
              style={{
                flex: 1, padding: ".65rem .85rem", fontFamily: "var(--fb)", fontSize: "13px",
                border: `2px solid ${NK.ink}`, background: NK.white, color: NK.ink, outline: "none",
              }}
            />
            <button
              onClick={() => send()}
              aria-label="Send message"
              style={{ width: 42, height: 42, flexShrink: 0, background: NK.green, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Send size={16} color={NK.navyDeep} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle pill */}
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHovToggle(true)}
        onMouseLeave={() => setHovToggle(false)}
        style={{
          display: "flex", alignItems: "center", gap: ".55rem",
          background: hovToggle ? NK.green : NK.ink,
          color: hovToggle ? NK.navyDeep : "#F6F8F4",
          padding: ".65rem 1.15rem .65rem .65rem",
          border: `2px solid ${NK.ink}`,
          boxShadow: hovToggle ? nkShadow(NK.ink, 5) : nkShadow(NK.green, 5),
          fontFamily: "var(--fs)", fontWeight: 700, fontSize: "14.5px",
          cursor: "pointer", transition: "background .2s, color .2s, box-shadow .2s",
          marginLeft: "auto",
        }}
      >
        <div style={{ width: 32, height: 32, background: hovToggle ? NK.navyDeep : NK.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Sparkles size={16} color={hovToggle ? NK.green : NK.navyDeep} />
        </div>
        Climate AI
      </button>
    </div>
  );
}
