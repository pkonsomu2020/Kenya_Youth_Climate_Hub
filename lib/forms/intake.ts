// ============================================================
// Public form intake (contact + register) — server only.
// Inserts with the anon key so RLS applies: visitors can insert,
// never read. Spam guards: a honeypot field, a minimum fill time,
// and a per-IP rate limit enforced by a trigger in the database
// (see lib/db/migrations/contact-and-registrations.sql).
// ============================================================
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { locales } from "@/i18n/config";

export const SENDER_TYPES = ["Young Kenyan", "Partner Organization", "Donor / Funder", "Media / Press", "Other"] as const;
export const INTERESTS = ["Energy", "Water", "Agriculture", "Policy", "Finance", "Innovation", "Resilience", "Advocacy", "Waste"] as const;

// Forms filled faster than this are almost certainly bots.
const MIN_FILL_MS = 2500;

const text = (max: number) => z.string().trim().min(1).max(max);

// Shared spam-guard fields every form posts alongside its data.
export const guardFields = {
  website: z.string().optional(), // honeypot: hidden from people, filled by bots
  startedAt: z.number().int().optional(),
  locale: z.enum(locales).catch("en"),
};

export const contactSchema = z.object({
  ...guardFields,
  name: text(120),
  email: z.email().max(254),
  type: z.enum(SENDER_TYPES),
  body: text(5000),
});

export const registerSchema = z.object({
  ...guardFields,
  name: text(120),
  email: z.email().max(254),
  county: text(60),
  age: z.coerce.number().int().min(15).max(35),
  interests: z.array(z.enum(INTERESTS)).max(INTERESTS.length).default([]),
  other: z.string().trim().max(200).optional(),
});

type Guarded = { website?: string; startedAt?: number };

/** True when the submission looks automated; the caller answers 200 without saving. */
export function looksLikeBot({ website, startedAt }: Guarded): boolean {
  if (website && website.trim() !== "") return true;
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) return true;
  return false;
}

export function ipHash(req: NextRequest): string | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
  if (!ip) return null;
  return createHash("sha256").update(`kych-forms:${ip}`).digest("hex");
}

export function anonClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export const ok = () => NextResponse.json({ ok: true }, { status: 201 });
export const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

/** Maps a Supabase insert error to an HTTP response. */
export function insertFailed(error: { message: string }) {
  if (error.message.includes("rate_limited")) return fail(429, "rate_limited");
  console.error("[forms] insert failed:", error.message);
  return fail(500, "save_failed");
}
