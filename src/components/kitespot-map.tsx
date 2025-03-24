"use client"

import { useState, useEffect } from "react"
import type { KiteSpot } from "@/types/kitespot"
import { getAllKiteSpots } from "@/components/kitespot-service"

export default function KitespotMap() {
  const [spots, setSpots] = useState<KiteSpot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSpots() {
      setLoading(true)
      const data = await getAllKiteSpots()
      setSpots(data)
      setLoading(false)
    }

    loadSpots()
  }, [])

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <div className="relative h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="absolute inset-0 p-4">
        <div className="text-center">
          <p className="mb-2">This is a placeholder for a map component that would display {spots.length} kitespots.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You would typically integrate with a mapping library like Google Maps, Mapbox, or Leaflet here.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[350px] overflow-y-auto p-2">
          {spots.slice(0, 9).map((spot, index) => (
            <div key={index} className="bg-background p-2 rounded border text-sm">
              <p className="font-bold">{spot.name}</p>
              <p className="text-xs">
                {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
              </p>
            </div>
          ))}
          {spots.length > 9 && (
            <div className="bg-background p-2 rounded border text-sm text-center">
              And {spots.length - 9} more spots...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

