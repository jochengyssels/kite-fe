"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Wind } from "lucide-react"
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

interface SpotRecommendationsProps {
  limit?: number
}

export default function SpotRecommendations({ limit = 3 }: SpotRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<KiteSpot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true)
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

        // Sort by wind reliability or probability
        const sortedData = mappedData.sort((a, b) => {
          const aScore = a.wind_reliability || a.probability || 0
          const bScore = b.wind_reliability || b.probability || 0
          return bScore - aScore
        })

        setRecommendations(sortedData.slice(0, limit))
      } catch (err) {
        console.error("Error fetching recommendations:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [limit])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Spots</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">No recommended spots available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Spots</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((spot) => (
          <div key={spot.id || spot.name} className="border rounded-lg p-4">
            <h3 className="font-medium text-lg">{spot.name}</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {spot.location}, {spot.country}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {spot.wave_spot && <Badge variant="outline">Wave</Badge>}
              {spot.flat_water && <Badge variant="outline">Flat Water</Badge>}
              {spot.suitable_for_beginners && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
                >
                  Beginner
                </Badge>
              )}
            </div>

            {spot.wind_reliability !== undefined && (
              <div className="flex items-center mb-3">
                <Wind className="h-4 w-4 mr-2 text-blue-500" />
                <div className="flex-1">
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${spot.wind_reliability * 10}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium">{spot.wind_reliability}/10</span>
              </div>
            )}

            <Link href={`/kitespots/${encodeURIComponent(spot.name)}`}>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

