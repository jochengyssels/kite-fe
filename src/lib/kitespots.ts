export interface KiteSpot {
  id: string
  name: string
  location: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
  description: string
  bestFor: string[]
  windDirection: string[]
  waterConditions: string
  bestSeason: string
}

const KITESPOTS: KiteSpot[] = [
  {
    id: "tarifa",
    name: "Tarifa Beach",
    location: "Tarifa, Spain",
    country: "Spain",
    coordinates: {
      lat: 36.0128,
      lng: -5.6012,
    },
    description: "Tarifa is known for its strong and consistent winds, making it a paradise for kitesurfers.",
    bestFor: ["Advanced", "Intermediate"],
    windDirection: ["East", "West"],
    waterConditions: "Waves",
    bestSeason: "Summer",
  },
  {
    id: "cabarete",
    name: "Cabarete",
    location: "Puerto Plata, Dominican Republic",
    country: "Dominican Republic",
    coordinates: {
      lat: 19.7667,
      lng: -70.4167,
    },
    description:
      "Cabarete offers a variety of conditions, from flat water lagoons to wave spots, suitable for all levels.",
    bestFor: ["Beginner", "Intermediate", "Advanced"],
    windDirection: ["East"],
    waterConditions: "Flat Water & Waves",
    bestSeason: "Winter",
  },
  {
    id: "maui",
    name: "Maui",
    location: "Hawaii, USA",
    country: "USA",
    coordinates: {
      lat: 20.7984,
      lng: -156.3319,
    },
    description: "Maui is a world-class kitesurfing destination with consistent trade winds and warm waters.",
    bestFor: ["Intermediate", "Advanced"],
    windDirection: ["Northeast"],
    waterConditions: "Waves",
    bestSeason: "Summer",
  },
]

export async function getKitespotById(id: string): Promise<KiteSpot | undefined> {
  return KITESPOTS.find((kitespot) => kitespot.id === id)
}

