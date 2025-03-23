import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import { fetchKiteSpot } from "@/app/kitespots/actions"

interface KitespotPageProps {
  params: {
    name: string
  }
}

export default async function KitespotPage({ params }: KitespotPageProps) {
  try {
    const spot = await fetchKiteSpot(params.name)

    if (!spot) {
      notFound()
    }

    // Format month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">{spot.name || "Unknown Spot"}</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
          {spot.location || "Unknown Location"}
          {spot.country ? `, ${spot.country}` : ""}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About this spot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{spot.description || "No description available."}</p>

                {spot.facilities && spot.facilities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {spot.facilities.map((facility, index) => (
                        <Badge key={index} variant="outline">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Spot Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {spot.wave_spot && <Badge>Wave Spot</Badge>}
                    {spot.flat_water && <Badge>Flat Water</Badge>}
                    {spot.suitable_for_beginners && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
                      >
                        Beginner Friendly
                      </Badge>
                    )}
                    {!spot.wave_spot && !spot.flat_water && !spot.suitable_for_beginners && (
                      <span className="text-gray-500 dark:text-gray-400">No type information available</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Best Months to Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-2">
                  {monthNames.map((month, index) => (
                    <div
                      key={index}
                      className={`p-2 text-center rounded ${
                        spot.best_months && Array.isArray(spot.best_months) && spot.best_months.includes(month)
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {month.substring(0, 3)}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Wind Probability</h3>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(spot.probability || 0) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {Math.round((spot.probability || 0) * 100)}% chance of good wind conditions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Spot Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <span>Wind Reliability</span>
                      <span className="font-bold">{spot.wind_reliability || 0}/10</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(spot.wind_reliability || 0) * 10}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <span>Water Quality</span>
                      <span className="font-bold">{spot.water_quality || 0}/10</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(spot.water_quality || 0) * 10}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <span>Crowd Level</span>
                      <span className="font-bold">{spot.crowd_level || 0}/10</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(spot.crowd_level || 0) * 10}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <span>Overall Rating</span>
                      <span className="font-bold">{spot.overall_rating || 0}/10</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(spot.overall_rating || 0) * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Map placeholder</p>
                  </div>
                  <div className="mt-4 text-sm">
                    <p>Latitude: {spot.lat !== undefined ? spot.lat : "N/A"}</p>
                    <p>Longitude: {spot.lng !== undefined ? spot.lng : "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching kitespot:", error)
    notFound()
  }
}

