import { Suspense } from "react"
import type { Metadata } from "next"
import { Skeleton } from "@/components/ui/skeleton"
import KitespotHeader from "@/components/kitespot-header"
import KitespotDetailContent from "./kitespot-detail-content"
import { useKiteSpot, useKiteSpotForecast } from "@/hooks/use-kitespots"
import { notFound } from "next/navigation"
import { getMockForecast } from "@/lib/kitespots-server"
import { getKiteSpotByName } from "@/lib/kitespots-server"

interface KitespotPageProps {
  params: {
    name: string
  }
}

export async function generateMetadata({ params }: KitespotPageProps): Promise<Metadata> {
  const decodedName = decodeURIComponent(params.name)
  const kitespot = await getKiteSpotByName(decodedName)

  return {
    title: kitespot ? `${kitespot.name} - Kitespot Details` : "Kitespot Not Found",
    description: kitespot?.description || "Detailed information about this kitespot",
  }
}

export default async function KitespotPage({ params }: KitespotPageProps) {
  const decodedName = decodeURIComponent(params.name)
  const kitespot = await getKiteSpotByName(decodedName)

  if (!kitespot) {
    notFound()
  }

  // Fetch forecast data on the server
  const forecast = kitespot.id ? await getMockForecast(kitespot.id) : null

  // If kitespot exists but has no image_url, add a default one
  if (!kitespot.image_url) {
    kitespot.image_url = `https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80`
  }

  // Mock current conditions (in a real app, this would come from an API)
  const currentConditions = {
    windSpeed: 18,
    windDirection: 135,
    temperature: 24,
    gust: 22,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <KitespotHeader kitespot={kitespot} currentConditions={currentConditions} />
      </Suspense>

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          {/* Pass server data to client component */}
          <KitespotDetailContent
            initialKitespot={kitespot}
            initialForecast={forecast}
            currentConditions={currentConditions}
          />
        </Suspense>
      </div>
    </div>
  )
}

