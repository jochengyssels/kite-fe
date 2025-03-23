"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudRain, Droplets, Sun, Thermometer, Wind } from "lucide-react"

interface RealtimeWeatherProps {
  temperature: number
  windSpeed: number
  windDirection: string
  condition: "sunny" | "cloudy" | "rainy" | "stormy"
  humidity: number
  location: string
}

export default function RealtimeWeather({
  temperature,
  windSpeed,
  windDirection,
  condition,
  humidity,
  location,
}: RealtimeWeatherProps) {
  // Helper function to get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-10 w-10 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-10 w-10 text-slate-400" />
      case "rainy":
        return <CloudRain className="h-10 w-10 text-blue-400" />
      case "stormy":
        return <CloudRain className="h-10 w-10 text-purple-500" />
      default:
        return <Sun className="h-10 w-10 text-yellow-500" />
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

  const windQuality = getWindQuality(windSpeed)

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Current Weather
          </span>
          <span className="text-sm font-normal text-muted-foreground">{location}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(condition)}
            <div>
              <div className="text-3xl font-bold">{temperature}°C</div>
              <div className="text-sm text-muted-foreground capitalize">{condition}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-end gap-2">
              <Wind className="h-4 w-4 text-primary" />
              <span className="font-medium">{windSpeed} knots</span>
              <Badge className={`${windQuality.color} ml-1`}>{windQuality.label}</Badge>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>{humidity}% humidity</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

