"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Wind, AlertTriangle } from 'lucide-react'
import Link from "next/link"
import { getAllKiteSpots } from "@/services/api-service"

// API response type
interface KiteSpotResponse {
  id?: string
  name: string
  location?: string
  country?: string
  description?: string
  lat?: number
  lng?: number
  latitude?: number
  longitude?: number
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

// Component's normalized type
interface KiteSpot {
  id: string
  name: string
  location: string
  country: string
  latitude: number
  longitude: number
  difficulty: string
  water_type: string
  wave_spot: boolean
  flat_water: boolean
  suitable_for_beginners: boolean
  wind_reliability: number
}

interface SpotRecommendationsProps {
  limit?: number
}

export default function SpotRecommendations({ limit = 3 }: SpotRecommendationsProps) {
  const [spots, setSpots] = useState<KiteSpotResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data
  useEffect(() => {
    let isMounted = true
    
    async function fetchRecommendations() {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllKiteSpots()
        
        if (isMounted) {
          setSpots(data)
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err)
        if (isMounted) {
          setError("Failed to load recommendations. Please try again later.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchRecommendations()
    
    return () => {
      isMounted = false
    }
  }, [])

  // Process data with memoization
  const recommendations = useMemo(() => {
    return spots
      .filter(spot => 
        spot.name && 
        spot.location && 
        spot.country && 
        (spot.latitude !== undefined || spot.lat !== undefined) &&
        (spot.longitude !== undefined || spot.lng !== undefined)
      )
      .map(spot => ({
        id: spot.id || spot.name,
        name: spot.name,
        location: spot.location || "Unknown location",
        country: spot.country || "Unknown country",
        latitude: spot.latitude || spot.lat || 0,
        longitude: spot.longitude || spot.lng || 0,
        difficulty: spot.difficulty || "Unknown",
        water_type: spot.water_type || "Unknown",
        wave_spot: !!spot.wave_spot,
        flat_water: !!spot.flat_water,
        suitable_for_beginners: !!spot.suitable_for_beginners,
        wind_reliability: spot.wind_reliability || spot.probability || 0
      }))
      .sort((a, b) => b.wind_reliability - a.wind_reliability)
      .slice(0, limit);
  }, [spots, limit]);

  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Spots</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 
            className="h-8 w-8 animate-spin text-sky-600" 
            aria-label="Loading recommendations" 
          />
        </CardContent>
      </Card>
    )
  }

  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-amber-600 gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render empty state
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

  // Render recommendations
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Spots</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((spot) => (
          <div key={spot.id} className="border rounded-lg p-4">
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

            {spot.wind_reliability > 0 && (
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