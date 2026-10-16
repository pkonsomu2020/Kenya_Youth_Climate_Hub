import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { retrieveRelevantContext } from "@/lib/rag/knowledgeBase";
import { getTranslations } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

const REPLY_LANGUAGE = { en: "English", sw: "Kiswahili (Swahili)", fr: "French" } as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;
    const locale: Locale = isLocale(body.locale) ? body.locale : defaultLocale;
    const t = await getTranslations({ locale, namespace: "chatApi" });

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const lastUserMessage = [...messages].reverse().find((m: { from?: string; role?: string; text?: string; content?: string }) => {
      const r = m.role || m.from;
      return r === "user";
    });

    const userQuery = lastUserMessage?.text || lastUserMessage?.content || "What is KYCH?";

    // 1. Context Retrieval (RAG)
    const contextChunks = retrieveRelevantContext(userQuery, 4);
    const contextString = contextChunks
      .map((c) => `--- [${c.title}] (Category: ${c.category})\nURL: ${c.url || "N/A"}\nContent: ${c.content}`)
      .join("\n\n");

    // 2. OpenAI API Client setup
    const apiKey = process.env.OPENAI_API_KEY;

    // Fallback if OpenAI API Key is missing or invalid
    if (!apiKey || apiKey.trim() === "" || apiKey.startsWith("sk-proj-placeholder")) {
      const topChunk = contextChunks[0];
      return NextResponse.json({
        reply: t("fallback", { content: topChunk.content, title: topChunk.title, url: topChunk.url || "/programs" }),
      });
    }

    const openai = new OpenAI({ apiKey });

    // 3. Formulate System Prompt with RAG Context Grounding
    const systemPrompt = `You are the KYCH Climate AI, a helpful, enthusiastic, and knowledgeable assistant for the Kenya Youth Climate Hub (KYCH).
Your mission is to guide users on grants, fellowships, climate programs, the Youth Climate Innovation Challenge (YCIC), e-library research, and weather watch across Kenya's 47 counties.

Ground your answers strictly using the following retrieved KYCH Knowledge Base context:
${contextString}

Formatting & Tone Guidelines:
1. Be warm, welcoming ("Karibu!"), professional, and encouraging.
2. Structure your answers cleanly using markdown bullet points and bold headers when helpful.
3. Highlight key eligibility criteria, deadlines, contact info (info@kenyayouthclimatehub.org, (+254) 0115963306), and relevant page paths (e.g., /programs/ycic, /opportunities, /library, /weather) when appropriate.
4. Keep responses concise, clear, and actionable (under 250 words unless detailed explanation is requested).
5. LANGUAGE: Always reply in ${REPLY_LANGUAGE[locale]}, the language the user selected on the site, even though the context above is in English. Keep names of programmes, organisations and URLs unchanged.
6. CRITICAL YCIC STATUS DIRECTIVE: The Youth Climate Innovation Challenge (YCIC 2025) has CONCLUDED and applications are CLOSED. Never suggest or invite users to apply or join YCIC now. State clearly that the 2025 cohort has concluded, summarize its past impact/partners (Flarehub, Yoma, KES 500K awarded at KICC), and guide users to the Opportunities Board (/opportunities) for current active calls and future cohorts.`;

    // 4. Format messages for OpenAI completion API
    const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-6).map((m: { from?: string; role?: string; text?: string; content?: string }) => {
        const role: "user" | "assistant" = (m.role === "user" || m.from === "user") ? "user" : "assistant";
        const content = m.text || m.content || "";
        return { role, content };
      }),
    ];

    // 5. Query OpenAI API
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: apiMessages,
        temperature: 0.6,
        max_tokens: 500,
      });

      const reply = completion.choices[0]?.message?.content?.trim();

      if (reply) {
        return NextResponse.json({ reply });
      }
    } catch (openaiErr: unknown) {
      console.error("OpenAI API call failed, falling back to RAG context engine:", openaiErr);
      
      // Fallback: Use RAG context content directly if OpenAI call fails (e.g. quota limit)
      const topChunk = contextChunks[0];
      return NextResponse.json({
        reply: t("fallback", { content: topChunk.content, title: topChunk.title, url: topChunk.url || "/programs" }),
      });
    }

    return NextResponse.json({
      reply: t("noReply"),
    });
  } catch (err: unknown) {
    console.error("Error in /api/chat route:", err);
    return NextResponse.json(
      { reply: "Karibu! We are currently experiencing a brief connection issue. Please feel free to email us at info@kenyayouthclimatehub.org or call (+254) 0115963306." },
      { status: 500 }
    );
  }
}
