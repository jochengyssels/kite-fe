"use client"

import useSWR from "swr"
import type { KiteSpot } from "@/types/kitespot"

// Reusable fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }
  return response.json()
}

// Hook to fetch all kitespots
export function useKiteSpots(initialData?: KiteSpot[]) {
  const { data, error, isLoading, mutate } = useSWR<KiteSpot[]>("/api/kitespots", fetcher, {
    fallbackData: initialData, // Use server-fetched data as initial data
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  })

  return {
    kiteSpots: data || [],
    isLoading,
    error,
    mutate, // Function to manually revalidate data
  }
}

// Hook to fetch a single kitespot
export function useKiteSpot(name: string, initialData?: KiteSpot) {
  const { data, error, isLoading, mutate } = useSWR<KiteSpot>(`/api/kitespots/${encodeURIComponent(name)}`, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    kiteSpot: data,
    isLoading,
    error,
    mutate,
  }
}

// Hook to fetch forecast data
export function useKiteSpotForecast(kitespotId: string, initialData?: any) {
  const { data, error, isLoading, mutate } = useSWR(
    kitespotId ? `/api/kitespots/${kitespotId}/forecast` : null,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    },
  )

  return {
    forecast: data,
    isLoading,
    error,
    mutate,
  }
}

// Hook to fetch current conditions
export function useCurrentConditions(kitespotId: string, initialData?: any) {
  const { data, error, isLoading, mutate } = useSWR(
    kitespotId ? `/api/kitespots/${kitespotId}/conditions` : null,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      refreshInterval: 900000, // Refresh every 15 minutes
    },
  )

  return {
    conditions: data,
    isLoading,
    error,
    mutate,
  }
}

