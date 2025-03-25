import { NextResponse } from "next/server"

// Mock data for popular kitesurfing locations
const MOCK_LOCATIONS = [
  {
    place_id: "1",
    display_name: "Tarifa, Cádiz, Andalusia, Spain",
    lat: "36.0128",
    lon: "-5.6012",
  },
  {
    place_id: "2",
    display_name: "Cape Town, Western Cape, South Africa",
    lat: "-33.9249",
    lon: "18.4241",
  },
  {
    place_id: "3",
    display_name: "Maui, Hawaii, USA",
    lat: "20.7984",
    lon: "-156.3319",
  },
  {
    place_id: "4",
    display_name: "Cabarete, Puerto Plata, Dominican Republic",
    lat: "19.7667",
    lon: "-70.4167",
  },
  {
    place_id: "5",
    display_name: "Essaouira, Morocco",
    lat: "31.5125",
    lon: "-9.7700",
  },
  {
    place_id: "6",
    display_name: "Fuerteventura, Canary Islands, Spain",
    lat: "28.3587",
    lon: "-14.0538",
  },
  {
    place_id: "7",
    display_name: "Jericoacoara, Ceará, Brazil",
    lat: "-2.7964",
    lon: "-40.5117",
  },
  {
    place_id: "8",
    display_name: "Mui Ne, Phan Thiet, Vietnam",
    lat: "10.9333",
    lon: "108.2833",
  },
  {
    place_id: "9",
    display_name: "Hood River, Oregon, USA",
    lat: "45.7054",
    lon: "-121.5215",
  },
  {
    place_id: "10",
    display_name: "Zanzibar, Tanzania",
    lat: "-6.1659",
    lon: "39.3621",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const limit = Number.parseInt(searchParams.get("limit") || "5")

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
  }

  try {
    // Filter locations based on the query
    const filteredLocations = MOCK_LOCATIONS.filter((location) =>
      location.display_name.toLowerCase().includes(query.toLowerCase()),
    ).slice(0, limit)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(filteredLocations)
  } catch (error) {
    console.error("Error with mock locations:", error)
    return NextResponse.json({ error: "Failed to fetch mock locations" }, { status: 500 })
  }
}

