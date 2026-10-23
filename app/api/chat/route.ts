import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { retrieveRelevantContext } from "@/lib/rag/knowledgeBase";
import { buildLiveContext, type Source } from "@/lib/rag/liveContext";
import { getTranslations } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

const REPLY_LANGUAGE = { en: "English", sw: "Kiswahili (Swahili)", fr: "French" } as const;
const MAX_CHARS = 1000; // per message
const MAX_TURNS = 8; // history sent to the model
const RATE = { windowMs: 60_000, max: 20 }; // per IP

// Small in-memory limiter (per server instance). Enough to stop accidental loops and casual abuse.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE.max;
}

type InMsg = { from?: string; role?: string; text?: string; content?: string };
const roleOf = (m: InMsg): "user" | "assistant" => (m.role === "user" || m.from === "user" ? "user" : "assistant");
const textOf = (m: InMsg) => String(m.text ?? m.content ?? "").slice(0, MAX_CHARS);

/** Plain-text reply with the sources header (used for fallbacks and errors). */
function plain(reply: string, sources: Source[], status = 200) {
  return new NextResponse(reply, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-KYCH-Sources": encodeURIComponent(JSON.stringify(sources)) },
  });
}

export async function POST(req: NextRequest) {
  let body: { messages?: InMsg[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const locale: Locale = isLocale(body.locale) ? body.locale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "chatApi" });

  const messages = Array.isArray(body.messages) ? body.messages.filter((m) => textOf(m).trim()) : [];
  if (!messages.length) return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return plain(t("rateLimited"), [], 429);

  const userQuery = textOf([...messages].reverse().find((m) => roleOf(m) === "user") ?? messages[messages.length - 1]);

  // 1. Static knowledge (what KYCH is and offers) + live data the question is about
  const chunks = retrieveRelevantContext(userQuery, 4);
  const live = await buildLiveContext(userQuery, locale, req.nextUrl.origin);
  // Chips: the live data actually used, plus the single best-matching KYCH page.
  const sources: Source[] = [
    ...live.sources,
    ...chunks.slice(0, 1).filter((c) => c.url).map((c) => ({ label: c.title, href: c.url! })),
  ].filter((s, i, a) => a.findIndex((x) => x.href === s.href) === i).slice(0, 3);

  const knowledge = chunks.map((c) => `--- ${c.title} (${c.url ?? "no page"})\n${c.content}`).join("\n\n");
  const todayStr = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Nairobi" });

  // 2. No API key: answer from the best-matching knowledge, translated wrapper
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim() || apiKey.startsWith("sk-proj-placeholder")) {
    const top = chunks[0];
    return plain(t("fallback", { content: top.content, title: top.title, url: top.url || "/programs" }), sources);
  }

  const systemPrompt = `You are Climate AI, the assistant of the Kenya Youth Climate Hub (KYCH), a platform for young Kenyans (15–35) working on climate.
Today is ${todayStr} (Nairobi time).

Answer using ONLY the facts below. If something is not covered, say you don't have that information and point to the closest KYCH page or info@kenyayouthclimatehub.org. Never invent opportunities, deadlines, amounts, events, phone numbers or statistics.

KYCH KNOWLEDGE:
${knowledge}

${live.text ? `LIVE DATA (fetched just now; prefer it over general statements):\n${live.text}` : "No live data was needed for this question."}

How to answer:
- Reply in ${REPLY_LANGUAGE[locale]} (the language the user chose on the site), even though the facts above are in English. Keep names of programmes, organisations and URLs as they are.
- Be specific and practical: name the actual calls, dates and counties from the live data, with "closes in N days" where known. Lead with the answer, no preamble or greetings after the first message.
- Format: short paragraphs, "- " bullet lists, **bold** for key facts, at most one "### " heading. Under 220 words unless the user asks for detail.
- Links: use markdown links. For KYCH pages use relative paths like [Funding board](/opportunities). For a funding call or event, make its title the link to the full URL from the live data, e.g. [Commonwealth Foundation Grant](https://...), instead of a separate "Link" word.
- The Youth Climate Innovation Challenge 2025 is closed: never invite people to apply now; point them to /opportunities for future cycles.
- For emergencies (floods, rescue), give the emergency numbers from the knowledge exactly as written.`;

  const history: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = messages
    .slice(-MAX_TURNS)
    .map((m) => ({ role: roleOf(m), content: textOf(m) }));

  // 3. Stream the answer; fall back to the knowledge text if the model call fails
  try {
    const openai = new OpenAI({ apiKey });
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...history],
      temperature: 0.4,
      max_tokens: 600,
      stream: true,
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const part of stream) {
            const delta = part.choices[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (err) {
          console.error("Chat stream interrupted:", err);
          controller.enqueue(encoder.encode(`\n\n${t("interrupted")}`));
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.controller.abort();
      },
    });

    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-KYCH-Sources": encodeURIComponent(JSON.stringify(sources)),
      },
    });
  } catch (err) {
    console.error("OpenAI call failed, answering from the knowledge base:", err);
    const top = chunks[0];
    return plain(t("fallback", { content: top.content, title: top.title, url: top.url || "/programs" }), sources);
  }
}
