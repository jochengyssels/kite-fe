"use client"

// Import the KiteSpot type
export interface KiteSpot {
  id: string
  name: string
  location: string
  country: string
  latitude: number
  longitude: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  water_type: "Flat" | "Choppy" | "Waves"
  best_months: string[]
  description?: string
  image_url?: string
  rating?: number
}

// Interface for forecast data
export interface KiteSpotForecast {
  id: string
  spot_id: string
  date: string
  wind_speed: number
  wind_direction: string
  temperature: number
  precipitation: number
  wave_height?: number
  conditions: "Excellent" | "Good" | "Fair" | "Poor"
}

// Get the API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Helper function to handle fetch errors
async function fetchWithErrorHandling<T>(url: string, errorMessage: string): Promise<T> {
  try {
    const response = await fetch(url, {
      // Add cache: 'no-store' to disable caching or next: { revalidate: 60 } to revalidate every 60 seconds
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null as T
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`)
    }

    return response.json()
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    throw error
  }
}

// Client-side API service for fetching data
export async function getAllKiteSpots(): Promise<KiteSpot[]> {
  try {
    return (
      (await fetchWithErrorHandling<KiteSpot[]>(`${API_BASE_URL}/api/kitespots`, "Failed to fetch kitespots")) || []
    )
  } catch (error) {
    console.error("Error fetching kitespots:", error)
    return []
  }
}

export async function getKiteSpotsByCountry(country: string): Promise<KiteSpot[]> {
  try {
    return (
      (await fetchWithErrorHandling<KiteSpot[]>(
        `${API_BASE_URL}/api/kitespots?country=${encodeURIComponent(country)}`,
        `Failed to fetch kitespots for country: ${country}`,
      )) || []
    )
  } catch (error) {
    console.error(`Error fetching kitespots for country ${country}:`, error)
    return []
  }
}

export async function getKiteSpotsByDifficulty(difficulty: string): Promise<KiteSpot[]> {
  try {
    return (
      (await fetchWithErrorHandling<KiteSpot[]>(
        `${API_BASE_URL}/api/kitespots?difficulty=${encodeURIComponent(difficulty)}`,
        `Failed to fetch kitespots for difficulty: ${difficulty}`,
      )) || []
    )
  } catch (error) {
    console.error(`Error fetching kitespots for difficulty ${difficulty}:`, error)
    return []
  }
}

export async function getKiteSpotsByWaterType(waterType: string): Promise<KiteSpot[]> {
  try {
    return (
      (await fetchWithErrorHandling<KiteSpot[]>(
        `${API_BASE_URL}/api/kitespots?water_type=${encodeURIComponent(waterType)}`,
        `Failed to fetch kitespots for water type: ${waterType}`,
      )) || []
    )
  } catch (error) {
    console.error(`Error fetching kitespots for water type ${waterType}:`, error)
    return []
  }
}

export async function getKiteSpotByName(name: string): Promise<KiteSpot | null> {
  try {
    return await fetchWithErrorHandling<KiteSpot | null>(
      `${API_BASE_URL}/api/kitespots/${encodeURIComponent(name)}`,
      `Failed to fetch kitespot: ${name}`,
    )
  } catch (error) {
    console.error(`Error fetching kitespot ${name}:`, error)
    return null
  }
}

export async function getAllCountries(): Promise<string[]> {
  try {
    // Get all kitespots and extract unique countries
    const kitespots = await getAllKiteSpots()
    const countries = [...new Set(kitespots.map((spot) => spot.country))].sort()
    return countries
  } catch (error) {
    console.error("Error fetching countries:", error)
    return []
  }
}

export async function getFilteredKiteSpots(
  country?: string,
  difficulty?: string,
  waterType?: string,
): Promise<KiteSpot[]> {
  try {
    const params = new URLSearchParams()

    if (country) {
      params.append("country", country)
    }

    if (difficulty) {
      params.append("difficulty", difficulty)
    }

    if (waterType) {
      params.append("water_type", waterType)
    }

    return (
      (await fetchWithErrorHandling<KiteSpot[]>(
        `${API_BASE_URL}/api/kitespots?${params.toString()}`,
        "Failed to fetch filtered kitespots",
      )) || []
    )
  } catch (error) {
    console.error("Error fetching filtered kitespots:", error)
    return []
  }
}

export async function getRecommendedKiteSpots(difficulty?: string, month?: string): Promise<KiteSpot[]> {
  try {
    const params = new URLSearchParams()

    if (difficulty) {
      params.append("difficulty", difficulty)
    }

    if (month) {
      params.append("month", month)
    }

    return (
      (await fetchWithErrorHandling<KiteSpot[]>(
        `${API_BASE_URL}/api/kitespots/recommended?${params.toString()}`,
        "Failed to fetch recommended kitespots",
      )) || []
    )
  } catch (error) {
    console.error("Error fetching recommended kitespots:", error)
    return []
  }
}

// Function to search kitespots by name or location
export async function searchKiteSpots(query: string): Promise<KiteSpot[]> {
  try {
    return (
      (await fetchWithErrorHandling<KiteSpot[]>(
        `${API_BASE_URL}/api/kitespots/search?q=${encodeURIComponent(query)}`,
        `Failed to search kitespots for: ${query}`,
      )) || []
    )
  } catch (error) {
    console.error(`Error searching kitespots for ${query}:`, error)
    return []
  }
}

// Function to get spots by month
export async function getKiteSpotsByMonth(month: string): Promise<KiteSpot[]> {
  try {
    return (
      (await fetchWithErrorHandling<KiteSpot[]>(
        `${API_BASE_URL}/api/kitespots?month=${encodeURIComponent(month)}`,
        `Failed to fetch kitespots for month: ${month}`,
      )) || []
    )
  } catch (error) {
    console.error(`Error fetching kitespots for month ${month}:`, error)
    return []
  }
}

// Function to get forecast for a specific kite spot
export async function getKiteSpotForecast(spotId: string): Promise<KiteSpotForecast[] | null> {
  try {
    return await fetchWithErrorHandling<KiteSpotForecast[] | null>(
      `${API_BASE_URL}/api/kitespots/${encodeURIComponent(spotId)}/forecast`,
      `Failed to fetch forecast for spot: ${spotId}`
    );
  } catch (error) {
    console.error(`Error fetching forecast for spot ${spotId}:`, error)
    return null
  }
}

