"use client"

import { useState } from "react"
import type { KiteSpot } from "@/types/kitespot"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Calendar, Share2, Star } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import SpotRecommendations from "@/components/spot-recommendation-card"
import WindAlertCard from "@/components/cards/wind-alert"
import KitesurfingNews from "@/components/cards/kitesurfing-news"

interface KitespotSidebarProps {
  kitespot: KiteSpot
  windForecast: Array<{
    time: string
    windSpeed: number
    windDirection: string
    quality: "perfect" | "good" | "fair" | "poor"
  }>
  goldenWindow: {
    start: string
    end: string
    quality: number
  }
}

export default function KitespotSidebar({ kitespot, windForecast, goldenWindow }: KitespotSidebarProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <Label htmlFor="follow-spot" className="font-medium">
                  Follow this spot
                </Label>
              </div>
              <Switch id="follow-spot" checked={isFollowing} onCheckedChange={setIsFollowing} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <Label htmlFor="wind-alerts" className="font-medium">
                  Wind alerts
                </Label>
              </div>
              <Switch id="wind-alerts" checked={showAlerts} onCheckedChange={setShowAlerts} />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Add to Calendar</span>
              </Button>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showAlerts && <WindAlertCard />}

      <SpotRecommendations limit={3} />

      <KitesurfingNews />
    </div>
  )
}

