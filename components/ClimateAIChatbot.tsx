"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { NK, nkShadow } from "@/lib/nkTheme";
import { useLocale, useTranslations } from "next-intl";

// ============================================================
// Climate AI Chatbot — RAG + OpenAI-powered floating widget.
// Grounded in KYCH Knowledge Base (grants, fellowships, YCIC,
// e-library, events, 47 counties weather, contact details).
// ============================================================

type Msg = { from: "bot" | "user"; text: string };

// Quick prompt labels/queries and canned replies live in messages under chat.*
const QUICK_PROMPTS = ["funding", "ycic", "join", "weather"] as const;

// Offline fallback when /api/chat is unreachable. Keyword match covers English,
// Kiswahili and French so the reply topic still fits the question.
function cannedTopic(text: string): "funding" | "programs" | "join" | "library" | "weather" | "default" {
  const t = text.toLowerCase();
  if (/(fund|grant|money|scholarship|ufadhili|ruzuku|pesa|financement|subvention|bourse)/.test(t)) return "funding";
  if (/(program|challenge|ycic|incubat|shindano|programu|défi|programme)/.test(t)) return "programs";
  if (/(join|member|start|register|jiunge|jisajili|rejoindre|inscri)/.test(t)) return "join";
  if (/(librar|resource|report|paper|maktaba|rasilimali|bibliothèque|ressource|rapport)/.test(t)) return "library";
  if (/(weather|county|flood|nairobi|hali ya hewa|kaunti|mafuriko|météo|comté|inondation)/.test(t)) return "weather";
  return "default";
}

function renderMessageText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lIdx) => {
    // Split by bold (**bold**) and markdown links ([label](url))
    const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return (
      <div key={lIdx} style={{ minHeight: line.trim() ? "auto" : "0.4rem", marginBottom: "0.2rem" }}>
        {parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
          }
          const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
          if (linkMatch) {
            return (
              <a
                key={pIdx}
                href={linkMatch[2]}
                target={linkMatch[2].startsWith("http") ? "_blank" : "_self"}
                rel="noreferrer"
                style={{ color: "#101C33", textDecoration: "underline", fontWeight: 700 }}
              >
                {linkMatch[1]}
              </a>
            );
          }
          return part;
        })}
      </div>
    );
  });
}

export function ClimateAIChatbot() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const getCannedReply = (text: string) => t(`canned.${cannedTopic(text)}`);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: t("greeting") },
  ]);
  const [hovToggle, setHovToggle] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    });
  };

  const send = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;

    const newMsgs: Msg[] = [...msgs, { from: "user", text: value }];
    setMsgs(newMsgs);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs, locale }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || getCannedReply(value);
      setMsgs((m) => [...m, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error("Chat API error, using fallback RAG reply:", err);
      setMsgs((m) => [...m, { from: "bot", text: getCannedReply(value) }]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  useEffect(() => { if (open) scrollToBottom(); }, [open]);

  // Allow other components (e.g. the "Ask AI Now" platform tool card) to open this widget.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("kych:open-chat", handler);
    return () => window.removeEventListener("kych:open-chat", handler);
  }, []);

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 350 }}>
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
                  <span style={{ fontFamily: "var(--fm)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: NK.mutedOnDark }}>
                    {isLoading ? t("thinking") : t("online")}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={t("close")}
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
                  maxWidth: "85%", padding: ".65rem .85rem",
                  fontFamily: "var(--fb)", fontSize: "13px", lineHeight: 1.5,
                  background: m.from === "user" ? NK.green : NK.white,
                  color: m.from === "user" ? NK.navyDeep : NK.ink,
                  fontWeight: m.from === "user" ? 700 : 400,
                  border: m.from === "user" ? "none" : `1.5px solid ${NK.ink}`,
                  boxShadow: m.from === "user" ? nkShadow("rgba(16,28,51,0.18)", 3) : nkShadow("rgba(16,28,51,0.12)", 3),
                }}>
                  {renderMessageText(m.text)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: ".5rem .75rem",
                  background: NK.white, color: NK.ink,
                  border: `1.5px solid ${NK.ink}`,
                  boxShadow: nkShadow("rgba(16,28,51,0.12)", 3),
                  display: "flex", alignItems: "center", gap: ".5rem",
                  fontFamily: "var(--fm)", fontSize: "12px",
                }}>
                  <Loader2 size={14} className="animate-spin" color={NK.greenAlt} />
                  <span>{t("retrieving")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div style={{ display: "flex", gap: ".4rem", padding: "0 1rem .75rem", flexWrap: "wrap", flexShrink: 0 }}>
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                disabled={isLoading}
                onClick={() => send(t(`prompts.${p}.query`))}
                style={{
                  padding: ".35rem .65rem", fontFamily: "var(--fs)", fontWeight: 600, fontSize: "11px",
                  background: NK.white, border: `1.5px solid ${NK.ink}`, color: NK.ink, cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1, transition: "background .2s, color .2s",
                }}
                onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = NK.green; }}
                onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = NK.white; }}
              >
                {t(`prompts.${p}.label`)}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div style={{ display: "flex", gap: ".5rem", padding: "0 1rem 1rem", flexShrink: 0 }}>
            <input
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !isLoading) send(); }}
              placeholder={isLoading ? t("typing") : t("placeholder")}
              aria-label={t("placeholder")}
              style={{
                flex: 1, padding: ".65rem .85rem", fontFamily: "var(--fb)", fontSize: "13px",
                border: `2px solid ${NK.ink}`, background: NK.white, color: NK.ink, outline: "none",
                opacity: isLoading ? 0.7 : 1,
              }}
            />
            <button
              disabled={isLoading || !input.trim()}
              onClick={() => send()}
              aria-label={t("send")}
              style={{
                width: 42, height: 42, flexShrink: 0,
                background: NK.green, border: "none",
                cursor: (isLoading || !input.trim()) ? "not-allowed" : "pointer",
                opacity: (isLoading || !input.trim()) ? 0.5 : 1,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
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
        <span>Climate AI</span>
      </button>
    </div>
  );
}
