"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getAccuWeatherTelemetry, COUNTY_COORDINATES, type AccuWeatherData } from "@/lib/services/accuweather";
import { KENYA_COUNTIES_WEATHER } from "@/lib/data/kenyaCountiesWeather";
import { EL_NINO_23_STEPS } from "@/lib/data/elNinoPreparedness";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { intlLocale, type Locale } from "@/i18n/config";
import { localizeItems } from "@/lib/data/localize";
import { elNinoStepsI18n } from "@/lib/data/translations/elNinoPreparedness";
import { countyAdvisoriesI18n } from "@/lib/data/translations/countyAdvisories";
import { CountyMap, RISK_FILL, type Risk } from "@/components/weather/CountyMap";
import { countyAt } from "@/lib/geo/countyMap";
import { Icon } from "@/components/zine/Icon";
import { EMERGENCY_CONTACTS } from "@/lib/data/emergencyContacts";

const STEP_CATEGORIES = [
  "All 23 Steps",
  "Home & Infrastructure",
  "Health & Medicine",
  "Emergency Kit",
  "Water & Sanitation",
  "Safety & Livestock",
] as const;

const RISKS: Risk[] = ["HIGH FLOOD RISK", "MODERATE RISK", "NORMAL"];
const RISK_KEY: Record<Risk, "riskHigh" | "riskModerate" | "riskNormal"> = {
  "HIGH FLOOD RISK": "riskHigh",
  "MODERATE RISK": "riskModerate",
  NORMAL: "riskNormal",
};

// The forecast service returns emoji; the design uses Material Symbols only.
const WX_ICON: Record<string, string> = {
  "☀️": "clear_day",
  "⛅": "partly_cloudy_day",
  "☁️": "cloud",
  "🌫️": "foggy",
  "🌦️": "rainy_light",
  "🌧️": "rainy",
  "⛈️": "thunderstorm",
  "🌤️": "partly_cloudy_day",
  "🌙": "bedtime",
};
const wxIcon = (emoji?: string) => (emoji && WX_ICON[emoji]) || "partly_cloudy_day";
const nightIcon = (name: string) => (name === "clear_day" ? "bedtime" : name === "partly_cloudy_day" ? "partly_cloudy_night" : name);
// Current conditions come as text only (see parseWmoCode in the service).
const NOW_ICON: Record<string, string> = {
  "Clear & Sunny": "clear_day",
  "Partly Cloudy Spells": "partly_cloudy_day",
  "Partly Cloudy": "partly_cloudy_day",
  "Mostly Overcast": "cloud",
  "Morning Fog & Mist": "foggy",
  "Light Drizzle Spells": "rainy_light",
  "Rain Showers": "rainy",
  "Heavy Rain Burst": "rainy",
  "Thunderstorm Alert": "thunderstorm",
};

const riskById = Object.fromEntries(KENYA_COUNTIES_WEATHER.map((c) => [c.id, c.riskLevel])) as Record<string, Risk>;
const nameById = Object.fromEntries(KENYA_COUNTIES_WEATHER.map((c) => [c.id, c.name]));

// Emergency numbers are shared with the Climate AI knowledge base.
const EMERGENCY = EMERGENCY_CONTACTS;

export default function WeatherPage() {
  const t = useTranslations("weatherPage");
  const tax = useTaxonomy();
  const term = useTaxonomy("weatherTerms");
  const locale = useLocale() as Locale;
  const steps = useMemo(() => localizeItems(EL_NINO_23_STEPS, elNinoStepsI18n, locale, (s) => String(s.stepNumber)), [locale]);

  const [selectedLocation, setSelectedLocation] = useState("Nairobi City");
  const [weatherData, setWeatherData] = useState<AccuWeatherData | null>(null);
  // which county+language the current forecast belongs to; loading until it matches the selection
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoMsg, setGeoMsg] = useState<string | null>(null);
  const [view, setView] = useState<"risk" | "street">("risk");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("All 23 Steps");

  const county = KENYA_COUNTIES_WEATHER.find((c) => c.name === selectedLocation) ?? KENYA_COUNTIES_WEATHER[0];
  const loading = loadedKey !== selectedLocation + "|" + locale;
  const advisory = (locale !== "en" && countyAdvisoriesI18n[locale]?.[county.id]) || county.advisory;

  useEffect(() => {
    let active = true;
    getAccuWeatherTelemetry(selectedLocation, intlLocale[locale]).then((data) => {
      if (active) {
        setWeatherData(data);
        setLoadedKey(selectedLocation + "|" + locale);
      }
    });
    return () => { active = false; };
  }, [selectedLocation, locale]);

  const choose = (name: string) => {
    setSelectedLocation(name);
    setSelectedDayIndex(0);
  };

  // Find the county the visitor is standing in: GPS -> map projection -> point-in-polygon.
  const findMyCounty = () => {
    if (!navigator.geolocation) {
      setGeoMsg(t("geoUnsupported"));
      return;
    }
    setLocating(true);
    setGeoMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const id = countyAt(pos.coords.longitude, pos.coords.latitude);
        if (id && nameById[id]) {
          choose(nameById[id]);
          setGeoMsg(t("geoFound", { name: nameById[id] }));
        } else {
          setGeoMsg(t("geoOutside", { name: selectedLocation }));
        }
        setLocating(false);
      },
      () => {
        setGeoMsg(t("geoDenied"));
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 600000 }
    );
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / 23) * 100);
  const filteredSteps = steps.filter((s) => activeCategory === "All 23 Steps" || s.category === activeCategory);

  const riskCounts = RISKS.map((r) => KENYA_COUNTIES_WEATHER.filter((c) => c.riskLevel === r).length);
  const coords = COUNTY_COORDINATES[selectedLocation.toLowerCase()] ?? COUNTY_COORDINATES["nairobi city"];
  const d = 0.35;
  const streetUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(coords.lon - d).toFixed(4)}%2C${(coords.lat - d).toFixed(4)}%2C${(coords.lon + d).toFixed(4)}%2C${(coords.lat + d).toFixed(4)}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`;

  const days = (weatherData?.dailyForecasts ?? []).slice(0, 7);
  const activeDay = days[selectedDayIndex] ?? days[0];
  const precip = activeDay ? parseInt(activeDay.precipProb) : 0;
  const s = (c: React.ReactNode) => <span className="z-serif">{c}</span>;

  return (
    <div className="z-page z-wx">
      {/* ── header + controls ── */}
      <header className="z-wx__head">
        <div className="z-wrap">
          <span className="z-mono z-eyebrow">{t("kicker")}</span>
          <h1 className="z-h2 z-balance">{t.rich("title", { s })}</h1>
          <p className="z-lead">{t("lead")}</p>

          <div className="z-wx__controls">
            <button type="button" className="z-btn z-btn--green" onClick={findMyCounty} disabled={locating} aria-busy={locating}>
              <Icon name={locating ? "progress_activity" : "my_location"} className={locating ? "z-wx__spin" : ""} />
              {locating ? t("finding") : t("findMe")}
            </button>
            <label className="z-wx__select">
              <span className="z-mono">{t("countySelect")}</span>
              <select value={selectedLocation} onChange={(e) => choose(e.target.value)}>
                {KENYA_COUNTIES_WEATHER.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <Icon name="expand_more" />
            </label>
          </div>
          <p className="z-wx__geomsg" role="status" aria-live="polite">{geoMsg}</p>
        </div>
      </header>

      {/* ── map + field card ── */}
      <section className="z-wx__mapsec" aria-label={t("mapSection")}>
        <div className="z-wrap z-wx__split">
          <div className="z-wx__mapcard">
            <div className="z-wx__maptabs" role="group" aria-label={t("mapViews")}>
              <button type="button" aria-pressed={view === "risk"} onClick={() => setView("risk")}>
                <Icon name="map" /> {t("viewRisk")}
              </button>
              <button type="button" aria-pressed={view === "street"} onClick={() => setView("street")}>
                <Icon name="signpost" /> {t("viewStreet")}
              </button>
            </div>

            {view === "risk" ? (
              <>
                <span className="z-note z-wx__hint" aria-hidden="true"><Icon name="touch_app" /> {t("tapHint")}</span>
                <CountyMap
                  riskById={riskById}
                  nameById={nameById}
                  selectedId={county.id}
                  onSelect={(id) => choose(nameById[id])}
                  label={t("mapLabel", { name: county.name })}
                  riskLabel={(r) => t(RISK_KEY[r])}
                />
                <ul className="z-wx__legend" aria-label={t("legendTitle")}>
                  {RISKS.map((r, i) => (
                    <li key={r}>
                      <i className={`z-wx__sw z-wx__sw--${RISK_KEY[r]}`} style={{ background: RISK_FILL[r] }} aria-hidden="true" />
                      <b>{t(RISK_KEY[r])}</b>
                      <span>{t("countiesCount", { count: riskCounts[i] })}</span>
                    </li>
                  ))}
                </ul>
                <p className="z-wx__credit">{t("riskSource")} {t("boundaryCredit")}</p>
              </>
            ) : (
              <>
                <div className="z-wx__street">
                  <iframe key={selectedLocation} title={t("mapFrame", { place: selectedLocation })} src={streetUrl} loading="lazy" />
                </div>
                <p className="z-wx__credit">{t("streetCredit")}</p>
              </>
            )}
          </div>

          <article className="z-wx__field" aria-live="polite" aria-busy={loading}>
            <span className="z-tape z-tape--sun" style={{ top: -12, left: 28, transform: "rotate(-4deg)" }} aria-hidden="true" />
            <div className="z-wx__fieldtop">
              <div>
                <span className="z-mono">{t("countyNo", { code: county.countyCode })}</span>
                <h2>{t("countyName", { name: county.name })}</h2>
              </div>
              <span className="z-wx__chip">
                <i className={`z-wx__sw z-wx__sw--${RISK_KEY[county.riskLevel]}`} style={{ background: RISK_FILL[county.riskLevel] }} aria-hidden="true" />
                {t(RISK_KEY[county.riskLevel])}
              </span>
            </div>

            {loading && !weatherData ? (
              <div className="z-wx__now z-skel" style={{ height: 120 }} aria-label={t("loading")} />
            ) : (
              <div className="z-wx__now">
                <Icon name={NOW_ICON[weatherData?.weatherText ?? ""] ?? wxIcon(weatherData?.periods[1]?.icon)} size={64} />
                <div>
                  <div className="z-wx__temp">{weatherData?.currentTemp}</div>
                  <div className="z-wx__cond">{term(weatherData?.weatherText)}</div>
                  <div className="z-wx__sub">
                    {t("feelsLike", { temp: weatherData?.realFeelTemp ?? "" })} · {t("highLow", { high: weatherData?.highTemp ?? "", low: weatherData?.lowTemp ?? "" })}
                  </div>
                </div>
              </div>
            )}

            <dl className="z-wx__stats">
              <div><dt><Icon name="humidity_percentage" /> {t("humidity")}</dt><dd>{weatherData?.humidity ?? "—"}</dd></div>
              <div><dt><Icon name="air" /> {t("windSpeed")}</dt><dd>{weatherData?.windSpeed ?? "—"}</dd></div>
              <div><dt><Icon name="wb_sunny" /> {t("uv")}</dt><dd>{weatherData?.uvIndex.replace("(High)", `(${term("High")})`) ?? "—"}</dd></div>
              <div><dt><Icon name="eco" /> {t("airQuality")}</dt><dd>{weatherData?.airQuality.replace("Good", term("Good")) ?? "—"}</dd></div>
            </dl>

            {(weatherData?.capAlerts ?? []).length > 0 ? (
              weatherData!.capAlerts.map((al) => (
                <div key={al.id} className="z-wx__alert" role="alert">
                  <div className="z-wx__alerthead">
                    <Icon name="warning" fill />
                    <b>{t("severityAlert", { severity: term(al.severity) })}</b>
                    <span>{term(al.issued)}</span>
                  </div>
                  <p>{advisory}</p>
                  <a href="tel:1199"><Icon name="call" /> {t("callRedCross")}</a>
                </div>
              ))
            ) : (
              <div className="z-wx__advice">
                <span className="z-mono"><Icon name="checklist" /> {t("fieldNote")}</span>
                <p>{advisory}</p>
              </div>
            )}

            <p className="z-wx__updated">{t("updated", { time: weatherData?.lastUpdated ?? "…" })}</p>
          </article>
        </div>
      </section>

      {/* ── today + week ── */}
      <div className="z-tear z-tear--top" aria-hidden="true" />
      <section className="z-dark z-wx__fc" aria-labelledby="wx-today">
        <div className="z-wrap">
          <div className="z-sec-head">
            <div>
              <span className="z-mono z-kicker">
                {new Date().toLocaleDateString(intlLocale[locale], { weekday: "long", day: "numeric", month: "long" })}
              </span>
              <h2 id="wx-today" className="z-h2">{t.rich("todayTitle", { place: county.name, s })}</h2>
            </div>
          </div>

          <ol className="z-wx__periods">
            {(weatherData?.periods ?? []).map((p) => (
              <li key={p.periodName}>
                <span className="z-mono">{term(p.periodName)}</span>
                <Icon name={p.periodName === "Night" ? nightIcon(wxIcon(p.icon)) : wxIcon(p.icon)} size={40} />
                <b>{p.temp}</b>
                <span className="z-wx__pcond">{term(p.condition)}</span>
                <span className="z-wx__pmeta">
                  <span><Icon name="water_drop" /> {p.precipProb}</span>
                  <span><Icon name="air" /> {p.windSpeed}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="z-sec-head z-wx__weekhead">
            <h2 className="z-h2">{t.rich("weekTitle", { s })}</h2>
            <span className="z-note" style={{ color: "var(--z-sun)" }}><Icon name="arrow_downward" /> {t("weekHint")}</span>
          </div>

          <div className="z-wx__days" role="group" aria-label={t("weekTitlePlain")}>
            {days.map((df, idx) => (
              <button
                key={df.dateStr}
                type="button"
                aria-pressed={selectedDayIndex === idx}
                onClick={() => setSelectedDayIndex(idx)}
              >
                <b>{df.dayName}</b>
                <span className="z-mono">{df.dateStr}</span>
                <Icon name={wxIcon(df.icon)} size={34} />
                <strong>{df.highTemp}</strong>
                <span className="z-wx__low">{df.lowTemp}</span>
                <span className="z-wx__rain"><Icon name="water_drop" /> {df.precipProb}</span>
              </button>
            ))}
          </div>

          {activeDay && (
            <div className="z-wx__spot">
              <div>
                <span className="z-mono z-kicker">{t("spotlight")}</span>
                <h3>{activeDay.dayName}, {activeDay.dateStr}</h3>
                <p>{t("dayNight", { day: term(activeDay.dayCondition), night: term(activeDay.nightCondition) })}</p>
              </div>
              <div className="z-wx__spotnum">
                <Icon name={wxIcon(activeDay.icon)} size={44} />
                <div>
                  <b>{activeDay.highTemp} / {activeDay.lowTemp}</b>
                  <span>{t("precipRisk")} {activeDay.precipProb}</span>
                </div>
              </div>
              <div className={`z-wx__plan${precip >= 70 ? " z-wx__plan--hot" : ""}`}>
                <span className="z-mono"><Icon name={precip >= 70 ? "flood" : precip >= 40 ? "umbrella" : "agriculture"} /> {t("recommended")}</span>
                <p>{precip >= 70 ? t("adviceHeavy") : precip >= 40 ? t("adviceModerate") : t("adviceDry")}</p>
              </div>
            </div>
          )}
          <p className="z-wx__credit z-wx__credit--dark">{t("forecastCredit")}</p>
        </div>
      </section>
      <div className="z-tear z-tear--bottom" aria-hidden="true" />

      {/* ── El Niño checklist ── */}
      <section id="preparedness" className="z-sec z-wx__check" aria-labelledby="wx-check">
        <div className="z-wrap">
          <div className="z-sec-head">
            <div>
              <span className="z-mono z-kicker">{t("checklistKicker")}</span>
              <h2 id="wx-check" className="z-h2 z-balance">{t.rich("checklistTitle", { s })}</h2>
              <p className="z-lead">{t("checklistIntro")}</p>
            </div>
            <div className="z-wx__score">
              <div className="z-wx__scorehead">
                <span className="z-mono">{t("score")}</span>
                <b>{completionPercentage}%</b>
              </div>
              <div className="z-wx__bar" role="progressbar" aria-valuemin={0} aria-valuemax={23} aria-valuenow={completedCount} aria-label={t("score")}>
                <i style={{ width: `${completionPercentage}%` }} />
              </div>
              <span className="z-wx__scoresub">{t("completed", { done: completedCount, total: 23 })}</span>
            </div>
          </div>

          <div className="z-wx__cats" role="group" aria-label={t("categories")}>
            {STEP_CATEGORIES.map((cat) => (
              <button key={cat} type="button" aria-pressed={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
                {tax(cat)}
              </button>
            ))}
          </div>

          <ul className="z-wx__steps">
            {filteredSteps.map((step) => {
              const done = Boolean(checkedSteps[step.stepNumber]);
              return (
                <li key={step.stepNumber}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={done}
                    className="z-wx__step"
                    onClick={() => setCheckedSteps((p) => ({ ...p, [step.stepNumber]: !p[step.stepNumber] }))}
                  >
                    <span className="z-wx__stepnum">{String(step.stepNumber).padStart(2, "0")}</span>
                    <Icon name={done ? "check_box" : "check_box_outline_blank"} fill={done} className="z-wx__box" />
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <span className="z-wx__do"><b>{t("action")}</b> {step.keyAction}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="z-motif" aria-hidden="true"><div className="z-motif__strip" /></div>

      {/* ── emergency directory ── */}
      <section className="z-sec z-wx__sos" aria-labelledby="wx-sos">
        <div className="z-wrap z-wx__sosgrid">
          <div>
            <span className="z-mono z-kicker">{t("agenciesKicker")}</span>
            <h2 id="wx-sos" className="z-h2 z-balance">{t.rich("agenciesTitle", { s })}</h2>
            <p className="z-lead">{t("agenciesBody")}</p>
          </div>
          <ul className="z-wx__phones">
            {EMERGENCY.map((e) => (
              <li key={e.key}>
                <a href={`tel:${e.tel}`} className={e.hot ? "z-wx__phone z-wx__phone--hot" : "z-wx__phone"}>
                  <span className="z-mono">{t(e.key)}</span>
                  <b><Icon name="call" fill /> {e.main ? t(e.main, { number: e.number }) : e.number}</b>
                  <small>{e.subNumber ? t(e.sub, { number: e.subNumber }) : t(e.sub)}</small>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
