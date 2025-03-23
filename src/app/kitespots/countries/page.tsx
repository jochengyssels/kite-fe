import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { fetchCountries } from "@/app/kitespots/actions"
import { Globe } from "lucide-react"

export default async function CountriesPage() {
  const countries = await fetchCountries()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Kitespots by Country</h1>

      {!countries || countries.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No countries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {countries.map((country) => (
            <Link key={country.name} href={`/kitespots/countries/${encodeURIComponent(country.name || "")}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="text-2xl mb-2">{country.flag || "🏳️"}</div>
                  <h2 className="text-xl font-medium text-center">{country.name || "Unknown"}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {country.count || 0} {country.count === 1 ? "spot" : "spots"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

