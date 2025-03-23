"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card } from "@/components/ui/card"
import { Compass, Loader2, Wind } from "lucide-react"
import WindDisplay from "@/components/wind-display"
import ThemeToggle from "@/components/theme-toggle"
import ForecastWeather from "@/components/cards/forecast-weather"
import RealtimeWeather from "@/components/cards/realtime-weather"
import FullForecastWeather from "@/components/cards/full-forecast-weather"
import WindVisualization from "@/components/wind-visualization"
import GoldenKiteLine from "@/components/cards/goldenKiteline"
import KitesurfingNews from "@/components/cards/kitesurfingnews"
import UnifiedInput from "@/components/unified-input"

interface LocationSuggestion {
  display_name: string
  place_id?: string
  // Add other properties if needed
}

interface KitespotSuggestion {
  name: string
  location: string
  country: string
}

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

  // Cache for autocomplete results
  const autocompleteCache = useRef<Record<string, { data: string[]; timestamp: number }>>({})
  const CACHE_EXPIRY = 3600 * 1000 // 1 hour in milliseconds

  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Get the API URL with a fallback
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

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
      const response = await axios.get(`${apiUrl}/api/weather?location=${encodeURIComponent(locationToSearch)}`)
      setResults({
        location: locationToSearch,
        basic: response.data.basic,
        enhanced: response.data.enhanced,
        golden_kitewindow: response.data.golden_kitewindow,
        model_used: response.data.model_used,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setLoading(false)
  }

  const handleChatQuery = async (question: string) => {
    setIsChat(true)
    setLoading(true)

    // Add user message to chat
    setChatMessages((prev) => [...prev, { role: "user", content: question }])

    try {
      console.log(`Sending chat request to: ${apiUrl}/api/chat`)
      const response = await axios.post(`${apiUrl}/api/chat`, {
        location: question,
      })

      // Add assistant response to chat
      setChatMessages((prev) => [...prev, { role: "assistant", content: response.data.reply }])
    } catch (error) {
      console.error("Error fetching chat response:", error)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ])
    }

    setLoading(false)
    setQuery("")
  }

  const handleAutocomplete = async (value: string) => {
    setQuery(value)

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

            setAutocompleteLoading(true)

            // Fetch location suggestions from FastAPI with timeout
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

            try {
              // Fetch location suggestions from FastAPI
              const response = await axios.get<LocationSuggestion[]>(
                `${apiUrl}/api/autocomplete?q=${encodeURIComponent(value)}&limit=5&dedupe=1`,
                { signal: controller.signal },
              )

              clearTimeout(timeoutId)

              const suggestions: LocationSuggestion[] = response.data
              // Format suggestions for display
              const formattedSuggestions = suggestions.map((suggestion) => suggestion.display_name)
              console.log("API autocomplete suggestions:", formattedSuggestions)

              // Cache the results
              autocompleteCache.current[cacheKey] = {
                data: formattedSuggestions,
                timestamp: Date.now(),
              }

              setSuggestions(formattedSuggestions)
            } catch (error: any) {
              clearTimeout(timeoutId)

              if (error.response && error.response.status === 429) {
                console.warn("Rate limit exceeded for autocomplete API")
              } else {
                console.error("Error getting location suggestions:", error)
              }

              // Try to get suggestions from the CSV fallback endpoint
              try {
                const fallbackResponse = await axios.get(
                  `${apiUrl}/api/kitespots/autocomplete?query=${encodeURIComponent(value)}`,
                )

                const fallbackSuggestions = fallbackResponse.data.map(
                  (spot: any) => `${spot.name}, ${spot.location}, ${spot.country}`,
                )

                console.log("Fallback suggestions:", fallbackSuggestions)

                // Cache the results
                autocompleteCache.current[cacheKey] = {
                  data: fallbackSuggestions,
                  timestamp: Date.now(),
                }

                setSuggestions(fallbackSuggestions)
                setKitespotSuggestions(fallbackResponse.data)
              } catch (fallbackError) {
                console.error("Error getting fallback suggestions:", fallbackError)
                setSuggestions([])
              }
            }
          } finally {
            setAutocompleteLoading(false)

            // Clean up cache if it gets too large
            const cacheKeys = Object.keys(autocompleteCache.current)
            if (cacheKeys.length > 100) {
              // Remove oldest 10 entries
              const oldestKeys = cacheKeys
                .sort((a, b) => autocompleteCache.current[a].timestamp - autocompleteCache.current[b].timestamp)
                .slice(0, 10)

              oldestKeys.forEach((key) => {
                delete autocompleteCache.current[key]
              })
            }
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
    // Extract the kitespot name from the suggestion (first part before the comma)
    const spotName = suggestion.split(",")[0].trim()

    // Find the selected kitespot in our suggestions
    const selectedSpot = kitespotSuggestions.find((spot) => spot.name === spotName)

    if (selectedSpot) {
      // Log the navigation for debugging
      console.log(`Navigating to kitespot: ${selectedSpot.name}`)

      // Navigate to the kitespot page
      router.push(`/kitespots/${encodeURIComponent(selectedSpot.name)}`)
    } else {
      // Even if not found in our suggestions, navigate to the kitespot page
      // This will show the unconfirmed kitespot page
      console.log(`Navigating to unconfirmed kitespot: ${spotName}`)
      router.push(`/kitespots/${encodeURIComponent(spotName)}`)
    }
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
            <Card className="p-10 text-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
              <div className="flex flex-col items-center gap-5">
                <Compass className="h-20 w-20 text-sky-600/40 dark:text-sky-400/40" />
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  Enter a location to see wind conditions or ask me anything about kitesurfing
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* News sidebar */}
        <div className="lg:w-80 xl:w-96">
          <KitesurfingNews />
        </div>
      </main>

      <footer className="mt-auto pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        &copy; {new Date().getFullYear()} Kiteaways - Find the perfect wind for your next adventure
      </footer>
    </div>
  )
}

