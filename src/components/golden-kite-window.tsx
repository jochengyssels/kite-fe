"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Wind, Waves, Clock, AlertTriangle, ArrowRight } from "lucide-react"

interface KitesurfProbability {
  probability: number
  explanation: string
  recommendedKiteSize: string
  bestTimeWindow: string
  warnings: string[]
}

interface GoldenKiteWindowProps {
  kitesurfData: KitesurfProbability
  locationName: string
}

export function GoldenKiteWindow({ kitesurfData, locationName }: GoldenKiteWindowProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Determine status based on probability
  const getStatus = (probability: number) => {
    if (probability >= 80) return { label: "Excellent", color: "bg-green-500 text-white" }
    if (probability >= 60) return { label: "Good", color: "bg-blue-500 text-white" }
    if (probability >= 40) return { label: "Fair", color: "bg-yellow-500 text-white" }
    return { label: "Poor", color: "bg-red-500 text-white" }
  }

  const status = getStatus(kitesurfData.probability)

  return (
    <div className="w-full">
      <Card className="overflow-hidden border-2 border-blue-500 shadow-xl">
        <div className="bg-blue-50 dark:bg-blue-950 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Circular gauge */}
            <div className="relative flex-shrink-0 w-40 h-40">
              <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
                {/* Background circle */}
                <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="12" />

                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={
                    kitesurfData.probability >= 80
                      ? "#22c55e"
                      : kitesurfData.probability >= 60
                        ? "#3b82f6"
                        : kitesurfData.probability >= 40
                          ? "#eab308"
                          : "#ef4444"
                  }
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${kitesurfData.probability * 4.4} 440`}
                />
              </svg>

              {/* Percentage in the middle */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold">{kitesurfData.probability}%</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorable</span>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">
                <span className={`px-3 py-1 rounded-full ${status.color}`}>{status.label} Conditions</span>
              </h2>
              <h3 className="text-xl text-gray-700 dark:text-gray-300 mb-4">at {locationName}</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{kitesurfData.explanation}</p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white dark:bg-gray-800">
          <div className="flex items-center p-4 gap-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Wind size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recommended Kite</p>
              <p className="font-semibold text-lg">{kitesurfData.recommendedKiteSize}</p>
            </div>
          </div>

          <div className="flex items-center p-4 gap-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Best Time</p>
              <p className="font-semibold text-lg">{kitesurfData.bestTimeWindow}</p>
            </div>
          </div>

          {kitesurfData.warnings.length > 0 ? (
            <div className="flex items-center p-4 gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Warning</p>
                <p className="font-semibold text-lg truncate">{kitesurfData.warnings[0]}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center p-4 gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                <Waves size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Water Conditions</p>
                <p className="font-semibold text-lg">Favorable</p>
              </div>
            </div>
          )}
        </div>

        {/* Show/Hide Details Button */}
        <Button
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2 py-6 rounded-none border-t border-gray-200 dark:border-gray-700"
        >
          {showDetails ? "Hide Details" : "Show Details"}
          {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>

        {/* Detailed Analysis */}
        {showDetails && (
          <div className="p-6 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Detailed Analysis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Wind size={20} />
                  Wind Conditions
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  The wind conditions are factored into the {kitesurfData.recommendedKiteSize} recommendation. Adjust
                  based on your weight and experience level.
                </p>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Kite Size</span>
                    <span className="font-medium">{kitesurfData.recommendedKiteSize}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Clock size={20} />
                  Time Window
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {kitesurfData.bestTimeWindow} offers the most consistent conditions. Check the hourly forecast for
                  more specific timing.
                </p>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Best Time</span>
                    <span className="font-medium">{kitesurfData.bestTimeWindow}</span>
                  </div>
                </div>
              </div>

              {kitesurfData.warnings.length > 0 && (
                <div className="md:col-span-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl shadow-md p-5 border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle size={20} />
                    Warnings
                  </h4>
                  <ul className="space-y-2">
                    {kitesurfData.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-amber-500" />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

