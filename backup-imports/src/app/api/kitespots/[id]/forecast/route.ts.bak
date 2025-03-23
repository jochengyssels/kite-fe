import { NextResponse } from "next/server"
import { getKiteSpotForecast } from "@/lib/kitespots-server"
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const forecast = await getKiteSpotForecast(params.id)

    if (!forecast) {
      return NextResponse.json({ error: "Forecast not found" }, { status: 404 })
    }

    return NextResponse.json(forecast)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch forecast" }, { status: 500 })
  }
}

