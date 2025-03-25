async function fetchWithRetry(url: string, retryCount = 0): Promise<any> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 }, // 1 hour revalidation
    })

    if (!response.ok) {
      const errorText = await response.text()

      // If we hit rate limit and have retries left, wait and try again
      if (response.status === 429) {
        console.log("Tomorrow.io rate limited (429), falling back to Weatherbit API")
        return fetchBatchFromWeatherbit()
      }

      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, retryCount)
        console.log(`Rate limited, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return fetchWithRetry(url, retryCount + 1)
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
      return fetchWithRetry(url, retryCount + 1)
    }
    throw error
  }
}

// Add a new function to fetch batch data from Weatherbit
async function fetchBatchFromWeatherbit(): Promise<any> {
  try {
    const weatherbitApiKey = process.env.WEATHERBIT_API_KEY
    if (!weatherbitApiKey) {
      throw new Error("WEATHERBIT_API_KEY environment variable is not set")
    }

    // Make parallel requests for each location
    const weatherPromises = POPULAR_DESTINATIONS.map(async (dest) => {
      const url = `https://api.weatherbit.io/v2.0/current?lat=${dest.coordinates.lat}&lon=${dest.coordinates.lon}&key=${weatherbitApiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Weatherbit API responded with status: ${response.status}`)
      }

      const data = await response.json()

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
      _meta: {
        source: "weatherbit",
      },
    }
  } catch (error) {
    console.error("Error fetching batch data from Weatherbit:", error)
    throw error
  }
}

