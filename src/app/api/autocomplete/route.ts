import { NextResponse } from "next/server"

const LOCATIONIQ_API_KEY = "pk.7d195946b1d5836bbef50b02dc8a4a41"

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10
const requestLog: { timestamp: number }[] = []

// Cache for API responses
const responseCache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_EXPIRY = 3600 * 1000 // 1 hour

function isRateLimited() {
  const now = Date.now()

  // Remove requests older than the window
  const windowStart = now - RATE_LIMIT_WINDOW
  const recentRequests = requestLog.filter((req) => req.timestamp > windowStart)

  // Update the request log
  requestLog.length = 0
  requestLog.push(...recentRequests, { timestamp: now })

  // Check if we're over the limit
  return recentRequests.length >= MAX_REQUESTS_PER_WINDOW
}

// Popular kitesurfing locations for fallback
const POPULAR_LOCATIONS = [
  {
    place_id: "1",
    display_name: "Tarifa, Cádiz, Andalusia, Spain",
    lat: "36.0128",
    lon: "-5.6012",
  },
  {
    place_id: "2",
    display_name: "Cape Town, Western Cape, South Africa",
    lat: "-33.9249",
    lon: "18.4241",
  },
  {
    place_id: "3",
    display_name: "Maui, Hawaii, USA",
    lat: "20.7984",
    lon: "-156.3319",
  },
  {
    place_id: "4",
    display_name: "Cabarete, Puerto Plata, Dominican Republic",
    lat: "19.7667",
    lon: "-70.4167",
  },
  {
    place_id: "5",
    display_name: "Essaouira, Morocco",
    lat: "31.5125",
    lon: "-9.7700",
  },
  {
    place_id: "6",
    display_name: "Fuerteventura, Canary Islands, Spain",
    lat: "28.3587",
    lon: "-14.0538",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const limit = searchParams.get("limit") || "5"
  const dedupe = searchParams.get("dedupe") || "1"

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
  }

  // Check cache first
  const cacheKey = `${query.toLowerCase()}_${limit}_${dedupe}`
  if (responseCache[cacheKey] && Date.now() - responseCache[cacheKey].timestamp < CACHE_EXPIRY) {
    console.log(`Using cached results for query: ${query}`)
    return NextResponse.json(responseCache[cacheKey].data, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "X-Cache": "HIT",
      },
    })
  }

  // Check rate limit
  if (isRateLimited()) {
    console.log("Rate limit exceeded for autocomplete API")

    // Return filtered popular locations as fallback
    const filteredLocations = POPULAR_LOCATIONS.filter((location) =>
      location.display_name.toLowerCase().includes(query.toLowerCase()),
    ).slice(0, Number(limit))

    return NextResponse.json(filteredLocations, {
      status: 200,
      headers: {
        "X-Rate-Limit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
        "X-Rate-Limit-Remaining": "0",
        "X-Rate-Limit-Reset": Math.floor((Date.now() + RATE_LIMIT_WINDOW) / 1000).toString(),
        "X-Source": "fallback",
      },
    })
  }

  try {
    console.log(`Fetching autocomplete for query: ${query}`)

    // Try with a timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const apiUrl = `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&dedupe=${dedupe}&format=json`
      console.log(`API URL: ${apiUrl}`)

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`LocationIQ API error (${response.status}): ${errorText}`)
        throw new Error(`LocationIQ API responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Received ${data.length || 0} suggestions`)

      // Cache the response
      responseCache[cacheKey] = {
        data: data,
        timestamp: Date.now(),
      }

      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, max-age=3600",
          "X-Source": "locationiq",
        },
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Error fetching from LocationIQ:", fetchError)
      throw fetchError // Re-throw to be caught by the outer try/catch
    }
  } catch (error) {
    console.error("Error fetching location autocomplete:", error)

    // Return filtered popular locations as fallback
    const filteredLocations = POPULAR_LOCATIONS.filter((location) =>
      location.display_name.toLowerCase().includes(query.toLowerCase()),
    ).slice(0, Number(limit))

    if (filteredLocations.length > 0) {
      return NextResponse.json(filteredLocations, {
        headers: {
          "Cache-Control": "public, max-age=3600",
          "X-Source": "fallback",
        },
      })
    }

    // Return a more detailed error message
    return NextResponse.json(
      {
        error: "Failed to fetch location suggestions",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

