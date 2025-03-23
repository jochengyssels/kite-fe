import fs from "fs/promises"
import path from "path"

// Define the root directory of your project
const ROOT_DIR = process.cwd()

// Path to the services directory
const SERVICES_DIR = path.join(ROOT_DIR, "src/services")

// Path to the api-service.ts file
const API_SERVICE_PATH = path.join(SERVICES_DIR, "api-service.ts")

// Content for the api-service.ts file
const API_SERVICE_CONTENT = `"use client"

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
      throw new Error(\`\${errorMessage} (Status: \${response.status})\`)
    }

    return response.json()
  } catch (error) {
    console.error(\`\${errorMessage}:\`, error)
    throw error
  }
}

// Client-side API service for fetching data
export async function getAllKiteSpots(): Promise<KiteSpot[]> {
  try {
    return (
      (await fetchWithErrorHandling<KiteSpot[]>(\`\${API_BASE_URL}/api/kitespots\`, "Failed to fetch kitespots")) || []
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
        \`\${API_BASE_URL}/api/kitespots?country=\${encodeURIComponent(country)}\`,
        \`Failed to fetch kitespots for country: \${country}\`,
      )) || []
    )
  } catch (error) {
    console.error(\`Error fetching kitespots for country \${country}:\`, error)
    return []
  }
}

export async function getKiteSpotsByDifficulty(difficulty: string): Promise<KiteSpot[]> {
  try {
    return (
      (await fetchWithErrorHandling<KiteSpot[]>(
        \`\${API_BASE_URL}/api/kitespots?difficulty=\${encodeURIComponent(difficulty)}\`,
        \`Failed to fetch kitespots for difficulty: \${difficulty}\`,
      )) || []
    )
  } catch (error) {
    console.error(\`Error fetching kitespots for difficulty \${difficulty}:\`, error)
    return []
  }
}

export async function getKiteSpotsByWaterType(waterType: string): Promise<KiteSpot[]> {
  try {
    return (
      (await fetchWithErrorHandling<KiteSpot[]>(
        \`\${API_BASE_URL}/api/kitespots?water_type=\${encodeURIComponent(waterType)}\`,
        \`Failed to fetch kitespots for water type: \${waterType}\`,
      )) || []
    )
  } catch (error) {
    console.error(\`Error fetching kitespots for water type \${waterType}:\`, error)
    return []
  }
}

export async function getKiteSpotByName(name: string): Promise<KiteSpot | null> {
  try {
    return await fetchWithErrorHandling<KiteSpot | null>(
      \`\${API_BASE_URL}/api/kitespots/\${encodeURIComponent(name)}\`,
      \`Failed to fetch kitespot: \${name}\`,
    )
  } catch (error) {
    console.error(\`Error fetching kitespot \${name}:\`, error)
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
        \`\${API_BASE_URL}/api/kitespots?\${params.toString()}\`,
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
        \`\${API_BASE_URL}/api/kitespots/recommended?\${params.toString()}\`,
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
        \`\${API_BASE_URL}/api/kitespots/search?q=\${encodeURIComponent(query)}\`,
        \`Failed to search kitespots for: \${query}\`,
      )) || []
    )
  } catch (error) {
    console.error(\`Error searching kitespots for \${query}:\`, error)
    return []
  }
}

// Function to get spots by month
export async function getKiteSpotsByMonth(month: string): Promise<KiteSpot[]> {
  try {
    return (
      (await fetchWithErrorHandling<KiteSpot[]>(
        \`\${API_BASE_URL}/api/kitespots?month=\${encodeURIComponent(month)}\`,
        \`Failed to fetch kitespots for month: \${month}\`,
      )) || []
    )
  } catch (error) {
    console.error(\`Error fetching kitespots for month \${month}:\`, error)
    return []
  }
}

// Function to get forecast for a specific kite spot
export async function getKiteSpotForecast(spotId: string): Promise<KiteSpotForecast[] | null> {
  try {
    return await fetchWithErrorHandling<KiteSpotForecast[] | null>(
      \`\${API_BASE_URL}/api/kitespots/\${encodeURIComponent(spotId)}/forecast\`,
      \`Failed to fetch forecast for spot: \${spotId}\`
    );
  } catch (error) {
    console.error(\`Error fetching forecast for spot \${spotId}:\`, error)
    return null
  }
}
`

// Content for the kitespots-server.ts file
const KITESPOTS_SERVER_CONTENT = `// This file re-exports functions from the api-service for backward compatibility
import { 
  getKiteSpotByName, 
  getAllKiteSpots, 
  getKiteSpotForecast,
  KiteSpotForecast
} from "@/services/api-service";
;

// You can add any server-specific logic here if needed
`

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function main() {
  console.log("Creating or updating api-service.ts...")

  // Create services directory if it doesn't exist
  await fs.mkdir(SERVICES_DIR, { recursive: true })

  // Check if api-service.ts already exists
  const apiServiceExists = await fileExists(API_SERVICE_PATH)

  if (apiServiceExists) {
    // Backup the existing file
    const backupPath = `${API_SERVICE_PATH}.bak`
    await fs.copyFile(API_SERVICE_PATH, backupPath)
    console.log(`Backed up existing api-service.ts to ${backupPath}`)
  }

  // Write the api-service.ts file
  await fs.writeFile(API_SERVICE_PATH, API_SERVICE_CONTENT, "utf8")
  console.log(`Created/updated api-service.ts at ${API_SERVICE_PATH}`)

  // Update kitespots-server.ts
  const kitespotsServerPath = path.join(ROOT_DIR, "src/lib/kitespots-server.ts")

  if (await fileExists(kitespotsServerPath)) {
    // Backup the existing file
    const backupPath = `${kitespotsServerPath}.bak`
    await fs.copyFile(kitespotsServerPath, backupPath)
    console.log(`Backed up existing kitespots-server.ts to ${backupPath}`)

    // Write the updated kitespots-server.ts file
    await fs.writeFile(kitespotsServerPath, KITESPOTS_SERVER_CONTENT, "utf8")
    console.log(`Updated kitespots-server.ts at ${kitespotsServerPath}`)
  } else {
    // Create the lib directory if it doesn't exist
    await fs.mkdir(path.dirname(kitespotsServerPath), { recursive: true })

    // Write the kitespots-server.ts file
    await fs.writeFile(kitespotsServerPath, KITESPOTS_SERVER_CONTENT, "utf8")
    console.log(`Created kitespots-server.ts at ${kitespotsServerPath}`)
  }

  console.log("\nSetup completed successfully!")
  console.log("Next steps:")
  console.log("1. Run the fix-specific-files.js script to update imports in your app files")
  console.log("2. Make sure to set the NEXT_PUBLIC_API_URL environment variable")
  console.log("3. Build and test your application")
}

main().catch((error) => {
  console.error("An error occurred:", error)
})

