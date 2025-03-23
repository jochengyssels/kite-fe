"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Compass, Wind } from "lucide-react"
import * as THREE from "three"

interface WindVisualizationProps {
  windSpeed: number
  windDirection: number
}

export default function WindVisualization({ windSpeed, windDirection }: WindVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const streaksRef = useRef<THREE.Line[]>([])
  const frameIdRef = useRef<number | null>(null)

  // Function to determine wind quality for kiteboarding
  const getWindQuality = (speed: number) => {
    if (speed < 8)
      return {
        label: "Too Light",
        color: "bg-slate-400",
        textColor: "text-slate-400",
        description: "Not enough wind for kitesurfing. Consider a larger kite or foil board.",
      }
    if (speed < 12)
      return {
        label: "Light",
        color: "bg-blue-400",
        textColor: "text-blue-400",
        description: "Suitable for large kites (12-17m) and experienced light wind riders.",
      }
    if (speed < 18)
      return {
        label: "Good",
        color: "bg-green-500",
        textColor: "text-green-500",
        description: "Ideal conditions for most riders. Perfect for medium-sized kites (9-12m).",
      }
    if (speed < 25)
      return {
        label: "Strong",
        color: "bg-yellow-500",
        textColor: "text-yellow-500",
        description: "Strong winds suitable for experienced riders with smaller kites (7-9m).",
      }
    return {
      label: "Very Strong",
      color: "bg-red-500",
      textColor: "text-red-500",
      description: "Extreme conditions for expert riders only. Use smallest kites (5-7m).",
    }
  }

  const windQuality = getWindQuality(windSpeed)

  // Determine wind color based on quality
  const getWindColor = (quality: string) => {
    switch (quality) {
      case "Too Light":
        return new THREE.Color("#94a3b8")
      case "Light":
        return new THREE.Color("#60a5fa")
      case "Good":
        return new THREE.Color("#22c55e")
      case "Strong":
        return new THREE.Color("#eab308")
      case "Very Strong":
        return new THREE.Color("#ef4444")
      default:
        return new THREE.Color("#60a5fa")
    }
  }

  // Get compass direction name
  const getCompassDirection = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  // Calculate recommended kite size based on wind speed and rider weight
  const getRecommendedKiteSize = (windSpeed: number, weight = 75) => {
    // Base formula: kite size = constant / wind speed * sqrt(weight / reference weight)
    // The constant is tuned to give reasonable kite sizes
    const constant = 800
    const referenceWeight = 75 // kg

    const recommendedSize = Math.round((constant / windSpeed) * Math.sqrt(weight / referenceWeight))

    // Clamp to reasonable kite sizes
    return Math.max(5, Math.min(17, recommendedSize))
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Setup scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0xffffff)

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    cameraRef.current = camera
    camera.position.z = 5

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    rendererRef.current = renderer
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Create wind streaks
    const createWindStreaks = () => {
      // Clear existing streaks
      streaksRef.current.forEach((streak) => scene.remove(streak))
      streaksRef.current = []

      const windColor = getWindColor(windQuality.label)
      const numStreaks = Math.max(5, Math.min(20, Math.floor(windSpeed / 2)))

      for (let i = 0; i < numStreaks; i++) {
        // Create curved path for each streak
        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(-2 + Math.random() * 0.5, -1 + Math.random() * 2, 0),
          new THREE.Vector3(-1 + Math.random() * 0.5, -0.5 + Math.random() * 1, 0),
          new THREE.Vector3(0 + Math.random() * 0.5, 0 + Math.random() * 1, 0),
          new THREE.Vector3(2 + Math.random() * 0.5, 1 + Math.random() * 2, 0),
        )

        const points = curve.getPoints(50)
        const geometry = new THREE.BufferGeometry().setFromPoints(points)

        // Line thickness based on wind speed
        const lineWidth = Math.max(1, Math.min(3, windSpeed / 10))

        const material = new THREE.LineBasicMaterial({
          color: windColor,
          opacity: Math.min(0.8, 0.3 + windSpeed / 30),
          transparent: true,
          linewidth: lineWidth,
        })

        const streak = new THREE.Line(geometry, material)

        // Rotate based on wind direction
        streak.rotation.z = THREE.MathUtils.degToRad(windDirection)

        // Add random offset for natural look
        streak.position.x = -1 + Math.random() * 2
        streak.position.y = -1 + Math.random() * 2

        scene.add(streak)
        streaksRef.current.push(streak)
      }
    }

    createWindStreaks()

    // Animation
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)

      // Move streaks based on wind speed
      streaksRef.current.forEach((streak, index) => {
        // Speed factor based on wind speed
        const speedFactor = windSpeed / 20

        // Move in direction of wind
        const directionRad = THREE.MathUtils.degToRad(windDirection)
        streak.position.x += Math.cos(directionRad) * 0.01 * speedFactor
        streak.position.y += Math.sin(directionRad) * 0.01 * speedFactor

        // Add slight oscillation for natural movement
        streak.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001

        // Reset position when out of view
        if (streak.position.x > 3 || streak.position.x < -3 || streak.position.y > 3 || streak.position.y < -3) {
          streak.position.x = -2 + Math.random()
          streak.position.y = -1 + Math.random() * 2
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      window.removeEventListener("resize", handleResize)
    }
  }, [windSpeed, windDirection, windQuality.label])

  return (
    <Card className="overflow-hidden border-0 shadow-none">
      <div ref={containerRef} className="relative h-[300px] w-full">
        <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Wind</p>
                <div className="flex items-center gap-1">
                  <Wind className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{windSpeed} knots</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Direction</p>
                <div className="flex items-center gap-1">
                  <Compass className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{getCompassDirection(windDirection)}</span>
                </div>
              </div>
              <Badge className={`${windQuality.color} px-3 py-1`}>{windQuality.label}</Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>{windQuality.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span>Recommended kite size: {getRecommendedKiteSize(windSpeed, 75)}m²</span>
              <span>Gust potential: {Math.round(windSpeed * 1.3)} knots</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

