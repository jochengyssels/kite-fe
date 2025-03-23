"use client"

import { Cloud, CloudRain, Sun, Wind } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
interface WeatherData {
  time: string
  temperature: number
  windSpeed: number
  windDirection: string
  condition: "sunny" | "cloudy" | "rainy" | "stormy"
  precipitation: number
}

interface ForecastWeatherProps {
  forecast: WeatherData[]
}

export default function ForecastWeather({ forecast }: ForecastWeatherProps) {
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

  // Format time from ISO to readable format
  const formatTimeDisplay = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return format(date, "h a")
    } catch (e) {
      return timeString
    }
  }

  // Format date for display
  const formatDateDisplay = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return format(date, "EEE, MMM d")
    } catch (e) {
      return timeString
    }
  }

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wind className="h-5 w-5 text-primary" />
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {forecast.length > 0 ? (
          <div>
            <div className="text-sm text-muted-foreground mb-3">{formatDateDisplay(forecast[0].time)}</div>
            <div className="grid grid-cols-4 gap-2">
              {forecast.map((item, index) => (
                <div key={index} className="flex flex-col items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <div className="text-sm font-medium">{formatTimeDisplay(item.time)}</div>
                  <div className="my-2">{getWeatherIcon(item.condition)}</div>
                  <div className="text-lg font-bold">{item.temperature}°</div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Wind className="h-3 w-3 mr-1" />
                    {item.windSpeed} kts
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">No forecast data available</div>
        )}
      </CardContent>
    </Card>
  )
}

