// Shared types used by both frontend and backend
export interface KiteSpot {
  id?: string
  name: string
  location: string
  country: string
  description?: string
  image_url?: string
  lat?: number
  lng?: number
  latitude: number
  longitude: number
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
  
  export interface TimeSlot {
    time: string
    windSpeed: number
    windDirection: string
    quality: "perfect" | "good" | "fair" | "poor"
  }
  
  export interface GoldenWindow {
    start: string
    end: string
    quality: number
  }
  
  export interface WeatherData {
    windSpeed: number
    windDirection: number
    temperature: number
    gust: number
  }

  



  export interface SafeKitespotData {
    name: string
    location: string
    country: string
    latitude: number
    longitude: number
    difficulty: string
    water_type: string
    description?: string | null
  }
  

  
  
  export interface WindForecastItem {
    time: string
    windSpeed: number
    windDirection: string
    quality: "perfect" | "good" | "fair" | "poor"
  }
  
  export interface Forecast {
    hourly: ForecastItem[]
  }
  
  export interface ForecastItem {
    time: string
    windSpeed: number
    windDirection: string | number
    quality: "perfect" | "good" | "fair" | "poor"
    temperature?: number
    gust?: number
  }
  
  export interface CurrentConditions {
    windSpeed: number
    windDirection: number
    temperature: number
    gust?: number
    humidity?: number
    precipitation?: number
    timestamp: string
  }
  
  export interface GoldenWindow {
    start: string
    end: string
    quality: number
  }
  
  export interface UserPreferences {
    favoriteSpots: string[]
    windAlerts: WindAlert[]
    units: {
      speed: "knots" | "mph" | "kph"
      temperature: "celsius" | "fahrenheit"
    }
    weight: number
  }
  
  export interface WindAlert {
    spotId: string
    minWindSpeed: number
    maxWindSpeed: number
    email?: string
    phone?: string
    enabled: boolean
  }
  
  