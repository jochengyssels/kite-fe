"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Wind, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { getAllKiteSpots } from "../../services/kitespot-service"
import type { KiteSpot } from "@/types/kitespot"

interface SpotRecommendationsProps {
  limit?: number
}

export default function SpotRecommendations({ limit = 3 }: SpotRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<KiteSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllKiteSpots()

        // Filter out spots without required fields
        const validData = data.filter(
          (spot) =>
            spot.location &&
            spot.country &&
            // Check for coordinates in either format
            spot.lat !== undefined &&
            spot.lng !== undefined,
        )

        // Sort by wind reliability or probability
        const sortedData = validData.sort((a, b) => {
          const aScore = a.wind_reliability || a.probability || 0
          const bScore = b.wind_reliability || b.probability || 0
          return bScore - aScore
        })

        setRecommendations(sortedData.slice(0, limit))
      } catch (err) {
        console.error("Error fetching recommendations:", err)
        setError("Failed to load recommendations. Please try again later.")
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
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" aria-label="Loading recommendations" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-red-500 gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
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
              <MapPin className="h-4 w-4 mr-1" aria-hidden="true" />
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
                <Wind className="h-4 w-4 mr-2 text-blue-500" aria-hidden="true" />
                <div className="flex-1">
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(spot.wind_reliability * 10, 100)}%` }}
                      aria-hidden="true"
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

