"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Wind, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface TimeSlot {
  time: string
  windSpeed: number
  windDirection: string
  quality: "perfect" | "good" | "fair" | "poor"
}

interface GoldenKiteLineProps {
  forecast: TimeSlot[]
  goldenWindow?: {
    start: string
    end: string
    quality: number
  }
}

export default function GoldenKiteLine({ forecast = [], goldenWindow }: GoldenKiteLineProps) {
  const [selectedDay, setSelectedDay] = useState<number>(0)

  // Group forecast by day
  const days: { [key: string]: TimeSlot[] } = {}

  forecast.forEach((slot) => {
    // Extract date from time string (assuming format like "2023-03-22T14:00:00")
    const date = slot.time.split("T")[0]
    if (!days[date]) {
      days[date] = []
    }
    days[date].push(slot)
  })

  const dayKeys = Object.keys(days)

  // Get quality color
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "perfect":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "fair":
        return "bg-yellow-500"
      case "poor":
        return "bg-slate-400"
      default:
        return "bg-slate-400"
    }
  }

  // Format time from ISO to readable format
  const formatTimeDisplay = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return format(date, "h:mm a")
    } catch (e) {
      return timeString
    }
  }

  // Format day for display
  const formatDayDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "EEE, MMM d")
    } catch (e) {
      return dateString
    }
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white/80 to-amber-50/80 dark:from-slate-800/70 dark:to-amber-900/60 backdrop-blur-md rounded-3xl shadow-xl text-slate-800 dark:text-slate-100 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold">Golden Kite Window</h2>
          </div>
          {goldenWindow && (
            <Badge className="px-3 py-1 text-xs font-medium rounded-full bg-green-500 text-white shadow-sm transition-all duration-200 hover:shadow-md hover:bg-green-600">
              {goldenWindow.quality}% Perfect
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Day selector */}
        {dayKeys.length > 0 && (
          <div className="flex overflow-x-auto pb-2 mb-4 gap-2 scrollbar-hide">
            {dayKeys.map((day, index) => (
              <button
                key={day}
                onClick={() => setSelectedDay(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedDay === index
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {formatDayDisplay(day)}
              </button>
            ))}
          </div>
        )}

        {/* Golden window highlight */}
        {goldenWindow && (
          <div className="mb-6 p-4 rounded-xl bg-amber-100/50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Best Time to Kite Today</p>
                <p className="text-lg font-bold mt-1">
                  {formatTimeDisplay(goldenWindow.start)} - {formatTimeDisplay(goldenWindow.end)}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-amber-500" />
            </div>
          </div>
        )}

        {/* Timeline */}
        {dayKeys.length > 0 && days[dayKeys[selectedDay]] && (
          <div className="space-y-3">
            {days[dayKeys[selectedDay]].map((slot, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl border transition-all ${
                  slot.quality === "perfect"
                    ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center w-14">
                      <span className="text-lg font-bold">{formatTimeDisplay(slot.time)}</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-primary" />
                        <span className="font-medium">{slot.windSpeed} knots</span>
                        <span className="text-sm text-muted-foreground">({slot.windDirection})</span>
                      </div>
                    </div>
                  </div>

                  <Badge className={`${getQualityColor(slot.quality)} px-2 py-0.5`}>
                    {slot.quality.charAt(0).toUpperCase() + slot.quality.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {(!dayKeys.length || !days[dayKeys[selectedDay]] || days[dayKeys[selectedDay]].length === 0) && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No forecast data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

