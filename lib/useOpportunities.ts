// ============================================================
// useOpportunities hook — fetches live climate opportunities
// from the backend API
// ============================================================
import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export type Opportunity = {
  id: string;
  name: string;
  title: string;
  desc: string;
  url: string;
  source: string;
  provider: string;
  type: string;
  topic: string;
  deadline: string;
  amount: string | null;
  climate_score: number;
  color: string;
  is_approved: boolean;
  fetched_at: string;
};

type UseOpportunitiesOptions = {
  limit?: number;
  type?: string;
  topic?: string;
};

type UseOpportunitiesResult = {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useOpportunities({
  limit = 30,
  type = "All",
  topic = "All",
}: UseOpportunitiesOptions = {}): UseOpportunitiesResult {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
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
    if (topic && topic !== "All") params.set("topic", topic);

    fetch(`/api/opportunities?${params}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setOpportunities(json.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn("Opportunities API unavailable:", err.message);
          setError("Could not load live opportunities. Please ensure the backend is running.");
          setOpportunities([]);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [limit, type, topic, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { opportunities, loading, error, refetch };
}
