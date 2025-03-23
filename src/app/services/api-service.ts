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
}

// Get the API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Client-side API service for fetching data
export async function getAllKiteSpots(): Promise<KiteSpot[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/kitespots`)
    if (!response.ok) {
      throw new Error("Failed to fetch kitespots")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching kitespots:", error)
    return []
  }
}

export async function getKiteSpotsByCountry(country: string): Promise<KiteSpot[]> {
  try {
    // Use the filter parameter on the main endpoint
    const response = await fetch(`${API_BASE_URL}/api/kitespots?country=${encodeURIComponent(country)}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch kitespots for country: ${country}`)
    }
    return response.json()
  } catch (error) {
    console.error(`Error fetching kitespots for country ${country}:`, error)
    return []
  }
}

export async function getKiteSpotsByDifficulty(difficulty: string): Promise<KiteSpot[]> {
  try {
    // Use the filter parameter on the main endpoint
    const response = await fetch(`${API_BASE_URL}/api/kitespots?difficulty=${encodeURIComponent(difficulty)}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch kitespots for difficulty: ${difficulty}`)
    }
    return response.json()
  } catch (error) {
    console.error(`Error fetching kitespots for difficulty ${difficulty}:`, error)
    return []
  }
}

export async function getKiteSpotsByWaterType(waterType: string): Promise<KiteSpot[]> {
  try {
    // Use the filter parameter on the main endpoint
    const response = await fetch(`${API_BASE_URL}/api/kitespots?water_type=${encodeURIComponent(waterType)}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch kitespots for water type: ${waterType}`)
    }
    return response.json()
  } catch (error) {
    console.error(`Error fetching kitespots for water type ${waterType}:`, error)
    return []
  }
}

export async function getKiteSpotByName(name: string): Promise<KiteSpot | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/kitespots/${encodeURIComponent(name)}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch kitespot: ${name}`)
    }
    return response.json()
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

    const url = `${API_BASE_URL}/api/kitespots?${params.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch filtered kitespots")
    }
    return response.json()
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

    const url = `${API_BASE_URL}/api/kitespots/recommended?${params.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch recommended kitespots")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching recommended kitespots:", error)
    return []
  }
}

