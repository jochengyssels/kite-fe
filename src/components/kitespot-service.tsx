"use client"

import type { KiteSpot } from "@/types/kitespot"
// This file provides client-side functions to fetch data from the API routes
// It should be used in client components instead of directly importing from lib/kitespots

export async function getAllKiteSpots(): Promise<KiteSpot[]> {
  try {
    const response = await fetch("/api/kitespots")
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
    const response = await fetch(`/api/kitespots/country/${encodeURIComponent(country)}`)
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
    const response = await fetch(`/api/kitespots/difficulty/${encodeURIComponent(difficulty)}`)
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
    const response = await fetch(`/api/kitespots/water-type/${encodeURIComponent(waterType)}`)
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
    const response = await fetch(`/api/kitespots/${encodeURIComponent(name)}`)
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
    const response = await fetch("/api/kitespots/countries")
    if (!response.ok) {
      throw new Error("Failed to fetch countries")
    }
    return response.json()
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
    let url = "/api/kitespots?"
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

    url += params.toString()

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

