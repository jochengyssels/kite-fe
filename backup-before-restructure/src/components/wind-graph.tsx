"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface WindGraphProps {
  data: {
    time: string
    windSpeed: number
    windDirection: string
    quality: "perfect" | "good" | "fair" | "poor"
  }[]
  height?: number
}

// Define the valid time frame types
type TimeFrame = "24h" | "48h" | "week"

export default function WindGraph({ data, height = 300 }: WindGraphProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("24h")

  // Filter data based on the selected time frame
  const getFilteredData = () => {
    switch (timeFrame) {
      case "24h":
        return data.slice(0, 24)
      case "48h":
        return data.slice(0, 48)
      case "week":
        return data
      default:
        return data.slice(0, 24)
    }
  }

  const chartData = getFilteredData().map((item) => ({
    name: new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    windSpeed: item.windSpeed,
    quality: item.quality,
  }))

  // Define color based on quality
  const getStrokeColor = (dataPoint: { quality: "perfect" | "good" | "fair" | "poor" }) => {
    switch (dataPoint.quality) {
      case "perfect":
        return "#10b981" // green-500
      case "good":
        return "#3b82f6" // blue-500
      case "fair":
        return "#f59e0b" // amber-500
      case "poor":
        return "#6b7280" // gray-500
      default:
        return "#3b82f6" // blue-500
    }
  }

  // Handle tab change with proper typing
  const handleTimeFrameChange = (value: string) => {
    // Validate that the value is a valid TimeFrame
    if (value === "24h" || value === "48h" || value === "week") {
      setTimeFrame(value)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Wind Forecast</h3>
          <Tabs value={timeFrame} onValueChange={handleTimeFrameChange}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="48h">48h</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} angle={-45} />
            <YAxis
              label={{
                value: "Wind Speed (knots)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fontSize: 12 },
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [`${value} knots`, "Wind Speed"]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <ReferenceLine
              y={12}
              stroke="#3b82f6"
              strokeDasharray="3 3"
              label={{ value: "Min Kitable", position: "insideBottomRight", fontSize: 12 }}
            />
            <ReferenceLine
              y={25}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{ value: "Strong Wind", position: "insideTopRight", fontSize: 12 }}
            />
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getStrokeColor(entry)} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={getStrokeColor(entry)} stopOpacity={0.2} />
                </linearGradient>
              ))}
            </defs>
            <Area type="monotone" dataKey="windSpeed" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

