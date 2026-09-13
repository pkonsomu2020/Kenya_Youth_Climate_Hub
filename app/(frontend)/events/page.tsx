"use client";

import { useState, useMemo } from "react";
import { OFFICIAL_EVENTS_2026, OfficialEvent, getGoogleCalendarUrl } from "@/lib/data/officialEvents";
import { Calendar as CalendarIcon, MapPin, Search, CalendarPlus, ChevronLeft, ChevronRight, Filter, Globe, X, ExternalLink, Tag, Building2 } from "lucide-react";
import { NK, nkShadow, nkCard } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { CTABand } from "@/components/CTABand";

// Month metadata for 2026 calendar rendering
const MONTH_CONFIGS = [
  { name: "September 2026", monthIdx: 8, year: 2026, monthName: "September" },
  { name: "October 2026", monthIdx: 9, year: 2026, monthName: "October" },
  { name: "November 2026", monthIdx: 10, year: 2026, monthName: "November" },
] as const;

const SDGS = [
  "All SDGs",
  "SDG 13: Climate Action",
  "SDG 15: Life on Land",
  "SDG 17: Partnerships",
  "SDG 11: Sustainable Cities",
  "SDG 4: Quality Education",
  "SDG 14: Life Below Water"
];

const REGIONS = ["All Regions", "Kenya", "Africa / Regional", "Global"];
const FORMATS = ["All Formats", "In-person", "Online", "Hybrid"];

export default function EventsPage() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = Sep, 1 = Oct, 2 = Nov
  const [selectedSdg, setSelectedSdg] = useState("All SDGs");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedFormat, setSelectedFormat] = useState("All Formats");
  const [searchQuery, setSearchQuery] = useState("");

  // POPUP MODAL STATE: stores the list of events for the clicked day/event
  const [modalEvents, setModalEvents] = useState<{ day: number; events: OfficialEvent[] } | null>(null);

  const currentMonth = MONTH_CONFIGS[currentMonthIndex];

  // Helper: check if an event falls on a specific day of the current month
  const getEventsForDay = (day: number) => {
    const year = currentMonth.year;
    const monthStr = String(currentMonth.monthIdx + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const targetDateStr = `${year}-${monthStr}-${dayStr}`;

    return OFFICIAL_EVENTS_2026.filter((e) => {
      if (e.month !== currentMonth.monthName) return false;
      return targetDateStr >= e.startDate && targetDateStr <= e.endDate;
    });
  };

  // Calendar Grid Generator
  const calendarGrid = useMemo(() => {
    const firstDayOfWeek = new Date(currentMonth.year, currentMonth.monthIdx, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(currentMonth.year, currentMonth.monthIdx + 1, 0).getDate();

    const matrix: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      matrix.push(null);
    }
    for (let d = 1; d <= totalDaysInMonth; d++) {
      matrix.push(d);
    }
    return matrix;
  }, [currentMonthIndex]);

  // Filtered list of all month events
  const filteredEvents = useMemo(() => {
    return OFFICIAL_EVENTS_2026.filter((evt) => {
      if (evt.month !== currentMonth.monthName) return false;
      if (selectedSdg !== "All SDGs" && !evt.sdgs.includes(selectedSdg)) return false;
      if (selectedRegion !== "All Regions" && evt.region !== selectedRegion) return false;
      if (selectedFormat !== "All Formats" && evt.format !== selectedFormat) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchDesc = evt.description.toLowerCase().includes(q);
        const matchLoc = evt.location.toLowerCase().includes(q);
        const matchOrg = evt.organizer.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchOrg) return false;
      }
      return true;
    });
  }, [currentMonthIndex, selectedSdg, selectedRegion, selectedFormat, searchQuery]);

  // Handle clicking a calendar day box
  const handleDayClick = (day: number) => {
    const dayEvts = getEventsForDay(day);
    if (dayEvts.length > 0) {
      setModalEvents({ day, events: dayEvts });
    }
  };

  return (
    <>
      {/* ── HERO HEADER ── */}
      <section style={{ background: NK.bg, borderBottom: `2px solid ${NK.ink}` }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "3rem 1.5rem 2rem" }}>
          <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: NK.greenAlt, marginBottom: "0.75rem" }}>
            IISD Knowledge Model · KYCH Calendar
          </span>
          <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(32px,5vw,76px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}>
            Climate Events <span style={{ color: NK.green }}>Calendar 2026.</span>
          </GrowHeading>
          <p style={{ fontFamily: "var(--fb)", fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)", color: NK.muted, lineHeight: 1.65, marginTop: "1rem", maxWidth: 740 }}>
            Click on any highlighted date in the calendar below to launch event details, sync to Google Calendar, or access official links.
          </p>
        </div>
      </section>

      {/* ── INTERACTIVE VISUAL MONTH CALENDAR GRID (RESPONSIVE) ── */}
      <section style={{ background: NK.bg, padding: "1.5rem 1rem 1rem" }} className="md:px-10 md:py-10">
        <div style={{ maxWidth: 1320, margin: "0 auto", background: NK.white, border: `2px solid ${NK.ink}`, boxShadow: nkShadow(NK.ink), overflow: "hidden" }}>
          
          {/* Calendar Header Navigation */}
          <div style={{ background: NK.navyDeep, color: "#fff", padding: "1.25rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <div style={{ width: 38, height: 38, background: NK.green, display: "flex", alignItems: "center", justifyContent: "center", color: NK.navyDeep, flexShrink: 0 }}>
                <CalendarIcon size={20} />
              </div>
              <div>
                <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)", color: "#fff", margin: 0, lineHeight: 1.1 }}>
                  {currentMonth.name}
                </h2>
                <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedOnDark, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                  Official Climate Schedule
                </div>
              </div>
            </div>

            {/* Month Switcher Tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: ".4rem", width: "100%", maxWidth: "max-content", overflowX: "auto" }} className="hide-scrollbar">
              {MONTH_CONFIGS.map((mConfig, idx) => (
                <button
                  key={mConfig.name}
                  onClick={() => { setCurrentMonthIndex(idx); }}
                  style={{
                    padding: ".5rem .9rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12,
                    background: currentMonthIndex === idx ? NK.green : "rgba(255,255,255,0.1)",
                    color: currentMonthIndex === idx ? NK.navyDeep : "#fff",
                    border: "none", cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap"
                  }}
                >
                  {mConfig.monthName}
                </button>
              ))}
              <div style={{ display: "flex", gap: "4px", marginLeft: ".25rem", flexShrink: 0 }}>
                <button
                  disabled={currentMonthIndex === 0}
                  onClick={() => { setCurrentMonthIndex((p) => p - 1); }}
                  aria-label="Previous month"
                  style={{ width: 32, height: 32, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: currentMonthIndex === 0 ? "not-allowed" : "pointer", opacity: currentMonthIndex === 0 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={currentMonthIndex === MONTH_CONFIGS.length - 1}
                  onClick={() => { setCurrentMonthIndex((p) => p + 1); }}
                  aria-label="Next month"
                  style={{ width: 32, height: 32, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: currentMonthIndex === MONTH_CONFIGS.length - 1 ? "not-allowed" : "pointer", opacity: currentMonthIndex === MONTH_CONFIGS.length - 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Days of Week Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: NK.ink, color: NK.green, borderBottom: `2px solid ${NK.ink}` }}>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((dayName) => (
              <div key={dayName} style={{ padding: ".6rem 2px", textAlign: "center", fontFamily: "var(--fm)", fontWeight: 700, fontSize: "clamp(10px, 1.5vw, 12px)", letterSpacing: "0.05em" }}>
                {dayName}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "rgba(16,28,51,0.06)", gap: "1px" }}>
            {calendarGrid.map((day, cellIdx) => {
              if (day === null) {
                return <div key={`empty-${cellIdx}`} style={{ minHeight: "clamp(60px, 10vw, 115px)", background: NK.white, opacity: 0.3 }} />;
              }

              const dayEvents = getEventsForDay(day);
              const hasEvents = dayEvents.length > 0;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => handleDayClick(day)}
                  style={{
                    minHeight: "clamp(60px, 10vw, 115px)", padding: "clamp(4px, 1vw, 8px)",
                    background: hasEvents ? NK.tintGreen : NK.white,
                    border: hasEvents ? `2px solid ${NK.green}` : "1px solid rgba(16,28,51,0.08)",
                    cursor: hasEvents ? "pointer" : "default",
                    transition: "all .15s",
                    display: "flex", flexDirection: "column", justifyContent: "space-between"
                  }}
                  className="group"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      fontFamily: "var(--fm)", fontWeight: 700, fontSize: "clamp(11px, 1.5vw, 13px)",
                      color: hasEvents ? NK.navyDeep : NK.muted,
                      width: "clamp(20px, 2.5vw, 26px)", height: "clamp(20px, 2.5vw, 26px)", display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "50%", background: hasEvents ? NK.green : "transparent",
                    }}>
                      {day}
                    </span>
                    {hasEvents && (
                      <span className="hidden sm:inline-block" style={{ fontFamily: "var(--fm)", fontSize: 9.5, fontWeight: 700, color: NK.greenAlt, background: NK.white, padding: "1px 5px", border: `1px solid ${NK.green}` }}>
                        {dayEvents.length} Event{dayEvents.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Day Events Pills */}
                  <div style={{ marginTop: ".3rem", display: "flex", flexDirection: "column", gap: 3 }}>
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        title={evt.title}
                        style={{
                          background: NK.navyDeep, color: "#fff", padding: "3px 5px",
                          fontSize: "clamp(9px, 1.2vw, 10.5px)", fontFamily: "var(--fs)", fontWeight: 600,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          borderLeft: `3px solid ${NK.green}`
                        }}
                      >
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FILTER & SEARCH BAR ── */}
      <section style={{ background: NK.bg, padding: "1rem 1rem .5rem" }} className="md:px-10">
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", background: NK.white, padding: "1rem 1.25rem", border: `2px solid ${NK.ink}`, boxShadow: nkShadow(NK.ink) }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap", width: "100%", maxWidth: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".4rem", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: NK.mutedLabel }}>
              <Filter size={14} color={NK.greenAlt} /> Filters:
            </div>

            {/* SDG Filter */}
            <select
              value={selectedSdg}
              onChange={(e) => setSelectedSdg(e.target.value)}
              style={{
                flex: "1 1 180px", padding: ".45rem .75rem", fontFamily: "var(--fs)", fontWeight: 600, fontSize: 12.5,
                background: NK.bg, border: `1.5px solid ${NK.ink}`, color: NK.ink, cursor: "pointer", outline: "none"
              }}
            >
              {SDGS.map((sdg) => <option key={sdg} value={sdg}>{sdg}</option>)}
            </select>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                flex: "1 1 140px", padding: ".45rem .75rem", fontFamily: "var(--fs)", fontWeight: 600, fontSize: 12.5,
                background: NK.bg, border: `1.5px solid ${NK.ink}`, color: NK.ink, cursor: "pointer", outline: "none"
              }}
            >
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>

            {/* Format Filter */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              style={{
                flex: "1 1 130px", padding: ".45rem .75rem", fontFamily: "var(--fs)", fontWeight: 600, fontSize: 12.5,
                background: NK.bg, border: `1.5px solid ${NK.ink}`, color: NK.ink, cursor: "pointer", outline: "none"
              }}
            >
              {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>

            {(selectedSdg !== "All SDGs" || selectedRegion !== "All Regions" || selectedFormat !== "All Formats" || searchQuery) && (
              <button
                onClick={() => { setSelectedSdg("All SDGs"); setSelectedRegion("All Regions"); setSelectedFormat("All Formats"); setSearchQuery(""); }}
                style={{ padding: ".45rem .75rem", fontFamily: "var(--fm)", fontSize: 11, fontWeight: 700, background: "transparent", border: `1px solid ${NK.ink}`, color: NK.ink, cursor: "pointer" }}
              >
                Reset ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── ALL MONTH EVENTS LIST ── */}
      <section style={{ background: NK.bg, padding: "2rem 1rem 5rem" }} className="md:px-10 md:pb-24">
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".5rem" }}>
            <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(1.15rem, 2vw, 1.35rem)", color: NK.ink, margin: 0 }}>
              All Events in {currentMonth.name}
            </h3>
            <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11.5, color: NK.greenAlt, textTransform: "uppercase" }}>
              Showing {filteredEvents.length} Event{filteredEvents.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1.5rem", background: NK.white, border: `2px solid ${NK.ink}`, boxShadow: nkShadow(NK.ink) }}>
              <CalendarIcon size={40} color={NK.mutedLabel} style={{ marginBottom: ".75rem" }} />
              <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.25rem", color: NK.ink, marginBottom: ".4rem" }}>No events found</div>
              <p style={{ fontSize: ".9rem", color: NK.muted }}>Try resetting your filter options above.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    ...nkCard, background: NK.white, border: `2px solid ${NK.ink}`,
                    padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem",
                    alignItems: "start", transition: "translate .2s, box-shadow .2s",
                    boxShadow: nkShadow(NK.ink),
                  }}
                  className="md:grid-cols-[160px_1fr]"
                >
                  {/* Left Date Block */}
                  <div style={{ background: NK.navyDeep, color: "#fff", padding: "1rem", textAlign: "center", border: `1.5px solid ${NK.ink}` }}>
                    <div style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: NK.green, marginBottom: 2 }}>
                      {evt.month} 2026
                    </div>
                    <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.25rem", lineHeight: 1.15, color: "#fff" }}>
                      {evt.dateDisplay}
                    </div>
                    <div style={{ marginTop: ".5rem", display: "inline-block", padding: "3px 7px", background: NK.green, color: NK.navyDeep, fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>
                      {evt.eventType}
                    </div>
                  </div>

                  {/* Right Event Content */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".4rem", marginBottom: ".5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".4rem", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10.5, padding: "2px 7px", background: "rgba(93,186,47,0.15)", color: NK.greenAlt, textTransform: "uppercase" }}>
                          {evt.region}
                        </span>
                        <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10.5, padding: "2px 7px", background: "rgba(16,28,51,0.08)", color: NK.ink, textTransform: "uppercase" }}>
                          {evt.format}
                        </span>
                      </div>
                      <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: NK.mutedLabel }}>
                        Organized by: <strong style={{ color: NK.ink }}>{evt.organizer}</strong>
                      </div>
                    </div>

                    <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(1.15rem, 2vw, 1.35rem)", color: NK.ink, margin: "0 0 .5rem", lineHeight: 1.25 }}>
                      {evt.title}
                    </h2>

                    <p style={{ fontFamily: "var(--fb)", fontSize: ".92rem", color: NK.muted, lineHeight: 1.6, margin: "0 0 1rem" }}>
                      {evt.description}
                    </p>

                    {/* Meta info & SDG Badges */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".75rem", paddingTop: ".85rem", borderTop: "1px solid rgba(16,28,51,0.08)" }}>
                      {/* SDG Badges */}
                      <div style={{ display: "flex", alignItems: "center", gap: ".35rem", flexWrap: "wrap" }}>
                        {evt.sdgs.map((sdg) => (
                          <span key={sdg} style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10, padding: "2px 7px", background: NK.ink, color: NK.green }}>
                            {sdg}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", width: "100%", flexWrap: "wrap" }}>
                        <button
                          onClick={() => setModalEvents({ day: new Date(evt.startDate).getDate(), events: [evt] })}
                          style={{
                            padding: ".5rem 1rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12,
                            background: NK.ink, color: "#fff", border: "none", cursor: "pointer", flex: "1 1 auto"
                          }}
                        >
                          Details Popup ↗
                        </button>
                        <a
                          href={getGoogleCalendarUrl(evt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: ".5rem 1rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12,
                            background: NK.green, color: NK.navyDeep, textDecoration: "none",
                            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: ".35rem",
                            border: `1.5px solid ${NK.ink}`, flex: "1 1 auto"
                          }}
                        >
                          <CalendarPlus size={14} /> + Google Cal
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HIGH-END RESPONSIVE EVENT DETAILS POPUP MODAL ── */}
      {modalEvents && (
        <div
          onClick={() => setModalEvents(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
            background: "rgba(11,20,36,0.88)", backdropFilter: "blur(6px)",
            overflowY: "auto", padding: "2.5rem 1rem",
            display: "flex", justifyContent: "center", alignItems: "flex-start",
            animation: "nkFadeIn .2s ease-out"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
            style={{
              background: NK.white, border: `3px solid ${NK.ink}`,
              boxShadow: nkShadow(NK.green, 12), width: "100%", maxWidth: 620,
              display: "flex", flexDirection: "column",
              position: "relative", margin: "auto 0"
            }}
          >
            {/* Modal Header Bar */}
            <div style={{ background: NK.navyDeep, color: "#fff", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `2px solid ${NK.ink}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, padding: "4px 9px", background: NK.green, color: NK.navyDeep, textTransform: "uppercase" }}>
                  {currentMonth.monthName} {modalEvents.day}, 2026
                </span>
                <span className="hidden sm:inline" style={{ fontFamily: "var(--fm)", fontSize: 11, color: NK.mutedOnDark }}>
                  {modalEvents.events.length} Event{modalEvents.events.length > 1 ? "s" : ""} Scheduled
                </span>
              </div>
              <button
                onClick={() => setModalEvents(null)}
                aria-label="Close modal"
                style={{
                  padding: "4px 10px", background: NK.green, color: NK.navyDeep,
                  border: `1.5px solid ${NK.ink}`, cursor: "pointer", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12,
                  display: "flex", alignItems: "center", gap: "4px", flexShrink: 0
                }}
              >
                Close <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {modalEvents.events.map((evt, idx) => (
                <div key={evt.id} style={{ borderBottom: idx < modalEvents.events.length - 1 ? "1.5px solid rgba(16,28,51,0.12)" : "none", paddingBottom: idx < modalEvents.events.length - 1 ? "1.5rem" : "0" }}>
                  
                  {/* Category & Region Pill Row */}
                  <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: ".65rem" }}>
                    <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10, padding: "3px 8px", background: NK.green, color: NK.navyDeep, textTransform: "uppercase" }}>
                      {evt.eventType}
                    </span>
                    <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10, padding: "3px 8px", background: NK.navyDeep, color: "#fff", textTransform: "uppercase" }}>
                      {evt.region} · {evt.format}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(1.25rem, 2.5vw, 1.55rem)", color: NK.ink, margin: "0 0 .85rem", lineHeight: 1.25 }}>
                    {evt.title}
                  </h3>

                  {/* Info Metadata Box */}
                  <div style={{ background: NK.bg, border: `1.5px solid ${NK.ink}`, padding: "1rem", display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "1.1rem", fontFamily: "var(--fm)", fontSize: 12, color: NK.ink }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                      <CalendarIcon size={14} color={NK.greenAlt} style={{ flexShrink: 0 }} /> 
                      <span><strong>Date:</strong> {evt.dateDisplay}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                      <MapPin size={14} color={NK.greenAlt} style={{ flexShrink: 0 }} /> 
                      <span><strong>Location:</strong> {evt.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                      <Building2 size={14} color={NK.greenAlt} style={{ flexShrink: 0 }} /> 
                      <span><strong>Organizer:</strong> {evt.organizer}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontFamily: "var(--fb)", fontSize: ".95rem", color: NK.muted, lineHeight: 1.65, margin: "0 0 1.25rem" }}>
                    {evt.description}
                  </p>

                  {/* SDG Badges */}
                  <div style={{ display: "flex", alignItems: "center", gap: ".4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                    <Tag size={13} color={NK.greenAlt} />
                    {evt.sdgs.map((sdg) => (
                      <span key={sdg} style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10, padding: "3px 8px", background: NK.ink, color: NK.green }}>
                        {sdg}
                      </span>
                    ))}
                  </div>

                  {/* Modal Action Buttons (Responsive Grid) */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: ".75rem" }} className="sm:grid-cols-2">
                    <a
                      href={getGoogleCalendarUrl(evt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: ".75rem 1.1rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12.5,
                        background: NK.green, color: NK.navyDeep, textDecoration: "none",
                        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: ".4rem",
                        border: `2px solid ${NK.ink}`, textAlign: "center"
                      }}
                    >
                      <CalendarPlus size={15} /> + Add to Google Calendar
                    </a>
                    {evt.link && (
                      <a
                        href={evt.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: ".75rem 1.1rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12.5,
                          background: NK.navyDeep, color: "#fff", textDecoration: "none",
                          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: ".4rem",
                          border: `2px solid ${NK.ink}`, textAlign: "center"
                        }}
                      >
                        Official Website <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CTABand title="Have a climate event to submit?" buttonLabel="Partner with KYCH →" href="/contact" />
    </>
  );
}
