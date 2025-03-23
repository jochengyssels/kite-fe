"use server"

import { getAllKiteSpots } from "@/backend/data"
import type { KiteSpot } from "@/types/kitespot"

export interface KiteSpotSuggestion {
  id: string
  name: string
  location: string
  country: string
}

// Simple in-memory cache for server action
const cache: Record<string, { data: KiteSpotSuggestion[]; timestamp: number }> = {}
const CACHE_EXPIRY = 3600 * 1000 // 1 hour in milliseconds

export async function searchKitespots(query: string): Promise<KiteSpotSuggestion[]> {
  try {
    // If no query, return empty array
    if (!query || query.trim() === "") {
      return []
    }

    // Check cache first
    const cacheKey = query.toLowerCase().trim()
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_EXPIRY) {
      console.log(`Using cached results for query: ${query}`)
      return cache[cacheKey].data
    }

    // First try to get suggestions from the API
    try {
      // Get the API URL with a fallback
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

      const response = await fetch(`${apiUrl}/api/autocomplete?q=${encodeURIComponent(query)}&limit=5`, {
        next: { revalidate: 0 }, // Don't cache the response
        signal: AbortSignal.timeout(3000), // Timeout after 3 seconds
      })

      if (response.ok) {
        const data = await response.json()
        console.log("API autocomplete suggestions:", data)

        // Convert LocationIQ format to our KiteSpotSuggestion format
        const suggestions = data.map((item: any) => {
          const nameParts = item.display_name.split(",")
          return {
            id: item.place_id,
            name: nameParts[0].trim(),
            location: item.display_place || (nameParts.length > 1 ? nameParts[1].trim() : ""),
            country: item.address?.country || (nameParts.length > 2 ? nameParts[2].trim() : ""),
          }
        })

        // If we got results, cache and return them
        if (suggestions && suggestions.length > 0) {
          cache[cacheKey] = {
            data: suggestions,
            timestamp: Date.now(),
          }
          return suggestions
        }
      } else if (response.status === 429) {
        console.warn("Rate limit exceeded for autocomplete API")
        // Fall through to CSV fallback
      }
    } catch (error) {
      console.error("API autocomplete error, falling back to CSV data:", error)
      // Fall through to CSV fallback
    }

    // Fallback to CSV data if API fails
    console.log("Falling back to CSV data for autocomplete")

    // Get all kitespots directly from your data layer
    const allSpots = await getAllKiteSpots()

    // Normalize the query for case-insensitive comparison
    const normalizedQuery = query.toLowerCase().trim()

    // Filter spots based on the query
    const filteredSpots = allSpots.filter(
      (spot: KiteSpot) =>
        (spot.name && spot.name.toLowerCase().includes(normalizedQuery)) ||
        (spot.location && spot.location.toLowerCase().includes(normalizedQuery)) ||
        (spot.country && spot.country.toLowerCase().includes(normalizedQuery)),
    )

    // Add some debug logging
    console.log(`CSV fallback: Autocomplete query "${query}" matched ${filteredSpots.length} spots`)

    // Map to a simpler structure for suggestions and limit to 5 results
    const results = filteredSpots
      .map((spot: KiteSpot) => ({
        // Use name as the ID since there's no id property
        id: String(spot.name),
        name: spot.name,
        location: spot.location || "",
        country: spot.country || "",
      }))
      .slice(0, 5)

    // Cache the results
    cache[cacheKey] = {
      data: results,
      timestamp: Date.now(),
    }

    // Clean up cache if it gets too large
    const cacheKeys = Object.keys(cache)
    if (cacheKeys.length > 100) {
      // Remove oldest 10 entries
      const oldestKeys = cacheKeys.sort((a, b) => cache[a].timestamp - cache[b].timestamp).slice(0, 10)

      oldestKeys.forEach((key) => {
        delete cache[key]
      })
    }

    return results
  } catch (error) {
    console.error("Error searching kitespots:", error)
    return []
  }
}

