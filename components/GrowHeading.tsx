"use client";

import { useRef, useEffect, useState, isValidElement, cloneElement, type ReactNode, type ElementType, type CSSProperties } from "react";

// ============================================================
// GrowHeading — ported from NEW_KYCH's `data-grow` effect:
// each word rolls up from a clipped baseline, staggered 55ms
// apart, on first scroll-into-view. Supports mixed-color inline
// spans (e.g. "Our core <span style={{color:green}}>values.</span>")
// by recursing into element children.
// ============================================================

function splitWords(node: ReactNode, keyPrefix: string, counter: { n: number }, inView: boolean): ReactNode {
  if (typeof node === "string") {
    const parts = node.split(/(\s+)/);
    return parts.map((part, i) => {
      if (part === "") return null;
      if (/^\s+$/.test(part)) return part;
      const idx = counter.n++;
      return (
        <span key={`${keyPrefix}-${i}`} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
          <span
            style={{
              display: "inline-block",
              transform: inView ? "translateY(0)" : "translateY(108%)",
              transition: `transform 0.72s cubic-bezier(.16,.84,.3,1) ${idx * 0.055}s`,
            }}
          >
            {part}
          </span>
        </span>
      );
    });
  }
  if (Array.isArray(node)) {
    return node.map((n, i) => splitWords(n, `${keyPrefix}-${i}`, counter, inView));
  }
  if (isValidElement(node)) {
    const el = node as React.ReactElement<any>;
    const kids = splitWords(el.props.children, `${keyPrefix}-c`, counter, inView);
    return cloneElement(el, { key: keyPrefix }, kids);
  }
  return node;
}

interface Props {
  as?: ElementType;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function GrowHeading({ as = "h2", children, style, className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Tag = as as any;
  const counter = { n: 0 };

  return (
    <Tag ref={ref} className={className} style={style}>
      {splitWords(children, "w", counter, inView)}
    </Tag>
  );
}
