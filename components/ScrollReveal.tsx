"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
    );

    const REVEAL_SELECTOR = ".animate-on-scroll, .nk-reveal";

    const observeElement = (el: Element) => {
      if (el instanceof HTMLElement && el.matches(REVEAL_SELECTOR) && !el.classList.contains("visible")) {
        observer.observe(el);
      }
    };

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(observeElement);
    };

    observeAll();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            observeElement(node);
            node.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(observeElement);
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
