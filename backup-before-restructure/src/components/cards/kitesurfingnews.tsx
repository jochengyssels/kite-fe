"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, ExternalLink } from "lucide-react"

interface NewsItem {
  title: string
  description: string
  url: string
  date: string
}

export default function KitesurfingNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [_error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Mock news data - in a real app, you would fetch this from an API
    const mockNews = [
      {
        title: "World Kiteboarding Championships Announced",
        description: "The 2023 World Kiteboarding Championships will be held in Tarifa, Spain this September.",
        url: "#",
        date: "2023-06-15",
      },
      {
        title: "New Kite Technology Promises Better Control",
        description: "Revolutionary new kite design offers improved stability and control in gusty conditions.",
        url: "#",
        date: "2023-06-10",
      },
      {
        title: "Top 5 Kitesurfing Destinations for Summer",
        description: "Discover the best spots to catch wind and waves during the summer months.",
        url: "#",
        date: "2023-06-05",
      },
      {
        title: "Safety Tips for Beginner Kitesurfers",
        description: "Essential safety advice for those new to the sport of kitesurfing.",
        url: "#",
        date: "2023-05-28",
      },
    ]

    // Simulate API fetch
    setTimeout(() => {
      try {
        setNews(mockNews)
        setLoading(false)
      } catch (error) {
        setError("Failed to load news")
        setLoading(false)
      }
    }, 1000)
  }, [])

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch {
      return "N/A"
    }
  }

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          Kitesurfing News
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item, index) => (
              <div key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-4 last:pb-0">
                <a href={item.url} className="group block" target="_blank" rel="noopener noreferrer">
                  <h3 className="font-medium group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center">
                    {item.title}
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{formatDate(item.date)}</p>
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

