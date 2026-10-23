"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";

// ============================================================
// Climate AI — floating assistant.
// Answers stream from /api/chat, which grounds them in the KYCH knowledge
// base plus live funding calls, events and county forecasts.
// ============================================================

type Source = { label: string; href: string };
type Msg = { from: "bot" | "user"; text: string; sources?: Source[]; error?: boolean };

const QUICK_PROMPTS = ["funding", "weather", "events", "join"] as const;
const STORE = "kych:chat";

// Offline fallback when /api/chat is unreachable (keywords in English, Kiswahili, French).
function cannedTopic(text: string): "funding" | "programs" | "join" | "library" | "weather" | "default" {
  const t = text.toLowerCase();
  if (/(fund|grant|money|scholarship|ufadhili|ruzuku|pesa|financement|subvention|bourse)/.test(t)) return "funding";
  if (/(program|challenge|ycic|incubat|shindano|programu|défi|programme)/.test(t)) return "programs";
  if (/(join|member|start|register|jiunge|jisajili|rejoindre|inscri)/.test(t)) return "join";
  if (/(librar|resource|report|paper|maktaba|rasilimali|bibliothèque|ressource|rapport)/.test(t)) return "library";
  if (/(weather|county|flood|nairobi|hali ya hewa|kaunti|mafuriko|météo|comté|inondation)/.test(t)) return "weather";
  return "default";
}

// ---------- tiny, safe markdown renderer (headings, lists, bold, links) ----------
const SITE = /^https?:\/\/(www\.)?kenyayouthclimatehub\.org/i;

function inline(text: string, key: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={`${key}-${i}`}>{part.slice(2, -2)}</strong>;
    const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (m) {
      const href = m[2].replace(SITE, "") || "/";
      if (href.startsWith("/")) return <Link key={`${key}-${i}`} href={href}>{m[1]}</Link>;
      if (/^https?:\/\//i.test(href)) return <a key={`${key}-${i}`} href={href} target="_blank" rel="noopener noreferrer">{m[1]}</a>;
      return <span key={`${key}-${i}`}>{m[1]}</span>; // never render other schemes as links
    }
    return part;
  });
}

function Markdown({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const items = list.items.map((it, i) => <li key={i}>{inline(it, `li${blocks.length}-${i}`)}</li>);
    blocks.push(list.ordered ? <ol key={blocks.length}>{items}</ol> : <ul key={blocks.length}>{items}</ul>);
    list = null;
  };
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const num = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const head = line.match(/^#{1,4}\s+(.*)$/);
    if (bullet || num) {
      const ordered = !!num;
      if (!list || list.ordered !== ordered) { flush(); list = { ordered, items: [] }; }
      list.items.push((bullet ?? num)![1]);
      continue;
    }
    flush();
    if (head) blocks.push(<h4 key={blocks.length}>{inline(head[1].replace(/\*\*/g, ""), `h${blocks.length}`)}</h4>);
    else if (line.trim()) blocks.push(<p key={blocks.length}>{inline(line, `p${blocks.length}`)}</p>);
  }
  flush();
  return <>{blocks}</>;
}

// Source chips use the site's own (translated) section names.
const SOURCE_KEYS: Record<string, string> = {
  "/opportunities": "opportunities",
  "/events": "events",
  "/weather": "climateWatch",
  "/e-library": "eLibrary",
  "/programs": "programs",
  "/success-stories": "successStories",
  "/about": "about",
  "/news": "news",
};

export function ClimateAIChatbot() {
  const t = useTranslations("chat");
  const tn = useTranslations("nav");
  const locale = useLocale();
  const greeting: Msg = { from: "bot", text: t("greeting") };
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([greeting]);
  const [restored, setRestored] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sourceLabel = (s: Source) => {
    if (s.href === "/programs/ycic") return "YCIC";
    if (s.href === "/programs/begreen") return "BeGreen Africa";
    const k = SOURCE_KEYS[s.href];
    return k ? tn(k) : s.label;
  };

  // Restore this tab's conversation once (sessionStorage is a per-tab convenience).
  if (!restored && typeof window !== "undefined") {
    setRestored(true);
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? "null");
      if (Array.isArray(saved) && saved.length) setMsgs(saved);
    } catch { /* storage blocked or corrupt: start fresh */ }
  }
  useEffect(() => {
    if (busy) return;
    try { sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-30))); } catch { /* ignore */ }
  }, [msgs, busy]);

  const scrollToBottom = () => requestAnimationFrame(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  });

  const wasOpen = useRef(false);
  const close = () => setOpen(false);
  // Return focus to the toggle after closing (it is hidden while the phone sheet is open).
  useEffect(() => {
    if (wasOpen.current && !open) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    scrollToBottom();
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Other components (homepage Simba, dashboard, footer) open the assistant with this event.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("kych:open-chat", handler);
    return () => window.removeEventListener("kych:open-chat", handler);
  }, []);

  const send = async (text?: string) => {
    const value = (text ?? input).trim().slice(0, 1000);
    if (!value || busy) return;
    const history: Msg[] = [...msgs, { from: "user", text: value }];
    setMsgs([...history, { from: "bot", text: "" }]);
    setInput("");
    setBusy(true);
    scrollToBottom();

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const update = (patch: Partial<Msg>) =>
      setMsgs((m) => { const next = [...m]; next[next.length - 1] = { ...next[next.length - 1], ...patch }; return next; });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.filter((m) => m.text && !m.error).map(({ from, text }) => ({ from, text })), locale }),
        signal: ctrl.signal,
      });
      let sources: Source[] = [];
      try { sources = JSON.parse(decodeURIComponent(res.headers.get("X-KYCH-Sources") ?? "[]")); } catch { /* none */ }
      if (!res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        acc += decoder.decode(chunk, { stream: true });
        update({ text: acc });
        scrollToBottom();
      }
      update({ text: acc || t(`canned.${cannedTopic(value)}`), sources: res.ok ? sources : [] });
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setMsgs((m) => {
          const last = m[m.length - 1];
          return last.text ? [...m.slice(0, -1), { ...last, text: `${last.text}\n\n${t("stopped")}` }] : m.slice(0, -1);
        });
      } else {
        update({ text: t(`canned.${cannedTopic(value)}`), error: true });
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
      scrollToBottom();
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMsgs([greeting]);
    try { sessionStorage.removeItem(STORE); } catch { /* ignore */ }
    inputRef.current?.focus();
  };

  const onlyGreeting = msgs.length === 1;
  const last = msgs[msgs.length - 1];

  return (
    <div className={`z-chat${open ? " z-chat--open" : ""}`}>
      {open && (
        <section className="z-chat__panel" role="dialog" aria-labelledby="z-chat-title" aria-describedby="z-chat-status">
          <header className="z-chat__head">
            <span className="z-chat__avatar" aria-hidden="true"><Icon name="forum" fill /></span>
            <div className="z-chat__title">
              <h2 id="z-chat-title">Climate AI</h2>
              <span id="z-chat-status" className="z-chat__status z-mono">
                <i aria-hidden="true" data-busy={busy} /> {busy ? t("thinking") : t("online")}
              </span>
            </div>
            <button type="button" className="z-chat__iconbtn" onClick={reset} aria-label={t("newChat")} title={t("newChat")}>
              <Icon name="edit_square" />
            </button>
            <button type="button" className="z-chat__iconbtn" onClick={close} aria-label={t("close")}>
              <Icon name="close" />
            </button>
          </header>

          <div ref={bodyRef} className="z-chat__body" aria-live="polite" aria-busy={busy} aria-relevant="additions">
            {msgs.map((m, i) => (
              <div key={i} className={`z-chat__msg z-chat__msg--${m.from}${m.error ? " z-chat__msg--err" : ""}`}>
                {m.from === "bot" && !m.text && busy && i === msgs.length - 1 ? (
                  <span className="z-chat__typing" aria-label={t("retrieving")}><i /><i /><i /> <small>{t("retrieving")}</small></span>
                ) : m.from === "bot" ? (
                  <Markdown text={m.text} />
                ) : (
                  <p>{m.text}</p>
                )}
                {m.sources && m.sources.length > 0 && (
                  <div className="z-chat__sources">
                    <span className="z-mono">{t("sources")}</span>
                    {m.sources.map((s) => <Link key={s.href} href={s.href}>{sourceLabel(s)}</Link>)}
                  </div>
                )}
              </div>
            ))}

            {onlyGreeting && (
              <div className="z-chat__prompts" role="group" aria-label={t("suggestions")}>
                {QUICK_PROMPTS.map((p) => (
                  <button key={p} type="button" onClick={() => send(t(`prompts.${p}.query`))}>
                    <Icon name={{ funding: "payments", weather: "rainy", events: "event", join: "person_add" }[p]} />
                    {t(`prompts.${p}.label`)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="z-chat__form" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <label htmlFor="z-chat-input" className="z-sr">{t("placeholder")}</label>
            <textarea
              id="z-chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={t("placeholder")}
            />
            {busy ? (
              <button type="button" className="z-chat__send z-chat__send--stop" onClick={() => abortRef.current?.abort()} aria-label={t("stop")}>
                <Icon name="stop" fill />
              </button>
            ) : (
              <button type="submit" className="z-chat__send" disabled={!input.trim()} aria-label={t("send")}>
                <Icon name="arrow_upward" />
              </button>
            )}
          </form>
          <p className="z-chat__note">{t("note")}</p>
          {last.error && <span className="z-sr" role="status">{t("offlineNotice")}</span>}
        </section>
      )}

      <button
        ref={toggleRef}
        type="button"
        className="z-chat__toggle"
        aria-expanded={open}
        aria-label={open ? t("close") : t("open")}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="z-chat__toggleicon" aria-hidden="true"><Icon name={open ? "close" : "forum"} fill /></span>
        <span className="z-chat__togglelabel">Climate AI</span>
      </button>
    </div>
  );
}
