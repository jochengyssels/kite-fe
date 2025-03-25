"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Wind, Thermometer, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import KiteSizeCalculator from "@/components/kitesizecalculator"
import { cn } from "@/lib/utils"

interface ForecastItem {
  time: string
  windSpeed: number
  windDirection: number
  temperature: number
  gust: number
  rain: number
}

interface GoldenWindow {
  start_time: string
  end_time: string
  score: number
}

interface GoldenKiteLineProps {
  forecast: ForecastItem[]
  goldenWindow: GoldenWindow
  className?: string
}

export default function GoldenKiteLine({ forecast, goldenWindow, className }: GoldenKiteLineProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [userWeight, setUserWeight] = useState(75)
  const [showDetails, setShowDetails] = useState(false)
  const [currentHoverTime, setCurrentHoverTime] = useState<string | null>(null)
  const [currentHoverSpeed, setCurrentHoverSpeed] = useState<number | null>(null)

  // Calculate average wind speed during golden window
  const goldenWindowForecasts = forecast.filter((item) => {
    const itemTime = new Date(item.time).getTime()
    return (
      itemTime >= new Date(goldenWindow.start_time).getTime() && itemTime <= new Date(goldenWindow.end_time).getTime()
    )
  })

  const averageWindSpeed =
    goldenWindowForecasts.length > 0
      ? goldenWindowForecasts.reduce((sum, item) => sum + item.windSpeed, 0) / goldenWindowForecasts.length
      : 0

  const kiteRecommendation = ""

  return (
    <Card
      className={cn(
        "overflow-hidden bg-gradient-to-br from-white/80 to-amber-50/80 dark:from-slate-800/70 dark:to-amber-900/60 backdrop-blur-md rounded-3xl shadow-xl text-slate-800 dark:text-slate-100",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-xl">Golden Kite Window</CardTitle>
          </div>
          <Badge className="bg-green-500">Perfect</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chart */}
        <div className="relative">
          <div ref={chartRef} className="w-full h-[180px]" />
        </div>

        {/* Golden window info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-amber-50/50 dark:bg-amber-900/20 p-3 rounded-lg">
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Best Time Window</p>
            <p className="font-medium">Start - End</p>
          </div>
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Average Wind</p>
            <p className="font-medium flex items-center gap-1">
              <Wind className="h-4 w-4" />0 knots
            </p>
          </div>
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Average Temp</p>
            <p className="font-medium flex items-center gap-1">
              <Thermometer className="h-4 w-4" />
              0°C
            </p>
          </div>
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Average Gust</p>
            <p className="font-medium flex items-center gap-1">
              <Zap className="h-4 w-4" />0 knots
            </p>
          </div>
        </div>

        {/* Kite size calculator */}
        <KiteSizeCalculator windSpeed={averageWindSpeed} userWeight={userWeight} />
      </CardContent>
    </Card>
  )
}

