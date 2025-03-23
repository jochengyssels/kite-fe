"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudRain, Droplets, Sun, Wind } from "lucide-react"
import { format } from "date-fns"

interface WeatherData {
  time: string
  temperature: number
  windSpeed: number
  windDirection: string
  condition: "sunny" | "cloudy" | "rainy" | "stormy"
  precipitation: number
  humidity: number
}

interface FullForecastWeatherProps {
  forecast: WeatherData[]
}

export default function FullForecastWeather({ forecast }: FullForecastWeatherProps) {
  const [selectedDay, setSelectedDay] = useState<number>(0)

  // Helper function to get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-slate-400" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-400" />
      case "stormy":
        return <CloudRain className="h-6 w-6 text-purple-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  // Function to determine wind quality for kiteboarding
  const getWindQuality = (speed: number) => {
    if (speed < 8) return { label: "Too Light", color: "bg-slate-400" }
    if (speed < 12) return { label: "Light", color: "bg-blue-400" }
    if (speed < 18) return { label: "Good", color: "bg-green-500" }
    if (speed < 25) return { label: "Strong", color: "bg-yellow-500" }
    return { label: "Very Strong", color: "bg-red-500" }
  }

  // Group forecast by day
  const days: { [key: string]: WeatherData[] } = {}

  forecast.forEach((item) => {
    // Extract date from time string (assuming format like "2023-03-22T14:00:00")
    const date = item.time.split("T")[0]
    if (!days[date]) {
      days[date] = []
    }
    days[date].push(item)
  })

  const dayKeys = Object.keys(days)

  // Format time from ISO to readable format
  const formatTimeDisplay = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return format(date, "h:mm a")
    } catch (e) {
      return timeString
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

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wind className="h-5 w-5 text-primary" />
          7-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dayKeys.length > 0 ? (
          <>
            <div className="flex overflow-x-auto pb-2 mb-4 gap-2 scrollbar-hide">
              {dayKeys.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedDay === index
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {formatDateDisplay(day)}
                </button>
              ))}
            </div>

            {dayKeys[selectedDay] && days[dayKeys[selectedDay]] && (
              <div className="space-y-3">
                {days[dayKeys[selectedDay]].map((item, index) => {
                  const windQuality = getWindQuality(item.windSpeed)

                  return (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center w-16">
                            <span className="text-sm font-medium">{formatTimeDisplay(item.time)}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {getWeatherIcon(item.condition)}
                            <div>
                              <div className="font-medium">{item.temperature}°C</div>
                              <div className="text-xs text-muted-foreground capitalize">{item.condition}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-primary" />
                            <span className="font-medium">{item.windSpeed} knots</span>
                            <Badge className={`${windQuality.color} ml-1`}>{windQuality.label}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Droplets className="h-3 w-3 text-blue-500" />
                            <span>{item.humidity}% humidity</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">No forecast data available</div>
        )}
      </CardContent>
    </Card>
  )
}

