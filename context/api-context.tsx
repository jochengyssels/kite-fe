"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define your data types
interface KiteSpot {
  id: string
  name: string
  location: string
  // other properties...
}

interface ApiContextType {
  kiteSpots: KiteSpot[]
  loading: boolean
  error: string | null
  fetchKiteSpots: () => Promise<void>
}

// Create the context with default values
const ApiContext = createContext<ApiContextType>({
  kiteSpots: [],
  loading: false,
  error: null,
  fetchKiteSpots: async () => {},
})

// Custom hook to use the API context
export const useApi = () => useContext(ApiContext)

// Provider component
export function ApiProvider({ children }: { children: ReactNode }) {
  const [kiteSpots, setKiteSpots] = useState<KiteSpot[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchKiteSpots = async () => {
    // Only fetch if we don't already have data
    if (kiteSpots.length > 0) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/kitespots")
      if (!response.ok) {
        throw new Error("Failed to fetch kitespots")
      }
      const data = await response.json()
      setKiteSpots(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching kitespots:", err)
    } finally {
      setLoading(false)
    }
  }

  // Optional: Fetch data on initial load
  useEffect(() => {
    fetchKiteSpots()
  }, [])

  return <ApiContext.Provider value={{ kiteSpots, loading, error, fetchKiteSpots }}>{children}</ApiContext.Provider>
}

