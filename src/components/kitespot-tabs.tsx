"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Info, Wind, Calendar, Map, MessageSquare } from "lucide-react"
import WindGraph from "@/components/wind-graph"
import GoldenKiteTimeline from "@/components/golden-kite-timeline"
import KitespotMap from "@/components/kitespot-map"
import WindVisualization from "@/components/wind-visualization"
import Chat from "@/components/chat"
import KiteSizeCalculator from "@/components/kitesizecalculator"
import GoldenKiteWindow from "@/components/cards/golden-kite-window"
import GoldenKiteGraph from "@/components/cards/golden-kite-graph"

interface KitespotTabsProps {
  kitespot: any
  windForecast: any[]
  goldenWindow: {
    start: string
    end: string
    quality: number
  }
  currentConditions: {
    windSpeed: number
    windDirection: number
    temperature: number
    gust?: number
  }
}

export default function KitespotTabs({ kitespot, windForecast, goldenWindow, currentConditions }: KitespotTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the GoldenKiteLine component
  const forecastItems = windForecast.map((item) => ({
    time: item.time,
    windSpeed: item.windSpeed,
    windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"].indexOf(item.windDirection) * 45,
    temperature: Math.round(20 + Math.random() * 10),
    gust: Math.round(item.windSpeed * (1 + Math.random() * 0.3)),
    rain: Math.random() < 0.2 ? Math.random() * 2 : 0,
  }))

  const goldenWindowFormatted = {
    start_time: goldenWindow.start,
    end_time: goldenWindow.end,
    score: goldenWindow.quality / 100,
  }

  // Mock function for chat responses
  const getChatResponse = async (message: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (message.toLowerCase().includes("wind")) {
      return `The current wind at ${kitespot.name} is ${currentConditions.windSpeed} knots from the ${
        ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(currentConditions.windDirection / 45) % 8]
      }. The forecast shows good conditions for the next 24 hours.`
    }

    if (message.toLowerCase().includes("kite") || message.toLowerCase().includes("size")) {
      return `For the current wind speed of ${currentConditions.windSpeed} knots, I would recommend a kite size between ${Math.round(
        14 - currentConditions.windSpeed / 3,
      )}m and ${Math.round(16 - currentConditions.windSpeed / 3)}m for an average rider.`
    }

    if (message.toLowerCase().includes("best time") || message.toLowerCase().includes("when")) {
      return `The best time to kite at ${kitespot.name} today would be between ${new Date(
        goldenWindow.start,
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} and ${new Date(
        goldenWindow.end,
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}, when the wind is expected to be most consistent.`
    }

    return `Thanks for your question about ${kitespot.name}. This is a ${
      kitespot.difficulty || "intermediate"
    } level spot known for its ${kitespot.water_type || "ocean"} conditions. How else can I help you?`
  }

  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="forecast" className="flex items-center gap-1">
          <Wind className="h-4 w-4" />
          <span className="hidden sm:inline">Forecast</span>
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Calendar</span>
        </TabsTrigger>
        <TabsTrigger value="map" className="flex items-center gap-1">
          <Map className="h-4 w-4" />
          <span className="hidden sm:inline">Map</span>
        </TabsTrigger>
        <TabsTrigger value="chat" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Chat</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">About {kitespot.name}</h2>
              <p className="text-muted-foreground mb-4">
                {kitespot.description ||
                  `${kitespot.name} is a popular kitesurfing destination located in ${kitespot.location}, ${kitespot.country}. 
                  Known for its consistent wind conditions and beautiful surroundings, it attracts kitesurfers of all levels.`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Spot Details</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty</span>
                      <span className="font-medium">{kitespot.difficulty || "Intermediate"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Water Type</span>
                      <span className="font-medium">{kitespot.water_type || "Ocean"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Wave Spot</span>
                      <span className="font-medium">{kitespot.wave_spot ? "Yes" : "No"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Flat Water</span>
                      <span className="font-medium">{kitespot.flat_water ? "Yes" : "No"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Suitable for Beginners</span>
                      <span className="font-medium">{kitespot.suitable_for_beginners ? "Yes" : "No"}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Ratings</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span className="text-muted-foreground">Wind Reliability</span>
                      <div className="w-32 bg-slate-200 dark:bg-slate-700 h-2 rounded-full">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(kitespot.wind_reliability || 7) * 10}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{kitespot.wind_reliability || 7}/10</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-muted-foreground">Water Quality</span>
                      <div className="w-32 bg-slate-200 dark:bg-slate-700 h-2 rounded-full">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(kitespot.water_quality || 8) * 10}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{kitespot.water_quality || 8}/10</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-muted-foreground">Crowd Level</span>
                      <div className="w-32 bg-slate-200 dark:bg-slate-700 h-2 rounded-full">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${(kitespot.crowd_level || 5) * 10}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{kitespot.crowd_level || 5}/10</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-muted-foreground">Overall Rating</span>
                      <div className="w-32 bg-slate-200 dark:bg-slate-700 h-2 rounded-full">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(kitespot.overall_rating || 7.5) * 10}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{kitespot.overall_rating || 7.5}/10</span>
                    </li>
                  </ul>
                </div>
              </div>

              {kitespot.facilities && kitespot.facilities.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {kitespot.facilities.map((facility: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {kitespot.best_months && kitespot.best_months.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">Best Months to Visit</h3>
                  <div className="flex flex-wrap gap-2">
                    {kitespot.best_months.map((month: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900">
                        {month}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WindVisualization
            windSpeed={currentConditions.windSpeed}
            windDirection={currentConditions.windDirection}
            optimalWindow={[
              new Date(goldenWindow.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              new Date(goldenWindow.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            ]}
          />
          <KiteSizeCalculator windSpeed={currentConditions.windSpeed} userWeight={75} className="h-full" />
        </div>
      </TabsContent>

      <TabsContent value="forecast" className="space-y-6">
        <WindGraph data={windForecast} height={350} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoldenKiteGraph forecast={windForecast} goldenWindow={goldenWindow} />
          <GoldenKiteWindow forecast={windForecast} goldenWindow={goldenWindow} />
        </div>

        <GoldenKiteTimeline forecast={windForecast} goldenWindow={goldenWindow} userWeight={75} />
      </TabsContent>

      <TabsContent value="calendar" className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Seasonal Wind Patterns</h3>
              <p className="text-muted-foreground mb-8">
                {kitespot.name} typically has the best wind conditions during{" "}
                {kitespot.best_months?.join(", ") || "summer months"}.
              </p>

              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => {
                  const isBestMonth =
                    kitespot.best_months?.includes(month) || ["Jun", "Jul", "Aug", "Sep"].includes(month)
                  return (
                    <div
                      key={month}
                      className={`p-3 rounded-lg border ${
                        isBestMonth
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                          : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                      }`}
                    >
                      <div className="text-sm font-medium">{month}</div>
                      {isBestMonth ? (
                        <div className="mt-2 text-xs text-green-600 dark:text-green-400">Good</div>
                      ) : (
                        <div className="mt-2 text-xs text-slate-500">Variable</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
              <p className="text-muted-foreground">No upcoming events at this location.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="map" className="space-y-6">
        <KitespotMap />

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Location Details</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Latitude</span>
                    <span className="font-medium">{kitespot.latitude?.toFixed(6) || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Longitude</span>
                    <span className="font-medium">{kitespot.longitude?.toFixed(6) || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Nearest City</span>
                    <span className="font-medium">{kitespot.location}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Getting There</h3>
                <p className="text-muted-foreground">
                  Access information for this kitespot is not available. If you have information about how to access
                  this spot, please share it in the chat.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="chat" className="space-y-6">
        <Chat
          title={`Chat about ${kitespot.name}`}
          placeholder="Ask about wind conditions, kite sizes, or local tips..."
          getChatResponse={getChatResponse}
          initialMessages={[
            {
              role: "assistant",
              content: `Welcome to the ${kitespot.name} chat! Ask me about current conditions, kite recommendations, or local tips for this spot.`,
            },
          ]}
        />
      </TabsContent>
    </Tabs>
  )
}

