"use client"

// React hooks
import { useState } from "react"
import Link from "next/link"

// Client-side data fetching hooks
import { useKiteSpots } from "@/hooks/use-kitespots"

// UI components
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Search } from "lucide-react"

// Type definitions
import type { KiteSpot } from "@/types/kitespot"

interface KitespotListProps {
  initialKiteSpots: KiteSpot[]
}

export default function KitespotList({ initialKiteSpots }: KitespotListProps) {
  // Use SWR with initial data from server
  const { kiteSpots, isLoading, error, mutate } = useKiteSpots(initialKiteSpots)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter kitespots based on search term
  const filteredSpots = kiteSpots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle refresh button click
  const handleRefresh = () => {
    mutate() // Trigger revalidation
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
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
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          {error && <div className="text-red-500 mb-4">Error loading kitespots: {error.message}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpots.map((spot) => (
              <Link key={spot.id} href={`/kitespots/${encodeURIComponent(spot.name)}`}>
                <div className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
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
                </div>
              </Link>
            ))}

            {filteredSpots.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No kitespots found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

