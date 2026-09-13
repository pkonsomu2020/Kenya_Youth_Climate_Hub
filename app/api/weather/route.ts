import { NextResponse } from "next/server";
import { getAccuWeatherTelemetry } from "@/lib/services/accuweather";

export const revalidate = 1800; // 30 minutes server cache

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location") || "Nairobi";

    const data = await getAccuWeatherTelemetry(location);

    return NextResponse.json({
      success: true,
      data,
      source: "AccuWeather Developer API",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("GET /api/weather error:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
