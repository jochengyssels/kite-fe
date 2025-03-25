export interface Coordinates {
  lat: number
  lng: number
}

export interface LocationSuggestion {
  place_id: string
  display_name: string
  lat: string
  lon: string
}

// Weather interfaces
export interface WeatherCondition {
  temperature: number
  windSpeed: number
  windDirection: number
  precipitation: number
  humidity?: number
  pressure?: number
  visibility?: number
  cloudCover?: number
  uvIndex?: number
  condition?: "sunny" | "cloudy" | "rainy" | "stormy"
}

export interface ForecastItem extends WeatherCondition {
  time: string // ISO string
}

export interface GoldenWindow {
  start_time: string // ISO string
  end_time: string // ISO string
  score: number // 0-1 value representing quality
}

export interface WeatherData {
  location: string
  realtime: WeatherCondition
  forecast: ForecastItem[]
  goldenWindow: GoldenWindow
}

// Kitespot interfaces
export interface KiteSpot {
  id: string
  name: string
  location: string
  country: string
  lat: number
  lng: number
  description?: string
  difficulty?: string
  water_type?: string
  facilities?: string[]
  best_months?: string[]
  wave_spot?: boolean
  flat_water?: boolean
  suitable_for_beginners?: boolean
  wind_reliability?: number
  water_quality?: number
  crowd_level?: number
  overall_rating?: number
  image_url?: string
}

// Kitesurfing probability interfaces
export interface KitesurfProbability {
  probability: number // 0-100
  explanation: string
  recommendedKiteSize: string // e.g. "9-12m"
  bestTimeWindow: {
    start: string // e.g. "14:00"
    end: string // e.g. "18:00"
  }
  warnings: string[]
}

// News interfaces
export interface NewsSource {
  id: string | null
  name: string
}

export interface NewsItem {
  source: NewsSource
  author: string | null
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string // ISO 8601 format
  content: string
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsItem[]
}

// Event interfaces
export interface KitesurfEvent {
  id: string
  title: string
  date: string // ISO string
  location: string
  type: "Competition" | "Workshop" | "Social" | "Demo" | "Community"
  description: string
  attendees: number
  image: string
}

