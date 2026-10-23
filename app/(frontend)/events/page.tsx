"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { intlLocale, type Locale } from "@/i18n/config";
import { useEventBoard, calendarUrl, todayStr, type BoardEvent } from "@/lib/useEventBoard";
import { Icon } from "@/components/zine/Icon";

const SDGS = [
  "All SDGs",
  "SDG 13: Climate Action",
  "SDG 15: Life on Land",
  "SDG 17: Partnerships",
  "SDG 11: Sustainable Cities",
  "SDG 4: Quality Education",
  "SDG 14: Life Below Water",
];
const REGIONS = ["All Regions", "Kenya", "Africa / Regional", "Global"];
const FORMATS = ["All Formats", "In-person", "Online", "Hybrid"];
const STUBS = ["var(--z-sky)", "var(--z-green)", "var(--z-sun)", "var(--z-pink)", "var(--z-green-l)"];
const WALL_STEP = 8;
const DAY = 86400000;

const parse = (s: string) => new Date(`${s}T00:00:00`);
const daysBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / DAY);

export default function EventsPage() {
  const t = useTranslations("eventsPage");
  const tax = useTaxonomy();
  const locale = useLocale() as Locale;
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(intlLocale[locale], o);
  const { events, loading } = useEventBoard();
  const today = todayStr();

  const [region, setRegion] = useState("All Regions");
  const [format, setFormat] = useState("All Formats");
  const [sdg, setSdg] = useState("All SDGs");
  const [search, setSearch] = useState("");
  const [wallCount, setWallCount] = useState(WALL_STEP);
  const [open, setOpen] = useState<{ label: string; events: BoardEvent[] } | null>(null);

  const filtersOn = region !== "All Regions" || format !== "All Formats" || sdg !== "All SDGs" || search.trim() !== "";
  const q = search.trim().toLowerCase();
  const matches = (e: BoardEvent) =>
    (region === "All Regions" || e.region === region) &&
    (format === "All Formats" || e.format === format) &&
    (sdg === "All SDGs" || e.sdgs.includes(sdg)) &&
    (!q || [e.title, e.description, e.location, e.organizer ?? ""].some((v) => v.toLowerCase().includes(q)));

  // upcoming = not finished yet (or date still to be announced)
  const upcoming = events.filter((e) => matches(e) && (!e.end || e.end >= today));
  const next = upcoming.find((e) => e.start) ?? null;
  const wall = upcoming.filter((e) => e !== next);

  // ---- month calendar: every month from the first event to the last ----
  const months = useMemo(() => {
    const dated = events.filter((e) => e.start);
    if (!dated.length) return [];
    const first = parse(dated[0].start!);
    const last = parse(dated.reduce((m, e) => (e.end! > m ? e.end! : m), dated[0].end!));
    const out: { y: number; m: number }[] = [];
    for (let d = new Date(first.getFullYear(), first.getMonth(), 1); d <= last; d.setMonth(d.getMonth() + 1)) {
      out.push({ y: d.getFullYear(), m: d.getMonth() });
    }
    return out;
  }, [events]);
  const [monthPick, setMonthPick] = useState<number | null>(null);
  const nowIdx = months.findIndex((x) => x.y === new Date().getFullYear() && x.m === new Date().getMonth());
  const monthIdx = monthPick ?? (nowIdx >= 0 ? nowIdx : 0);
  const month = months[monthIdx];

  const cells = useMemo(() => {
    if (!month) return [];
    const lead = (new Date(month.y, month.m, 1).getDay() + 6) % 7; // weeks start on Monday
    const total = new Date(month.y, month.m + 1, 0).getDate();
    return [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)] as (number | null)[];
  }, [month]);
  const dayStr = (d: number) => `${month.y}-${String(month.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const onDay = (d: number) => events.filter((e) => matches(e) && e.start && e.start <= dayStr(d) && dayStr(d) <= (e.end ?? e.start));
  // Monday 2026-02-02 -> Sunday 2026-02-08
  const weekdays = Array.from({ length: 7 }, (_, i) => fmt({ weekday: "short" }).format(new Date(2026, 1, 2 + i)));

  const whenChip = (e: BoardEvent) => {
    if (!e.start) return t("tba");
    if (e.start <= today && (e.end ?? e.start) >= today) return t("happening");
    const n = daysBetween(today, e.start);
    return n === 1 ? t("tomorrow") : t("inDays", { days: n });
  };
  const dateLine = (e: BoardEvent) => {
    if (!e.start) return t("tba");
    const f = fmt({ day: "numeric", month: "long", year: "numeric" });
    return e.end && e.end !== e.start ? `${f.format(parse(e.start))} – ${f.format(parse(e.end))}` : f.format(parse(e.start));
  };
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;

  return (
    <div className="z-page z-ev">
      <header className="z-ev__head">
        <div className="z-wrap">
          <span className="z-mono z-eyebrow">{loading ? t("eyebrow") : t("upcomingCount", { count: upcoming.length })}</span>
          <h1 className="z-h2 z-balance">{t.rich("title", { s })}</h1>
          <p className="z-lead">{t("intro")}</p>

          <div className="z-ev__filters" role="group" aria-label={t("filters")}>
            <label className="z-fund__field">
              <Icon name="search" />
              <span className="z-sr">{t("search")}</span>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search")} />
            </label>
            {([[region, setRegion, REGIONS, "regionLabel", "public"], [format, setFormat, FORMATS, "formatLabel", "devices"], [sdg, setSdg, SDGS, "sdgLabel", "flag"]] as const).map(([val, set, opts, label, icon]) => (
              <label key={label} className="z-fund__field z-fund__field--select">
                <Icon name={icon} />
                <span className="z-sr">{t(label)}</span>
                <select value={val} onChange={(e) => { set(e.target.value); setWallCount(WALL_STEP); }}>
                  {opts.map((o) => <option key={o} value={o}>{tax(o)}</option>)}
                </select>
                <Icon name="expand_more" />
              </label>
            ))}
            {filtersOn && (
              <button type="button" className="z-ghost" onClick={() => { setRegion("All Regions"); setFormat("All Formats"); setSdg("All SDGs"); setSearch(""); }}>
                <Icon name="filter_alt_off" /> {t("reset")}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── next event (tear-off page) + ticket wall ── */}
      <section className="z-ev__main" aria-busy={loading}>
        <div className="z-wrap z-ev__split">
          {loading ? (
            <div className="z-tearcal z-tearcal--skel" aria-hidden="true" />
          ) : next ? (
            <article className="z-tearcal" aria-labelledby="ev-next">
              <div className="z-tearcal__rings" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} />)}</div>
              <span className="z-mono z-tearcal__label">{t("nextUp")}</span>
              <div className="z-tearcal__big">
                <div className="z-tearcal__date">
                  <b>{fmt({ day: "numeric" }).format(parse(next.start!))}</b>
                  <span className="z-mono">{fmt({ month: "long" }).format(parse(next.start!))} · {fmt({ weekday: "short" }).format(parse(next.start!))}</span>
                </div>
                <div>
                  <span className="z-ev__chip"><Icon name="bolt" fill /> {whenChip(next)}</span>
                  <h2 id="ev-next">{next.title}</h2>
                  <p className="z-ev__meta">
                    <span><Icon name="location_on" /> {next.location || tax(next.region)}</span>
                    <span><Icon name="devices" /> {tax(next.format)}</span>
                    {next.end !== next.start && <span><Icon name="date_range" /> {dateLine(next)}</span>}
                  </p>
                  {next.description && <p className="z-tearcal__desc">{next.description}</p>}
                </div>
              </div>
              <div className="z-tearcal__acts">
                {calendarUrl(next) && (
                  <a className="z-btn z-btn--green z-btn--sm" href={calendarUrl(next)!} target="_blank" rel="noopener noreferrer">
                    <Icon name="calendar_add_on" /> {t("addCalendar")}
                  </a>
                )}
                {next.link && (
                  <a className="z-btn z-btn--white z-btn--sm" href={next.link} target="_blank" rel="noopener noreferrer">
                    <Icon name="open_in_new" /> {t("website")}
                  </a>
                )}
              </div>
            </article>
          ) : (
            <div className="z-fund__empty">
              <Icon name="event_busy" size={44} />
              <h2 className="z-fund__h3">{t("emptyTitle")}</h2>
              <p>{t("emptyBody")}</p>
            </div>
          )}

          <div className="z-ev__wallwrap">
            <h2 className="z-fund__h3"><Icon name="confirmation_number" /> {t("comingUp")}</h2>
            {loading ? (
              <div className="z-ev__wall" aria-hidden="true">{[0, 1, 2, 3].map((i) => <div key={i} className="z-ticket" style={{ height: 96 }} />)}</div>
            ) : wall.length === 0 ? (
              <p className="z-ev__none">{t("wallEmpty")}</p>
            ) : (
              <>
                <ul className="z-ev__wall">
                  {wall.slice(0, wallCount).map((e, i) => (
                    <li key={e.id}>
                      <button type="button" className="z-ticket z-ev__tk" onClick={() => setOpen({ label: dateLine(e), events: [e] })}>
                        <span className="z-ticket__date" style={{ background: STUBS[i % STUBS.length] }}>
                          {e.start ? fmt({ day: "2-digit" }).format(parse(e.start)) : t("tbaShort")}
                          <small>{e.start ? fmt({ month: "short" }).format(parse(e.start)).replace(".", "").toUpperCase() : ""}</small>
                        </span>
                        <span className="z-ticket__body">
                          <span className="z-ev__tktitle">{e.title}</span>
                          <span className="z-ticket__where">{[...new Set([e.location || tax(e.region), tax(e.format)])].join(" · ")}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                {wall.length > wallCount && (
                  <button type="button" className="z-btn z-btn--white z-ev__more" onClick={() => setWallCount((c) => c + WALL_STEP)}>
                    <Icon name="expand_more" /> {t("showMore", { count: wall.length - wallCount })}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── month calendar ── */}
      <div className="z-tear z-tear--top" aria-hidden="true" />
      <section className="z-dark z-ev__calsec" aria-labelledby="ev-cal">
        <div className="z-wrap">
          <div className="z-sec-head">
            <div>
              <span className="z-mono z-kicker">{t("calKicker")}</span>
              <h2 id="ev-cal" className="z-h2">{month ? fmt({ month: "long", year: "numeric" }).format(new Date(month.y, month.m, 1)) : ""}</h2>
            </div>
            <div className="z-ev__monthnav">
              <button type="button" disabled={monthIdx <= 0} onClick={() => setMonthPick(monthIdx - 1)} aria-label={t("prevMonth")}><Icon name="chevron_left" /></button>
              <button type="button" disabled={monthIdx >= months.length - 1} onClick={() => setMonthPick(monthIdx + 1)} aria-label={t("nextMonth")}><Icon name="chevron_right" /></button>
            </div>
          </div>

          {month && (
            <div className="z-cal" role="grid" aria-labelledby="ev-cal">
              <div className="z-cal__row z-cal__head" role="row">
                {weekdays.map((w) => <span key={w} role="columnheader" className="z-mono">{w}</span>)}
              </div>
              <div className="z-cal__grid">
                {cells.map((d, i) => {
                  if (d === null) return <span key={`x${i}`} className="z-cal__cell z-cal__cell--empty" aria-hidden="true" />;
                  const evs = onDay(d);
                  const isToday = dayStr(d) === today;
                  const label = fmt({ weekday: "long", day: "numeric", month: "long" }).format(new Date(month.y, month.m, d));
                  return evs.length ? (
                    <button
                      key={d}
                      type="button"
                      className={`z-cal__cell z-cal__cell--on${isToday ? " z-cal__cell--today" : ""}`}
                      onClick={() => setOpen({ label, events: evs })}
                      aria-label={`${label}: ${t("eventCount", { count: evs.length })}`}
                    >
                      <b>{d}</b>
                      <span className="z-cal__pills" aria-hidden="true">
                        {evs.slice(0, 2).map((e) => <span key={e.id}>{e.title}</span>)}
                        {evs.length > 2 && <span>+{evs.length - 2}</span>}
                      </span>
                    </button>
                  ) : (
                    <span key={d} className={`z-cal__cell${isToday ? " z-cal__cell--today" : ""}`}><b>{d}</b></span>
                  );
                })}
              </div>
            </div>
          )}
          <p className="z-wx__credit z-wx__credit--dark">{t("calNote")}</p>
        </div>
      </section>
      <div className="z-tear z-tear--bottom" aria-hidden="true" />

      {/* ── submit an event ── */}
      <section className="z-ev__submit">
        <div className="z-wrap">
          <Link href="/contact" className="z-ticket z-ev__submitcard">
            <span className="z-ticket__date" style={{ background: "var(--z-orange)" }}><Icon name="add" size={40} /></span>
            <span className="z-ticket__body">
              <span className="z-mono z-kicker">{t("ctaKicker")}</span>
              <h2 className="z-h2 z-balance">{t.rich("ctaTitle", { s })}</h2>
              <p>{t("ctaBody")}</p>
              <span className="z-btn z-btn--navy z-btn--sm">{t("ctaButton")} <Icon name="arrow_forward" /></span>
            </span>
          </Link>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />

      <EventDialog data={open} onClose={() => setOpen(null)} dateLine={dateLine} />
    </div>
  );
}

function EventDialog({ data, onClose, dateLine }: { data: { label: string; events: BoardEvent[] } | null; onClose: () => void; dateLine: (e: BoardEvent) => string }) {
  const t = useTranslations("eventsPage");
  const tax = useTaxonomy();
  const ref = useRef<HTMLDialogElement>(null);

  // Native <dialog>: focus is trapped and Escape closes it.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (data && !d.open) d.showModal();
    if (!data && d.open) d.close();
  }, [data]);

  return (
    <dialog ref={ref} className="z-ev__dialog" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }} aria-labelledby="ev-dialog-title">
      {data && (
        <div className="z-ev__dialogin">
          <div className="z-ev__dialoghead">
            <span id="ev-dialog-title" className="z-mono">{data.label} · {t("eventCount", { count: data.events.length })}</span>
            <button type="button" onClick={onClose} aria-label={t("closeModal")}><Icon name="close" /></button>
          </div>
          {data.events.map((e) => (
            <article key={e.id} className="z-ev__dialogev">
              <div className="z-ev__tags">
                <span>{tax(e.kind)}</span>
                <span>{tax(e.region)} · {tax(e.format)}</span>
              </div>
              <h3>{e.title}</h3>
              <dl className="z-ev__facts">
                <div><dt><Icon name="event" /> {t("date")}</dt><dd>{dateLine(e)}</dd></div>
                {e.location && <div><dt><Icon name="location_on" /> {t("location")}</dt><dd>{e.location}</dd></div>}
                {e.organizer && <div><dt><Icon name="apartment" /> {t("organizer")}</dt><dd>{e.organizer}</dd></div>}
              </dl>
              {e.description && <p>{e.description}</p>}
              {e.sdgs.length > 0 && <p className="z-ev__sdgs">{e.sdgs.map((x) => <span key={x}>{tax(x)}</span>)}</p>}
              <div className="z-tearcal__acts" style={{ padding: 0 }}>
                {calendarUrl(e) && (
                  <a className="z-btn z-btn--green z-btn--sm" href={calendarUrl(e)!} target="_blank" rel="noopener noreferrer">
                    <Icon name="calendar_add_on" /> {t("addCalendar")}
                  </a>
                )}
                {e.link && (
                  <a className="z-btn z-btn--white z-btn--sm" href={e.link} target="_blank" rel="noopener noreferrer">
                    <Icon name="open_in_new" /> {t("website")}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </dialog>
  );
}
