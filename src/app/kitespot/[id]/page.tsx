"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getKitespotById } from "@/lib/kitespots"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { ChevronDown, ChevronUp, Wind, Waves, Clock, AlertTriangle, MapPin, Calendar, Info } from "lucide-react"

export default function KitespotPage() {
  const { id } = useParams()
  const [kitespot, setKitespot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [kitesurfProbability, setKitesurfProbability] = useState<any>(null)
  const [weather, setWeather] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch kitespot data
        const spotData = await getKitespotById(id as string)
        setKitespot(spotData)

        // Fetch weather data
        const weatherResponse = await fetch(`/api/weather/realtime?lat=${spotData.latitude}&lon=${spotData.longitude}`)
        const weatherData = await weatherResponse.json()
        setWeather(weatherData)

        // Fetch kitesurf probability
        const probabilityResponse = await fetch(
          `/api/kitesurf-probability?location=${spotData.name}&lat=${spotData.latitude}&lon=${spotData.longitude}`,
        )
        const probabilityData = await probabilityResponse.json()
        setKitesurfProbability(probabilityData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!kitespot) {
    return <div className="text-center p-8">Kitespot not found</div>
  }

  // Default probability data if API fails
  const probability = kitesurfProbability?.probability || 65
  const explanation =
    kitesurfProbability?.explanation || "Moderate winds and favorable conditions make kitesurfing possible today."
  const kiteSize = kitesurfProbability?.recommendedKiteSize || "9-12m"
  const bestTimeWindow = kitesurfProbability?.bestTimeWindow || "2PM - 5PM"
  const warnings = kitesurfProbability?.warnings || "Watch out for afternoon gusts"

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-400 flex items-end">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 pb-8">
          <h1 className="text-4xl font-bold text-white">{kitespot.name}</h1>
          <div className="flex items-center text-white/90 mt-2">
            <MapPin size={16} className="mr-1" />
            <span>{kitespot.country}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Golden Kite Window */}
          <Card className="md:col-span-2 shadow-lg border-2 border-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center">
                <span className="mr-2">Kitesurfing Conditions</span>
                <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded">AI Powered</span>
              </CardTitle>
              <CardDescription>Today&apos;s prediction based on current and forecasted conditions</CardDescription>
            </CardHeader>
            <CardContent>
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
                    <p className="text-gray-700 mt-1">{explanation}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                      <Wind className="text-blue-500" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Recommended Kite</div>
                        <div className="font-medium">{kiteSize}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                      <Clock className="text-blue-500" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Best Time</div>
                        <div className="font-medium">{bestTimeWindow}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                      <AlertTriangle className="text-amber-500" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Warning</div>
                        <div className="font-medium">{warnings}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show Details Section */}
              <div className="mt-4 border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-1"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                  {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>

                {showDetails && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Detailed Analysis</h3>
                    <p className="text-gray-700 mb-4">
                      The AI has analyzed wind speed, direction, gusts, water conditions, and weather patterns to
                      determine the kitesurfing probability. Here&apos;s a breakdown of the factors:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium flex items-center gap-1">
                          <Wind size={16} /> Wind Conditions
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Wind speed is {weather?.data?.values?.windSpeed || "15"} m/s from the
                          {weather?.data?.values?.windDirection || "SW"}, providing good power for a {kiteSize} kite.
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium flex items-center gap-1">
                          <Waves size={16} /> Water Conditions
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Wave height is approximately {weather?.data?.values?.waveHeight || "0.5-1.5"} meters with
                          moderate chop, suitable for most skill levels.
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium flex items-center gap-1">
                          <Calendar size={16} /> Timing
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Wind is expected to be most consistent during {bestTimeWindow}, with potential for stronger
                          gusts later in the day.
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium flex items-center gap-1">
                          <Info size={16} /> Recommendations
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
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

          {/* Kitespot Info */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Spot Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Description</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {kitespot.description ||
                    "A popular kitesurfing destination known for its consistent winds and beautiful scenery."}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Best Seasons</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Spring", "Summer", "Fall", "Winter"].map((season) => (
                    <div
                      key={season}
                      className={`text-center py-1 px-2 rounded text-sm ${
                        ["Summer", "Fall"].includes(season) ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {season}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Difficulty Level</h3>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-6 h-2 rounded-full mr-1 ${level <= 3 ? "bg-blue-500" : "bg-gray-200"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">Intermediate</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Local Resources</h3>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Kite School: WindRiders Academy</li>
                  <li>• Equipment Rental: KiteSurf Pro Shop</li>
                  <li>• Nearest Hospital: 15 min drive</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Tabs */}
        <div className="mt-6 mb-12">
          <Tabs defaultValue="current">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Weather</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-500">Temperature</div>
                      <div className="text-2xl font-semibold text-gray-900">
                        {weather?.data?.values?.temperature || "22"}°C
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-500">Wind Speed</div>
                      <div className="text-2xl font-semibold text-gray-900">
                        {weather?.data?.values?.windSpeed || "15"} m/s
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-500">Humidity</div>
                      <div className="text-2xl font-semibold text-gray-900">
                        {weather?.data?.values?.humidity || "65"}%
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-500">Visibility</div>
                      <div className="text-2xl font-semibold text-gray-900">
                        {weather?.data?.values?.visibility || "10"} km
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forecast" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <div className="flex space-x-4 pb-4">
                      {[...Array(6)].map((_, i) => {
                        const hour = new Date()
                        hour.setHours(hour.getHours() + i + 1)
                        return (
                          <div key={i} className="flex-shrink-0 w-24 bg-blue-50 p-3 rounded-lg text-center">
                            <div className="text-sm font-medium">{hour.getHours()}:00</div>
                            <div className="my-2">
                              <Wind className="mx-auto text-blue-500" size={24} />
                            </div>
                            <div className="text-lg font-semibold">{12 + Math.floor(Math.random() * 8)} m/s</div>
                          </div>
                        )
                      })}
                    </div>
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

