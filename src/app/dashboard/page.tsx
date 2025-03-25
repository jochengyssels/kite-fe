"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Wind,
  MapPin,
  Star,
  Compass,
  Sun,
  Cloud,
  CloudRain,
  ArrowRight,
  Thermometer,
  Heart,
  Plus,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import WindDisplay from "@/components/wind-display"
import GoldenKiteLine from "@/components/cards/golden-kite-line"
import KiteSizeCalculator from "@/components/kitesizecalculator"
import LocationSearch from "@/components/location-search"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

// Mock data for the dashboard
const NEARBY_SPOTS = [
  {
    id: "1",
    name: "Tarifa Beach",
    location: "Tarifa, Spain",
    distance: 5.2,
    windSpeed: 18,
    windDirection: 135,
    temperature: 24,
    conditions: "sunny",
    rating: 4.8,
    isFavorite: true,
  },
  {
    id: "2",
    name: "Los Lances",
    location: "Tarifa, Spain",
    distance: 7.5,
    windSpeed: 16,
    windDirection: 120,
    temperature: 23,
    conditions: "sunny",
    rating: 4.5,
    isFavorite: false,
  },
  {
    id: "3",
    name: "Valdevaqueros",
    location: "Tarifa, Spain",
    distance: 9.1,
    windSpeed: 22,
    windDirection: 150,
    temperature: 22,
    conditions: "cloudy",
    rating: 4.9,
    isFavorite: true,
  },
  {
    id: "4",
    name: "Punta Paloma",
    location: "Tarifa, Spain",
    distance: 12.3,
    windSpeed: 14,
    windDirection: 110,
    temperature: 24,
    conditions: "sunny",
    rating: 4.3,
    isFavorite: false,
  },
]

const FORECAST_DATA = [
  {
    time: new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString(),
    windSpeed: 15,
    windDirection: 120,
    temperature: 22,
    gust: 18,
    rain: 0,
  },
  {
    time: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    windSpeed: 16,
    windDirection: 125,
    temperature: 23,
    gust: 19,
    rain: 0,
  },
  {
    time: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    windSpeed: 18,
    windDirection: 130,
    temperature: 24,
    gust: 22,
    rain: 0,
  },
  {
    time: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    windSpeed: 20,
    windDirection: 135,
    temperature: 25,
    gust: 24,
    rain: 0,
  },
  {
    time: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    windSpeed: 22,
    windDirection: 140,
    temperature: 25,
    gust: 26,
    rain: 0,
  },
  {
    time: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    windSpeed: 21,
    windDirection: 145,
    temperature: 24,
    gust: 25,
    rain: 0,
  },
  {
    time: new Date(Date.now() + 1000 * 60 * 60 * 7).toISOString(),
    windSpeed: 19,
    windDirection: 140,
    temperature: 23,
    gust: 23,
    rain: 0,
  },
  {
    time: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    windSpeed: 17,
    windDirection: 135,
    temperature: 22,
    gust: 20,
    rain: 0,
  },
  {
    time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    windSpeed: 14,
    windDirection: 130,
    temperature: 21,
    gust: 17,
    rain: 0,
  },
  {
    time: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    windSpeed: 12,
    windDirection: 125,
    temperature: 20,
    gust: 15,
    rain: 0.2,
  },
]

const GOLDEN_WINDOW = {
  start_time: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
  end_time: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
  score: 0.85,
}

const UPCOMING_EVENTS = [
  {
    id: "1",
    title: "Tarifa Kite Championship",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    location: "Tarifa Beach, Spain",
    type: "Competition",
  },
  {
    id: "2",
    title: "Beginner Kite Workshop",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    location: "Los Lances, Spain",
    type: "Workshop",
  },
  {
    id: "3",
    title: "Sunset Kite Session",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    location: "Valdevaqueros, Spain",
    type: "Social",
  },
]

export default function Dashboard() {
  const [favorites, setFavorites] = useState<string[]>(["1", "3"])
  const [userLocation, setUserLocation] = useState<string>("Tarifa, Spain")
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const router = useRouter()

  // Add this function near the top of the Dashboard component:

  const handleDirectSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const searchQuery = formData.get("locationSearch") as string

    if (!searchQuery) return

    // For direct search, we'll use a default location for Tarifa
    // In a real app, you would use a geocoding service here
    router.push(`/kitespots?lat=36.0128&lon=-5.6012&name=${encodeURIComponent(searchQuery)}`)
  }

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  const toggleFavorite = (spotId: string) => {
    setFavorites((prev) => (prev.includes(spotId) ? prev.filter((id) => id !== spotId) : [...prev, spotId]))
  }

  const favoriteSpots = NEARBY_SPOTS.filter((spot) => favorites.includes(spot.id))

  // Helper function to get weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-slate-400" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-400" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-900/30 dark:to-cyan-900/30" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-20" />

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Find Your Perfect <span className="text-blue-600 dark:text-blue-400">Kite Spot</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Discover the best kitesurfing conditions, track wind forecasts, and connect with the kitesurfing community.
          </p>

          {/* Location Search */}
          <div className="relative max-w-2xl mx-auto">
            <div className="mb-4">
              <LocationSearch />
            </div>

            {/* Fallback direct search */}
            <div className="text-center mt-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Having trouble with the search? Try our direct search:
              </p>
              <form onSubmit={handleDirectSearch} className="mt-2 flex">
                <Input name="locationSearch" placeholder="Enter a location name..." className="rounded-l-full" />
                <Button type="submit" className="rounded-r-full">
                  Go
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Location */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Your Location</h2>
                  </div>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">{userLocation}</Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Current Conditions</h3>
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">{getWeatherIcon("sunny")}</div>
                      <div>
                        <div className="text-3xl font-bold">24°C</div>
                        <div className="text-slate-500 dark:text-slate-400">Sunny</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <WindDisplay windSpeed={18} windDirection={135} size="lg" showLabel={true} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recommended Kite Size</h3>
                    <KiteSizeCalculator windSpeed={18} userWeight={75} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Golden Window */}
            <GoldenKiteLine forecast={FORECAST_DATA} goldenWindow={GOLDEN_WINDOW} />

            {/* Nearby Spots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Nearby Kitespots
                </CardTitle>
                <CardDescription>Discover kitesurfing spots near your location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {NEARBY_SPOTS.map((spot) => (
                    <div
                      key={spot.id}
                      className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{spot.name}</h3>
                          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{spot.location}</span>
                            <span className="mx-1">•</span>
                            <span>{spot.distance} km away</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => toggleFavorite(spot.id)}
                        >
                          <Heart
                            className={`h-5 w-5 ${favorites.includes(spot.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md">
                            <Wind className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium">{spot.windSpeed} knots</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{spot.windDirection}° SE</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded-md">
                            <Thermometer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="font-medium">{spot.temperature}°C</div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-4 w-4 fill-amber-500" />
                          <span>{spot.rating}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Link href={`/kitespots?lat=36.0128&lon=-5.6012&name=${encodeURIComponent(spot.name)}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link href="/kitespots">
                    <Button variant="outline" className="gap-2">
                      View All Kitespots
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Favorites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Your Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteSpots.length > 0 ? (
                  <div className="space-y-4">
                    {favoriteSpots.map((spot) => (
                      <div
                        key={spot.id}
                        className="border rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{spot.name}</h3>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{spot.location}</div>
                          </div>
                          <WindDisplay
                            windSpeed={spot.windSpeed}
                            windDirection={spot.windDirection}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                    <Heart className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p>You haven't added any favorites yet.</p>
                    <p className="text-sm mt-1">Click the heart icon on any kitespot to add it to your favorites.</p>
                  </div>
                )}

                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Spot
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {UPCOMING_EVENTS.map((event) => (
                    <div
                      key={event.id}
                      className="border rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2 rounded-md flex flex-col items-center min-w-[50px]">
                          <span className="text-xs font-medium">
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                          <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Link href="/events">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Events
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* News */}
            <Tabs defaultValue="news" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="news">Latest News</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>
              <TabsContent value="news" className="mt-2">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                      <div className="p-4">
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="border-b pb-4 last:border-0">
                              <h3 className="font-medium hover:text-blue-600 transition-colors">
                                <a href="#">New Kitesurfing Technique Gaining Popularity</a>
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                A revolutionary new kitesurfing technique is making waves in the community, allowing
                                riders to achieve higher jumps with less wind.
                              </p>
                              <div className="text-xs text-slate-400 mt-1">3 hours ago</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="community" className="mt-2">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                      <div className="p-4">
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="border-b pb-4 last:border-0">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-medium">JD</span>
                                </div>
                                <div>
                                  <div className="font-medium">John Doe</div>
                                  <div className="text-xs text-slate-500">Tarifa, Spain</div>
                                </div>
                              </div>
                              <p className="text-sm mt-2">
                                Amazing session at Valdevaqueros today! Wind was perfect at 20 knots.
                              </p>
                              <div className="text-xs text-slate-400 mt-1">2 hours ago</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

