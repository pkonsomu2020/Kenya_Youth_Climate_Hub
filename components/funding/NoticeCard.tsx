"use client";
import { useLocale, useTranslations } from "next-intl";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { intlLocale, type Locale } from "@/i18n/config";
import type { Opportunity } from "@/lib/useOpportunities";
import { Icon } from "@/components/zine/Icon";

// One colour pair per type: the pin and the type tag share it so a type is
// recognisable across the board. The tag always carries the type name too.
export const TYPE_STYLE: Record<string, { pin: string; tag: string }> = {
  Grant: { pin: "var(--z-green)", tag: "var(--z-green-l)" },
  Fellowship: { pin: "var(--z-sun)", tag: "#FFE8A8" },
  Internship: { pin: "var(--z-orange)", tag: "var(--z-pink)" },
  Competition: { pin: "var(--z-navy)", tag: "var(--z-sky)" },
  Job: { pin: "var(--z-green-d)", tag: "var(--z-paper-2)" },
  Accelerator: { pin: "var(--z-orange)", tag: "var(--z-white)" },
};
const FALLBACK = { pin: "var(--z-navy)", tag: "var(--z-white)" };

const DAY = 86400000;

/** Date for a real deadline; null for Open / Rolling / unknown / unparseable. */
export function deadlineDate(str: string | null | undefined): Date | null {
  if (!str || /^(open|rolling|unknown|tba)$/i.test(str.trim())) return null;
  const d = new Date(str.replace(/(\d+)(st|nd|rd|th)/gi, "$1"));
  return isNaN(d.getTime()) ? null : d;
}
export function daysUntil(str: string | null | undefined): number | null {
  const d = deadlineDate(str);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / DAY);
}

// Scraped titles often end in " - Publisher" or " | Publisher"; the provider line already says who.
export function cleanTitle(o: Opportunity) {
  const title = o.name || o.title || "";
  const provider = (o.provider || "").trim();
  const i = Math.max(title.lastIndexOf(" - "), title.lastIndexOf(" | "));
  if (i > 20 && (!provider || title.slice(i + 3).toLowerCase().includes(provider.toLowerCase().slice(0, 6)))) {
    return title.slice(0, i);
  }
  return title;
}

export function NoticeCard({ o }: { o: Opportunity }) {
  const t = useTranslations("opportunitiesPage");
  const tax = useTaxonomy();
  const locale = useLocale() as Locale;
  const style = TYPE_STYLE[o.type] ?? FALLBACK;
  const days = daysUntil(o.deadline);
  const date = deadlineDate(o.deadline);
  const open = /^(open|rolling)$/i.test((o.deadline ?? "").trim());

  let when: string;
  let icon = "event_available";
  let urgent = false;
  if (days !== null && days >= 0 && days <= 7) {
    when = days === 0 ? t("closesToday") : days === 1 ? t("closesTomorrow") : t("closesIn", { days });
    icon = "timer";
    urgent = true;
  } else if (date) {
    when = t("closesOn", { date: date.toLocaleDateString(intlLocale[locale], { day: "numeric", month: "short", year: "numeric" }) });
    icon = "event";
  } else if (open) {
    when = t("rolling");
  } else {
    when = t("noDeadline");
    icon = "help";
  }

  const title = cleanTitle(o);
  return (
    <a className="z-note-card" href={o.url} target="_blank" rel="noopener noreferrer" aria-label={t("cardLabel", { title, type: tax(o.type) })}>
      <span className="z-note-card__pin" style={{ background: style.pin }} aria-hidden="true" />
      <span className="z-note-card__type" style={{ background: style.tag }}>{tax(o.type)}</span>
      <h3>{title}</h3>
      <p className="z-note-card__who">
        {o.provider || o.source}
        {o.topic ? <> · {tax(o.topic)}</> : null}
      </p>
      {o.amount && <p className="z-note-card__amount"><Icon name="payments" /> {o.amount}</p>}
      <p className={`z-note-card__dl${urgent ? " z-note-card__dl--urgent" : ""}`}>
        <Icon name={icon} /> {when}
      </p>
      <span className="z-note-card__go" aria-hidden="true">
        {o.type === "Grant" ? t("apply") : t("details")} <Icon name="open_in_new" />
      </span>
    </a>
  );
}
