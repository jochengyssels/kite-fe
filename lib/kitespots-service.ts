// This file should be deleted or replaced with a proper server-side implementation
// For now, we'll create a simple redirect to the client-side API service

import { redirect } from "next/navigation"

// This is just a placeholder to prevent import errors
// All actual functionality should use the client-side API service
export async function getKiteSpotByName(name: string) {
  console.warn("getKiteSpotByName from kitespots-server.ts is deprecated. Use the client-side API service instead.")
  redirect(`/spots/${encodeURIComponent(name)}`)
}

export async function getAllKiteSpots() {
  console.warn("getAllKiteSpots from kitespots-server.ts is deprecated. Use the client-side API service instead.")
  redirect("/spots")
}

