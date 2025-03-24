import { getAllKiteSpots } from "@/services/api-service"

export async function getKiteSpotByName(name: string) {
  const allSpots = await getAllKiteSpots()
  return allSpots.find((spot) => spot.name === name)
}

