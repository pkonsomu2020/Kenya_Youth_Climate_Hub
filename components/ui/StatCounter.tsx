"use client";

import { useEffect, useMemo, useState } from "react";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function StatCounter({ value, suffix = "+", label }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const formatted = useMemo(() => {
    return new Intl.NumberFormat("en-US").format(count) + suffix;
  }, [count, suffix]);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const stepTime = Math.max(Math.floor(duration / value), 15);
    const timer = setInterval(() => {
      start += Math.max(1, Math.floor(value / 25));
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="stat-card">
      <div className="stat-value">{formatted}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
