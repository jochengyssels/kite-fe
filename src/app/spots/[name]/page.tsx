import { getKiteSpotByName } from "@/app/services/api-service" // Updated import path to match your file structure
import { notFound } from "next/navigation"
import { MapPin, Wind, Waves, Calendar, Info, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Props {
  params: {
    name: string
  }
}

export default async function SpotPage({ params: { name } }: Props) {
  const spot = await getKiteSpotByName(name)

  if (!spot) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/spots" className="flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to all spots
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{spot.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {spot.location}, {spot.country}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Wind className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Difficulty</p>
                <p className="font-medium">{spot.difficulty}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Waves className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Water Type</p>
                <p className="font-medium">{spot.water_type}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Best Season</p>
                <p className="font-medium">{spot.best_months.join(", ")}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              About this spot
            </h2>
            <p className="text-gray-700">{spot.description || "No description available."}</p>
          </div>

          <div className="mt-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-sm text-gray-600 mb-2">
                Coordinates: {spot.latitude}, {spot.longitude}
              </p>
              <div className="bg-gray-300 h-48 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Map placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

