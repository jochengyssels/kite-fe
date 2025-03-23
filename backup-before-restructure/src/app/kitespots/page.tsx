// React and Next.js imports
import { Suspense } from "react"

// Server-side data fetching (from lib folder)
import { getKiteSpots } from "@/lib/kitespots-server"

// UI components (from components folder)
import KitespotList from "./kitespots-list"
import { Skeleton } from "@/components/ui/skeleton"

// Type definitions (if needed)
// import type { KiteSpot } from "@/types/kitespot"

export const metadata = {
  title: "Kitespots | Find the Perfect Spot for Kitesurfing",
  description: "Discover and explore kitesurfing spots around the world with detailed information and forecasts.",
}

export default async function KitespotsPage() {
  // Fetch data on the server
  const initialKiteSpots = await getKiteSpots()

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">Find Your Perfect Kitespot</h1>
        <p className="text-center text-muted-foreground mb-8">
          Discover kitesurfing spots worldwide with real-time conditions and forecasts
        </p>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          {/* Pass server data to client component */}
          <KitespotList initialKiteSpots={initialKiteSpots} />
        </Suspense>
      </div>
    </div>
  )
}

