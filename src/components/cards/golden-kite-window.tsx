"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, Clock, Info, ChevronDown, ChevronUp, Thermometer, Zap } from "lucide-react"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import KiteSizeCalculator from "@/components/kitesizecalculator"

interface ForecastItem {
  time: string
  windSpeed: number
  windDirection: string | number
  quality: "perfect" | "good" | "fair" | "poor"
  temperature?: number
  gust?: number
}

interface GoldenWindow {
  start: string
  end: string
  quality: number
}

interface GoldenKiteWindowProps {
  forecast: ForecastItem[]
  goldenWindow: GoldenWindow
  className?: string
}

export default function GoldenKiteWindow({ forecast, goldenWindow, className }: GoldenKiteWindowProps) {
  const [userWeight, setUserWeight] = useState(75)
  const [showDetails, setShowDetails] = useState(false)

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (e) {
      return "N/A"
    }
  }

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "EEE, MMM d")
    } catch (e) {
      return dateString
    }
  }

  // Get color for quality indicator
  const getQualityColor = (quality: number) => {
    if (quality >= 90) return "bg-green-500"
    if (quality >= 75) return "bg-blue-500"
    if (quality >= 60) return "bg-yellow-500"
    return "bg-slate-400"
  }

  // Get forecast for the golden window
  const goldenWindowForecast = useMemo(() => {
    return forecast.filter((item) => {
      const itemTime = new Date(item.time).getTime()
      const startTime = new Date(goldenWindow.start).getTime()
      const endTime = new Date(goldenWindow.end).getTime()
      return itemTime >= startTime && itemTime <= endTime
    })
  }, [forecast, goldenWindow])

  // Calculate average values for the golden window
  const averageValues = useMemo(() => {
    if (goldenWindowForecast.length === 0) {
      return { windSpeed: 0, temperature: 0, gust: 0 }
    }

    const windSpeed = goldenWindowForecast.reduce((sum, item) => sum + item.windSpeed, 0) / goldenWindowForecast.length

    // Calculate average temperature if available
    const temperature =
      goldenWindowForecast.reduce((sum, item) => sum + (item.temperature || 0), 0) / goldenWindowForecast.length

    // Calculate average gust if available
    const gust =
      goldenWindowForecast.reduce((sum, item) => sum + (item.gust || item.windSpeed * 1.3), 0) /
      goldenWindowForecast.length

    return { windSpeed, temperature, gust }
  }, [goldenWindowForecast])

  // Get wind direction as text
  const getWindDirectionText = (direction: string | number) => {
    if (typeof direction === "string") return direction

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
    const index = Math.round(direction / 22.5) % 16
    return directions[index]
  }

  return (
    <Card
      className={cn(
        "overflow-hidden bg-gradient-to-br from-white/80 to-amber-50/80 dark:from-slate-800/70 dark:to-amber-900/60 backdrop-blur-md rounded-xl shadow-xl",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-xl">Golden Kite Window</CardTitle>
          </div>
          <Badge className={`${getQualityColor(goldenWindow.quality)}`}>{goldenWindow.quality}% Perfect</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Golden window info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-amber-50/50 dark:bg-amber-900/20 p-3 rounded-lg">
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Best Time Window</p>
            <p className="font-medium">
              {formatDateDisplay(goldenWindow.start)}
              <br />
              {formatTime(goldenWindow.start)} - {formatTime(goldenWindow.end)}
            </p>
          </div>
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Average Wind</p>
            <p className="font-medium flex items-center gap-1">
              <Wind className="h-4 w-4" />
              {averageValues.windSpeed.toFixed(1)} knots
            </p>
          </div>
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Average Temp</p>
            <p className="font-medium flex items-center gap-1">
              <Thermometer className="h-4 w-4" />
              {averageValues.temperature ? `${averageValues.temperature.toFixed(1)}°C` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Average Gust</p>
            <p className="font-medium flex items-center gap-1">
              <Zap className="h-4 w-4" />
              {averageValues.gust.toFixed(1)} knots
            </p>
          </div>
        </div>

        {/* User weight input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-1">
              Your Weight
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Adjust your weight to get personalized kite size recommendations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <span className="text-sm font-medium">{userWeight} kg</span>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="40"
              max="140"
              value={userWeight}
              onChange={(e) => setUserWeight(Number.parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((userWeight - 40) / 100) * 100}%, #e2e8f0 ${((userWeight - 40) / 100) * 100}%, #e2e8f0 100%)`,
              }}
            />
          </div>
        </div>

        {/* Kite size calculator */}
        <KiteSizeCalculator windSpeed={averageValues.windSpeed} userWeight={userWeight} />

        {/* Toggle details button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-center w-full text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
        >
          {showDetails ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Details
            </>
          )}
        </button>

        {/* Detailed forecast */}
        {showDetails && (
          <div className="border-t border-amber-200/50 dark:border-amber-900/50 pt-4 mt-2">
            <h4 className="text-sm font-medium mb-2">Hourly Forecast</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-2 text-sm">
              {goldenWindowForecast.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-amber-100/50 dark:bg-amber-900/30"
                >
                  <span>{formatTime(item.time)}</span>
                  <span className="flex items-center gap-1">
                    <Wind className="h-3 w-3" /> {item.windSpeed} kt
                  </span>
                  <span>{getWindDirectionText(item.windDirection)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

