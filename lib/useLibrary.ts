// ============================================================
// useLibrary hook — fetches live climate tools from backend API
// ============================================================
import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export type LibraryTool = {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  topic: string;
  use_case: string | null;
  difficulty: string;
  is_free: boolean;
  tech_stack: string | null;
  stars: string | null;
  language: string | null;
  trending_score: number;
  climate_score: number;
  color: string;
  icon: string;
  badge: string;
  is_approved: boolean;
  fetched_at: string;
};

type UseLibraryOptions = {
  limit?: number;
  category?: string;
  topic?: string;
  difficulty?: string;
  is_free?: string;
  sort?: "trending" | "newest" | "climate";
};

export function useLibrary({
  limit = 40,
  category = "All",
  topic = "All",
  difficulty = "All",
  is_free = "All",
  sort = "trending",
}: UseLibraryOptions = {}) {
  const [tools, setTools] = useState<LibraryTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ limit: String(limit), sort });
    params.set("_t", Date.now().toString());
    if (category !== "All") params.set("category", category);
    if (topic !== "All") params.set("topic", topic);
    if (difficulty !== "All") params.set("difficulty", difficulty);
    if (is_free !== "All") params.set("is_free", is_free);

    fetch(`/api/library?${params}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setTools(json.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn("Library API unavailable:", err.message);
          setError("Could not load live tools. Please ensure the backend is running.");
          setTools([]);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [limit, category, topic, difficulty, is_free, sort, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { tools, loading, error, refetch };
}
