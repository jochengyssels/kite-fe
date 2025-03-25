import { NextResponse } from "next/server"

// Get the API URL with a fallback
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET() {
  try {
    const response = await fetch(`${apiUrl}/api/kitespots`)

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching kitespots:", error)
    return NextResponse.json({ error: "Failed to fetch kitespots" }, { status: 500 })
  }
}

