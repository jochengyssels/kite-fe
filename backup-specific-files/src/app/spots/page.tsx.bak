import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Wind, Waves, Calendar, Info, ArrowLeft, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getKiteSpotByName } from "@/services/api-service" // Fixed import path
// Import your components - these would need to be updated to work with the new data structure
import WindGraph from "@/components/wind-graph"
import Chat from "@/components/chat"
import GoldenKiteTimeline from "@/components/golden-kite-timeline"
import CurrentConditions from "@/components/current-conditions"

// Define interfaces for the components that expect specific data structures
interface TimeSlot {
  time: string
  windSpeed: number
  windDirection: string
  quality: "perfect" | "good" | "fair" | "poor"
}

interface GoldenWindow {
  start: string
  end: string
  quality: number
}

// Fetch data from your API
async function getSpotData(name: string) {
  const spot = await getKiteSpotByName(name)

  if (!spot) {
    return null
  }

  // Transform the data to match what your components expect
  // This is a simplified example - you would need to adapt this to your actual data
  return {
    id: spot.name,
    name: spot.name,
    location: spot.location,
    country: spot.country,
    coordinates: `${spot.latitude}, ${spot.longitude}`,
    windSpeed: 15, // This would come from a weather API in a real app
    windDirection: 180, // This would come from a weather API in a real app
    temperature: 25, // This would come from a weather API in a real app
    gust: 20, // This would come from a weather API in a real app
    difficulty: spot.difficulty,
    waterType: spot.water_type,
    bestMonths: "June to September", // This would come from historical data in a real app
    description: `${spot.name} is a popular kitesurfing spot located in ${spot.location}, ${spot.country}. It offers ${spot.water_type.toLowerCase()} water conditions and is suitable for ${spot.difficulty.toLowerCase()} riders.`,
    facilities: ["Parking", "Restrooms", "Equipment Rental", "Lessons"], // This would come from your database in a real app
    hazards: ["Strong currents during tide changes", "Shallow reef on the north side"], // This would come from your database in a real app
    imageUrl: "/placeholder.svg?height=600&width=1200",
    rating: 4.5, // This would come from user reviews in a real app
    reviewCount: 42, // This would come from user reviews in a real app
    // Mock forecast data - this would come from a weather API in a real app
    forecast: [
      { time: new Date().toISOString(), windSpeed: 15, windDirection: "SW", quality: "good" as const },
      { time: new Date(Date.now() + 3600000).toISOString(), windSpeed: 18, windDirection: "SW", quality: "perfect" as const },
      { time: new Date(Date.now() + 7200000).toISOString(), windSpeed: 20, windDirection: "SW", quality: "perfect" as const },
      { time: new Date(Date.now() + 10800000).toISOString(), windSpeed: 16, windDirection: "SW", quality: "good" as const },
      { time: new Date(Date.now() + 14400000).toISOString(), windSpeed: 12, windDirection: "SW", quality: "fair" as const },
      { time: new Date(Date.now() + 18000000).toISOString(), windSpeed: 10, windDirection: "SW", quality: "poor" as const },
    ],
    // Mock golden window data - this would be calculated based on forecast and user preferences in a real app
    golden_kitewindow: {
      start_time: new Date(Date.now() + 3600000).toISOString(),
      end_time: new Date(Date.now() + 10800000).toISOString(),
      score: 0.9,
    },
  }
}

export default async function SpotDetailPage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name)
  const spot = await getSpotData(decodedName)

  if (!spot) {
    notFound()
  }

  // Format the golden window data to match the component's expected structure
  const goldenWindow = spot.golden_kitewindow
    ? {
        start: spot.golden_kitewindow.start_time,
        end: spot.golden_kitewindow.end_time,
        quality: Math.round(spot.golden_kitewindow.score * 100), // Assuming score is 0-1
      }
    : undefined

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/spots"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all spots
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{spot.name}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {spot.location}, {spot.country}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span>{spot.rating}</span>
              <span className="text-muted-foreground">({spot.reviewCount})</span>
            </Badge>
            <Badge className="px-3 py-1">{spot.difficulty}</Badge>
          </div>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Current Conditions</h2>
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <CurrentConditions
            windSpeed={spot.windSpeed}
            windDirection={spot.windDirection}
            temperature={spot.temperature}
            gust={spot.gust}
          />
        </Suspense>
      </div>

      {/* Golden Kite Window */}
      {spot.forecast && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Golden Kite Window</h2>
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <GoldenKiteTimeline forecast={spot.forecast} goldenWindow={goldenWindow} userWeight={75} />
          </Suspense>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wind Graph */}
          {spot.forecast && (
            <div className="space-y-6">
              <Suspense
                fallback={
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                }
              >
                <WindGraph data={spot.forecast} height={300} />
              </Suspense>
            </div>
          )}

          {/* Spot image */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${spot.imageUrl})` }} />
          </Card>

          {/* Tabs for additional information */}
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">About this spot</h3>
                  <p className="text-muted-foreground">{spot.description}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Location</h3>
                  <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Map placeholder: {spot.coordinates}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="conditions" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Wind Conditions</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Average Wind Speed</span>
                          <span className="font-medium">{spot.windSpeed} knots</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Prevailing Direction</span>
                          <span className="font-medium">Southwest</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Best Months</span>
                          <span className="font-medium">{spot.bestMonths}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Water Type</span>
                          <span className="font-medium">{spot.waterType}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Hazards & Safety</h3>
                      <ul className="space-y-2">
                        {spot.hazards.map((hazard, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-amber-500" />
                            <span>{hazard}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="facilities" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Available Facilities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {spot.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Nearby Services</h3>
                  <p className="text-muted-foreground">
                    Information about nearby accommodations, restaurants, and other services will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Forecast Weather */}
          {spot.forecast && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Forecast</h3>
                <div className="space-y-3">
                  {spot.forecast.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-primary" />
                        <span>
                          {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.windSpeed} knots</span>
                        <Badge
                          className={
                            item.quality === "perfect"
                              ? "bg-green-500"
                              : item.quality === "good"
                                ? "bg-blue-500"
                                : item.quality === "fair"
                                  ? "bg-yellow-500"
                                  : "bg-slate-400"
                          }
                        >
                          {item.quality}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Best Time to Visit */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Best Time to Visit</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">{spot.bestMonths}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-primary" />
                  <span>Average {spot.windSpeed} knots</span>
                </div>
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-primary" />
                  <span>{spot.waterType} water conditions</span>
                </div>
              </div>
              <div className="mt-4">
                <Button className="w-full">Check Full Forecast</Button>
              </div>
            </CardContent>
          </Card>

          {/* Kite Size Calculator */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Recommended Kite Size</h3>
              <div className="text-center py-2">
                <div className="text-4xl font-bold text-primary">9m²</div>
                <p className="text-sm text-muted-foreground mt-1">Based on current wind and your weight</p>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  Adjust Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chat Assistant */}
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <Chat />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

