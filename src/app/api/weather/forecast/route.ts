import { NextResponse } from "next/server"

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

// Update the fetchWithRetry function to add Weatherbit fallback for 429 errors
async function fetchWithRetry(lat: string, lon: string, retryCount = 0): Promise<any> {
  try {
    const apiKey = process.env.TOMORROW_IO_API_KEY
    if (!apiKey) {
      throw new Error("TOMORROW_IO_API_KEY environment variable is not set")
    }

    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${apiKey}`

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 10800 }, // 3 hour revalidation
    })

    if (!response.ok) {
      const errorText = await response.text()

      // If we hit rate limit, try Weatherbit API instead
      if (response.status === 429) {
        console.log("Tomorrow.io rate limited (429), falling back to Weatherbit API")
        return fetchFromWeatherbit(lat, lon)
      }

      // If we hit other errors and have retries left, wait and try again
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, retryCount)
        console.log(`API error, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return fetchWithRetry(lat, lon, retryCount + 1)
      }

      throw new Error(`Tomorrow.io API responded with status: ${response.status}
${errorText}`)
    }

    return await response.json()
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount)
      console.log(`API error, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return fetchWithRetry(lat, lon, retryCount + 1)
    }
    throw error
  }
}

// Add a new function to fetch from Weatherbit API
async function fetchFromWeatherbit(lat: string, lon: string): Promise<any> {
  try {
    const weatherbitApiKey = process.env.WEATHERBIT_API_KEY
    if (!weatherbitApiKey) {
      throw new Error("WEATHERBIT_API_KEY environment variable is not set")
    }

    // Get hourly forecast for the next 120 hours (5 days)
    const url = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${lat}&lon=${lon}&hours=120&key=${weatherbitApiKey}`

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 10800 }, // 3 hour revalidation
    })

    if (!response.ok) {
      throw new Error(`Weatherbit API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Transform Weatherbit response to match Tomorrow.io format
    return transformWeatherbitToTomorrowFormat(data)
  } catch (error) {
    console.error("Error fetching from Weatherbit:", error)
    throw error
  }
}

// Transform Weatherbit forecast data to match Tomorrow.io format
function transformWeatherbitToTomorrowFormat(weatherbitData: any): any {
  if (!weatherbitData || !weatherbitData.data) {
    throw new Error("Invalid Weatherbit data format")
  }

  // Map Weatherbit hourly data to Tomorrow.io format
  const hourlyData = weatherbitData.data.map((item: any) => ({
    time: item.timestamp_local,
    values: {
      temperature: item.temp,
      windSpeed: item.wind_spd,
      windDirection: item.wind_dir,
      precipitationIntensity: item.precip,
      humidity: item.rh,
      cloudCover: item.clouds,
      // Add other fields as needed
    },
  }))

  return {
    timelines: {
      hourly: hourlyData,
    },
    _meta: {
      source: "weatherbit",
    },
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const timesteps = searchParams.get("timesteps") || "1h"

  if (!lat || !lon) {
    return NextResponse.json({ error: "Both 'lat' and 'lon' parameters are required" }, { status: 400 })
  }

  try {
    const data = await fetchWithRetry(lat, lon)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching forecast weather:", error)
    return NextResponse.json({ error: "Failed to fetch forecast weather data" }, { status: 500 })
  }
}

