import type { NextRequest } from "next/server";
import { anonClient, contactSchema, fail, insertFailed, ipHash, looksLikeBot, ok, readJson } from "@/lib/forms/intake";

export async function POST(req: NextRequest) {
  const parsed = contactSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(400, "invalid");
  const d = parsed.data;
  if (looksLikeBot(d)) return ok();

  const { error } = await anonClient().from("contact_messages").insert({
    name: d.name,
    email: d.email,
    sender_type: d.type,
    body: d.body,
    locale: d.locale,
    ip_hash: ipHash(req),
  });
  return error ? insertFailed(error) : ok();
}
