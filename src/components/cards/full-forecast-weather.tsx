"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wind, Cloud, CloudRain, Sun, Droplets } from "lucide-react"
import { format } from "date-fns"

interface ForecastItem {
  time: string
  windSpeed: number
  windDirection: number | string
  temperature: number
  precipitation?: number
  condition?: "sunny" | "cloudy" | "rainy" | "stormy"
}

interface FullForecastWeatherProps {
  forecast: ForecastItem[]
}

export default function FullForecastWeather({ forecast }: FullForecastWeatherProps) {
  // Group forecast by day
  const groupedForecast: Record<string, ForecastItem[]> = {}

  forecast.forEach((item) => {
    const date = new Date(item.time)
    const day = format(date, "yyyy-MM-dd")

    if (!groupedForecast[day]) {
      groupedForecast[day] = []
    }

    groupedForecast[day].push(item)
  })

  // Get day names for tabs
  const days = Object.keys(groupedForecast).map((day) => {
    const date = new Date(day)
    return {
      key: day,
      label: format(date, "EEE, MMM d"),
    }
  })

  // Helper function to get weather icon based on condition
  const getWeatherIcon = (item: ForecastItem) => {
    if (item.condition) {
      switch (item.condition) {
        case "sunny":
          return <Sun className="h-6 w-6 text-yellow-500" />
        case "cloudy":
          return <Cloud className="h-6 w-6 text-slate-400" />
        case "rainy":
          return <CloudRain className="h-6 w-6 text-blue-400" />
        case "stormy":
          return <CloudRain className="h-6 w-6 text-purple-500" />
      }
    }

    // Default icon based on precipitation if condition not provided
    if (item.precipitation && item.precipitation > 0.5) {
      return <CloudRain className="h-6 w-6 text-blue-400" />
    }

    return <Sun className="h-6 w-6 text-yellow-500" />
  }

  // Format time from ISO to readable format
  const formatTimeDisplay = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return format(date, "h a")
    } catch (e) {
      return timeString
    }
  }

  // Get wind direction as text
  const getWindDirectionText = (direction: number | string) => {
    if (typeof direction === "string") return direction

    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    const index = Math.round(direction / 45) % 8
    return directions[index]
  }

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wind className="h-5 w-5 text-primary" />
          Detailed Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {days.length > 0 ? (
          <Tabs defaultValue={days[0].key}>
            <TabsList className="mb-4">
              {days.map((day) => (
                <TabsTrigger key={day.key} value={day.key}>
                  {day.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {days.map((day) => (
              <TabsContent key={day.key} value={day.key}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {groupedForecast[day.key].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700"
                    >
                      <div className="text-sm font-medium">{formatTimeDisplay(item.time)}</div>
                      <div className="my-2">{getWeatherIcon(item)}</div>
                      <div className="text-lg font-bold">{item.temperature}°</div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Wind className="h-3 w-3 mr-1" />
                        {item.windSpeed} kts
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {getWindDirectionText(item.windDirection)}
                      </div>
                      {item.precipitation !== undefined && (
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Droplets className="h-3 w-3 mr-1" />
                          {item.precipitation} mm
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-6 text-muted-foreground">No forecast data available</div>
        )}
      </CardContent>
    </Card>
  )
}

