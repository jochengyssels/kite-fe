export interface KiteSpot {
  id: string
  name: string
  location: string
  country: string
  lat: number
  lng: number
  windProbability?: number
  whenToGo?: string[]
  description?: string
}

