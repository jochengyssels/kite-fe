"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, Clock } from "lucide-react"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"

interface GoldenKiteTimelineProps {
  forecast: {
    time: string
    windSpeed: number
    windDirection: string
    quality: "perfect" | "good" | "fair" | "poor"
  }[]
  goldenWindow?: {
    start: string
    end: string
    quality: number
  }
  userWeight?: number
}

export default function GoldenKiteTimeline({ forecast, goldenWindow, userWeight = 75 }: GoldenKiteTimelineProps) {
  const [weight, setWeight] = useState(userWeight)

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (e) {
      return "N/A"
    }
  }

  // Calculate kite size recommendation based on wind speed and rider weight
  const getKiteSize = (windSpeed: number, weight: number) => {
    // Simple formula - this should be replaced with a more accurate algorithm
    if (windSpeed < 8) return "Too light"
    if (windSpeed > 35) return "Too strong"

    // Base size for 75kg rider
    let baseSize
    if (windSpeed >= 30) baseSize = 7
    else if (windSpeed >= 25) baseSize = 8
    else if (windSpeed >= 20) baseSize = 9
    else if (windSpeed >= 16) baseSize = 10
    else if (windSpeed >= 13) baseSize = 12
    else if (windSpeed >= 10) baseSize = 14
    else baseSize = 16

    // Adjust for rider weight
    const weightFactor = weight / 75
    const adjustedSize = Math.round(baseSize * weightFactor)

    return `${adjustedSize}m²`
  }

  // Get color for quality indicator
  const getQualityColor = (quality: number) => {
    if (quality >= 90) return "bg-green-500"
    if (quality >= 75) return "bg-blue-500"
    if (quality >= 60) return "bg-yellow-500"
    return "bg-slate-400"
  }

  // Get forecast for the golden window
  const getGoldenWindowForecast = () => {
    if (!goldenWindow) return []

    return forecast.filter((item) => {
      const itemTime = new Date(item.time).getTime()
      const startTime = new Date(goldenWindow.start).getTime()
      const endTime = new Date(goldenWindow.end).getTime()
      return itemTime >= startTime && itemTime <= endTime
    })
  }

  const goldenWindowForecast = getGoldenWindowForecast()
  const averageWindSpeed = goldenWindowForecast.length
    ? goldenWindowForecast.reduce((sum, item) => sum + Number(item.windSpeed), 0) / goldenWindowForecast.length
    : 0

  const kiteRecommendation = getKiteSize(averageWindSpeed, weight)

  if (!goldenWindow) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No ideal kiting window found</h3>
          <p className="text-muted-foreground">
            Based on the forecast, there doesn't seem to be an ideal time for kitesurfing in the next 24 hours.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Golden Kite Window</h3>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {formatTime(goldenWindow.start)} - {formatTime(goldenWindow.end)}
              </span>
              <Badge className={`${getQualityColor(goldenWindow.quality)}`}>{goldenWindow.quality}%</Badge>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg text-center">
            <h4 className="text-sm font-medium mb-1">Recommended Kite Size</h4>
            <div className="text-3xl font-bold text-primary">{kiteRecommendation}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Your Weight</h4>
              <span>{weight} kg</span>
            </div>
            <Slider value={[weight]} min={40} max={120} step={1} onValueChange={(value) => setWeight(value[0])} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            {goldenWindowForecast.slice(0, 3).map((item, index) => (
              <div key={index} className="border rounded-md p-2 flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{formatTime(item.time)}</div>
                  <div className="font-medium">{item.windSpeed} knots</div>
                </div>
                <div className="flex items-center gap-1">
                  <Wind
                    className={`h-4 w-4 ${
                      item.quality === "perfect"
                        ? "text-green-500"
                        : item.quality === "good"
                          ? "text-blue-500"
                          : item.quality === "fair"
                            ? "text-yellow-500"
                            : "text-slate-400"
                    }`}
                  />
                  <span className="text-sm">{item.windDirection}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

