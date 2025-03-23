"use client"

import { useState } from "react"
import { useKiteSpot, useKiteSpotForecast } from "@/hooks/use-kitespots"
import KitespotTabs from "@/components/kitespot-tabs"
import KitespotSidebar from "@/components/kitespot-sidebar"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import type { KiteSpot } from "@/types/kitespot"

interface KitespotDetailContentProps {
  initialKitespot: KiteSpot
  initialForecast: any
  currentConditions: {
    windSpeed: number
    windDirection: number
    temperature: number
    gust?: number
  }
}

export default function KitespotDetailContent({
  initialKitespot,
  initialForecast,
  currentConditions,
}: KitespotDetailContentProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Use SWR with initial data from server
  const { kiteSpot, mutate: mutateKitespot } = useKiteSpot(initialKitespot.name, initialKitespot)

  const {
    forecast,
    isLoading: forecastLoading,
    mutate: mutateForecast,
  } = useKiteSpotForecast(initialKitespot.id || "", initialForecast)

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([mutateKitespot(), mutateForecast()])
    setIsRefreshing(false)
  }

  // Process forecast data for components
  const windForecast = forecast?.hourly || initialForecast?.hourly || []

  // Find the best consecutive 3-hour window for kitesurfing
  const goldenWindow = {
    start: windForecast[0]?.time || new Date().toISOString(),
    end: windForecast[2]?.time || new Date().toISOString(),
    quality: 85, // Mock quality score
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Data</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <KitespotTabs
            kitespot={kiteSpot || initialKitespot}
            windForecast={windForecast}
            goldenWindow={goldenWindow}
            currentConditions={currentConditions}
          />
        </div>

        <div className="lg:col-span-1">
          <KitespotSidebar
            kitespot={kiteSpot || initialKitespot}
            windForecast={windForecast}
            goldenWindow={goldenWindow}
          />
        </div>
      </div>
    </div>
  )
}

