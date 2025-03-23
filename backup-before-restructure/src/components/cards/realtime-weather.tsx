"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, Thermometer, Droplets, MapPin } from "lucide-react"

export interface RealtimeWeatherProps {
  windSpeed: number
  windDirection: number
  temperature: number
  precipitation: number
  location: string
}

export default function RealtimeWeather({
  windSpeed,
  windDirection,
  temperature,
  precipitation,
  location,
}: RealtimeWeatherProps) {
  // Convert wind direction to cardinal direction
  const getWindDirection = (degrees: number) => {
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

  // Format wind speed with units
  const formatWindSpeed = (speed: number) => {
    return `${speed.toFixed(1)} m/s (${(speed * 1.944).toFixed(1)} knots)`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          Current Conditions for {location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Wind className="h-10 w-10 text-sky-600 dark:text-sky-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
              <p className="text-xl font-semibold">{formatWindSpeed(windSpeed)}</p>
              <p className="text-sm">
                Direction: {getWindDirection(windDirection)} ({windDirection}°)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Thermometer className="h-10 w-10 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Temperature</p>
              <p className="text-xl font-semibold">{temperature}°C</p>
              <p className="text-sm">{temperature < 10 ? "Cold" : temperature < 20 ? "Mild" : "Warm"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Droplets className="h-10 w-10 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Precipitation</p>
              <p className="text-xl font-semibold">{precipitation} mm</p>
              <p className="text-sm">
                {precipitation < 0.5 ? "No rain" : precipitation < 4 ? "Light rain" : "Heavy rain"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center">
              <div className={`h-6 w-6 rounded-full ${getKiteConditionColor(windSpeed)}`}></div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kite Conditions</p>
              <p className="text-xl font-semibold">{getKiteCondition(windSpeed)}</p>
              <p className="text-sm">{getKiteRecommendation(windSpeed)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper functions for kite recommendations
function getKiteCondition(windSpeed: number) {
  if (windSpeed < 4) return "Too Light"
  if (windSpeed < 8) return "Light"
  if (windSpeed < 12) return "Good"
  if (windSpeed < 18) return "Strong"
  return "Too Strong"
}

function getKiteConditionColor(windSpeed: number) {
  if (windSpeed < 4) return "bg-gray-300 dark:bg-gray-600"
  if (windSpeed < 8) return "bg-yellow-400"
  if (windSpeed < 12) return "bg-green-500"
  if (windSpeed < 18) return "bg-orange-500"
  return "bg-red-500"
}

function getKiteRecommendation(windSpeed: number) {
  if (windSpeed < 4) return "Not suitable for kitesurfing"
  if (windSpeed < 8) return "Use large kite (12-17m²)"
  if (windSpeed < 12) return "Ideal conditions (9-12m²)"
  if (windSpeed < 18) return "Use small kite (5-8m²)"
  return "Experts only, smallest kite"
}

