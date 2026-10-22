"use client";

// ============================================================
// Admin Hub inbox — contact messages from Supabase.
// RLS lets only admins (public.admin_users) read, mark and delete,
// so this runs with the signed-in admin's session.
// Rows are mapped to the Message shape the admin pages already use.
// ============================================================
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Message } from "@/lib/contentStore";

type Row = { id: string; name: string; email: string; sender_type: string; body: string; read: boolean; created_at: string };

const toMessage = (r: Row): Message => ({
  id: r.id,
  from: r.name,
  email: r.email,
  subject: `Message from ${r.sender_type}`,
  body: r.body,
  date: new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  read: r.read,
});

export function useContactMessages() {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("id, name, email, sender_type, body, read, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) { setError(error.message); return; }
    setError(null);
    setMessages((data as Row[]).map(toMessage));
  }, [supabase]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
  useEffect(() => { void load(); }, [load]);

  const toggleRead = useCallback(async (id: string) => {
    const m = messages.find((x) => x.id === id);
    if (!m) return;
    setMessages((ms) => ms.map((x) => (x.id === id ? { ...x, read: !x.read } : x)));
    const { error } = await supabase.from("contact_messages").update({ read: !m.read }).eq("id", id);
    if (error) { setError(error.message); void load(); }
  }, [messages, supabase, load]);

  const remove = useCallback(async (id: string) => {
    setMessages((ms) => ms.filter((x) => x.id !== id));
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) { setError(error.message); void load(); }
  }, [supabase, load]);

  return { messages, error, toggleRead, remove, reload: load };
}
