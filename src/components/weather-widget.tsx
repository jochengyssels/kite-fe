"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Wind, Droplets, Thermometer, Clock, ArrowUp, Umbrella, Sun } from "lucide-react"

interface WeatherData {
  temperature: number
  windSpeed: number
  windDirection: number
  humidity: number
  // Add other properties as needed
}

interface ForecastData {
  hourly: {
    time: string
    temperature: number
    windSpeed: number
    windDirection: number
    humidity: number
    // Add other properties as needed
  }[]
}

interface WeatherWidgetProps {
  lat: number
  lng: number
}

export function WeatherWidget({ lat, lng }: WeatherWidgetProps) {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      setError(null)

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

        // Fetch current weather
        const currentResponse = await fetch(`${apiUrl}/api/weather/realtime?lat=${lat}&lng=${lng}`)
        if (!currentResponse.ok) {
          throw new Error("Failed to fetch current weather")
        }
        const currentData = await currentResponse.json()
        setCurrentWeather(currentData)

        // Fetch forecast
        const forecastResponse = await fetch(`${apiUrl}/api/weather/forecast?lat=${lat}&lng=${lng}`)
        if (!forecastResponse.ok) {
          throw new Error("Failed to fetch forecast")
        }
        const forecastData = await forecastResponse.json()
        setForecast(forecastData)
      } catch (err) {
        console.error("Error fetching weather data:", err)
        setError("Failed to load weather data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [lat, lng])

  if (loading) {
    return <Skeleton className="h-[400px] w-full rounded-lg" />
  }

  if (error) {
    return (
      <Card className="w-full border-2 border-red-500">
        <CardContent className="p-6 text-center text-red-500">
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!currentWeather || !forecast) {
    return null
  }

  // Format wind direction as compass direction
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

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="w-full border-2 border-blue-500 shadow-xl">
      <CardContent className="p-0">
        <Tabs defaultValue="current" className="w-full">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Weather Conditions</h2>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="current" className="p-0 m-0">
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 border-amber-500 flex flex-col items-center">
                  <Thermometer size={24} className="text-amber-500 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Temperature</span>
                  <span className="text-2xl font-bold mt-1">{currentWeather.temperature}°C</span>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 border-blue-500 flex flex-col items-center">
                  <Wind size={24} className="text-blue-500 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Wind</span>
                  <span className="text-2xl font-bold mt-1">{currentWeather.windSpeed} km/h</span>
                  <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
                    <ArrowUp
                      size={14}
                      className="mr-1"
                      style={{ transform: `rotate(${currentWeather.windDirection}deg)` }}
                    />
                    <span>{getWindDirection(currentWeather.windDirection)}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 border-indigo-500 flex flex-col items-center">
                  <Droplets size={24} className="text-indigo-500 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Humidity</span>
                  <span className="text-2xl font-bold mt-1">{currentWeather.humidity}%</span>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 border-gray-500 flex flex-col items-center">
                  <Clock size={24} className="text-gray-500 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Updated</span>
                  <span className="text-2xl font-bold mt-1">
                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hourly" className="p-0 m-0">
            <div className="overflow-x-auto">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 sticky left-0">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">24-Hour Forecast</h3>
              </div>
              <div className="flex overflow-x-auto pb-4 pt-2 px-4 gap-3">
                {forecast.hourly.slice(0, 24).map((hour, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[120px] bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center border-2 border-blue-500"
                  >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {formatTime(hour.time)}
                    </span>
                    <div className="my-2">
                      {hour.temperature > 25 ? (
                        <Sun className="text-amber-500" size={24} />
                      ) : hour.humidity > 70 ? (
                        <Umbrella className="text-blue-500" size={24} />
                      ) : (
                        <Sun className="text-amber-500" size={24} />
                      )}
                    </div>
                    <span className="text-lg font-bold">{hour.temperature}°C</span>
                    <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
                      <Wind size={14} className="mr-1" />
                      <span>{hour.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
                      <ArrowUp size={12} className="mr-1" style={{ transform: `rotate(${hour.windDirection}deg)` }} />
                      <span>{getWindDirection(hour.windDirection)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

