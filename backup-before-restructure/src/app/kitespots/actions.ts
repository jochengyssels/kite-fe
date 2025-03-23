"use server"

interface KiteSpot {
  id?: string
  name: string
  location: string
  country: string
  description?: string
  lat?: number
  lng?: number
  latitude: number // Changed to required
  longitude: number // Changed to required
  difficulty?: string
  water_type?: string
  facilities?: string[]
  best_months?: string[]
  wave_spot?: boolean
  flat_water?: boolean
  suitable_for_beginners?: boolean
  probability?: number
  wind_reliability?: number
  water_quality?: number
  crowd_level?: number
  overall_rating?: number
}

interface CountryWithCount {
  name: string
  count: number
  flag?: string
}

export async function fetchKiteSpot(name: string): Promise<KiteSpot | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/kitespots/${encodeURIComponent(name)}`)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch kitespot: ${response.statusText}`)
    }

    const data = await response.json()

    // Ensure required fields are never undefined
    return {
      ...data,
      location: data.location || "Unknown location",
      country: data.country || "Unknown country",
      latitude: data.latitude || data.lat || 0,
      longitude: data.longitude || data.lng || 0,
    }
  } catch (error) {
    console.error("Error in fetchKiteSpot:", error)
    return null
  }
}

export async function getAllKiteSpots(): Promise<KiteSpot[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/kitespots`)

    if (!response.ok) {
      throw new Error(`Failed to fetch kitespots: ${response.statusText}`)
    }

    const data = await response.json()

    // Map the data to ensure it matches the expected KiteSpot type
    return data.map((spot: any) => ({
      ...spot,
      // Ensure required fields are never undefined
      location: spot.location || "Unknown location",
      country: spot.country || "Unknown country",
      latitude: spot.latitude || spot.lat || 0,
      longitude: spot.longitude || spot.lng || 0,
    }))
  } catch (error) {
    console.error("Error in getAllKiteSpots:", error)
    return []
  }
}

export async function fetchCountries(): Promise<CountryWithCount[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/kitespots/countries`)

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error in fetchCountries:", error)
    return []
  }
}

export async function fetchKitespotsByCountry(country: string): Promise<KiteSpot[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/kitespots/countries/${encodeURIComponent(country)}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch kitespots for country: ${response.statusText}`)
    }

    const data = await response.json()

    // Map the data to ensure it matches the expected KiteSpot type
    return data.map((spot: any) => ({
      ...spot,
      // Ensure required fields are never undefined
      location: spot.location || "Unknown location",
      country: spot.country || "Unknown country",
      latitude: spot.latitude || spot.lat || 0,
      longitude: spot.longitude || spot.lng || 0,
    }))
  } catch (error) {
    console.error("Error in fetchKitespotsByCountry:", error)
    return []
  }
}

