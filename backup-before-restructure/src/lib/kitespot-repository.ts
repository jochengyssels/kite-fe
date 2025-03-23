// Backend data access layer - server-only code
import "server-only"
import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"
import type { KiteSpot } from "@/types/kitespot"

// Cache the parsed data to avoid reading the file on every request
let kiteSpotCache: KiteSpot[] | null = null

export async function getAllKiteSpots(): Promise<KiteSpot[]> {
  // Return cached data if available
  if (kiteSpotCache) {
    return kiteSpotCache
  }

  try {
    // Read the CSV file
    const filePath = path.join(process.cwd(), "src", "backend", "data", "kitespots.csv")
    const fileContent = fs.readFileSync(filePath, "utf8")

    // Parse the CSV data
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        // Convert latitude and longitude to numbers
        if (context.column === "latitude" || context.column === "longitude") {
          return Number.parseFloat(value)
        }
        return value
      },
    })

    // Store in cache
    kiteSpotCache = records

    return records
  } catch (error) {
    console.error("Error reading kitespot data:", error)
    return []
  }
}

export async function getUniqueCountries(): Promise<string[]> {
  const spots = await getAllKiteSpots()
  const countries = new Set(spots.map((spot) => spot.country))
  return Array.from(countries).sort()
}

export async function getSpotsByCountry(country: string): Promise<KiteSpot[]> {
  const spots = await getAllKiteSpots()
  return spots.filter((spot) => spot.country.toLowerCase() === country.toLowerCase())
}

export async function getSpotsByDifficulty(difficulty: string): Promise<KiteSpot[]> {
  const spots = await getAllKiteSpots()
  return spots.filter((spot) => spot.difficulty.toLowerCase() === difficulty.toLowerCase())
}

export async function getSpotsByWaterType(waterType: string): Promise<KiteSpot[]> {
  const spots = await getAllKiteSpots()
  return spots.filter((spot) => spot.water_type.toLowerCase() === waterType.toLowerCase())
}

export async function getSpotByName(name: string): Promise<KiteSpot | null> {
  const spots = await getAllKiteSpots()
  const spot = spots.find((spot) => spot.name.toLowerCase() === name.toLowerCase())
  return spot || null
}

