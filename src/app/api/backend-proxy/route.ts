import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get the API URL with a fallback
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    // Make a request to the FastAPI backend
    const response = await fetch(`${apiUrl}/api/health`)

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error connecting to backend:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to backend service",
      },
      { status: 500 },
    )
  }
}

