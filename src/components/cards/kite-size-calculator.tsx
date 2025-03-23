"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Scale } from "lucide-react"

interface KiteSizeCalculatorCardProps {
  defaultWindSpeed?: number
  defaultWeight?: number
}

export default function KiteSizeCalculatorCard({
  defaultWindSpeed = 15,
  defaultWeight = 75,
}: KiteSizeCalculatorCardProps) {
  const [windSpeed, setWindSpeed] = useState(defaultWindSpeed)
  const [riderWeight, setRiderWeight] = useState(defaultWeight)

  // Calculate recommended kite sizes based on wind speed and user weight
  const kiteSizes = (() => {
    // Base kite sizes for a 75kg rider
    const baseKiteSizes = [
      { minWind: 0, maxWind: 8, sizes: [] }, // Too light
      { minWind: 8, maxWind: 12, sizes: [12, 14, 15] }, // Light wind
      { minWind: 12, maxWind: 16, sizes: [10, 12] }, // Medium wind
      { minWind: 16, maxWind: 22, sizes: [8, 9, 10] }, // Good wind
      { minWind: 22, maxWind: 28, sizes: [6, 7, 8] }, // Strong wind
      { minWind: 28, maxWind: 35, sizes: [5, 6] }, // Very strong wind
      { minWind: 35, maxWind: 100, sizes: [] }, // Too strong
    ]

    // Weight adjustment factor
    const weightFactor = riderWeight / 75

    // Find the appropriate wind range
    const windRange = baseKiteSizes.find((range) => windSpeed >= range.minWind && windSpeed < range.maxWind)

    if (!windRange || windRange.sizes.length === 0) {
      return {
        sizes: [],
        message: windSpeed < 8 ? "Wind too light for kiteboarding" : "Wind too strong for kiteboarding",
      }
    }

    // Adjust kite sizes based on rider weight
    const adjustedSizes = windRange.sizes.map((size) => {
      // Heavier riders need bigger kites, lighter riders need smaller kites
      const adjustedSize = Math.round(size * weightFactor)
      return adjustedSize
    })

    // Remove duplicates and sort
    const uniqueSizes = [...new Set(adjustedSizes)].sort((a, b) => a - b)

    return {
      sizes: uniqueSizes,
      message: "",
    }
  })()

  // Calculate probability for each kite size
  const kiteProbabilities = (() => {
    if (kiteSizes.sizes.length === 0) return []

    // Calculate the ideal kite size based on the formula
    const idealSize = Math.round((800 / windSpeed) * Math.sqrt(riderWeight / 75))

    // Calculate probabilities based on distance from ideal size
    return kiteSizes.sizes.map((size) => {
      const distance = Math.abs(size - idealSize)
      // The closer to the ideal size, the higher the probability
      const probability = Math.max(0, Math.round(100 - distance * 15))
      return { size, probability }
    })
  })()

  // Get color class based on probability
  const getColorClass = (probability: number) => {
    if (probability >= 80) return "bg-green-500"
    if (probability >= 60) return "bg-blue-500"
    if (probability >= 40) return "bg-yellow-500"
    return "bg-slate-400"
  }

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Kite Size Calculator
        </CardTitle>
        <CardDescription>Find the right kite size based on wind conditions and your weight</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Wind Speed</label>
              <span className="text-sm font-bold">{windSpeed} knots</span>
            </div>
            <Slider value={[windSpeed]} min={5} max={35} step={1} onValueChange={(value) => setWindSpeed(value[0])} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Rider Weight</label>
              <span className="text-sm font-bold">{riderWeight} kg</span>
            </div>
            <Slider
              value={[riderWeight]}
              min={40}
              max={120}
              step={1}
              onValueChange={(value) => setRiderWeight(value[0])}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Recommended Kite Sizes</h3>

            {kiteSizes.message ? (
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">{kiteSizes.message}</div>
            ) : kiteProbabilities.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {kiteProbabilities.map(({ size, probability }) => (
                  <div key={size} className="flex flex-col items-center">
                    <div className="text-2xl font-bold">{size}m</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                      <div
                        className={`${getColorClass(probability)} h-2 rounded-full`}
                        style={{ width: `${probability}%` }}
                      />
                    </div>
                    <div className="text-xs mt-1">{probability}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
                No suitable kite size for these conditions
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

