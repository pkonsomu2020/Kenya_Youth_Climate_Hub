"use client";
import { useTranslations } from "next-intl";

// Category / type / topic values come from the database in English and stay English
// for filtering. This only translates how they are displayed; unknown values show as-is.
const keyOf = (value: string) => value.replace(/[^A-Za-z0-9]/g, "");

export function useTaxonomy(namespace: "taxonomy" | "weatherTerms" = "taxonomy") {
  const t = useTranslations(namespace);
  return (value: string | null | undefined) => {
    if (!value) return "";
    const key = keyOf(value);
    return t.has(key) ? t(key) : value;
  };
}
