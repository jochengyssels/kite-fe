export interface NewsItem {
  source: {
    id: string;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface NewsResponse {
  items: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsItem[];
} 