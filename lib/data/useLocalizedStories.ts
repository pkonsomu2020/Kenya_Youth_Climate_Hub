"use client";
import { useMemo } from "react";
import { useLocale } from "next-intl";
import { successStories } from "./successStories";
import { successStoriesI18n } from "./translations/successStories";
import { localizeItems } from "./localize";

export function useLocalizedStories() {
  const locale = useLocale();
  return useMemo(
    () => localizeItems(successStories, successStoriesI18n, locale, (s) => s.id),
    [locale],
  );
}
