import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Get the API URL with a fallback
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    // Forward the request to the backend API
    const response = await fetch(`${apiUrl}/api/kitespots/autocomplete?query=${encodeURIComponent(query)}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in autocomplete API route:", error)
    return NextResponse.json({ error: "Failed to fetch autocomplete suggestions" }, { status: 500 })
  }
}

