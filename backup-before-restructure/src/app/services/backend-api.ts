"use client"

// Base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Interface for API responses
interface ApiResponse<T> {
  data?: T
  error?: string
}

// Interface for chat requests and responses
interface ChatRequest {
  location: string
}

interface ChatResponse {
  reply: string
}

// Interface for weather forecast
interface WeatherForecast {
  basic: {
    wind_speed: number | string
    wind_direction: number | string
    temperature: number | string
    precipitation: number | string
    forecast: {
      time: string
      windSpeed: number | string
      windDirection: number | string
      temperature: number | string
      gust: number | string
      rain: number | string
    }[]
  }
  enhanced: Record<string, any>
  model_used: string
  golden_kitewindow: {
    start_time: string
    end_time: string
    score: number
  } | null
}

/**
 * Generic function to make API calls
 */
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        error: errorData.detail || `API error: ${response.status} ${response.statusText}`,
      }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error("API call failed:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to fetch data",
    }
  }
}

/**
 * Get weather forecast for a kitespot location
 */
export async function getWeatherForecast(location: string): Promise<ApiResponse<WeatherForecast>> {
  return apiCall<WeatherForecast>(`/api/weather?location=${encodeURIComponent(location)}`)
}

/**
 * Get AI chat response about kitespots
 */
export async function getChatResponse(location: string): Promise<ApiResponse<ChatResponse>> {
  return apiCall<ChatResponse>(`/api/chat`, {
    method: "POST",
    body: JSON.stringify({ location }),
  })
}

/**
 * Maps the backend weather forecast to our frontend format
 */
export function mapWeatherForecastToFrontend(forecast: WeatherForecast): {
  windSpeed: number
  windDirection: number
  temperature: number
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
} {
  // Calculate quality based on wind speed
  const getQuality = (windSpeed: number): "perfect" | "good" | "fair" | "poor" => {
    if (windSpeed >= 15 && windSpeed <= 25) return "perfect"
    if ((windSpeed >= 12 && windSpeed < 15) || (windSpeed > 25 && windSpeed <= 30)) return "good"
    if ((windSpeed >= 8 && windSpeed < 12) || (windSpeed > 30 && windSpeed <= 35)) return "fair"
    return "poor"
  }

  // Map the forecast data
  const mappedForecast = forecast.basic.forecast.map((item) => {
    const windSpeed = typeof item.windSpeed === "string" ? 0 : item.windSpeed
    return {
      time: item.time,
      windSpeed,
      windDirection:
        typeof item.windDirection === "number"
          ? ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(((item.windDirection + 22.5) % 360) / 45)]
          : "N/A",
      quality: getQuality(windSpeed),
    }
  })

  // Map the golden window
  const goldenWindow = forecast.golden_kitewindow
    ? {
        start: forecast.golden_kitewindow.start_time,
        end: forecast.golden_kitewindow.end_time,
        quality: Math.round(forecast.golden_kitewindow.score * 100),
      }
    : null

  return {
    windSpeed: typeof forecast.basic.wind_speed === "string" ? 0 : Number(forecast.basic.wind_speed),
    windDirection: typeof forecast.basic.wind_direction === "string" ? 0 : Number(forecast.basic.wind_direction),
    temperature: typeof forecast.basic.temperature === "string" ? 0 : Number(forecast.basic.temperature),
    forecast: mappedForecast,
    goldenWindow,
  }
}

