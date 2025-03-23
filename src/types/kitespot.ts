// Shared types used by both frontend and backend
export interface KiteSpot {
    name: string
    location: string
    country: string
    latitude: number
    longitude: number
    difficulty: string
    water_type: string
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
  
  