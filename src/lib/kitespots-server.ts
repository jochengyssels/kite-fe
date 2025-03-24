// This file should be updated to include the getKiteSpotForecast function
// to maintain backward compatibility

import { redirect } from "next/navigation"
import type { KiteSpotForecast } from "@/app/services/api-service" // Updated import path to match your file structure

// Add this to src/lib/kitespots-server.ts

// Mock forecast data function
export function getMockForecast(spotId: string): KiteSpotForecast[] {
  // Return mock forecast data
  return [
    {
      id: "forecast-1",
      spot_id: spotId,
      date: new Date().toISOString().split('T')[0], // Today
      wind_speed: 18,
      wind_direction: "NE",
      temperature: 25,
      precipitation: 0,
      wave_height: 1.2,
      conditions: "Excellent"
    },
    {
      id: "forecast-2",
      spot_id: spotId,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      wind_speed: 15,
      wind_direction: "E",
      temperature: 24,
      precipitation: 0,
      wave_height: 0.8,
      conditions: "Good"
    },
    {
      id: "forecast-3",
      spot_id: spotId,
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
      wind_speed: 12,
      wind_direction: "SE",
      temperature: 23,
      precipitation: 10,
      wave_height: 0.5,
      conditions: "Fair"
    }
  ];
}
// This is just a placeholder to prevent import errors
// All actual functionality should use the client-side API service
export async function getKiteSpotByName(name: string) {
  console.warn("getKiteSpotByName from kitespots-server.ts is deprecated. Use the client-side API service instead.")
  redirect(`/spots/${encodeURIComponent(name)}`)
}

export async function getAllKiteSpots() {
  console.warn("getAllKiteSpots from kitespots-server.ts is deprecated. Use the client-side API service instead.")
  redirect("/spots")
}

export async function getKiteSpotForecast(spotId: string): Promise<KiteSpotForecast[] | null> {
  console.warn("getKiteSpotForecast from kitespots-server.ts is deprecated. Use the client-side API service instead.")

  // We can't redirect here since this is used in an API route
  // Instead, we'll forward the request to the client-side API service
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const response = await fetch(`${API_BASE_URL}/api/kitespots/${encodeURIComponent(spotId)}/forecast`)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch forecast for spot: ${spotId}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching forecast for spot ${spotId}:`, error)
    return null
  }
}

