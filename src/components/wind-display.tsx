"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind } from "lucide-react"

interface WindDisplayProps {
  windSpeed: number
  windDirection: number | string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export default function WindDisplay({
  windSpeed,
  windDirection,
  size = "md",
  showLabel = true,
  className = "",
}: WindDisplayProps) {
  // Function to determine wind quality for kiteboarding
  const getWindQuality = (speed: number) => {
    if (speed < 8) return { label: "Too Light", color: "bg-slate-400", textColor: "text-slate-400" }
    if (speed < 12) return { label: "Light", color: "bg-blue-400", textColor: "text-blue-400" }
    if (speed < 18) return { label: "Good", color: "bg-green-500", textColor: "text-green-500" }
    if (speed < 25) return { label: "Strong", color: "bg-yellow-500", textColor: "text-yellow-500" }
    return { label: "Very Strong", color: "bg-red-500", textColor: "text-red-500" }
  }

  const windQuality = getWindQuality(windSpeed)

  // Get compass direction name
  const getCompassDirection = (direction: number | string) => {
    if (typeof direction === "string") return direction

    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    const index = Math.round(direction / 45) % 8
    return directions[index]
  }

  // Size classes
  const sizeClasses = {
    sm: {
      card: "p-2",
      icon: "h-6 w-6",
      speed: "text-lg",
      direction: "text-xs",
    },
    md: {
      card: "p-4",
      icon: "h-8 w-8",
      speed: "text-2xl",
      direction: "text-sm",
    },
    lg: {
      card: "p-6",
      icon: "h-12 w-12",
      speed: "text-4xl",
      direction: "text-lg",
    },
  }

  const classes = sizeClasses[size]
  const compassDirection = getCompassDirection(windDirection)
  const directionDegrees = typeof windDirection === "number" ? windDirection : 0

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardContent className={`${classes.card} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`relative ${windQuality.textColor}`}>
            <Wind
              className={classes.icon}
              style={{
                transform: typeof windDirection === "number" ? `rotate(${directionDegrees}deg)` : "none",
              }}
            />
          </div>
          <div>
            <div className={`${classes.speed} font-bold`}>{windSpeed} knots</div>
            <div className={`${classes.direction} text-muted-foreground`}>{compassDirection}</div>
          </div>
        </div>
        {showLabel && <Badge className={`${windQuality.color}`}>{windQuality.label}</Badge>}
      </CardContent>
    </Card>
  )
}

