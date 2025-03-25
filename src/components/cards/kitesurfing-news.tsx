"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, ExternalLink, Calendar, AlertCircle, Loader2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import type { NewsItem } from "@/types/news"

export default function KitesurfingNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)

        const response = await fetch("/api/kitesurfing-news")

        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`)
        }

        const data = await response.json()

        if (data.status === "error") {
          throw new Error(data.error || "Unknown error fetching news")
        }

        setNews(data.articles || [])

        // Initialize image loaded state
        const initialLoadState: Record<number, boolean> = {}
        data.articles.forEach((_: any, index: number) => {
          initialLoadState[index] = false
        })
        setImageLoaded(initialLoadState)
      } catch (error) {
        console.error("Error fetching news:", error)
        setError(error instanceof Error ? error.message : "Failed to load kitesurfing news. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => ({
      ...prev,
      [index]: true,
    }))
  }

  const handleImageError = (index: number) => {
    // If image fails to load, mark it as loaded to remove the loading state
    setImageLoaded((prev) => ({
      ...prev,
      [index]: true,
    }))
  }

  const getTimeAgo = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy")
    } catch (e) {
      // Try to parse as RFC 822 date format (common in RSS feeds)
      try {
        return format(new Date(dateString), "MMM d, yyyy")
      } catch (e) {
        return "Recently"
      }
    }
  }

  // Function to strip HTML tags from content
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Kitesurfing News
        </CardTitle>
        <CardDescription>Latest news from IKSurfMag</CardDescription>
      </CardHeader>
      <ScrollArea className="h-[600px]">
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-500">Loading the latest kitesurfing news...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
              <p className="text-slate-500">{error}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Newspaper className="h-10 w-10 text-slate-400 mb-4" />
              <p className="text-slate-500">No kitesurfing news available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {news.map((item, index) => (
                <div key={index} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                  {item.urlToImage && (
                    <div className="relative w-full h-48 mb-3 overflow-hidden rounded-lg bg-slate-100">
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${imageLoaded[index] ? "opacity-0" : "opacity-100"}`}
                      >
                        <div className="w-full h-full animate-pulse bg-slate-200 dark:bg-slate-700"></div>
                      </div>
                      <Image
                        src={item.urlToImage || "/placeholder.svg?height=300&width=600"}
                        alt={item.title}
                        fill
                        className={`object-cover transition-all duration-500 ${imageLoaded[index] ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="flex items-center gap-2 text-white text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>{getTimeAgo(item.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {item.title}
                    </a>
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Badge variant="outline" className="bg-slate-100 hover:bg-slate-200">
                      {item.source.name}
                    </Badge>
                    {item.author && <span>by {item.author}</span>}
                  </div>

                  <p className={`text-sm text-slate-600 ${expandedItems[index] ? "" : "line-clamp-3"}`}>
                    {stripHtml(item.description)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(index)} className="text-xs px-2 h-7">
                      {expandedItems[index] ? "Show less" : "Read more"}
                    </Button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Visit source <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  )
}

