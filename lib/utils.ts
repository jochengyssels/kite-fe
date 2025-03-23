import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to conditionally join class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to readable string
export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date)
  }
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

// Format time to readable string
export function formatTime(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date)
  }
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Convert wind direction in degrees to cardinal direction
export function degreesToCardinal(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Calculate wind quality based on wind speed
export function getWindQuality(speed: number) {
  if (speed < 8) return { label: "Too Light", color: "bg-slate-400", textColor: "text-slate-400" }
  if (speed < 12) return { label: "Light", color: "bg-blue-400", textColor: "text-blue-400" }
  if (speed < 18) return { label: "Good", color: "bg-green-500", textColor: "text-green-500" }
  if (speed < 25) return { label: "Strong", color: "bg-yellow-500", textColor: "text-yellow-500" }
  return { label: "Very Strong", color: "bg-red-500", textColor: "text-red-500" }
}

// Calculate recommended kite size based on wind speed and rider weight
export function getRecommendedKiteSize(windSpeed: number, weight = 75) {
  // Base formula: kite size = constant / wind speed * sqrt(weight / reference weight)
  const constant = 800
  const referenceWeight = 75 // kg

  const recommendedSize = Math.round((constant / windSpeed) * Math.sqrt(weight / referenceWeight))

  // Clamp to reasonable kite sizes
  return Math.max(5, Math.min(17, recommendedSize))
}

// Find the golden window (best time to kitesurf) from forecast data
export function findGoldenWindow(forecast: any[]) {
  if (!forecast || forecast.length < 3) {
    return {
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      quality: 0,
    }
  }

  let bestScore = 0
  let bestStart = 0
  let bestEnd = 0

  for (let i = 0; i < forecast.length - 3; i++) {
    let score = 0
    for (let j = 0; j < 3; j++) {
      if (forecast[i + j].quality === "perfect") score += 1
      else if (forecast[i + j].quality === "good") score += 0.7
      else if (forecast[i + j].quality === "fair") score += 0.4
    }
    score /= 3 // Average score

    if (score > bestScore) {
      bestScore = score
      bestStart = i
      bestEnd = i + 2
    }
  }

  return {
    start: forecast[bestStart].time,
    end: forecast[bestEnd].time,
    quality: Math.round(bestScore * 100),
  }
}

