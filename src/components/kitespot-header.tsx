"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, MapPin, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CurrentConditions from "@/components/current-conditions"
import UnconfirmedKitespotBanner from "@/components/univormed-kitespot-banner"
import ThemeToggle from "@/components/theme-toggle"

interface KitespotHeaderProps {
  kitespot: any
  currentConditions: {
    windSpeed: number
    windDirection: number
    temperature: number
    gust?: number
  }
}

export default function KitespotHeader({ kitespot, currentConditions }: KitespotHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVerified, setIsVerified] = useState(true)

  // Check if the kitespot is verified (for demo purposes)
  useEffect(() => {
    // This would typically be determined by your data
    setIsVerified(!!kitespot.id)
  }, [kitespot])

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 h-[500px] z-0">
        <div className="relative w-full h-full">
          <Image
            src={kitespot.image_url || "/placeholder.svg?height=500&width=1200"}
            alt={kitespot.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
        </div>
      </div>

      {/* Navigation Bar */}
      <div
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md" : "bg-transparent text-white"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/kitespots">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              {isScrolled && <h1 className="font-bold text-lg truncate max-w-[200px]">{kitespot.name}</h1>}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Header Content */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-8">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                {kitespot.water_type || "Ocean"}
              </Badge>
              {kitespot.difficulty && (
                <Badge variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  {kitespot.difficulty}
                </Badge>
              )}
              {kitespot.wave_spot && (
                <Badge variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  Wave Spot
                </Badge>
              )}
              {kitespot.flat_water && (
                <Badge variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  Flat Water
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white">{kitespot.name}</h1>

            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4" />
              <span>
                {kitespot.location}, {kitespot.country}
              </span>
            </div>

            {kitespot.overall_rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-medium">{kitespot.overall_rating}/10</span>
                <span className="text-white/70 text-sm">Rating</span>
              </div>
            )}
          </div>

          {!isVerified && <UnconfirmedKitespotBanner />}

          <div className="mt-4">
            <CurrentConditions
              windSpeed={currentConditions.windSpeed}
              windDirection={currentConditions.windDirection}
              temperature={currentConditions.temperature}
              gust={currentConditions.gust}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

