"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Thermometer, Wind } from "lucide-react"
import WindDirectionArrow from "@/components/wind-direction-arrow"

interface CurrentConditionsProps {
  windSpeed: number
  windDirection: number
  temperature: number
  gust?: number
}

export default function CurrentConditions({ windSpeed, windDirection, temperature, gust }: CurrentConditionsProps) {
  // Convert wind direction to cardinal direction
  const getWindDirectionText = (degrees: number) => {
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

  // Determine wind quality
  const getWindQuality = (speed: number) => {
    if (speed < 8) return { text: "Light", color: "text-slate-400" }
    if (speed < 12) return { text: "Moderate", color: "text-blue-400" }
    if (speed < 16) return { text: "Good", color: "text-green-500" }
    if (speed < 25) return { text: "Strong", color: "text-amber-500" }
    return { text: "Very Strong", color: "text-red-500" }
  }

  const windQuality = getWindQuality(windSpeed)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-1">Wind</h3>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-blue-500" />
                <span className="text-3xl font-bold">{windSpeed}</span>
                <span>knots</span>
              </div>
              <p className={`mt-1 ${windQuality.color}`}>{windQuality.text}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <WindDirectionArrow direction={windDirection} size="lg" className="h-12 w-12" />
              </div>
              <span className="mt-1 font-medium">{getWindDirectionText(windDirection)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-1">Temperature</h3>
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <span className="text-3xl font-bold">{temperature}°</span>
                <span>C</span>
              </div>
            </div>

            {gust && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Gusts</h3>
                <div className="flex items-center gap-1">
                  <Wind className="h-4 w-4 text-amber-500" />
                  <span className="text-xl font-bold">{gust}</span>
                  <span className="text-sm">knots</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

