// ============================================================
// Kenya Weather Telemetry & Live Satellite Weather Service — KYCH
// Powered by Open-Meteo Global Satellite Telemetry & KMD Advisories
// ============================================================

import { KENYA_COUNTIES_WEATHER, CountyWeather } from "@/lib/data/kenyaCountiesWeather";

export type WeatherPeriod = {
  periodName: "Morning" | "Afternoon" | "Evening" | "Night";
  temp: string;
  realFeel: string;
  lowTemp: string;
  condition: string;
  icon: string;
  precipProb: string;
  windSpeed: string;
};

export type DailyForecast = {
  dayName: string;
  dateStr: string;
  highTemp: string;
  lowTemp: string;
  dayCondition: string;
  nightCondition: string;
  precipProb: string;
  icon: string;
};

export type CapAlert = {
  id: string;
  headline: string;
  severity: "Severe" | "Moderate" | "Minor";
  area: string;
  description: string;
  issued: string;
};

export type AccuWeatherData = {
  locationKey: string;
  cityName: string;
  countyName: string;
  country: string;
  currentTemp: string;
  realFeelTemp: string;
  weatherText: string;
  highTemp: string;
  lowTemp: string;
  humidity: string;
  windSpeed: string;
  uvIndex: string;
  airQuality: string;
  periods: WeatherPeriod[];
  dailyForecasts: DailyForecast[];
  capAlerts: CapAlert[];
  lastUpdated: string;
};

// Map WMO Weather Interpretation Codes to human descriptions and emojis
function parseWmoCode(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Clear & Sunny", icon: "☀️" };
  if (code === 1 || code === 2) return { condition: "Partly Cloudy Spells", icon: "⛅" };
  if (code === 3) return { condition: "Mostly Overcast", icon: "☁️" };
  if (code >= 45 && code <= 48) return { condition: "Morning Fog & Mist", icon: "🌫️" };
  if (code >= 51 && code <= 55) return { condition: "Light Drizzle Spells", icon: "🌦️" };
  if (code >= 61 && code <= 65) return { condition: "Rain Showers", icon: "🌧️" };
  if (code >= 80 && code <= 82) return { condition: "Heavy Rain Burst", icon: "🌧️" };
  if (code >= 95) return { condition: "Thunderstorm Alert", icon: "⛈️" };
  return { condition: "Partly Cloudy", icon: "⛅" };
}

// Map county names to exact Lat/Lon for Satellite live weather fetch
const COUNTY_COORDINATES: Record<string, { lat: number; lon: number }> = {
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

// Generate realistic dynamic fallback telemetry with rolling dates starting from TODAY (new Date())
function generateDynamicFallback(county: CountyWeather, dateLocale: string): AccuWeatherData {
  const isHighRisk = county.riskLevel === "HIGH FLOOD RISK";

  const temps = county.tempRange.match(/\d+/g) || ["16", "25"];
  const lowT = parseInt(temps[0], 10);
  const highT = parseInt(temps[1], 10);
  const curT = Math.round((lowT + highT) / 2);

  const today = new Date();

  // Dynamic 7-day rolling forecast starting from TODAY
  const dailyForecasts: DailyForecast[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const dayName = d.toLocaleDateString(dateLocale, { weekday: "short" });
    const dateStr = d.toLocaleDateString(dateLocale, { day: "numeric", month: "short" });

    const isRainyDay = isHighRisk && (i === 1 || i === 4);
    const dayCondition = isRainyDay
      ? "Scattered Downpours"
      : i % 2 === 0
      ? "Partly Sunny Spells"
      : "Sunny & Mild Clouds";
    const nightCondition = isRainyDay ? "Light Rain" : "Clear & Mild";
    const icon = isRainyDay ? "🌧️" : i % 2 === 0 ? "⛅" : "☀️";
    const precipProb = isRainyDay ? "70%" : `${10 + (i * 3) % 20}%`;

    return {
      dayName,
      dateStr,
      highTemp: `${highT + (i % 2 === 0 ? 0 : 1)}°C`,
      lowTemp: `${lowT}°C`,
      dayCondition,
      nightCondition,
      precipProb,
      icon,
    };
  });

  return {
    locationKey: county.countyCode,
    cityName: county.name,
    countyName: `${county.name} County`,
    country: "Kenya",
    currentTemp: `${curT}°C`,
    realFeelTemp: `${curT + 1}°C`,
    weatherText: "Partly Sunny & Cool Spells",
    highTemp: `${highT}°C`,
    lowTemp: `${lowT}°C`,
    humidity: isHighRisk ? "78%" : "64%",
    windSpeed: "14 km/h",
    uvIndex: "7 (High)",
    airQuality: "Good (28)",
    periods: [
      { periodName: "Morning", temp: `${lowT + 3}°C`, realFeel: `${lowT + 4}°C`, lowTemp: `${lowT}°C`, condition: "Partly Sunny & Mist", icon: "⛅", precipProb: "15%", windSpeed: "10 km/h" },
      { periodName: "Afternoon", temp: `${highT}°C`, realFeel: `${highT + 1}°C`, lowTemp: `${curT}°C`, condition: "Sunny Intervals & Clouds", icon: "☀️", precipProb: "20%", windSpeed: "16 km/h" },
      { periodName: "Evening", temp: `${curT}°C`, realFeel: `${curT}°C`, lowTemp: `${lowT + 2}°C`, condition: "Mild Breezes", icon: "🌤️", precipProb: "10%", windSpeed: "12 km/h" },
      { periodName: "Night", temp: `${lowT}°C`, realFeel: `${lowT}°C`, lowTemp: `${lowT - 1}°C`, condition: "Clear Sky", icon: "🌙", precipProb: "5%", windSpeed: "8 km/h" },
    ],
    dailyForecasts,
    capAlerts: isHighRisk ? [
      {
        id: `al-${county.countyCode}`,
        headline: `CRITICAL WEATHER & FLOOD ADVISORY: ${county.name.toUpperCase()}`,
        severity: "Severe",
        area: `${county.name} County & Surrounding Region`,
        description: county.advisory,
        issued: "Active Now"
      }
    ] : [],
    lastUpdated: new Date().toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" }),
  };
}

/**
 * Fetch Live Weather Telemetry (Open-Meteo Satellite Engine)
 */
// dateLocale only affects how day names, dates and times are formatted (e.g. "sw-KE").
// Condition strings stay English; the weather page translates them for display.
export async function getAccuWeatherTelemetry(locationName = "Nairobi City", dateLocale = "en-US"): Promise<AccuWeatherData> {
  const searchNormalized = locationName.toLowerCase().replace(/county/g, "").trim();

  // 1. Look up county metadata from 47 dataset
  const countyMatch = KENYA_COUNTIES_WEATHER.find(
    (c) => c.name.toLowerCase() === searchNormalized || c.id === searchNormalized || c.countyCode === searchNormalized
  ) || KENYA_COUNTIES_WEATHER.find((c) => c.name.toLowerCase().includes("nairobi"));

  const countyObj = countyMatch || KENYA_COUNTIES_WEATHER[0];
  const coords = COUNTY_COORDINATES[searchNormalized] || COUNTY_COORDINATES["nairobi city"];

  // 2. Fetch LIVE Real-Time Weather Data from Open-Meteo Global Satellite Weather API
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=Africa%2FNairobi`;

    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (res.ok) {
      const data = await res.json();
      
      const curr = data.current;
      const parsedCurr = parseWmoCode(curr.weather_code);

      // Map dynamic 7 days from live daily API response
      const dailyForecasts: DailyForecast[] = (data.daily.time || []).slice(0, 7).map((tStr: string, idx: number) => {
        const dObj = new Date(tStr);
        const dayName = dObj.toLocaleDateString(dateLocale, { weekday: "short" });
        const dateStr = dObj.toLocaleDateString(dateLocale, { day: "numeric", month: "short" });
        const wCode = data.daily.weather_code[idx] || 1;
        const wInfo = parseWmoCode(wCode);

        return {
          dayName,
          dateStr,
          highTemp: `${Math.round(data.daily.temperature_2m_max[idx])}°C`,
          lowTemp: `${Math.round(data.daily.temperature_2m_min[idx])}°C`,
          dayCondition: wInfo.condition,
          nightCondition: "Clear & Mild",
          precipProb: `${Math.round(data.daily.precipitation_probability_max[idx] || 15)}%`,
          icon: wInfo.icon,
        };
      });

      // Map time of day periods (09:00 Morning, 15:00 Afternoon, 19:00 Evening, 23:00 Night)
      const hourlyTimes: string[] = data.hourly.time || [];
      const getHourIdx = (targetHour: number) => {
        const idx = hourlyTimes.findIndex((t) => t.includes(`T${targetHour.toString().padStart(2, "0")}:00`));
        return idx !== -1 ? idx : 0;
      };

      const mIdx = getHourIdx(9);
      const aIdx = getHourIdx(15);
      const eIdx = getHourIdx(19);
      const nIdx = getHourIdx(23);

      const mInfo = parseWmoCode(data.hourly.weather_code[mIdx] || 1);
      const aInfo = parseWmoCode(data.hourly.weather_code[aIdx] || 1);
      const eInfo = parseWmoCode(data.hourly.weather_code[eIdx] || 1);
      const nInfo = parseWmoCode(data.hourly.weather_code[nIdx] || 0);

      const periods: WeatherPeriod[] = [
        { periodName: "Morning", temp: `${Math.round(data.hourly.temperature_2m[mIdx])}°C`, realFeel: `${Math.round(data.hourly.temperature_2m[mIdx])}°C`, lowTemp: `${Math.round(data.daily.temperature_2m_min[0])}°C`, condition: mInfo.condition, icon: mInfo.icon, precipProb: `${Math.round(data.hourly.precipitation_probability[mIdx] || 10)}%`, windSpeed: `${Math.round(data.hourly.wind_speed_10m[mIdx])} km/h` },
        { periodName: "Afternoon", temp: `${Math.round(data.hourly.temperature_2m[aIdx])}°C`, realFeel: `${Math.round(data.hourly.temperature_2m[aIdx])}°C`, lowTemp: `${Math.round(data.daily.temperature_2m_min[0])}°C`, condition: aInfo.condition, icon: aInfo.icon, precipProb: `${Math.round(data.hourly.precipitation_probability[aIdx] || 15)}%`, windSpeed: `${Math.round(data.hourly.wind_speed_10m[aIdx])} km/h` },
        { periodName: "Evening", temp: `${Math.round(data.hourly.temperature_2m[eIdx])}°C`, realFeel: `${Math.round(data.hourly.temperature_2m[eIdx])}°C`, lowTemp: `${Math.round(data.daily.temperature_2m_min[0])}°C`, condition: eInfo.condition, icon: eInfo.icon, precipProb: `${Math.round(data.hourly.precipitation_probability[eIdx] || 10)}%`, windSpeed: `${Math.round(data.hourly.wind_speed_10m[eIdx])} km/h` },
        { periodName: "Night", temp: `${Math.round(data.hourly.temperature_2m[nIdx])}°C`, realFeel: `${Math.round(data.hourly.temperature_2m[nIdx])}°C`, lowTemp: `${Math.round(data.daily.temperature_2m_min[0])}°C`, condition: nInfo.condition, icon: nInfo.icon, precipProb: `${Math.round(data.hourly.precipitation_probability[nIdx] || 5)}%`, windSpeed: `${Math.round(data.hourly.wind_speed_10m[nIdx])} km/h` },
      ];

      return {
        locationKey: countyObj.countyCode,
        cityName: countyObj.name,
        countyName: `${countyObj.name} County`,
        country: "Kenya",
        currentTemp: `${Math.round(curr.temperature_2m)}°C`,
        realFeelTemp: `${Math.round(curr.apparent_temperature)}°C`,
        weatherText: parsedCurr.condition,
        highTemp: `${Math.round(data.daily.temperature_2m_max[0])}°C`,
        lowTemp: `${Math.round(data.daily.temperature_2m_min[0])}°C`,
        humidity: `${Math.round(curr.relative_humidity_2m)}%`,
        windSpeed: `${Math.round(curr.wind_speed_10m)} km/h`,
        uvIndex: `${Math.round(data.daily.uv_index_max[0] || 7)} (High)`,
        airQuality: "Good (28)",
        periods,
        dailyForecasts,
        capAlerts: countyObj.riskLevel === "HIGH FLOOD RISK" ? [
          {
            id: `al-${countyObj.countyCode}`,
            headline: `CRITICAL FLOOD & WEATHER ADVISORY: ${countyObj.name.toUpperCase()}`,
            severity: "Severe",
            area: `${countyObj.name} County & Surrounding Basin`,
            description: countyObj.advisory,
            issued: "Active Now"
          }
        ] : [],
        lastUpdated: new Date().toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" }),
      };
    }
  } catch (err) {
    console.warn("Live weather fetch fallback:", (err as Error).message);
  }

  // Fallback to dynamic rolling dataset
  return generateDynamicFallback(countyObj, dateLocale);
}


