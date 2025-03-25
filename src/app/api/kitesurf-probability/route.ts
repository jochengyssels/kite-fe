import { NextResponse } from "next/server"
import Groq from "groq"

declare module "groq" {
  export default class Groq {
    constructor(config: { apiKey: string });
    chat: {
      completions: {
        create: (params: any) => Promise<any>;
      };
    };
  }
}

const GROQ_API_KEY = "gsk_RKeG7qd7lpOxnK2k9EHpWGdyb3FYICtRBvXSfMfiFdfZlwjpUQ6"

// Initialize the Groq client
const groq = new Groq({
  apiKey: GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { location, weatherData } = body

    if (!location || !weatherData) {
      return NextResponse.json({ error: "Both 'location' and 'weatherData' are required" }, { status: 400 })
    }

    // Extract relevant weather data for the AI
    const { windSpeed, windDirection, temperature, precipitation } = weatherData

    // Create a prompt for the AI
    const prompt = `
      You are an expert kitesurfing advisor. Based on the following weather conditions for ${location}, 
      provide a kitesurfing probability score from 0-100% and a brief explanation:
      
      - Wind Speed: ${windSpeed} knots
      - Wind Direction: ${windDirection}°
      - Temperature: ${temperature}°C
      - Precipitation: ${precipitation} mm
      
      Format your response as a JSON object with the following structure:
      {
        "probability": number, // 0-100
        "explanation": string,
        "recommendedKiteSize": string, // e.g. "9-12m"
        "bestTimeWindow": {
          "start": string, // e.g. "14:00"
          "end": string,   // e.g. "18:00"
        },
        "warnings": string[] // Any safety warnings
      }
    `

    // Call the Groq API
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 500,
    })

    // Parse the AI response
    const responseContent = completion.choices[0]?.message?.content || ""

    try {
      // Extract JSON from the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const jsonResponse = JSON.parse(jsonMatch[0])
        return NextResponse.json(jsonResponse)
      } else {
        throw new Error("Could not parse JSON from AI response")
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      // Fallback response if parsing fails
      return NextResponse.json({
        probability: 50,
        explanation: "Based on the current conditions, kitesurfing is possible but not ideal.",
        recommendedKiteSize: "9-12m",
        bestTimeWindow: {
          start: "14:00",
          end: "18:00",
        },
        warnings: ["Always check local conditions before heading out."],
      })
    }
  } catch (error) {
    console.error("Error generating kitesurfing probability:", error)
    return NextResponse.json({ error: "Failed to generate kitesurfing probability" }, { status: 500 })
  }
}

