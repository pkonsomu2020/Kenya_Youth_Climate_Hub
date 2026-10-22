"use client";

// Client side of the public forms' spam guards (see lib/forms/intake.ts):
// a honeypot field people never see, plus the time the form was opened.
import { useEffect, useRef, useState } from "react";

export type SendState = "idle" | "sending" | "sent" | "failed" | "rate_limited";

export function useFormGuard() {
  const startedAt = useRef<number | undefined>(undefined);
  const [website, setWebsite] = useState("");
  useEffect(() => { startedAt.current = Date.now(); }, []);
  const honeypot = (
    <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </label>
    </div>
  );
  return { honeypot, guard: () => ({ website, startedAt: startedAt.current }) };
}

/** POSTs a form as JSON. Never throws: network errors come back as "failed". */
export async function postForm(url: string, data: object): Promise<"sent" | "failed" | "rate_limited"> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) return "sent";
    return res.status === 429 ? "rate_limited" : "failed";
  } catch {
    return "failed";
  }
}
