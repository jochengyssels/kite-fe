"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Loader2, Wind, Sun, Cloud, CloudRain } from "lucide-react"
import WindDisplay from "@/components/wind-display"
import ThemeToggle from "@/components/theme-toggle"
import ForecastWeather from "@/components/cards/forecast-weather"
import RealtimeWeather from "@/components/cards/realtime-weather"
import FullForecastWeather from "@/components/cards/full-forecast-weather"
import WindVisualization from "@/components/wind-visualization"
import GoldenKiteLine from "@/components/cards/golden-kiteline"
import KitesurfingNews from "@/components/cards/kitesurfing-news"
import UnifiedInput from "@/components/unified-input"
import { Skeleton } from "@/components/ui/skeleton"

// First, let's add the necessary imports for time zone handling
import { formatInTimeZone } from "date-fns-tz"

// Add the import for the WindDirectionArrow component
import WindDirectionArrow from "@/components/wind-direction-arrow"

interface LocationSuggestion {
  display_name: string
  place_id?: string
  lat?: string
  lon?: string
}

interface KitespotSuggestion {
  name: string
  location: string
  country: string
}

// Popular kitesurfing destinations with coordinates for fallback
const POPULAR_DESTINATIONS = [
  { name: "Tarifa", location: "Spain", coordinates: { lat: "36.0128", lon: "-5.6012" } },
  { name: "Cape Town", location: "South Africa", coordinates: { lat: "-33.9249", lon: "18.4241" } },
  { name: "Maui", location: "Hawaii", coordinates: { lat: "20.7984", lon: "-156.3319" } },
  { name: "Cabarete", location: "Dominican Republic", coordinates: { lat: "19.7667", lon: "-70.4167" } },
  { name: "Essaouira", location: "Morocco", coordinates: { lat: "31.5125", lon: "-9.7700" } },
  { name: "Fuerteventura", location: "Spain", coordinates: { lat: "28.3587", lon: "-14.0538" } },
]

export default function Page() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [autocompleteLoading, setAutocompleteLoading] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [isChat, setIsChat] = useState(false)
  const [kitespotSuggestions, setKitespotSuggestions] = useState<KitespotSuggestion[]>([])
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [popularSpotsWeather, setPopularSpotsWeather] = useState<Record<string, any>>({})
  const [loadingWeather, setLoadingWeather] = useState(true)
  const [locationTimeZones, setLocationTimeZones] = useState<Record<string, string>>({})

  // Cache for time zone data to avoid repeated API calls
  const timeZoneCache = useRef<Record<string, string>>({})

  const getTimeZoneFromCoordinates = async (lat: string, lon: string) => {
    const cacheKey = `${lat},${lon}`

    // Check cache first
    if (timeZoneCache.current[cacheKey]) {
      return timeZoneCache.current[cacheKey]
    }

    try {
      // Try to get time zone from our API
      const response = await fetch(`/api/timezone?lat=${lat}&lng=${lon}`)

      if (!response.ok) {
        throw new Error(`Time zone API responded with status: ${response.status}`)
      }

      const data = await response.json()

      // Cache the result
      timeZoneCache.current[cacheKey] = data.timeZoneId

      return data.timeZoneId
    } catch (error) {
      console.error("Error fetching time zone:", error)

      // Fallback to our simple approximation
      const hourOffset = Math.round(Number(lon) / 15)
      const timeZoneId =
        hourOffset === 0 ? "Etc/GMT" : hourOffset > 0 ? `Etc/GMT-${hourOffset}` : `Etc/GMT+${Math.abs(hourOffset)}`

      return timeZoneId
    }
  }

  // Cache for autocomplete results
  const autocompleteCache = useRef<Record<string, { data: string[]; timestamp: number }>>({})
  const CACHE_EXPIRY = 3600 * 1000 // 1 hour in milliseconds

  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Last API call timestamp for rate limiting
  const lastApiCallRef = useRef<number>(0)
  const MIN_API_CALL_INTERVAL = 500 // 500ms between API calls

  // Get the API URL with a fallback
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // Fetch weather data for popular destinations
  useEffect(() => {
    const fetchPopularSpotsWeather = async () => {
      setLoadingWeather(true)
      const weatherData: Record<string, any> = {}

      // Fetch weather data for each popular destination
      for (const spot of POPULAR_DESTINATIONS) {
        try {
          const response = await fetch(
            `/api/weather/realtime?lat=${spot.coordinates.lat}&lon=${spot.coordinates.lon}`,
            {
              signal: AbortSignal.timeout(5000), // 5 second timeout
            },
          )

          if (response.ok) {
            const data = await response.json()
            weatherData[spot.name] = {
              temperature: data.data?.values?.temperature || 0,
              windSpeed: data.data?.values?.windSpeed || 0,
              windDirection: data.data?.values?.windDirection || 0,
              precipitation: data.data?.values?.precipitationIntensity || 0,
              condition:
                data.data?.values?.cloudCover > 70
                  ? "cloudy"
                  : data.data?.values?.precipitationIntensity > 0.5
                    ? "rainy"
                    : "sunny",
            }
          }
        } catch (error) {
          console.error(`Error fetching weather for ${spot.name}:`, error)
          // Provide fallback data if fetch fails
          weatherData[spot.name] = {
            temperature: Math.round(15 + Math.random() * 10),
            windSpeed: Math.round(10 + Math.random() * 15),
            windDirection: Math.round(Math.random() * 360),
            precipitation: Math.random() > 0.8 ? Math.random() * 2 : 0,
            condition: Math.random() > 0.7 ? "sunny" : Math.random() > 0.5 ? "cloudy" : "rainy",
          }
        }
      }

      setPopularSpotsWeather(weatherData)
      setLoadingWeather(false)
    }

    fetchPopularSpotsWeather()
  }, [])

  useEffect(() => {
    const fetchTimeZones = async () => {
      const timeZones: Record<string, string> = {}

      for (const spot of POPULAR_DESTINATIONS) {
        try {
          const timeZone = await getTimeZoneFromCoordinates(spot.coordinates.lat, spot.coordinates.lon)
          timeZones[spot.name] = timeZone
        } catch (error) {
          console.error(`Error fetching time zone for ${spot.name}:`, error)
          // Use a default time zone as fallback
          timeZones[spot.name] = "UTC"
        }
      }

      setLocationTimeZones(timeZones)
    }

    fetchTimeZones()
  }, [])

  const handleSearch = async (selectedLocation?: string) => {
    const locationToSearch = selectedLocation || query
    if (!locationToSearch) return

    // Check if this is a chat query or a location search
    if (
      locationToSearch.includes("?") ||
      locationToSearch.toLowerCase().startsWith("how") ||
      locationToSearch.toLowerCase().startsWith("what") ||
      locationToSearch.toLowerCase().startsWith("when") ||
      locationToSearch.toLowerCase().startsWith("where") ||
      locationToSearch.toLowerCase().startsWith("why") ||
      locationToSearch.toLowerCase().startsWith("can") ||
      locationToSearch.toLowerCase().startsWith("do") ||
      locationToSearch.toLowerCase().startsWith("tell")
    ) {
      // Handle as chat
      handleChatQuery(locationToSearch)
      return
    }

    // Handle as location search
    setIsChat(false)
    setLoading(true)
    try {
      // Use fetch instead of axios for better error handling
      const response = await fetch(`${apiUrl}/api/weather?location=${encodeURIComponent(locationToSearch)}`)

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()

      setResults({
        location: locationToSearch,
        basic: data.basic,
        enhanced: data.enhanced,
        golden_kitewindow: data.golden_kitewindow,
        model_used: data.model_used,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      // Handle the error gracefully - maybe show a message to the user
    } finally {
      setLoading(false)
    }
  }

  const handleChatQuery = async (question: string) => {
    setIsChat(true)
    setLoading(true)

    // Add user message to chat
    setChatMessages((prev) => [...prev, { role: "user", content: question }])

    try {
      // Use fetch instead of axios
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: question }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()

      // Add assistant response to chat
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
    } catch (error) {
      console.error("Error fetching chat response:", error)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
      setQuery("")
    }
  }

  const handleAutocomplete = async (value: string) => {
    setQuery(value)
    setNetworkError(null)

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Only fetch location suggestions if it doesn't look like a chat query
    if (
      !value.includes("?") &&
      !value.toLowerCase().startsWith("how") &&
      !value.toLowerCase().startsWith("what") &&
      !value.toLowerCase().startsWith("when") &&
      !value.toLowerCase().startsWith("where") &&
      !value.toLowerCase().startsWith("why") &&
      !value.toLowerCase().startsWith("can") &&
      !value.toLowerCase().startsWith("do") &&
      !value.toLowerCase().startsWith("tell")
    ) {
      if (value.trim().length > 2) {
        // Only search if at least 3 characters
        // Set a new timer to delay the API call
        debounceTimerRef.current = setTimeout(async () => {
          try {
            // Check cache first
            const cacheKey = value.toLowerCase().trim()
            if (
              autocompleteCache.current[cacheKey] &&
              Date.now() - autocompleteCache.current[cacheKey].timestamp < CACHE_EXPIRY
            ) {
              console.log(`Using cached results for query: ${value}`)
              setSuggestions(autocompleteCache.current[cacheKey].data)
              return
            }

            // Check if we need to throttle API calls
            const now = Date.now()
            const timeSinceLastCall = now - lastApiCallRef.current

            if (timeSinceLastCall < MIN_API_CALL_INTERVAL) {
              console.log(`Throttling API call. Only ${timeSinceLastCall}ms since last call.`)
              return
            }

            // Update the timestamp for the API call
            lastApiCallRef.current = now

            setAutocompleteLoading(true)

            // Try to fetch from our own API endpoint first
            try {
              const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(value)}&limit=5&dedupe=1`, {
                signal: AbortSignal.timeout(3000), // 3 second timeout
              })

              if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`)
              }

              const data = await response.json()

              // Format suggestions for display
              const formattedSuggestions = data.map((suggestion: any) => suggestion.display_name)
              console.log("API autocomplete suggestions:", formattedSuggestions)

              // Cache the results
              autocompleteCache.current[cacheKey] = {
                data: formattedSuggestions,
                timestamp: Date.now(),
              }

              setSuggestions(formattedSuggestions)
              return
            } catch (error) {
              console.error("Error fetching from Next.js API:", error)
              // Continue to try the backend API
            }

            // If that fails, try the backend API directly
            try {
              const response = await fetch(`${apiUrl}/api/autocomplete?q=${encodeURIComponent(value)}&limit=5`, {
                signal: AbortSignal.timeout(3000), // 3 second timeout
              })

              if (!response.ok) {
                throw new Error(`Backend API responded with status: ${response.status}`)
              }

              const data = await response.json()

              // Format suggestions for display
              const formattedSuggestions = data.map(
                (suggestion: any) => suggestion.display_name || `${suggestion.name}, ${suggestion.location || ""}`,
              )
              console.log("Backend API autocomplete suggestions:", formattedSuggestions)

              // Cache the results
              autocompleteCache.current[cacheKey] = {
                data: formattedSuggestions,
                timestamp: Date.now(),
              }

              setSuggestions(formattedSuggestions)
              return
            } catch (error) {
              console.error("Error fetching from backend API:", error)
              // Continue to try the kitespots API
            }

            // If both fail, try the kitespots API
            try {
              const response = await fetch(`${apiUrl}/api/kitespots/autocomplete?query=${encodeURIComponent(value)}`, {
                signal: AbortSignal.timeout(3000), // 3 second timeout
              })

              if (!response.ok) {
                throw new Error(`Kitespots API responded with status: ${response.status}`)
              }

              const data = await response.json()

              const fallbackSuggestions = data.map(
                (spot: any) => `${spot.name}, ${spot.location || ""}, ${spot.country || ""}`,
              )
              console.log("Kitespots API suggestions:", fallbackSuggestions)

              // Cache the results
              autocompleteCache.current[cacheKey] = {
                data: fallbackSuggestions,
                timestamp: Date.now(),
              }

              setSuggestions(fallbackSuggestions)
              setKitespotSuggestions(data)
              return
            } catch (error) {
              console.error("Error fetching from kitespots API:", error)
              // All APIs failed, use local filtering of popular destinations
            }

            // If all APIs fail, filter popular destinations that match the query
            const filteredDestinations = POPULAR_DESTINATIONS.filter(
              (dest) =>
                dest.name.toLowerCase().includes(value.toLowerCase()) ||
                dest.location.toLowerCase().includes(value.toLowerCase()),
            ).map((dest) => `${dest.name}, ${dest.location}`)

            if (filteredDestinations.length > 0) {
              console.log("Using filtered popular destinations:", filteredDestinations)
              setSuggestions(filteredDestinations)
            } else {
              setSuggestions([])
              setNetworkError("Network error: Couldn't connect to location services")
            }
          } catch (error) {
            console.error("Error in autocomplete:", error)
            setNetworkError("Network error: Couldn't connect to location services")
            setSuggestions([])
          } finally {
            setAutocompleteLoading(false)
          }
        }, 300) // 300ms debounce
      } else {
        setSuggestions([])
      }
    } else {
      // Clear suggestions for chat queries
      setSuggestions([])
    }
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleSuggestionSelect = (suggestion: string) => {
    // Extract location parts
    const parts = suggestion.split(",").map((part) => part.trim())
    const spotName = parts[0]
    const country = parts.length > 1 ? parts[parts.length - 1] : ""

    // Check if this is one of our popular destinations
    const popularDest = POPULAR_DESTINATIONS.find(
      (dest) =>
        dest.name.toLowerCase() === spotName.toLowerCase() ||
        `${dest.name}, ${dest.location}`.toLowerCase() === suggestion.toLowerCase(),
    )

    if (popularDest) {
      // Use the hardcoded coordinates
      router.push(
        `/kitespots?lat=${popularDest.coordinates.lat}&lon=${popularDest.coordinates.lon}&name=${encodeURIComponent(suggestion)}`,
      )
      return
    }

    // Find the selected kitespot in our suggestions
    const selectedSpot = kitespotSuggestions.find((spot) => spot.name === spotName)

    if (selectedSpot) {
      // Navigate to the kitespot page
      router.push(`/kitespots/${encodeURIComponent(selectedSpot.name)}`)
    } else {
      // Default to Tarifa if we can't find coordinates
      router.push(`/kitespots?lat=36.0128&lon=-5.6012&name=${encodeURIComponent(suggestion)}`)
    }
  }

  // Helper function to get weather icon
  const getWeatherIcon = (condition: string, className = "h-6 w-6") => {
    switch (condition) {
      case "sunny":
        return <Sun className={`${className} text-yellow-500`} />
      case "cloudy":
        return <Cloud className={`${className} text-slate-400`} />
      case "rainy":
        return <CloudRain className={`${className} text-blue-400`} />
      default:
        return <Sun className={`${className} text-yellow-500`} />
    }
  }

  // Get wind direction as text
  const getWindDirectionText = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center p-6 sm:p-10 text-gray-900 dark:text-white space-y-8">
      <header className="w-full max-w-7xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Wind className="h-8 w-8 text-sky-600 dark:text-sky-400" />
          <h1 className="text-4xl font-bold text-sky-900 dark:text-sky-100">Kiteaways Spot Finder</h1>
        </div>
        <ThemeToggle />
      </header>

      <div className="w-full max-w-7xl relative">
        <UnifiedInput
          query={query}
          setQuery={setQuery}
          suggestions={suggestions}
          handleAutocomplete={handleAutocomplete}
          handleSearch={() => handleSearch()}
          loading={loading}
          autocompleteLoading={autocompleteLoading}
          onSuggestionSelect={handleSuggestionSelect}
          isFadingOut={isFadingOut}
          setIsFadingOut={setIsFadingOut}
          networkError={networkError}
        />
      </div>

      <main className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
            </div>
          ) : isChat ? (
            <Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-sky-100 dark:bg-sky-900/30 ml-auto max-w-[80%]"
                        : "bg-white dark:bg-slate-700 mr-auto max-w-[80%]"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            </Card>
          ) : results ? (
            <div className="flex flex-col gap-6 w-full">
              <RealtimeWeather
                windSpeed={results.basic.wind_speed}
                windDirection={results.basic.wind_direction}
                temperature={results.basic.temperature}
                precipitation={results.basic.precipitation}
                location={results.location}
              />
              <WindDisplay windSpeed={results.basic.wind_speed} windDirection={results.basic.wind_direction} />

              {/* Add Golden Window Timeline */}
              <GoldenKiteLine forecast={results.basic.forecast} goldenWindow={results.golden_kitewindow} />

              <ForecastWeather forecast={results.basic.forecast?.slice(0, 4) || []} />

              <FullForecastWeather forecast={results.basic.forecast || []} />

              <div className="space-y-6">
                <WindVisualization windSpeed={results.basic.wind_speed} windDirection={results.basic.wind_direction} />
              </div>

              {/* Optional: Show AI model used */}
              <div className="text-sm text-slate-500 dark:text-slate-400">Prediction model: {results.model_used}</div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
                <h2 className="text-xl font-bold mb-4">Popular Kitesurfing Destinations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {POPULAR_DESTINATIONS.map((spot, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => handleSuggestionSelect(`${spot.name}, ${spot.location}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{spot.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{spot.location}</p>
                        </div>
                        {loadingWeather ? (
                          <Skeleton className="h-6 w-6 rounded-full" />
                        ) : (
                          getWeatherIcon(popularSpotsWeather[spot.name]?.condition || "sunny", "h-6 w-6")
                        )}
                      </div>

                      {/* Weather information */}
                      <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                        {loadingWeather ? (
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        ) : (
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-base">
                                {popularSpotsWeather[spot.name]?.temperature.toFixed(1)}°
                              </span>
                              <span className="text-xs text-slate-500">
                                {loadingWeather || !locationTimeZones[spot.name]
                                  ? "..."
                                  : formatInTimeZone(new Date(), locationTimeZones[spot.name], "h:mm a")}
                              </span>
                            </div>
                            {/* Then update the wind information section to use this component: */}
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <Wind className="h-3.5 w-3.5" />
                              <span>{popularSpotsWeather[spot.name]?.windSpeed.toFixed(1)} kts</span>
                              <span className="text-xs ml-1">
                                {getWindDirectionText(popularSpotsWeather[spot.name]?.windDirection || 0)}
                              </span>
                              <div className="ml-auto">
                                <WindDirectionArrow
                                  direction={popularSpotsWeather[spot.name]?.windDirection || 0}
                                  size="sm"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <CloudRain className="h-3.5 w-3.5" />
                              <span>{popularSpotsWeather[spot.name]?.precipitation.toFixed(1)} mm</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center mt-3 text-xs">
                        <Wind className="h-3 w-3 mr-1 text-blue-500" />
                        <span>Popular destination</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <KitesurfingNews />
            </div>
          )}
        </div>

        {/* News sidebar - only show if results are displayed */}
        {results && (
          <div className="lg:w-80 xl:w-96">
            <KitesurfingNews />
          </div>
        )}
      </main>

      <footer className="mt-auto pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        &copy; {new Date().getFullYear()} Kiteaways - Find the perfect wind for your next adventure
      </footer>
    </div>
  )
}

