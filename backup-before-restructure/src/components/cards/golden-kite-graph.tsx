"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import * as d3 from "d3"

interface ForecastItem {
  time: string
  windSpeed: number
  windDirection: string | number
  quality: "perfect" | "good" | "fair" | "poor"
  temperature?: number
  gust?: number
}

interface GoldenWindow {
  start: string
  end: string
  quality: number
}

interface GoldenKiteGraphProps {
  forecast: ForecastItem[]
  goldenWindow: GoldenWindow
  className?: string
}

export default function GoldenKiteGraph({ forecast, goldenWindow, className }: GoldenKiteGraphProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [currentHoverTime, setCurrentHoverTime] = useState<string | null>(null)
  const [currentHoverSpeed, setCurrentHoverSpeed] = useState<number | null>(null)

  // Get quality score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-lime-500"
    if (score >= 40) return "bg-amber-500"
    if (score >= 20) return "bg-orange-500"
    return "bg-red-500"
  }

  useEffect(() => {
    if (!chartRef.current || !forecast.length) return

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove()

    // Get container dimensions for responsive chart
    const containerWidth = chartRef.current.clientWidth
    const containerHeight = 180

    // D3 visualization implementation
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.top - margin.bottom

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Parse times
    const allTimes = forecast.map((f) => new Date(f.time))

    // Create scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(allTimes) as [Date, Date])
      .range([0, width])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(forecast, (d) => d.windSpeed) || 0])
      .nice()
      .range([height, 0])

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickSize(-height)
          .tickFormat(() => ""),
      )
      .attr("color", "rgba(100, 116, 139, 0.1)")
      .select(".domain")
      .remove()

    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => ""),
      )
      .attr("color", "rgba(100, 116, 139, 0.1)")
      .select(".domain")
      .remove()

    // Highlight golden window on the chart
    const startTime = new Date(goldenWindow.start)
    const endTime = new Date(goldenWindow.end)

    svg
      .append("rect")
      .attr("x", x(startTime))
      .attr("y", 0)
      .attr("width", x(endTime) - x(startTime))
      .attr("height", height)
      .attr("fill", "rgba(245, 158, 11, 0.15)")
      .attr("rx", 4)

    // Add wind speed line
    const line = d3
      .line<ForecastItem>()
      .x((d) => x(new Date(d.time)))
      .y((d) => y(d.windSpeed))
      .curve(d3.curveCatmullRom.alpha(0.5))

    svg
      .append("path")
      .datum(forecast)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2.5)
      .attr("d", line)

    // Add data points
    svg
      .selectAll(".dot")
      .data(forecast)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(new Date(d.time)))
      .attr("cy", (d) => y(d.windSpeed))
      .attr("r", 3)
      .attr("fill", (d) => {
        if (d.quality === "perfect") return "#10b981"
        if (d.quality === "good") return "#3b82f6"
        if (d.quality === "fair") return "#f59e0b"
        return "#6b7280"
      })
      .attr("stroke", "white")
      .attr("stroke-width", 1)

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => format(d as Date, "MMM dd HH:mm")),
      )
      .attr("font-size", "10px")

    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${d}`),
      )
      .attr("font-size", "10px")

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#64748b")
      .text("Wind Speed (knots)")

    // Add interactive overlay for tooltips
    const bisect = d3.bisector((d: ForecastItem) => new Date(d.time)).left

    const focus = svg.append("g").attr("class", "focus").style("display", "none")

    focus.append("circle").attr("r", 5).attr("fill", "#3b82f6").attr("stroke", "white").attr("stroke-width", 2)

    const overlay = svg
      .append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .style("opacity", 0)
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => {
        focus.style("display", "none")
        setCurrentHoverTime(null)
        setCurrentHoverSpeed(null)
      })
      .on("mousemove", mousemove)

    function mousemove(event: any) {
      const x0 = x.invert(d3.pointer(event)[0])
      const i = bisect(forecast, x0, 1)
      const d0 = forecast[i - 1]
      const d1 = forecast[i]
      if (!d0 || !d1) return

      const d = x0.getTime() - new Date(d0.time).getTime() > new Date(d1.time).getTime() - x0.getTime() ? d1 : d0

      focus.attr("transform", `translate(${x(new Date(d.time))},${y(d.windSpeed)})`)

      setCurrentHoverTime(d.time)
      setCurrentHoverSpeed(d.windSpeed)
    }

    // Handle window resize
    const handleResize = () => {
      if (chartRef.current) {
        d3.select(chartRef.current).selectAll("*").remove()
        // We could call the chart creation function here, but for simplicity
        // we'll rely on the useEffect to re-render when dependencies change
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [forecast, goldenWindow])

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Wind Forecast</CardTitle>
          <Badge className={getScoreColor(goldenWindow.quality)}>{goldenWindow.quality}% Perfect</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div ref={chartRef} className="w-full h-[180px]" />

          {currentHoverTime && currentHoverSpeed !== null && (
            <div className="absolute top-0 right-0 bg-white/90 dark:bg-slate-800/90 p-2 text-xs rounded shadow">
              <div>Time: {format(new Date(currentHoverTime), "MMM dd HH:mm")}</div>
              <div>Wind: {currentHoverSpeed} knots</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

