import "server-only"
import type { KiteSpot } from "@/types/kitespot"

// Cache options
const cacheOptions = {
  // Cache for 5 minutes
  next: { revalidate: 300 },
}

// Server-side data fetching function
export async function getKiteSpots(): Promise<KiteSpot[]> {
  try {
    // In a real app, this would be an API call to your backend
    // For demo purposes, we're using a mock API endpoint
    const response = await fetch("https://api.example.com/kitespots", cacheOptions)

    if (!response.ok) {
      throw new Error(`Failed to fetch kitespots: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching kitespots:", error)
    return [] // Return empty array on error
  }
}

// Get a single kitespot by name
export async function getKiteSpotByName(name: string): Promise<KiteSpot | null> {
  try {
    // For demo purposes, we'll use the mock data
    const kiteSpots = await getMockKiteSpots()
    return kiteSpots.find((spot) => spot.name.toLowerCase() === name.toLowerCase()) || null
  } catch (error) {
    console.error(`Error fetching kitespot ${name}:`, error)
    return null
  }
}

// Get forecast data for a specific kitespot
export async function getKiteSpotForecast(kitespotId: string): Promise<any> {
  try {
    const response = await fetch(`https://api.example.com/kitespots/${kitespotId}/forecast`, cacheOptions)

    if (!response.ok) {
      throw new Error(`Failed to fetch forecast: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching forecast for kitespot ${kitespotId}:`, error)
    return null
  }
}

// For demo purposes, you can use this function to get mock data
// This would be removed in a production app
export async function getMockKiteSpots(): Promise<KiteSpot[]> {
  return [
    {
      id: "1",
      name: "Tarifa",
      location: "Andalusia",
      country: "Spain",
      description:
        "Tarifa is one of Europe's most popular kitesurfing destinations, known for its consistent strong winds and beautiful beaches.",
      latitude: 36.0143,
      longitude: -5.6044,
      difficulty: "Intermediate",
      water_type: "Ocean",
      facilities: ["Parking", "Restaurants", "Kite Schools", "Equipment Rental"],
      best_months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      wave_spot: true,
      flat_water: false,
      suitable_for_beginners: false,
      wind_reliability: 9,
      water_quality: 8,
      crowd_level: 7,
      overall_rating: 9,
    },
    {
      id: "2",
      name: "Cabarete",
      location: "Puerto Plata",
      country: "Dominican Republic",
      description:
        "Cabarete is known as the kiteboarding capital of the Caribbean. It offers thermal winds that blow side-onshore almost every day.",
      latitude: 19.7667,
      longitude: -70.4167,
      difficulty: "Beginner to Advanced",
      water_type: "Ocean",
      facilities: ["Parking", "Restaurants", "Kite Schools", "Equipment Rental", "Accommodation"],
      best_months: ["Jan", "Feb", "Mar", "Jun", "Jul", "Aug"],
      wave_spot: true,
      flat_water: true,
      suitable_for_beginners: true,
      wind_reliability: 8,
      water_quality: 9,
      crowd_level: 6,
      overall_rating: 8.5,
    },
    {
      id: "3",
      name: "Dakhla",
      location: "Western Sahara",
      country: "Morocco",
      description:
        "Dakhla offers one of the most unique kitesurfing experiences in the world. The main spot is a flat water lagoon with shallow, crystal clear water.",
      latitude: 23.7166,
      longitude: -15.9333,
      difficulty: "Beginner to Advanced",
      water_type: "Lagoon",
      facilities: ["Kite Camps", "Equipment Rental", "Accommodation"],
      best_months: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      wave_spot: false,
      flat_water: true,
      suitable_for_beginners: true,
      wind_reliability: 9.5,
      water_quality: 9,
      crowd_level: 4,
      overall_rating: 9,
    },
  ]
}

// Get mock forecast data
export async function getMockForecast(kitespotId: string): Promise<any> {
  // Generate mock forecast data
  const hourly = Array.from({ length: 48 }, (_, i) => {
    const hour = i % 24
    const day = Math.floor(i / 24)
    const date = new Date()
    date.setDate(date.getDate() + day)
    date.setHours(hour, 0, 0, 0)

    // Create some variation in the wind speed
    const baseSpeed = 15
    const variation = Math.sin((hour / 24) * Math.PI * 2) * 5 + Math.random() * 3
    const windSpeed = Math.max(5, Math.min(25, baseSpeed + variation))

    // Determine quality based on wind speed
    let quality: "perfect" | "good" | "fair" | "poor" = "fair"
    if (windSpeed >= 14 && windSpeed <= 22) quality = "perfect"
    else if (windSpeed >= 12 && windSpeed <= 25) quality = "good"
    else if (windSpeed < 8 || windSpeed > 30) quality = "poor"

    return {
      time: date.toISOString(),
      windSpeed: Math.round(windSpeed),
      windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
      quality,
      temperature: Math.round(20 + Math.random() * 10),
      gust: Math.round(windSpeed * (1 + Math.random() * 0.3)),
    }
  })

  return { hourly }
}

