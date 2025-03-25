import { NextResponse } from "next/server"

// Get the API URL with a fallback
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { location } = body

    const response = await fetch(`${apiUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location }),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json(
      {
        reply: "Sorry, I encountered an error processing your request. Please try again later.",
      },
      { status: 500 },
    )
  }
}

