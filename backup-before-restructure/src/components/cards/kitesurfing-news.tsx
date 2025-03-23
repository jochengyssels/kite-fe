"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, ExternalLink, Calendar, AlertCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NewsSource {
  id: string | null
  name: string
}

interface NewsItem {
  source: NewsSource
  author: string | null
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string
}

export default function KitesurfingNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})

  useEffect(() => {
    // In a real app, this would fetch from an actual API
    // For demo purposes, we'll use mock data
    const mockNews = [
      {
        source: { id: "kitesurfmag", name: "Kitesurf Magazine" },
        author: "Sarah Johnson",
        title: "New World Record Set for Longest Kitesurfing Journey",
        description:
          "Professional kitesurfer Alex Thompson has set a new world record for the longest continuous kitesurfing journey, covering over 500km along the coast of Australia in just 24 hours.",
        url: "#",
        urlToImage: "/placeholder.svg?height=400&width=600",
        publishedAt: "2023-03-15T09:30:00Z",
        content:
          "Professional kitesurfer Alex Thompson has set a new world record for the longest continuous kitesurfing journey, covering over 500km along the coast of Australia in just 24 hours. The journey, which started in Sydney and ended in Brisbane, was completed despite challenging wind conditions and required exceptional endurance.",
      },
      {
        source: { id: "kiteboarding", name: "Kiteboarding International" },
        author: "Mike Peterson",
        title: "Revolutionary New Kite Design Promises Better Performance in Light Winds",
        description:
          "A startup company has unveiled a new kite design that claims to provide superior performance in light wind conditions, potentially extending the kitesurfing season for many enthusiasts.",
        url: "#",
        urlToImage: "/placeholder.svg?height=400&width=600",
        publishedAt: "2023-03-10T14:15:00Z",
        content:
          "A startup company has unveiled a new kite design that claims to provide superior performance in light wind conditions, potentially extending the kitesurfing season for many enthusiasts. The innovative design uses a new aerodynamic profile and lightweight materials to generate more power from less wind.",
      },
      {
        source: { id: "watersports", name: "Watersports Today" },
        author: "Lisa Chen",
        title: "Top 5 Kitesurfing Destinations for Summer 2023",
        description:
          "Discover the best kitesurfing spots to visit this summer, from the consistent winds of Tarifa to the flat waters of Dakhla Lagoon.",
        url: "#",
        urlToImage: "/placeholder.svg?height=400&width=600",
        publishedAt: "2023-03-05T11:45:00Z",
        content:
          "As summer approaches, kitesurfers around the world are planning their next adventures. Our experts have compiled a list of the top 5 destinations that offer the perfect combination of wind conditions, accommodation options, and stunning scenery. From the consistent winds of Tarifa to the flat waters of Dakhla Lagoon, these spots should be on every kitesurfer's bucket list.",
      },
    ]

    setTimeout(() => {
      setNews(mockNews)
      setLoading(false)
    }, 1000)
  }, [])

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const getTimeAgo = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return "Recently"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Kitesurfing News
        </CardTitle>
        <CardDescription>Stay updated with the latest kitesurfing news and events</CardDescription>
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
                        className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-500"
                        style={{ backgroundImage: `url(${item.urlToImage})` }}
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
                    <a href={item.url} className="hover:underline">
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
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(index)} className="text-xs px-2 h-7">
                      {expandedItems[index] ? "Show less" : "Read more"}
                    </Button>

                    <a
                      href={item.url}
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

