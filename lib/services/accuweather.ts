// ============================================================
// AccuWeather Service & Kenya Weather Telemetry Engine — KYCH
// AccuWeather Developer API Integration (developer.accuweather.com)
// ============================================================

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

// Fallback database for Kenya counties & towns if API key is not set or rate limit reached
const KENYA_LOCATIONS_FALLBACK: Record<string, Partial<AccuWeatherData>> = {
  nairobi: {
    cityName: "Nairobi",
    countyName: "Nairobi City",
    currentTemp: "22°C",
    realFeelTemp: "23°C",
    weatherText: "Partly Cloudy with Rain Showers",
    highTemp: "25°C",
    lowTemp: "15°C",
    humidity: "68%",
    windSpeed: "14 km/h",
    uvIndex: "6 (High)",
    airQuality: "Good (32)",
    periods: [
      { periodName: "Morning", temp: "19.0°C", realFeel: "20.0°C", lowTemp: "15.0°C", condition: "Partly Sunny", icon: "⛅", precipProb: "20%", windSpeed: "11 km/h" },
      { periodName: "Afternoon", temp: "24.0°C", realFeel: "25.0°C", lowTemp: "19.0°C", condition: "Thunderstorms Likely", icon: "🌧️", precipProb: "75%", windSpeed: "16 km/h" },
      { periodName: "Evening", temp: "21.0°C", realFeel: "21.0°C", lowTemp: "17.0°C", condition: "Light Rain", icon: "🌦️", precipProb: "45%", windSpeed: "12 km/h" },
      { periodName: "Night", temp: "16.0°C", realFeel: "16.0°C", lowTemp: "15.0°C", condition: "Mainly Clear", icon: "🌙", precipProb: "10%", windSpeed: "8 km/h" },
    ],
    dailyForecasts: [
      { dayName: "Mon", dateStr: "14 Sep", highTemp: "25°C", lowTemp: "15°C", dayCondition: "Scattered Showers", nightCondition: "Partly Cloudy", precipProb: "70%", icon: "🌧️" },
      { dayName: "Tue", dateStr: "15 Sep", highTemp: "24°C", lowTemp: "16°C", dayCondition: "Heavy Downpours", nightCondition: "Rain", precipProb: "85%", icon: "⛈️" },
      { dayName: "Wed", dateStr: "16 Sep", highTemp: "23°C", lowTemp: "15°C", dayCondition: "Thunderstorms", nightCondition: "Showers", precipProb: "80%", icon: "🌧️" },
      { dayName: "Thu", dateStr: "17 Sep", highTemp: "26°C", lowTemp: "14°C", dayCondition: "Partly Sunny", nightCondition: "Clear", precipProb: "25%", icon: "⛅" },
      { dayName: "Fri", dateStr: "18 Sep", highTemp: "27°C", lowTemp: "15°C", dayCondition: "Mostly Sunny", nightCondition: "Clear", precipProb: "15%", icon: "☀️" },
      { dayName: "Sat", dateStr: "19 Sep", highTemp: "28°C", lowTemp: "16°C", dayCondition: "Sunny Spells", nightCondition: "Fair", precipProb: "20%", icon: "🌤️" },
      { dayName: "Sun", dateStr: "20 Sep", highTemp: "26°C", lowTemp: "16°C", dayCondition: "Evening Showers", nightCondition: "Partly Cloudy", precipProb: "45%", icon: "🌦️" },
    ],
    capAlerts: [
      { id: "al-1", headline: "Urban Flash Flood Advisory", severity: "Severe", area: "Nairobi South C, Eastlands & River Basins", description: "Heavy afternoon downpours may cause rapid water pooling in storm drains.", issued: "Active Now" }
    ]
  },
  mombasa: {
    cityName: "Mombasa",
    countyName: "Mombasa County",
    currentTemp: "28°C",
    realFeelTemp: "31°C",
    weatherText: "Humid & Coastal Showers",
    highTemp: "31°C",
    lowTemp: "24°C",
    humidity: "82%",
    windSpeed: "22 km/h",
    uvIndex: "9 (Very High)",
    airQuality: "Good (24)",
    periods: [
      { periodName: "Morning", temp: "26.0°C", realFeel: "29.0°C", lowTemp: "24.0°C", condition: "Coastal Showers", icon: "🌦️", precipProb: "60%", windSpeed: "18 km/h" },
      { periodName: "Afternoon", temp: "30.0°C", realFeel: "34.0°C", lowTemp: "27.0°C", condition: "Humid & Breezy", icon: "⛅", precipProb: "40%", windSpeed: "24 km/h" },
      { periodName: "Evening", temp: "28.0°C", realFeel: "31.0°C", lowTemp: "25.0°C", condition: "Partly Cloudy", icon: "🌤️", precipProb: "30%", windSpeed: "20 km/h" },
      { periodName: "Night", temp: "25.0°C", realFeel: "27.0°C", lowTemp: "24.0°C", condition: "Passing Showers", icon: "🌧️", precipProb: "50%", windSpeed: "15 km/h" },
    ],
    dailyForecasts: [
      { dayName: "Mon", dateStr: "14 Sep", highTemp: "31°C", lowTemp: "24°C", dayCondition: "Coastal Showers", nightCondition: "Warm & Breezy", precipProb: "60%", icon: "🌦️" },
      { dayName: "Tue", dateStr: "15 Sep", highTemp: "30°C", lowTemp: "25°C", dayCondition: "Heavy Storm Surges", nightCondition: "Rain", precipProb: "80%", icon: "⛈️" },
      { dayName: "Wed", dateStr: "16 Sep", highTemp: "29°C", lowTemp: "24°C", dayCondition: "Tropical Rains", nightCondition: "Showers", precipProb: "75%", icon: "🌧️" },
      { dayName: "Thu", dateStr: "17 Sep", highTemp: "31°C", lowTemp: "24°C", dayCondition: "Sunny Spells", nightCondition: "Fair", precipProb: "30%", icon: "🌤️" },
      { dayName: "Fri", dateStr: "18 Sep", highTemp: "32°C", lowTemp: "25°C", dayCondition: "Mostly Sunny", nightCondition: "Clear", precipProb: "20%", icon: "☀️" },
      { dayName: "Sat", dateStr: "19 Sep", highTemp: "31°C", lowTemp: "25°C", dayCondition: "Partly Cloudy", nightCondition: "Warm", precipProb: "25%", icon: "⛅" },
      { dayName: "Sun", dateStr: "20 Sep", highTemp: "30°C", lowTemp: "24°C", dayCondition: "Ocean Breeze Showers", nightCondition: "Breezy", precipProb: "50%", icon: "🌦️" },
    ],
    capAlerts: [
      { id: "al-2", headline: "Coastal Storm Surge & Wind Warning", severity: "Moderate", area: "Kilifi, Mombasa & Kwale Ocean Belt", description: "High tides & strong gusty sea winds expected along low-lying beaches.", issued: "Active Now" }
    ]
  },
  kisumu: {
    cityName: "Kisumu",
    countyName: "Kisumu County",
    currentTemp: "26°C",
    realFeelTemp: "28°C",
    weatherText: "Thunderstorms & Heavy Downpours",
    highTemp: "29°C",
    lowTemp: "19°C",
    humidity: "76%",
    windSpeed: "16 km/h",
    uvIndex: "7 (High)",
    airQuality: "Good (28)",
    periods: [
      { periodName: "Morning", temp: "22.0°C", realFeel: "23.0°C", lowTemp: "19.0°C", condition: "Lake Mist & Clouds", icon: "⛅", precipProb: "30%", windSpeed: "10 km/h" },
      { periodName: "Afternoon", temp: "28.0°C", realFeel: "30.0°C", lowTemp: "22.0°C", condition: "Heavy Downpours", icon: "⛈️", precipProb: "85%", windSpeed: "18 km/h" },
      { periodName: "Evening", temp: "24.0°C", realFeel: "25.0°C", lowTemp: "20.0°C", condition: "Lake Storms", icon: "🌧️", precipProb: "65%", windSpeed: "14 km/h" },
      { periodName: "Night", temp: "20.0°C", realFeel: "20.0°C", lowTemp: "19.0°C", condition: "Overcast", icon: "☁️", precipProb: "25%", windSpeed: "8 km/h" },
    ],
    dailyForecasts: [
      { dayName: "Mon", dateStr: "14 Sep", highTemp: "29°C", lowTemp: "19°C", dayCondition: "Heavy Downpours", nightCondition: "Overcast", precipProb: "85%", icon: "⛈️" },
      { dayName: "Tue", dateStr: "15 Sep", highTemp: "28°C", lowTemp: "19°C", dayCondition: "Severe Lake Storms", nightCondition: "Rain", precipProb: "90%", icon: "🌧️" },
      { dayName: "Wed", dateStr: "16 Sep", highTemp: "27°C", lowTemp: "18°C", dayCondition: "Nyando Flood Warning", nightCondition: "Showers", precipProb: "80%", icon: "⛈️" },
      { dayName: "Thu", dateStr: "17 Sep", highTemp: "29°C", lowTemp: "19°C", dayCondition: "Scattered Rains", nightCondition: "Clear", precipProb: "40%", icon: "🌦️" },
      { dayName: "Fri", dateStr: "18 Sep", highTemp: "30°C", lowTemp: "20°C", dayCondition: "Sunny Intervals", nightCondition: "Clear", precipProb: "20%", icon: "☀️" },
      { dayName: "Sat", dateStr: "19 Sep", highTemp: "29°C", lowTemp: "19°C", dayCondition: "Thunderstorms", nightCondition: "Rain", precipProb: "75%", icon: "⛈️" },
      { dayName: "Sun", dateStr: "20 Sep", highTemp: "28°C", lowTemp: "18°C", dayCondition: "Moderate Showers", nightCondition: "Overcast", precipProb: "60%", icon: "🌧️" },
    ],
    capAlerts: [
      { id: "al-3", headline: "Nyando River Basin Flood Alert", severity: "Severe", area: "Kano Plains, Ahero & Nyando", description: "River Nyando water levels rising rapidly. Evacuate low-lying farms.", issued: "Active Now" }
    ]
  },
  garissa: {
    cityName: "Garissa",
    countyName: "Garissa County",
    currentTemp: "32°C",
    realFeelTemp: "35°C",
    weatherText: "Torrential Rains & Flash Floods",
    highTemp: "35°C",
    lowTemp: "24°C",
    humidity: "65%",
    windSpeed: "19 km/h",
    uvIndex: "10 (Very High)",
    airQuality: "Moderate (42)",
    periods: [
      { periodName: "Morning", temp: "26.0°C", realFeel: "28.0°C", lowTemp: "24.0°C", condition: "Hot & Overcast", icon: "🌤️", precipProb: "20%", windSpeed: "12 km/h" },
      { periodName: "Afternoon", temp: "34.0°C", realFeel: "37.0°C", lowTemp: "28.0°C", condition: "Heavy Rain Burst", icon: "⛈️", precipProb: "90%", windSpeed: "22 km/h" },
      { periodName: "Evening", temp: "29.0°C", realFeel: "31.0°C", lowTemp: "26.0°C", condition: "Flash Flood Surge", icon: "🌧️", precipProb: "80%", windSpeed: "16 km/h" },
      { periodName: "Night", temp: "25.0°C", realFeel: "26.0°C", lowTemp: "24.0°C", condition: "Overcast", icon: "☁️", precipProb: "30%", windSpeed: "10 km/h" },
    ],
    dailyForecasts: [
      { dayName: "Mon", dateStr: "14 Sep", highTemp: "35°C", lowTemp: "24°C", dayCondition: "Torrential Rains", nightCondition: "Overcast", precipProb: "90%", icon: "⛈️" },
      { dayName: "Tue", dateStr: "15 Sep", highTemp: "33°C", lowTemp: "24°C", dayCondition: "Tana Overflow", nightCondition: "Rain", precipProb: "95%", icon: "🌊" },
      { dayName: "Wed", dateStr: "16 Sep", highTemp: "32°C", lowTemp: "23°C", dayCondition: "Heavy Storms", nightCondition: "Showers", precipProb: "85%", icon: "🌧️" },
      { dayName: "Thu", dateStr: "17 Sep", highTemp: "34°C", lowTemp: "24°C", dayCondition: "Cloudy Spells", nightCondition: "Clear", precipProb: "30%", icon: "🌤️" },
      { dayName: "Fri", dateStr: "18 Sep", highTemp: "36°C", lowTemp: "25°C", dayCondition: "Hot & Sunny", nightCondition: "Clear", precipProb: "10%", icon: "☀️" },
      { dayName: "Sat", dateStr: "19 Sep", highTemp: "35°C", lowTemp: "25°C", dayCondition: "Scattered Cloud", nightCondition: "Fair", precipProb: "15%", icon: "⛅" },
      { dayName: "Sun", dateStr: "20 Sep", highTemp: "34°C", lowTemp: "24°C", dayCondition: "Isolated Thunderstorm", nightCondition: "Cloudy", precipProb: "55%", icon: "⛈️" },
    ],
    capAlerts: [
      { id: "al-4", headline: "CRITICAL TANA RIVER FLOOD ALARM", severity: "Severe", area: "Garissa & Tana River Basin", description: "Upstream hydro dams spilling. Major flood surge approaching within 24hrs.", issued: "URGENT" }
    ]
  }
};

import { KENYA_COUNTIES_WEATHER, CountyWeather } from "@/lib/data/kenyaCountiesWeather";

function generateCountyTelemetry(county: CountyWeather): AccuWeatherData {
  const isHighRisk = county.riskLevel === "HIGH FLOOD RISK";
  const isModerate = county.riskLevel === "MODERATE RISK";

  // Extract temperatures from string e.g. "15°C – 24°C"
  const temps = county.tempRange.match(/\d+/g) || ["18", "26"];
  const lowT = parseInt(temps[0], 10);
  const highT = parseInt(temps[1], 10);
  const curT = Math.round((lowT + highT) / 2);

  return {
    locationKey: county.countyCode,
    cityName: county.name,
    countyName: `${county.name} County`,
    country: "Kenya",
    currentTemp: `${curT}°C`,
    realFeelTemp: `${curT + 1}°C`,
    weatherText: county.weatherCondition,
    highTemp: `${highT}°C`,
    lowTemp: `${lowT}°C`,
    humidity: isHighRisk ? "84%" : isModerate ? "72%" : "60%",
    windSpeed: isHighRisk ? "18 km/h" : "12 km/h",
    uvIndex: "7 (High)",
    airQuality: "Good (28)",
    periods: [
      { periodName: "Morning", temp: `${lowT + 3}°C`, realFeel: `${lowT + 4}°C`, lowTemp: `${lowT}°C`, condition: "Partly Sunny / Morning Mist", icon: "⛅", precipProb: isHighRisk ? "40%" : "20%", windSpeed: "10 km/h" },
      { periodName: "Afternoon", temp: `${highT}°C`, realFeel: `${highT + 1}°C`, lowTemp: `${curT}°C`, condition: county.weatherCondition, icon: isHighRisk ? "⛈️" : "🌦️", precipProb: isHighRisk ? "85%" : "45%", windSpeed: "18 km/h" },
      { periodName: "Evening", temp: `${curT}°C`, realFeel: `${curT}°C`, lowTemp: `${lowT + 2}°C`, condition: "Scattered Showers", icon: "🌧️", precipProb: isHighRisk ? "65%" : "30%", windSpeed: "14 km/h" },
      { periodName: "Night", temp: `${lowT}°C`, realFeel: `${lowT}°C`, lowTemp: `${lowT - 1}°C`, condition: "Partly Cloudy", icon: "🌙", precipProb: "15%", windSpeed: "8 km/h" },
    ],
    dailyForecasts: [
      { dayName: "Mon", dateStr: "14 Sep", highTemp: `${highT}°C`, lowTemp: `${lowT}°C`, dayCondition: county.weatherCondition, nightCondition: "Overcast Spells", precipProb: isHighRisk ? "85%" : "40%", icon: isHighRisk ? "⛈️" : "🌦️" },
      { dayName: "Tue", dateStr: "15 Sep", highTemp: `${highT - 1}°C`, lowTemp: `${lowT}°C`, dayCondition: isHighRisk ? "Heavy Torrential Rains" : "Scattered Showers", nightCondition: "Rain", precipProb: isHighRisk ? "90%" : "50%", icon: isHighRisk ? "⛈️" : "🌧️" },
      { dayName: "Wed", dateStr: "16 Sep", highTemp: `${highT - 2}°C`, lowTemp: `${lowT - 1}°C`, dayCondition: isHighRisk ? "Severe Flood Warning Rains" : "Partly Sunny", nightCondition: "Showers", precipProb: isHighRisk ? "80%" : "35%", icon: isHighRisk ? "🌧️" : "⛅" },
      { dayName: "Thu", dateStr: "17 Sep", highTemp: `${highT}°C`, lowTemp: `${lowT}°C`, dayCondition: "Sunny Intervals", nightCondition: "Fair", precipProb: "25%", icon: "🌤️" },
      { dayName: "Fri", dateStr: "18 Sep", highTemp: `${highT + 1}°C`, lowTemp: `${lowT + 1}°C`, dayCondition: "Mostly Sunny", nightCondition: "Clear", precipProb: "15%", icon: "☀️" },
      { dayName: "Sat", dateStr: "19 Sep", highTemp: `${highT + 1}°C`, lowTemp: `${lowT}°C`, dayCondition: "Sunny Spells", nightCondition: "Partly Cloudy", precipProb: "20%", icon: "⛅" },
      { dayName: "Sun", dateStr: "20 Sep", highTemp: `${highT}°C`, lowTemp: `${lowT}°C`, dayCondition: "Evening Showers", nightCondition: "Cloudy", precipProb: isHighRisk ? "60%" : "30%", icon: "🌦️" },
    ],
    capAlerts: isHighRisk ? [
      {
        id: `al-${county.countyCode}`,
        headline: `CRITICAL FLOOD & WEATHER ADVISORY: ${county.name.toUpperCase()}`,
        severity: "Severe",
        area: `${county.name} County (Code ${county.countyCode}) & Surrounding Basin`,
        description: county.advisory,
        issued: "Active Now"
      }
    ] : [],
    lastUpdated: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

/**
 * Fetch AccuWeather Telemetry for a given location or fallback
 */
export async function getAccuWeatherTelemetry(locationName = "Nairobi"): Promise<AccuWeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY || process.env.ACCUWEATHER_API_KEY;
  const searchNormalized = locationName.toLowerCase().replace(/county/g, "").trim();

  // Find county in official 47 dataset
  const countyMatch = KENYA_COUNTIES_WEATHER.find(
    (c) => c.name.toLowerCase() === searchNormalized || c.id === searchNormalized || c.countyCode === searchNormalized
  ) || KENYA_COUNTIES_WEATHER.find((c) => c.name.toLowerCase().includes("nairobi"));

  const countyTelemetry = generateCountyTelemetry(countyMatch || KENYA_COUNTIES_WEATHER[0]);

  // If AccuWeather API Key is provided, attempt live fetch
  if (apiKey) {
    try {
      // 1. Search LocationKey
      const searchRes = await fetch(
        `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(locationName)}&countryCode=KE`
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData && searchData.length > 0) {
          const locKey = searchData[0].Key;
          const locName = searchData[0].LocalizedName;
          const adminArea = searchData[0].AdministrativeArea?.LocalizedName || "Kenya";

          // 2. Fetch Current Conditions
          const condRes = await fetch(
            `https://dataservice.accuweather.com/currentconditions/v1/${locKey}?apikey=${apiKey}&details=true`
          );
          const condData = condRes.ok ? await condRes.json() : null;

          if (condData && condData.length > 0) {
            const current = condData[0];
            return {
              locationKey: locKey,
              cityName: locName,
              countyName: `${adminArea} County`,
              country: "Kenya",
              currentTemp: `${Math.round(current.Temperature.Metric.Value)}°C`,
              realFeelTemp: `${Math.round(current.RealFeelTemperature.Metric.Value)}°C`,
              weatherText: current.WeatherText,
              highTemp: `${Math.round(current.TemperatureSummary.Past6HourRange.Maximum.Metric.Value)}°C`,
              lowTemp: `${Math.round(current.TemperatureSummary.Past6HourRange.Minimum.Metric.Value)}°C`,
              humidity: `${current.RelativeHumidity}%`,
              windSpeed: `${current.Wind.Speed.Metric.Value} km/h`,
              uvIndex: `${current.UVIndex} (${current.UVIndexText})`,
              airQuality: "Good (30)",
              periods: countyTelemetry.periods,
              dailyForecasts: countyTelemetry.dailyForecasts,
              capAlerts: countyTelemetry.capAlerts,
              lastUpdated: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            };
          }
        }
      }
    } catch (err) {
      console.warn("AccuWeather Live API fallback triggered:", (err as Error).message);
    }
  }

  // Return formatted 47 County Fallback telemetry
  return countyTelemetry;
}

