import "server-only"

interface KiteSpot {
  id: string
  name: string
  location: string
  // other properties...
}

// Cache options
const cacheOptions = {
  // Cache for 5 minutes
  next: { revalidate: 300 },
}

// Shared data fetching function
export async function getKiteSpots(): Promise<KiteSpot[]> {
  try {
    // This could be an external API or database call
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
    const kiteSpots = await getKiteSpots()
    return kiteSpots.find((spot) => spot.name.toLowerCase() === name.toLowerCase()) || null
  } catch (error) {
    console.error(`Error fetching kitespot ${name}:`, error)
    return null
  }
}

