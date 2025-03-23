"use client"

import { useState, useEffect } from "react"
import { getAllKiteSpots, getAllCountries, getFilteredKiteSpots } from "@/components/kitespot-service"
import type { KiteSpot } from "@/types/kitespot"
import Link from "next/link"

export default function KitespotsPage() {
  const [spots, setSpots] = useState<KiteSpot[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    country: "",
    difficulty: "",
    waterType: "",
  })

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [spotsData, countriesData] = await Promise.all([getAllKiteSpots(), getAllCountries()])
      setSpots(spotsData)
      setCountries(countriesData)
      setLoading(false)
    }

    loadData()
  }, [])

  async function handleFilterChange(filterType: "country" | "difficulty" | "waterType", value: string) {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)

    // Apply filters
    const filteredSpots = await getFilteredKiteSpots(
      newFilters.country || undefined,
      newFilters.difficulty || undefined,
      newFilters.waterType || undefined,
    )
    setSpots(filteredSpots)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Kitesurfing Spots</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Country filter */}
        <div>
          <label htmlFor="country" className="block mb-2 text-sm font-medium">
            Country
          </label>
          <select
            id="country"
            className="w-full p-2 border rounded-md bg-background"
            value={filters.country}
            onChange={(e) => handleFilterChange("country", e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty filter */}
        <div>
          <label htmlFor="difficulty" className="block mb-2 text-sm font-medium">
            Difficulty
          </label>
          <select
            id="difficulty"
            className="w-full p-2 border rounded-md bg-background"
            value={filters.difficulty}
            onChange={(e) => handleFilterChange("difficulty", e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Water type filter */}
        <div>
          <label htmlFor="waterType" className="block mb-2 text-sm font-medium">
            Water Type
          </label>
          <select
            id="waterType"
            className="w-full p-2 border rounded-md bg-background"
            value={filters.waterType}
            onChange={(e) => handleFilterChange("waterType", e.target.value)}
          >
            <option value="">All Water Types</option>
            <option value="Flat">Flat</option>
            <option value="Choppy">Choppy</option>
            <option value="Waves">Waves</option>
          </select>
        </div>
      </div>

      {spots.length === 0 ? (
        <div className="text-center py-8">
          <p>No kitespots found with the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map((spot, index) => (
            <Link href={`/kitespots/${encodeURIComponent(spot.name)}`} key={`${spot.name}-${index}`} className="block">
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-40 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{spot.name}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{spot.name}</h3>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Location:</span> {spot.location}, {spot.country}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Difficulty:</span> {spot.difficulty}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Water Type:</span> {spot.water_type}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

