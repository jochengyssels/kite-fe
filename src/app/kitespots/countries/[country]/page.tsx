import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchKitespotsByCountry } from "@/app/kitespots/actions"
import { notFound } from "next/navigation"
import { Wind, MapPin } from "lucide-react"

interface CountryPageProps {
  params: {
    country: string
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const countryName = decodeURIComponent(params.country)
  const spots = await fetchKitespotsByCountry(countryName)

  if (!spots || spots.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Kitespots in {countryName}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Discover {spots.length} {spots.length === 1 ? "spot" : "spots"} for kitesurfing
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map((spot) => (
          <Link key={spot.id || spot.name} href={`/kitespots/${encodeURIComponent(spot.name)}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start justify-between">
                  <span>{spot.name}</span>
                  {spot.probability !== undefined && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {Math.round(spot.probability * 100)}%
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{spot.location}</span>
                </div>
              </CardHeader>
              <CardContent>
                {spot.description ? (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{spot.description}</p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">No description available</p>
                )}

                <div className="flex flex-wrap gap-2 mt-auto">
                  {spot.wave_spot && <Badge variant="outline">Wave</Badge>}
                  {spot.flat_water && <Badge variant="outline">Flat Water</Badge>}
                  {spot.suitable_for_beginners && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
                    >
                      Beginner
                    </Badge>
                  )}
                </div>

                {spot.wind_reliability !== undefined && (
                  <div className="mt-4 flex items-center">
                    <Wind className="h-4 w-4 mr-2 text-blue-500" />
                    <div className="flex-1">
                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${spot.wind_reliability * 10}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{spot.wind_reliability}/10</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

