// ============================================================
// useEvents hook — fetches live climate events from backend API
// ============================================================
import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export type LiveEvent = {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  event_type: string;
  format: string;
  event_date: string | null;
  location: string;
  topic: string;
  climate_score: number;
  color: string;
  is_approved: boolean;
  fetched_at: string;
};

type UseEventsOptions = {
  limit?: number;
  type?: string;
  format?: string;
};

export function useEvents({ limit = 30, type = "All", format = "All" }: UseEventsOptions = {}) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ limit: String(limit) });
    params.set("_t", Date.now().toString());
    if (type && type !== "All") params.set("type", type);
    if (format && format !== "All") params.set("format", format);

    fetch(`/api/events?${params}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setEvents(json.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn("Events API unavailable:", err.message);
          setError("Could not load live events. Please ensure the backend is running.");
          setEvents([]);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [limit, type, format, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { events, loading, error, refetch };
}
