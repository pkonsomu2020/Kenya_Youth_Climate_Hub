"use client";
import { useMemo } from "react";
import { useLocale } from "next-intl";
import { OFFICIAL_EVENTS_2026 } from "./officialEvents";
import { officialEventsI18n } from "./translations/officialEvents";
import { localizeItems } from "./localize";

export function useLocalizedEvents() {
  const locale = useLocale();
  return useMemo(
    () => localizeItems(OFFICIAL_EVENTS_2026, officialEventsI18n, locale, (e) => e.id),
    [locale],
  );
}
