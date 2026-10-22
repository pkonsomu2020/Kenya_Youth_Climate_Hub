import type { NextRequest } from "next/server";
import { KENYA_COUNTIES_WEATHER } from "@/lib/data/kenyaCountiesWeather";
import { anonClient, fail, insertFailed, ipHash, looksLikeBot, ok, readJson, registerSchema } from "@/lib/forms/intake";

const COUNTIES = new Set(KENYA_COUNTIES_WEATHER.map((c) => c.name));

export async function POST(req: NextRequest) {
  const parsed = registerSchema.safeParse(await readJson(req));
  if (!parsed.success || !COUNTIES.has(parsed.data.county)) return fail(400, "invalid");
  const d = parsed.data;
  if (looksLikeBot(d)) return ok();

  const { error } = await anonClient().from("youth_registrations").insert({
    name: d.name,
    email: d.email,
    county: d.county,
    age: d.age,
    interests: d.interests,
    other_interest: d.other || null,
    locale: d.locale,
    ip_hash: ipHash(req),
  });
  return error ? insertFailed(error) : ok();
}
