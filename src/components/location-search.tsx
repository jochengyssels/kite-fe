"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, MapPin, Loader2, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface LocationSuggestion {
  place_id: string
  display_name: string
  lat: string
  lon: string
}

export default function LocationSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Cache for location data
  const locationCache = useRef<Record<string, LocationSuggestion>>({})

  // Add this near the top of the component, after the state declarations
  const lastApiCallRef = useRef<number>(0)
  const MIN_API_CALL_INTERVAL = 1000 // Minimum 1 second between API calls

  // Handle clicks outside the suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Only close if we're not in the middle of selecting
        if (!loading) {
          setShowSuggestions(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [loading])

  // Fetch location suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([])
        setError(null)
        return
      }

      // Check if we need to throttle API calls
      const now = Date.now()
      const timeSinceLastCall = now - lastApiCallRef.current

      if (timeSinceLastCall < MIN_API_CALL_INTERVAL) {
        console.log(`Throttling API call. Only ${timeSinceLastCall}ms since last call.`)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Check if we have cached results for this query
        const cachedResults = localStorage.getItem(`autocomplete_${query.toLowerCase()}`)
        if (cachedResults) {
          const parsedResults = JSON.parse(cachedResults)
          setSuggestions(parsedResults)
          setShowSuggestions(true)
          setLoading(false)
          return
        }

        // Update the timestamp for the API call
        lastApiCallRef.current = now

        // Fetch from API
        const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}&limit=5&dedupe=1`)

        if (!response.ok) {
          const errorData = await response.json()
          console.error("API error:", errorData)
          throw new Error(errorData.details || `Error: ${response.status}`)
        }

        const data = await response.json()

        // Cache the results
        localStorage.setItem(`autocomplete_${query.toLowerCase()}`, JSON.stringify(data))

        setSuggestions(data)
        setShowSuggestions(true)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setError("Couldn't fetch location suggestions. Please try again or enter a location manually.")
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions()
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    // Cache the location data
    locationCache.current[suggestion.display_name] = suggestion

    // Store in localStorage for persistence
    const cachedLocations = JSON.parse(localStorage.getItem("cachedLocations") || "{}")
    cachedLocations[suggestion.display_name] = suggestion
    localStorage.setItem("cachedLocations", JSON.stringify(cachedLocations))

    // Navigate to the kitespot page with coordinates
    router.push(
      `/kitespots?lat=${suggestion.lat}&lon=${suggestion.lon}&name=${encodeURIComponent(suggestion.display_name)}`,
    )

    setShowSuggestions(false)
    setQuery(suggestion.display_name)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    // Check if we have this location cached
    const cachedLocations = JSON.parse(localStorage.getItem("cachedLocations") || "{}")
    if (cachedLocations[query]) {
      const location = cachedLocations[query]
      router.push(
        `/kitespots?lat=${location.lat}&lon=${location.lon}&name=${encodeURIComponent(location.display_name)}`,
      )
      return
    }

    // If not cached but we have suggestions, use the first one
    if (suggestions.length > 0) {
      handleSuggestionSelect(suggestions[0])
      return
    }

    // If we have no suggestions but the user entered something, use a default location
    // and show a toast notification
    toast({
      title: "Location not found",
      description: "Using Tarifa, Spain as a default location",
      variant: "destructive",
    })

    router.push(`/kitespots?lat=36.0128&lon=-5.6012&name=${encodeURIComponent("Tarifa, Spain")}`)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for a location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setShowSuggestions(true)}
          className="pl-10 py-6 text-lg rounded-full shadow-lg"
        />
        <Button
          type="submit"
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2 rounded-full px-6"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      {error && (
        <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {showSuggestions && (
        <Card className="absolute z-10 w-full mt-2 shadow-lg max-h-80 overflow-auto">
          {suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((suggestion) => (
                <li key={suggestion.place_id}>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-start gap-2"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                    <span>{suggestion.display_name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              {loading ? "Searching..." : "No locations found"}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

