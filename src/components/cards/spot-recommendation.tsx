"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Wind, Waves, ArrowRight } from "lucide-react"
import Link from "next/link"

interface SpotRecommendation {
  id: number
  name: string
  location: string
  distance: number
  windSpeed: number
  windDirection: string
  waterType: string
  matchScore: number
  imageUrl: string
}

interface SpotRecommendationCardProps {
  recommendations: SpotRecommendation[]
}

export default function SpotRecommendationCard({ recommendations }: SpotRecommendationCardProps) {
  // Get match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 75) return "bg-blue-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-slate-400"
  }

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Recommended Spots
        </CardTitle>
        <CardDescription>Kitesurfing spots with the best conditions right now</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((spot) => (
              <div
                key={spot.id}
                className="flex gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div
                  className="w-20 h-20 rounded-md bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${spot.imageUrl})` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium truncate">{spot.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{spot.location}</span>
                        <span className="mx-1">•</span>
                        <span>{spot.distance} km away</span>
                      </div>
                    </div>
                    <Badge className={`${getMatchScoreColor(spot.matchScore)} ml-1`}>{spot.matchScore}%</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center">
                        <Wind className="h-3 w-3 mr-1 text-blue-500" />
                        <span>{spot.windSpeed} kts</span>
                      </div>
                      <div className="flex items-center">
                        <Waves className="h-3 w-3 mr-1 text-blue-500" />
                        <span>{spot.waterType}</span>
                      </div>
                    </div>
                    <Link href={`/spots/${spot.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        Details <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">No spot recommendations available</div>
        )}
      </CardContent>
    </Card>
  )
}

