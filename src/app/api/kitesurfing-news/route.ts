import { NextResponse } from "next/server"
import type { NewsItem, NewsApiResponse } from "@/types/news"
import { XMLParser } from "fast-xml-parser"

// IKSurfMag RSS feed URL
const IKSURFMAG_FEED_URL = "https://www.iksurfmag.com/feed/"

export async function GET() {
  try {
    // Fetch the RSS feed
    const response = await fetch(IKSURFMAG_FEED_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`RSS feed responded with status: ${response.status}`)
    }

    const xmlData = await response.text()

    // Parse XML to JSON
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    })
    const result = parser.parse(xmlData)

    // Extract and format the news items
    const channel = result.rss.channel
    const items = channel.item || []

    // Transform RSS items to our NewsItem format
    const articles: NewsItem[] = items.map((item: any) => {
      // Extract the first image from the content if available
      let imageUrl = null
      if (item.enclosure && item.enclosure["@_url"]) {
        imageUrl = item.enclosure["@_url"]
      } else if (item["media:content"] && item["media:content"]["@_url"]) {
        imageUrl = item["media:content"]["@_url"]
      }

      // Extract first paragraph as description if no description exists
      let description = item.description || ""
      if (!description && item["content:encoded"]) {
        const contentMatch = item["content:encoded"].match(/<p>(.*?)<\/p>/)
        if (contentMatch && contentMatch[1]) {
          description = contentMatch[1].replace(/<[^>]*>/g, "")
        }
      }

      return {
        source: {
          id: "iksurfmag",
          name: "IKSurfMag",
        },
        author: item["dc:creator"] || null,
        title: item.title || "Untitled",
        description: description,
        url: item.link || "",
        urlToImage: imageUrl,
        publishedAt: item.pubDate || new Date().toISOString(),
        content: item["content:encoded"] || item.description || "",
      }
    })

    const newsResponse: NewsApiResponse = {
      status: "ok",
      totalResults: articles.length,
      articles: articles,
    }

    return NextResponse.json(newsResponse)
  } catch (error) {
    console.error("Error fetching kitesurfing news:", error)
    return NextResponse.json(
      {
        status: "error",
        totalResults: 0,
        articles: [],
        error: "Failed to fetch kitesurfing news",
      },
      { status: 500 },
    )
  }
}

