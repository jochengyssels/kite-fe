export interface NewsSource {
  id: string | null
  name: string
}

export interface NewsItem {
  source: NewsSource
  author: string | null
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string // ISO 8601 format (e.g., "2023-04-12T10:30:00Z")
  content: string
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsItem[]
}

