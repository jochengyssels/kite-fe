// Backend business logic - server-only code
import "server-only"
import type { KiteSpot } from "@/types/kitespot"
import * as kitespotRepository from "@/backend/lib/kitespot-repository"
import * as weatherService from "@/backend/services/weather-service"

// Enhanced kitespot data with additional information
export interface KiteSpotDetail extends KiteSpot {
  weather: {
    windSpeed: number
    windDirection: number
    temperature: number
    gust: number
  }
  forecast: {
    time: string
    windSpeed: number
    windDirection: string
    quality: "perfect" | "good" | "fair" | "poor"
  }[]
  goldenWindow: {
    start: string
    end: string
    quality: number
  } | null
  bestMonths: string
  description: string
  facilities: string[]
  hazards: string[]
  imageUrl: string
  rating: number
  reviewCount: number
}

export async function getAllKiteSpots(): Promise<KiteSpot[]> {
  return kitespotRepository.getAllKiteSpots()
}

export async function getUniqueCountries(): Promise<string[]> {
  return kitespotRepository.getUniqueCountries()
}

export async function getSpotsByCountry(country: string): Promise<KiteSpot[]> {
  return kitespotRepository.getSpotsByCountry(country)
}

export async function getSpotsByDifficulty(difficulty: string): Promise<KiteSpot[]> {
  return kitespotRepository.getSpotsByDifficulty(difficulty)
}

export async function getSpotsByWaterType(waterType: string): Promise<KiteSpot[]> {
  return kitespotRepository.getSpotsByWaterType(waterType)
}

export async function getSpotByName(name: string): Promise<KiteSpotDetail | null> {
  const spot = await kitespotRepository.getSpotByName(name)

  if (!spot) {
    return null
  }

  // Get weather and forecast data
  const weather = await weatherService.getCurrentWeather(spot.latitude, spot.longitude)
  const forecast = await weatherService.getForecast(spot.latitude, spot.longitude)
  const goldenWindow = await weatherService.getGoldenWindow(spot.latitude, spot.longitude)

  // Return enhanced spot data
  return {
    ...spot,
    weather,
    forecast,
    goldenWindow,
    bestMonths: "June to September", // This would come from historical data in a real app
    description: `${spot.name} is a popular kitesurfing spot located in ${spot.location}, ${spot.country}. It offers ${spot.water_type.toLowerCase()} water conditions and is suitable for ${spot.difficulty.toLowerCase()} riders.`,
    facilities: ["Parking", "Restrooms", "Equipment Rental", "Lessons"], // This would come from your database in a real app
    hazards: ["Strong currents during tide changes", "Shallow reef on the north side"], // This would come from your database in a real app
    imageUrl: "/placeholder.svg?height=600&width=1200",
    rating: 4.5, // This would come from user reviews in a real app
    reviewCount: 42, // This would come from user reviews in a real app
  }
}

