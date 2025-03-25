import { fetchWithRetry } from "@/lib/fetch-utils"

// Add a new function to fetch batch data from Weatherbit
async function fetchBatchFromWeatherbit(): Promise<any> {
  try {
    const weatherbitApiKey = process.env.WEATHERBIT_API_KEY
    if (!weatherbitApiKey) {
      throw new Error("WEATHERBIT_API_KEY environment variable is not set")
    }

    // Get all popular destinations
    const destinations = [
      { name: "Tarifa", location: "Spain", coordinates: { lat: "36.0128", lon: "-5.6012" } },
      { name: "Cape Town", location: "South Africa", coordinates: { lat: "-33.9249", lon: "18.4241" } },
      { name: "Maui", location: "Hawaii", coordinates: { lat: "20.7984", lon: "-156.3319" } },
      { name: "Cabarete", location: "Dominican Republic", coordinates: { lat: "19.7667", lon: "-70.4167" } },
      { name: "Essaouira", location: "Morocco", coordinates: { lat: "31.5125", lon: "-9.7700" } },
      { name: "Fuerteventura", location: "Spain", coordinates: { lat: "28.3587", lon: "-14.0538" } },
    ]

    // Make parallel requests for each location
    const weatherPromises = destinations.map(async (dest) => {
      const url = `https://api.weatherbit.io/v2.0/current?lat=${dest.coordinates.lat}&lon=${dest.coordinates.lon}&key=${weatherbitApiKey}`
      const data = await fetchWithRetry(url)

      // Transform to match expected format
      return {
        location: {
          lat: Number(dest.coordinates.lat),
          lon: Number(dest.coordinates.lon),
          name: `${dest.name}, ${dest.location}`,
        },
        data: {
          time: new Date().toISOString(),
          values: {
            temperature: data.data[0].temp,
            windSpeed: data.data[0].wind_spd,
            windDirection: data.data[0].wind_dir,
            precipitationIntensity: data.data[0].precip,
            humidity: data.data[0].rh,
            pressureSurfaceLevel: data.data[0].pres,
            visibility: data.data[0].vis,
            cloudCover: data.data[0].clouds,
            uvIndex: data.data[0].uv,
          },
        },
      }
    })

    const results = await Promise.all(weatherPromises)

    return {
      data: results,
    }
  } catch (error) {
    console.error("Error fetching from Weatherbit:", error)
    throw error
  }
}

export async function GET() {
  try {
    const tomorrowApiKey = process.env.TOMORROW_API_KEY
    if (!tomorrowApiKey) {
      throw new Error("TOMORROW_API_KEY environment variable is not set")
    }

    // Get all popular destinations
    const destinations = [
      { name: "Tarifa", location: "Spain", coordinates: { lat: "36.0128", lon: "-5.6012" } },
      { name: "Cape Town", location: "South Africa", coordinates: { lat: "-33.9249", lon: "18.4241" } },
      { name: "Maui", location: "Hawaii", coordinates: { lat: "20.7984", lon: "-156.3319" } },
      { name: "Cabarete", location: "Dominican Republic", coordinates: { lat: "19.7667", lon: "-70.4167" } },
      { name: "Essaouira", location: "Morocco", coordinates: { lat: "31.5125", lon: "-9.7700" } },
      { name: "Fuerteventura", location: "Spain", coordinates: { lat: "28.3587", lon: "-14.0538" } },
    ]

    // Make parallel requests for each location
    const weatherPromises = destinations.map(async (dest) => {
      const url = `https://api.tomorrow.io/v4/weather/realtime?location=${dest.coordinates.lat},${dest.coordinates.lon}&apikey=${tomorrowApiKey}`
      try {
        const data = await fetchWithRetry(url)
        return {
          location: {
            lat: Number(dest.coordinates.lat),
            lon: Number(dest.coordinates.lon),
            name: `${dest.name}, ${dest.location}`,
          },
          data: data.data,
        }
      } catch (error) {
        console.error(`Error fetching weather for ${dest.name}:`, error)
        // If Tomorrow.io fails, try Weatherbit
        return fetchBatchFromWeatherbit()
      }
    })

    const results = await Promise.all(weatherPromises)

    return Response.json({
      data: results,
    })
  } catch (error) {
    console.error("Error fetching batch weather data:", error)
    return Response.json(
      {
        error: "Failed to fetch weather data",
      },
      { status: 500 },
    )
  }
}

