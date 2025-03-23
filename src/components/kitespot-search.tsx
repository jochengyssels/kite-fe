"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { getAllKiteSpots } from "@/app/kitespots/actions"

// Define the KiteSpot interface inline to avoid conflicts
interface KiteSpot {
  id?: string
  name: string
  location: string
  country: string
  description?: string
  lat?: number
  lng?: number
  latitude: number // Required
  longitude: number // Required
  difficulty?: string
  water_type?: string
  facilities?: string[]
  best_months?: string[]
  wave_spot?: boolean
  flat_water?: boolean
  suitable_for_beginners?: boolean
  probability?: number
  wind_reliability?: number
  water_quality?: number
  crowd_level?: number
  overall_rating?: number
}

export default function KitespotSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [kitespots, setKitespots] = useState<KiteSpot[]>([])
  const [filteredSpots, setFilteredSpots] = useState<KiteSpot[]>([])
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    async function loadKitespots() {
      try {
        setInitialLoading(true)
        const data = await getAllKiteSpots()

        // Filter out spots without required fields
        const validData = data.filter(
          (spot) =>
            spot.location &&
            spot.country &&
            (spot.latitude !== undefined || spot.lat !== undefined) &&
            (spot.longitude !== undefined || spot.lng !== undefined),
        )

        // Map to ensure all required fields are present
        const mappedData = validData.map((spot) => ({
          ...spot,
          location: spot.location || "Unknown location",
          country: spot.country || "Unknown country",
          latitude: spot.latitude || spot.lat || 0,
          longitude: spot.longitude || spot.lng || 0,
        }))

        setKitespots(mappedData)
        setFilteredSpots(mappedData)
      } catch (error) {
        console.error("Error loading kitespots:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    loadKitespots()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSpots(kitespots)
    } else {
      const lowercasedSearch = searchTerm.toLowerCase()
      const filtered = kitespots.filter(
        (spot) =>
          spot.name.toLowerCase().includes(lowercasedSearch) ||
          spot.location.toLowerCase().includes(lowercasedSearch) ||
          spot.country.toLowerCase().includes(lowercasedSearch),
      )
      setFilteredSpots(filtered)
    }
  }, [searchTerm, kitespots])

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search kitespots by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="default">Search</Button>
      </div>

      {initialLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
        </div>
      ) : filteredSpots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpots.map((spot) => (
            <Link key={spot.id || spot.name} href={`/kitespots/${encodeURIComponent(spot.name)}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-1">{spot.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {spot.location}, {spot.country}
                    </span>
                  </div>
                  {spot.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{spot.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {spot.wave_spot && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs rounded-full">
                        Wave
                      </span>
                    )}
                    {spot.flat_water && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs rounded-full">
                        Flat
                      </span>
                    )}
                    {spot.suitable_for_beginners && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 text-xs rounded-full">
                        Beginner
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No kitespots found matching your search.</p>
        </div>
      )}
    </div>
  )
}

