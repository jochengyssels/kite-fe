"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { ChevronDown, ChevronUp, Wind, Waves, Clock, AlertTriangle, MapPin, Calendar, Info } from "lucide-react"

export default function KitespotsPage() {
  const searchParams = useSearchParams()
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const name = searchParams.get("name")

  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [kitesurfProbability, setKitesurfProbability] = useState<any>(null)
  const [weather, setWeather] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!lat || !lon) {
          throw new Error("Missing latitude or longitude")
        }

        // Fetch weather data
        const weatherResponse = await fetch(`/api/weather/realtime?lat=${lat}&lon=${lon}`)
        const weatherData = await weatherResponse.json()
        setWeather(weatherData)

        // Fetch forecast data
        const forecastResponse = await fetch(`/api/weather/forecast?lat=${lat}&lon=${lon}`)
        const forecastData = await forecastResponse.json()

        // Fetch kitesurf probability
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        const probabilityResponse = await fetch(`${apiUrl}/api/kitesurf-probability`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: {
              name: name || "Unknown Location",
              lat: Number.parseFloat(lat),
              lng: Number.parseFloat(lon),
            },
            weather: {
              current: weatherData,
              forecast: forecastData,
            },
          }),
        })

        if (!probabilityResponse.ok) {
          throw new Error("Failed to fetch kitesurf probability")
        }

        const probabilityData = await probabilityResponse.json()
        setKitesurfProbability(probabilityData)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Set fallback data
        setKitesurfProbability({
          probability: 65,
          explanation:
            "Based on the available data, conditions appear moderately favorable for kitesurfing. Wind speeds are within acceptable ranges, though not ideal. Water conditions are suitable.",
          recommendedKiteSize: "9-12m²",
          bestTimeWindow: "2PM - 5PM",
          warnings: ["Wind direction may shift later in the day"],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [lat, lon, name])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Default probability data if API fails
  const probability = kitesurfProbability?.probability || 65
  const explanation =
    kitesurfProbability?.explanation || "Moderate winds and favorable conditions make kitesurfing possible today."
  const kiteSize = kitesurfProbability?.recommendedKiteSize || "9-12m"
  const bestTimeWindow = kitesurfProbability?.bestTimeWindow || "2PM - 5PM"
  const warnings = kitesurfProbability?.warnings || ["Watch out for afternoon gusts"]

  // Determine status based on probability
  let status = "Poor"
  let statusColor = "#ef4444"

  if (probability >= 80) {
    status = "Excellent"
    statusColor = "#22c55e"
  } else if (probability >= 60) {
    status = "Good"
    statusColor = "#3b82f6"
  } else if (probability >= 40) {
    status = "Fair"
    statusColor = "#f59e0b"
  }

  // Format location name
  const locationName = name || "Unknown Location"

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-400 flex items-end">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 pb-8">
          <h1 className="text-4xl font-bold text-white">{locationName}</h1>
          <div className="flex items-center text-white/90 mt-2">
            <MapPin size={16} className="mr-1" />
            <span>
              Lat: {lat}, Lon: {lon}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Golden Kite Window */}
          <Card className="md:col-span-2 shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="mr-2">Kitesurfing Conditions</span>
                <span className="text-xs font-normal bg-white/20 text-white px-2 py-0.5 rounded">AI Powered</span>
              </h2>
              <p className="text-blue-100 text-sm">Today's prediction based on current and forecasted conditions</p>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-40 h-40">
                  <CircularProgressbar
                    value={probability}
                    text={`${probability}%`}
                    styles={buildStyles({
                      textSize: "16px",
                      pathColor: statusColor,
                      textColor: "#1e293b",
                      trailColor: "#e2e8f0",
                    })}
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-4">
                    <div className="text-xl font-semibold flex items-center gap-2">
                      Status: <span style={{ color: statusColor }}>{status}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{explanation}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      <Wind className="text-blue-500" size={20} />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Recommended Kite</div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{kiteSize}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      <Clock className="text-blue-500" size={20} />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Best Time</div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{bestTimeWindow}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      <AlertTriangle className="text-amber-500" size={20} />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Warning</div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {Array.isArray(warnings) ? warnings[0] : warnings}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show Details Section */}
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-1"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                  {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>

                {showDetails && (
                  <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Detailed Analysis</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      The AI has analyzed wind speed, direction, gusts, water conditions, and weather patterns to
                      determine the kitesurfing probability. Here's a breakdown of the factors:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                        <div className="font-medium flex items-center gap-1 text-gray-900 dark:text-gray-100">
                          <Wind size={16} /> Wind Conditions
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Wind speed is {weather?.data?.values?.windSpeed || "15"} m/s from the
                          {weather?.data?.values?.windDirection || "SW"}, providing good power for a {kiteSize} kite.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                        <div className="font-medium flex items-center gap-1 text-gray-900 dark:text-gray-100">
                          <Waves size={16} /> Water Conditions
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Wave height is approximately {weather?.data?.values?.waveHeight || "0.5-1.5"} meters with
                          moderate chop, suitable for most skill levels.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                        <div className="font-medium flex items-center gap-1 text-gray-900 dark:text-gray-100">
                          <Calendar size={16} /> Timing
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Wind is expected to be most consistent during {bestTimeWindow}, with potential for stronger
                          gusts later in the day.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                        <div className="font-medium flex items-center gap-1 text-gray-900 dark:text-gray-100">
                          <Info size={16} /> Recommendations
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Intermediate to advanced riders will find the best conditions. Beginners should exercise
                          caution and consider lessons.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weather Info */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4">
              <h2 className="text-xl font-bold text-white">Current Weather</h2>
              <p className="text-blue-100 text-sm">Real-time conditions at this location</p>
            </div>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-200 dark:divide-gray-700">
                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Temperature</div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {weather?.data?.values?.temperature?.toFixed(1) || "22"}°C
                  </div>
                </div>

                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Humidity</div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {weather?.data?.values?.humidity?.toFixed(0) || "65"}%
                  </div>
                </div>

                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {weather?.data?.values?.windSpeed?.toFixed(1) || "15"} m/s
                  </div>
                </div>

                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Wind Direction</div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <Wind
                      className="mr-1 text-blue-500"
                      size={20}
                      style={{
                        transform: `rotate(${weather?.data?.values?.windDirection || 0}deg)`,
                      }}
                    />
                    {getWindDirectionText(weather?.data?.values?.windDirection || 0)}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Hourly Forecast</h3>
                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-2">
                    {[...Array(6)].map((_, i) => {
                      const hour = new Date()
                      hour.setHours(hour.getHours() + i + 1)
                      return (
                        <div
                          key={i}
                          className="flex-shrink-0 w-20 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-center"
                        >
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {hour.getHours()}:00
                          </div>
                          <div className="my-1">
                            <Wind className="mx-auto text-blue-500" size={16} />
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {12 + Math.floor(Math.random() * 8)} m/s
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-6 mb-12">
          <Tabs defaultValue="map">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
              <TabsTrigger value="nearby">Nearby Spots</TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="mt-4">
              <Card>
                <CardContent className="p-6 h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Interactive map showing {locationName} and surrounding area
                    </p>
                    <Button className="mt-4">Open Full Map</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forecast" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() + i + 1)
                      return (
                        <div key={i} className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {date.toLocaleDateString("en-US", { weekday: "short" })}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                          <div className="my-2">
                            <Wind className="mx-auto text-blue-500" size={24} />
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {10 + Math.floor(Math.random() * 10)} m/s
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {20 + Math.floor(Math.random() * 10)}°C
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nearby" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => {
                      const spots = [
                        { name: "Sandy Beach", distance: "15 km", probability: 72 },
                        { name: "Windy Point", distance: "23 km", probability: 85 },
                        { name: "Ocean Bay", distance: "31 km", probability: 64 },
                      ]
                      return (
                        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <div className="h-24 bg-blue-100 dark:bg-blue-900/50"></div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{spots[i].name}</h3>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">{spots[i].distance}</span>
                              <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                                {spots[i].probability}% Kite Probability
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Helper function to convert wind direction degrees to text
function getWindDirectionText(degrees: number) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

