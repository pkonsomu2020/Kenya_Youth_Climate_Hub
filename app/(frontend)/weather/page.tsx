"use client";

import { useState, useEffect, useMemo } from "react";
import { getAccuWeatherTelemetry, AccuWeatherData, WeatherPeriod } from "@/lib/services/accuweather";
import { KENYA_COUNTIES_WEATHER } from "@/lib/data/kenyaCountiesWeather";
import { EL_NINO_23_STEPS, PreparednessStep } from "@/lib/data/elNinoPreparedness";
import {
  CloudRain, ShieldAlert, PhoneCall, Search, Filter, CheckSquare, Square,
  MapPin, ChevronLeft, ChevronRight, Wind, Droplets, Sun, Compass,
  Globe, AlertTriangle, Layers, Maximize2, RefreshCw, Navigation
} from "lucide-react";
import { NK, nkShadow, nkCard } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";
import { CTABand } from "@/components/CTABand";
import { useLocale, useTranslations } from "next-intl";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { intlLocale, type Locale } from "@/i18n/config";
import { localizeItems } from "@/lib/data/localize";
import { elNinoStepsI18n } from "@/lib/data/translations/elNinoPreparedness";
import { countyAdvisoriesI18n } from "@/lib/data/translations/countyAdvisories";

const ALL_47_KENYA_COUNTIES = KENYA_COUNTIES_WEATHER.map((c) => c.name);

const STEP_CATEGORIES = [
  "All 23 Steps",
  "Home & Infrastructure",
  "Health & Medicine",
  "Emergency Kit",
  "Water & Sanitation",
  "Safety & Livestock",
] as const;

export default function WeatherPage() {
  const t = useTranslations("weatherPage");
  const tax = useTaxonomy();
  const term = useTaxonomy("weatherTerms");
  const locale = useLocale() as Locale;
  const steps = useMemo(() => localizeItems(EL_NINO_23_STEPS, elNinoStepsI18n, locale, (s) => String(s.stepNumber)), [locale]);
  // CAP alerts carry the county's English advisory; swap in the translated one when we have it.
  const advisoryFor = (alertId: string, fallback: string) => {
    if (locale === "en") return fallback;
    const countyId = `c-${alertId.replace(/^al-/, "")}`;
    return countyAdvisoriesI18n[locale]?.[countyId] ?? fallback;
  };
  const [selectedLocation, setSelectedLocation] = useState("Nairobi City");
  const [weatherData, setWeatherData] = useState<AccuWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  // Time-of-Day Carousel active index
  const [periodIndex, setPeriodIndex] = useState(0);

  // Preparedness Checklist State
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("All 23 Steps");

  // Map Basemap Toggle
  const [mapLayer, setMapLayer] = useState<"natural" | "forecast">("forecast");

  // Load AccuWeather Telemetry for selected location
  useEffect(() => {
    let active = true;
    setLoading(true);

    getAccuWeatherTelemetry(selectedLocation, intlLocale[locale]).then((data) => {
      if (active) {
        setWeatherData(data);
        setLoading(false);
      }
    });

    return () => { active = false; };
  }, [selectedLocation, locale]);

  // Auto-Detect User Location using Geolocation API
  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      alert(t("geoUnsupported"));
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Check proximity to major Kenya hubs or query API
        if (latitude < -3.5) setSelectedLocation("Mombasa");
        else if (longitude > 38.5) setSelectedLocation("Garissa");
        else if (longitude < 35.5) setSelectedLocation("Kisumu");
        else setSelectedLocation("Nairobi City");
        setLocating(false);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setSelectedLocation("Nairobi City");
        setLocating(false);
      }
    );
  };

  // Toggle checklist step
  const toggleStep = (stepNumber: number) => {
    setCheckedSteps((prev) => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  };

  const completedCount = useMemo(() => {
    return Object.values(checkedSteps).filter(Boolean).length;
  }, [checkedSteps]);

  const completionPercentage = Math.round((completedCount / 23) * 100);

  // Filtered Preparedness Steps
  const filteredSteps = useMemo(() => {
    return steps.filter((step) => {
      if (activeCategory !== "All 23 Steps" && step.category !== activeCategory) return false;
      return true;
    });
  }, [activeCategory, steps]);

  // 7-Day Weather Focus Selected Day Index
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  return (
    <>
      {/* ── ACCUWEATHER LOCATION & SEARCH HEADER BAR ── */}
      <section style={{ background: NK.navyDeep, color: "#fff", borderBottom: `2px solid ${NK.green}`, padding: "1.25rem 1rem" }} className="md:px-10">
        <div style={{ maxWidth: 1320, margin: "0 auto" }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Location Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{ width: 40, height: 40, background: NK.green, color: NK.navyDeep, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", flexShrink: 0 }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.8vw, 2rem)", color: "#fff", margin: 0, lineHeight: 1.1 }}>
                  {weatherData?.cityName || selectedLocation}
                </h1>
                <span style={{ fontFamily: "var(--fm)", fontSize: 11, background: "rgba(255,255,255,0.15)", color: NK.green, padding: "2px 8px" }}>
                  {weatherData ? t("countyName", { name: weatherData.cityName }) : "Kenya"}
                </span>
              </div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: NK.mutedOnDark, marginTop: 3 }}>
                {t("poweredUpdated", { time: weatherData?.lastUpdated || t("live") })}
              </div>
            </div>
          </div>

          {/* Controls: Auto-Detect & Search Bar for All 47 Kenya Counties */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleAutoDetectLocation}
              disabled={locating}
              style={{
                padding: ".65rem 1.1rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12.5,
                background: NK.green, color: NK.navyDeep, border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: ".4rem", whiteSpace: "nowrap"
              }}
            >
              <Navigation size={14} className={locating ? "animate-spin" : ""} />
              {locating ? t("detecting") : t("autoDetect")}
            </button>

            {/* All 47 Kenya Counties Select Dropdown */}
            <select
              aria-label={t("countySelect")}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                padding: ".65rem 1rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12.5,
                background: NK.panelNavy, color: "#fff", border: `1.5px solid ${NK.borderNavy}`, outline: "none", cursor: "pointer"
              }}
              className="w-full sm:w-auto"
            >
              {KENYA_COUNTIES_WEATHER.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── ACCUWEATHER HERO TELEMETRY DISPLAY ── */}
      <section style={{ background: NK.bg }} className="px-4 py-6 md:px-10 md:py-8">
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          
          {/* Main Weather Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-5 sm:p-8" style={{ background: NK.white, border: `2px solid ${NK.ink}`, boxShadow: nkShadow(NK.ink) }}>
            
            {/* Left Big Temperature Block */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div style={{ fontSize: "clamp(48px, 6vw, 88px)", fontFamily: "var(--fs)", fontWeight: 800, color: NK.ink, lineHeight: 1 }}>
                {weatherData?.currentTemp || "23°C"}
              </div>
              <div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(1.1rem, 2vw, 1.35rem)", color: NK.ink, marginBottom: 4 }}>
                  {term(weatherData?.weatherText)}
                </div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 13, color: NK.greenAlt, fontWeight: 700 }}>
                  RealFeel® {weatherData?.realFeelTemp || "24°C"}
                </div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 11.5, color: NK.mutedLabel, marginTop: 4 }}>
                  {t("highLow", { high: weatherData?.highTemp ?? "", low: weatherData?.lowTemp ?? "" })}
                </div>
              </div>
            </div>

            {/* Right Telemetry Grid */}
            <div className="grid grid-cols-2 gap-3 p-4" style={{ background: NK.bg, border: `1.5px solid ${NK.ink}` }}>
              <div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t("humidity")}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: NK.ink, marginTop: 2 }}>{weatherData?.humidity}</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t("windSpeed")}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: NK.ink, marginTop: 2 }}>{weatherData?.windSpeed}</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t("uv")}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: NK.ink, marginTop: 2 }}>{weatherData?.uvIndex.replace("(High)", `(${term("High")})`)}</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t("airQuality")}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.1rem", color: NK.greenAlt, marginTop: 2 }}>{weatherData?.airQuality.replace("Good", term("Good"))}</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TIME-OF-DAY FORECAST CAROUSEL ── */}
      <section style={{ background: NK.bg }} className="px-4 py-4 md:px-10 md:py-6">
        <div className="p-4 sm:p-6" style={{ maxWidth: 1320, margin: "0 auto", background: NK.white, border: `2px solid ${NK.ink}`, boxShadow: nkShadow(NK.ink) }}>
          
          {/* Header & Controls */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: NK.navyDeep }}>
                {new Date().toLocaleDateString(intlLocale[locale], { weekday: "short", day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
              </span>
              <span className="hidden sm:inline" style={{ fontFamily: "var(--fm)", fontSize: 11, color: NK.mutedLabel }}>
                · {t("timeOfDay")}
              </span>
            </div>

            <div style={{ display: "flex", gap: "4px" }}>
              <button
                disabled={periodIndex === 0}
                onClick={() => setPeriodIndex((p) => Math.max(0, p - 1))}
                aria-label={t("prevPeriod")}
                style={{ width: 34, height: 34, background: NK.navyDeep, border: "none", color: "#fff", cursor: periodIndex === 0 ? "not-allowed" : "pointer", opacity: periodIndex === 0 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={periodIndex >= (weatherData?.periods.length || 4) - 2}
                onClick={() => setPeriodIndex((p) => Math.min((weatherData?.periods.length || 4) - 2, p + 1))}
                aria-label={t("nextPeriod")}
                style={{ width: 34, height: 34, background: NK.navyDeep, border: "none", color: "#fff", cursor: periodIndex >= (weatherData?.periods.length || 4) - 2 ? "not-allowed" : "pointer", opacity: periodIndex >= (weatherData?.periods.length || 4) - 2 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(weatherData?.periods || []).slice(periodIndex, periodIndex + 4).map((p) => (
              <div key={p.periodName} className="p-4 flex flex-col justify-between" style={{ background: NK.bg, border: `2px solid ${NK.ink}` }}>
                
                {/* Period Title Bar */}
                <div style={{ background: NK.navyDeep, color: "#fff", padding: ".4rem .75rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13, textAlign: "center", marginBottom: "1rem" }}>
                  {term(p.periodName)}
                </div>

                {/* Weather Condition & Icon */}
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <div style={{ fontSize: 36, marginBottom: 4 }}>{p.icon}</div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.25rem", color: NK.ink }}>{p.temp}</div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: NK.mutedLabel }}>{term(p.condition)}</div>
                </div>

                {/* Metrics */}
                <div style={{ background: NK.white, border: "1px solid rgba(16,28,51,0.12)", padding: ".6rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", textAlign: "center", fontFamily: "var(--fm)", fontSize: 11 }}>
                  <div>💧 {t("rain")} <strong>{p.precipProb}</strong></div>
                  <div>💨 {t("wind")} <strong>{p.windSpeed}</strong></div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── DUAL DASHBOARD GRID: CAP ALERTS & KENYA WEATHER WATCH MAP ── */}
      <section style={{ background: NK.bg }} className="px-4 py-4 md:px-10 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ maxWidth: 1320, margin: "0 auto" }}>
          
          {/* Left Column: CAP Severe Weather Alerts Box */}
          <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between" style={{ background: NK.white, border: `2px solid ${NK.ink}`, boxShadow: nkShadow(NK.ink) }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", borderBottom: "2px solid rgba(16,28,51,0.08)", paddingBottom: ".75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <ShieldAlert size={20} color="#dc2626" />
                  <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.25rem", color: NK.ink, margin: 0 }}>
                    {t("alertsTitle")}
                  </h3>
                </div>
                <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, padding: "2px 8px", background: "#dc2626", color: "#fff", borderRadius: 10 }}>
                  {weatherData?.capAlerts.length || 0}
                </span>
              </div>

              {(weatherData?.capAlerts || []).length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: NK.muted }}>
                  <ShieldAlert size={36} color={NK.mutedLabel} style={{ marginBottom: ".5rem" }} />
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 600, fontSize: ".95rem" }}>{t("noAlerts")}</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {(weatherData?.capAlerts || []).map((al) => (
                    <div key={al.id} style={{ background: "#fef2f2", border: "1.5px solid #ef4444", padding: "1rem", borderLeft: "4px solid #dc2626" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10, padding: "2px 6px", background: "#dc2626", color: "#fff", textTransform: "uppercase" }}>
                          {t("severityAlert", { severity: term(al.severity) })}
                        </span>
                        <span style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: "#991b1b" }}>{term(al.issued)}</span>
                      </div>
                      <h4 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.05rem", color: "#991b1b", margin: "0 0 4px" }}>
                        {t("alertHeadline", { county: (weatherData?.cityName ?? "").toUpperCase() })}
                      </h4>
                      <p style={{ fontFamily: "var(--fb)", fontSize: ".88rem", color: "#7f1d1d", lineHeight: 1.5, margin: 0 }}>
                        {advisoryFor(al.id, al.description)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Hotline Direct Links */}
            <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid rgba(16,28,51,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--fm)", fontSize: 11, color: NK.mutedLabel }}>{t("hotline")}</span>
              <a href="tel:1199" style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: 13, color: "#dc2626", textDecoration: "none" }}>
                📞 {t("redCross")}
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Kenya Weather Watch Map & Heat Map Signatures Component */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between" style={{ background: NK.white, border: `2px solid ${NK.ink}`, boxShadow: nkShadow(NK.ink) }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", borderBottom: "2px solid rgba(16,28,51,0.08)", paddingBottom: ".75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <Compass size={20} color={NK.greenAlt} />
                  <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.25rem", color: NK.ink, margin: 0 }}>
                    {t("mapTitle")}
                  </h3>
                </div>
                <div style={{ display: "flex", gap: ".5rem" }}>
                  <button
                    onClick={() => setMapLayer(mapLayer === "forecast" ? "natural" : "forecast")}
                    style={{ padding: "4px 10px", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, background: NK.navyDeep, color: "#fff", border: "none", cursor: "pointer" }}
                  >
                    {mapLayer === "forecast" ? `🌐 ${t("mapView")}` : `📡 ${t("satellite")}`}
                  </button>
                </div>
              </div>

              {/* Map Canvas / OpenStreetMap Display with clipped bottom footer */}
              <div style={{ position: "relative", height: 310, background: NK.navyDeep, border: `1.5px solid ${NK.ink}`, overflow: "hidden" }}>
                {(() => {
                  const locKey = selectedLocation.toLowerCase().trim();
                  const coordsMap: Record<string, { lat: number; lon: number }> = {
                    mombasa: { lat: -4.0435, lon: 39.6682 },
                    kwale: { lat: -4.1737, lon: 39.4521 },
                    kilifi: { lat: -3.6307, lon: 39.8499 },
                    "tana river": { lat: -1.503, lon: 40.033 },
                    lamu: { lat: -2.2717, lon: 40.902 },
                    "taita-taveta": { lat: -3.3161, lon: 38.485 },
                    garissa: { lat: -0.4532, lon: 39.646 },
                    wajir: { lat: 1.7471, lon: 40.0573 },
                    mandera: { lat: 3.9373, lon: 41.8569 },
                    marsabit: { lat: 2.3347, lon: 37.9899 },
                    isiolo: { lat: 0.3546, lon: 37.5822 },
                    meru: { lat: 0.047, lon: 37.6498 },
                    "tharaka-nithi": { lat: -0.3, lon: 37.95 },
                    embu: { lat: -0.5341, lon: 37.4582 },
                    kitui: { lat: -1.367, lon: 38.0106 },
                    machakos: { lat: -1.5177, lon: 37.2634 },
                    makueni: { lat: -1.8, lon: 37.6167 },
                    nyandarua: { lat: -0.18, lon: 36.37 },
                    nyeri: { lat: -0.4201, lon: 36.9476 },
                    kirinyaga: { lat: -0.5, lon: 37.28 },
                    "murang'a": { lat: -0.721, lon: 37.1526 },
                    kiambu: { lat: -1.1714, lon: 36.8356 },
                    turkana: { lat: 3.1167, lon: 35.6 },
                    "west pokot": { lat: 1.2333, lon: 35.1167 },
                    samburu: { lat: 1.1, lon: 36.95 },
                    "trans nzoia": { lat: 1.0167, lon: 35.0 },
                    "uasin gishu": { lat: 0.5143, lon: 35.2698 },
                    eldoret: { lat: 0.5143, lon: 35.2698 },
                    "elgeyo-marakwet": { lat: 0.67, lon: 35.53 },
                    nandi: { lat: 0.1833, lon: 35.15 },
                    baringo: { lat: 0.4919, lon: 35.743 },
                    laikipia: { lat: 0.35, lon: 36.78 },
                    nakuru: { lat: -0.3031, lon: 36.08 },
                    narok: { lat: -1.0833, lon: 35.8667 },
                    kajiado: { lat: -1.85, lon: 36.7833 },
                    kericho: { lat: -0.3667, lon: 35.2833 },
                    bomet: { lat: -0.7833, lon: 35.35 },
                    kakamega: { lat: 0.2833, lon: 34.75 },
                    vihiga: { lat: 0.0833, lon: 34.7167 },
                    bungoma: { lat: 0.5667, lon: 34.5667 },
                    busia: { lat: 0.4608, lon: 34.1115 },
                    siaya: { lat: -0.0607, lon: 34.2881 },
                    kisumu: { lat: -0.0917, lon: 34.768 },
                    "homa bay": { lat: -0.5273, lon: 34.4571 },
                    migori: { lat: -1.0634, lon: 34.4731 },
                    kisii: { lat: -0.6817, lon: 34.7667 },
                    nyamira: { lat: -0.5633, lon: 34.9358 },
                    "nairobi city": { lat: -1.2864, lon: 36.8172 },
                    nairobi: { lat: -1.2864, lon: 36.8172 }
                  };
                  const coords = coordsMap[locKey] || { lat: -1.286389, lon: 36.817223 };
                  const bboxDelta = mapLayer === "forecast" ? 0.35 : 1.2;
                  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(coords.lon - bboxDelta).toFixed(4)}%2C${(coords.lat - bboxDelta).toFixed(4)}%2C${(coords.lon + bboxDelta).toFixed(4)}%2C${(coords.lat + bboxDelta).toFixed(4)}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`;

                  return (
                    <iframe
                      key={`${selectedLocation}-${mapLayer}`}
                      title={t("mapFrame", { place: selectedLocation })}
                      src={mapUrl}
                      style={{ width: "100%", height: "calc(100% + 38px)", border: "none", marginBottom: "-38px" }}
                    />
                  );
                })()}

                {/* Custom Overlay Badges */}
                <div style={{ position: "absolute", top: 12, left: 12, background: NK.navyDeep, color: "#fff", padding: "4px 10px", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", gap: 6, border: `1px solid ${NK.green}`, pointerEvents: "none", zIndex: 10 }}>
                  <CloudRain size={13} color={NK.green} /> {t("canvas", { place: selectedLocation })}
                </div>

                <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(11,20,36,0.92)", color: "#fff", padding: "4px 8px", fontFamily: "var(--fm)", fontSize: 10, border: "1px solid rgba(255,255,255,0.2)", pointerEvents: "none", zIndex: 10 }}>
                  © OpenStreetMap / KMD Telemetry
                </div>
              </div>

              {/* ── HEAT MAP SIGNATURES & RISK ANALYSIS BAR ── */}
              <div style={{ marginTop: "1.25rem", background: NK.bg, border: `1.5px solid ${NK.ink}`, padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".75rem", flexWrap: "wrap", gap: ".4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".4rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12.5, color: NK.ink }}>
                    <Layers size={15} color={NK.greenAlt} /> {t("heatTitle")}
                  </div>
                  <span style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedLabel }}>
                    {t("kmdSignatures")}
                  </span>
                </div>

                {/* 4-Scale Heat Map Legend Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div style={{ background: "#fef2f2", border: "1px solid #ef4444", padding: "6px 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--fm)", fontWeight: 800, fontSize: 10, color: "#991b1b" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626", display: "inline-block" }}></span>
                      🔴 {t("extreme")}
                    </div>
                    <div style={{ fontFamily: "var(--fm)", fontSize: 9.5, color: "#7f1d1d", marginTop: 2 }}>{t("extremeDesc")}</div>
                  </div>

                  <div style={{ background: "#fff7ed", border: "1px solid #f97316", padding: "6px 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--fm)", fontWeight: 800, fontSize: 10, color: "#c2410c" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ea580c", display: "inline-block" }}></span>
                      🟧 {t("high")}
                    </div>
                    <div style={{ fontFamily: "var(--fm)", fontSize: 9.5, color: "#9a3412", marginTop: 2 }}>{t("highDesc")}</div>
                  </div>

                  <div style={{ background: "#fefce8", border: "1px solid #eab308", padding: "6px 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--fm)", fontWeight: 800, fontSize: 10, color: "#854d0e" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308", display: "inline-block" }}></span>
                      🟨 {t("moderate")}
                    </div>
                    <div style={{ fontFamily: "var(--fm)", fontSize: 9.5, color: "#713f12", marginTop: 2 }}>{t("moderateDesc")}</div>
                  </div>

                  <div style={{ background: "#f0fdf4", border: "1px solid #22c55e", padding: "6px 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--fm)", fontWeight: 800, fontSize: 10, color: "#166534" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "inline-block" }}></span>
                      🟩 {t("normal")}
                    </div>
                    <div style={{ fontFamily: "var(--fm)", fontSize: 9.5, color: "#14532d", marginTop: 2 }}>{t("normalDesc")}</div>
                  </div>
                </div>

                {/* County Live Heat Index Analysis Readout */}
                <div style={{ marginTop: ".75rem", background: NK.white, padding: "6px 10px", border: "1px solid rgba(16,28,51,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "var(--fm)", fontSize: 11, flexWrap: "wrap", gap: 4 }}>
                  <span>{t("countyAnalysis", { name: weatherData?.cityName ?? "" })}</span>
                  <span style={{ fontWeight: 800, color: selectedLocation === "Garissa" || selectedLocation === "Tana River" || selectedLocation === "Baringo" ? "#dc2626" : selectedLocation === "Kisumu" ? "#dc2626" : selectedLocation === "Nairobi" ? "#ea580c" : "#166534" }}>
                    {selectedLocation === "Garissa" || selectedLocation === "Tana River" ? `🔴 ${t("riskExtreme")}` : selectedLocation === "Kisumu" ? `🔴 ${t("riskKisumu")}` : selectedLocation === "Nairobi" ? `🟧 ${t("riskUrban")}` : `🟩 ${t("riskLow")}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Map Bottom Region Link */}
            <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "var(--fm)", fontSize: 11.5 }}>
              <span style={{ color: NK.mutedLabel }}>{t.rich("selectedRegion", { name: weatherData ? t("countyName", { name: weatherData.cityName }) : "", b: (c) => <strong style={{ color: NK.ink }}>{c}</strong> })}</span>
              <a href="#preparedness" style={{ color: NK.greenAlt, fontWeight: 700, textDecoration: "none" }}>
                {t("guideLink")} ↓
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ── 7-DAY ACCUWEATHER DAILY WEATHER FOCUS (14TH - 20TH SEPTEMBER 2026) ── */}
      <section style={{ background: NK.bg }} className="px-4 py-4 md:px-10 md:py-8">
        <div className="p-4 sm:p-7" style={{ maxWidth: 1320, margin: "0 auto", background: NK.white, border: `2px solid ${NK.ink}`, boxShadow: nkShadow(NK.ink) }}>
          
          <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: ".3rem", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, background: NK.navyDeep, color: NK.green, padding: "2px 8px", textTransform: "uppercase", marginBottom: 4 }}>
                📅 {t("weeklyFocus")}
              </div>
              <h3 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)", color: NK.ink, margin: 0 }}>
                {t("sevenDay", { place: selectedLocation, from: weatherData?.dailyForecasts[0]?.dateStr || t("today"), to: weatherData?.dailyForecasts[6]?.dateStr || t("next7") })}
              </h3>
            </div>

            <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11.5, color: NK.greenAlt, background: NK.bg, padding: "6px 12px", border: `1px solid ${NK.ink}` }}>
              {t("poweredBy")}
            </span>
          </div>

          {/* 7-Day Responsive Grid Selector (2 cols on mobile, 4 on tablet, 7 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {(weatherData?.dailyForecasts || []).slice(0, 7).map((df, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <div
                  key={df.dayName}
                  onClick={() => setSelectedDayIndex(idx)}
                  style={{
                    background: isSelected ? NK.navyDeep : NK.bg,
                    color: isSelected ? "#fff" : NK.ink,
                    border: `2px solid ${isSelected ? NK.green : NK.ink}`,
                    padding: "1rem .75rem", textAlign: "center", cursor: "pointer",
                    transition: "all .2s ease",
                    transform: isSelected ? "translateY(-4px)" : "none",
                    boxShadow: isSelected ? nkShadow(NK.green, 4) : "none"
                  }}
                >
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.05rem", color: isSelected ? NK.green : NK.ink }}>
                    {df.dayName}
                  </div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, opacity: 0.8, marginBottom: ".4rem" }}>
                    {df.dateStr}
                  </div>
                  
                  <div style={{ fontSize: 28, margin: ".4rem 0" }}>{df.icon}</div>

                  <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.15rem", margin: "4px 0" }}>
                    {df.highTemp}
                    <span style={{ fontSize: ".8rem", fontWeight: 400, opacity: 0.7, display: "block" }}>{df.lowTemp}</span>
                  </div>

                  <div style={{ fontFamily: "var(--fm)", fontSize: 10, marginTop: 4, color: isSelected ? NK.green : NK.greenAlt, fontWeight: 700 }}>
                    💧 {df.precipProb}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Day Detailed Focus Spotlight Card (Responsive Grid: 1 col on mobile/tablet, 3 cols on desktop) */}
          {(() => {
            const activeDay = (weatherData?.dailyForecasts || [])[selectedDayIndex] || (weatherData?.dailyForecasts || [])[0];
            if (!activeDay) return null;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center p-5 sm:p-6 mt-6" style={{ background: NK.navyDeep, color: "#fff", border: `2px solid ${NK.ink}` }}>
                
                <div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", color: NK.green }}>
                    {t("spotlight")}
                  </div>
                  <h4 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.4rem", color: "#fff", margin: "4px 0" }}>
                    {activeDay.dayName}, {activeDay.dateStr}
                  </h4>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 12, color: NK.mutedOnDark }}>
                    {t("dayNight", { day: term(activeDay.dayCondition), night: term(activeDay.nightCondition) })}
                  </div>
                </div>

                <div style={{ background: NK.panelNavy, padding: "1rem", border: `1px solid ${NK.borderNavy}`, display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ fontSize: 36 }}>{activeDay.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.3rem", color: NK.green }}>
                      {activeDay.highTemp} / {activeDay.lowTemp}
                    </div>
                    <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: NK.mutedOnDark }}>
                      {t("precipRisk")} <strong>{activeDay.precipProb}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ background: NK.panelNavy, padding: "1rem", border: `1px solid ${NK.borderNavy}` }}>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.green, fontWeight: 700, textTransform: "uppercase" }}>
                    💡 {t("recommended")}
                  </div>
                  <div style={{ fontFamily: "var(--fb)", fontSize: ".88rem", color: "#fff", marginTop: 4 }}>
                    {parseInt(activeDay.precipProb) >= 70
                      ? t("adviceHeavy")
                      : parseInt(activeDay.precipProb) >= 40
                      ? t("adviceModerate")
                      : t("adviceDry")}
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* ── OFFICIAL 23-POINT KMD EL NIÑO PREPAREDNESS ACTION GUIDE ── */}
      <section id="preparedness" style={{ background: NK.navyDeep, color: "#fff" }} className="px-4 py-10 md:px-10 md:py-16">
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          
          {/* Header & Progress Tracker */}
          <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-10">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", background: NK.green, color: NK.navyDeep, padding: "3px 10px", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", marginBottom: ".75rem" }}>
                {t("planBadge")}
              </div>
              <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 52px)", color: "#fff", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
                {t.rich("checklistTitle", { g: (c) => <span style={{ color: NK.green }}>{c}</span> })}
              </GrowHeading>
              <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.mutedOnDark, marginTop: ".5rem", maxWidth: 620 }}>
                {t("checklistIntro")}
              </p>
            </div>

            {/* Interactive Progress Bar Card */}
            <div className="w-full lg:w-auto min-w-[280px]" style={{ background: NK.panelNavy, border: `2px solid ${NK.ink}`, padding: "1.25rem 1.75rem", boxShadow: nkShadow(NK.green, 6) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}>
                <span style={{ fontFamily: "var(--fm)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: NK.mutedOnDark }}>{t("score")}</span>
                <span style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.2rem", color: NK.green }}>{completionPercentage}%</span>
              </div>
              <div style={{ height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 5, overflow: "hidden", border: `1px solid ${NK.borderNavy}` }}>
                <div style={{ height: "100%", width: `${completionPercentage}%`, background: NK.green, transition: "width .3s ease" }} />
              </div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedOnDark, marginTop: ".5rem", textAlign: "right" }}>
                {t("completed", { done: completedCount, total: 23 })}
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: ".5rem", overflowX: "auto", paddingBottom: "1rem", marginBottom: "2rem" }} className="hide-scrollbar">
            {STEP_CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: ".6rem 1.1rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12.5,
                    background: active ? NK.green : NK.panelNavy,
                    color: active ? NK.navyDeep : "#fff",
                    border: `1.5px solid ${NK.borderNavy}`, cursor: "pointer", transition: "all .2s",
                    whiteSpace: "nowrap"
                  }}
                >
                  {tax(cat)}
                </button>
              );
            })}
          </div>

          {/* Checklist Cards Grid (Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSteps.map((step) => {
              const isChecked = Boolean(checkedSteps[step.stepNumber]);

              return (
                <div
                  key={step.stepNumber}
                  onClick={() => toggleStep(step.stepNumber)}
                  style={{
                    background: NK.panelNavy,
                    border: `2px solid ${isChecked ? NK.green : NK.borderNavy}`,
                    padding: "1.35rem", cursor: "pointer", transition: "all .2s",
                    position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between",
                    opacity: isChecked ? 0.9 : 1
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".75rem" }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: "50%", background: isChecked ? NK.green : NK.navyDeep,
                        color: isChecked ? NK.navyDeep : NK.green, fontFamily: "var(--fs)", fontWeight: 800, fontSize: 13,
                        display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${NK.green}`
                      }}>
                        {step.stepNumber}
                      </span>

                      <div style={{ color: isChecked ? NK.green : NK.mutedOnDark }}>
                        {isChecked ? <CheckSquare size={22} color={NK.green} /> : <Square size={22} />}
                      </div>
                    </div>

                    <h3 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.15rem", color: "#fff", margin: "0 0 .4rem", textDecoration: isChecked ? "line-through" : "none" }}>
                      {step.title}
                    </h3>

                    <p style={{ fontFamily: "var(--fb)", fontSize: ".88rem", color: NK.mutedOnDark, lineHeight: 1.6, margin: "0 0 1rem" }}>
                      {step.description}
                    </p>
                  </div>

                  <div style={{ background: NK.navyDeep, padding: ".5rem .75rem", borderLeft: `3px solid ${NK.green}`, fontFamily: "var(--fm)", fontSize: 11, color: NK.green }}>
                    💡 <strong>{t("action")}</strong> {step.keyAction}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── OFFICIAL KENYA GOVERNMENT EMERGENCY & DISASTER DIRECTORY ── */}
      <section style={{ background: NK.green, color: NK.navyDeep, borderTop: `3px solid ${NK.ink}` }} className="px-4 py-10 md:px-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div>
            <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.18em", textTransform: "uppercase", color: NK.navyDeep, marginBottom: ".5rem" }}>
              {t("agenciesEyebrow")}
            </span>
            <h2 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "clamp(24px, 3.5vw, 44px)", color: NK.navyDeep, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 1rem", lineHeight: 1.1 }}>
              {t("agenciesTitle")}
            </h2>
            <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.navyDeep, lineHeight: 1.65, opacity: 0.9 }}>
              {t("agenciesBody")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NDOC */}
            <a href="tel:0800721570" style={{ background: NK.navyDeep, color: "#fff", padding: "1.25rem", border: `2px solid ${NK.ink}`, textDecoration: "none", boxShadow: nkShadow(NK.ink) }}>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: NK.green, marginBottom: 4 }}>
                {t("ndoc")}
              </div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.1rem", marginBottom: 2 }}>{t("tollFree", { number: "0800 721 570" })}</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedOnDark }}>{t("landline", { number: "020 221 2386" })}</div>
            </a>

            {/* Red Cross */}
            <a href="tel:1199" style={{ background: "#dc2626", color: "#fff", padding: "1.25rem", border: `2px solid ${NK.ink}`, textDecoration: "none", boxShadow: nkShadow(NK.ink) }}>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff", opacity: 0.9, marginBottom: 4 }}>
                {t("redCrossAmb")}
              </div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.2rem", marginBottom: 2 }}>{t("tollFree", { number: "1199" })}</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: "#fee2e2" }}>{t("rescue247")}</div>
            </a>

            {/* NDMU */}
            <a href="tel:0203871851" style={{ background: NK.navyDeep, color: "#fff", padding: "1.25rem", border: `2px solid ${NK.ink}`, textDecoration: "none", boxShadow: nkShadow(NK.ink) }}>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: NK.green, marginBottom: 4 }}>
                {t("ndmu")}
              </div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.05rem", marginBottom: 2 }}>020 387 1851</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedOnDark }}>{t("mobile", { number: "0722 519 288" })}</div>
            </a>

            {/* KMD */}
            <a href="tel:0203867880" style={{ background: NK.navyDeep, color: "#fff", padding: "1.25rem", border: `2px solid ${NK.ink}`, textDecoration: "none", boxShadow: nkShadow(NK.ink) }}>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: NK.green, marginBottom: 4 }}>
                {t("kmd")}
              </div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.05rem", marginBottom: 2 }}>020 386 7880</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedOnDark }}>{t("advisories")}</div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
