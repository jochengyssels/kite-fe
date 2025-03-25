import { NextResponse } from "next/server"

// Google Maps Time Zone API key (you would need to set this up in your environment variables)
// For demo purposes, we'll use a fallback method if the API key is not available
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const timestamp = searchParams.get("timestamp") || Math.floor(Date.now() / 1000).toString()

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // If we have a Google Maps API key, use their Time Zone API
    if (GOOGLE_MAPS_API_KEY) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${GOOGLE_MAPS_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error(`Google Time Zone API responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status !== "OK") {
        throw new Error(`Google Time Zone API error: ${data.status}`)
      }

      return NextResponse.json({
        timeZoneId: data.timeZoneId,
        timeZoneName: data.timeZoneName,
        rawOffset: data.rawOffset,
        dstOffset: data.dstOffset,
      })
    } else {
      // Fallback method: approximate time zone based on longitude
      const hourOffset = Math.round(Number(lng) / 15)
      const timeZoneId =
        hourOffset === 0 ? "Etc/GMT" : hourOffset > 0 ? `Etc/GMT-${hourOffset}` : `Etc/GMT+${Math.abs(hourOffset)}`

      return NextResponse.json({
        timeZoneId,
        timeZoneName: `GMT${hourOffset >= 0 ? "+" : ""}${hourOffset}`,
        rawOffset: hourOffset * 3600,
        dstOffset: 0,
        approximated: true,
      })
    }
  } catch (error) {
    console.error("Error determining time zone:", error)
    return NextResponse.json({ error: "Failed to determine time zone" }, { status: 500 })
  }
}

