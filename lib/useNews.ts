// ============================================================
// useNews hook — fetches live climate news from the backend API
// Falls back to empty array if backend is unavailable
// ============================================================
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export type NewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: string;
  date: string;
  published_at: string;
  category: string;
  cat: string;
  relevance: string;
  ai_score: number;
  image_url: string | null;
  gradient: string;
  icon: string;
  emoji: string;
};

type UseNewsOptions = {
  limit?: number;
  category?: string;
};

type UseNewsResult = {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useNews({ limit = 20, category = "All" }: UseNewsOptions = {}): UseNewsResult {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ limit: String(limit) });
    params.set("_t", Date.now().toString());
    if (category && category !== "All") params.set("category", category);

    fetch(`/api/news?${params}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setArticles(json.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn("News API unavailable:", err.message);
          setError("Could not load live news. Please ensure the backend is running.");
          setArticles([]);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [limit, category, tick]);

  const refetch = () => setTick((t) => t + 1);

  return { articles, loading, error, refetch };
}
