export interface RSSFeed {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt: number;
  lastFetched?: number;
}

export interface FeedItem {
  id: string;
  feedId: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  fetchedAt: number;
  category: string;
  feedTitle: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface AppState {
  feeds: RSSFeed[];
  items: FeedItem[];
  categories: Category[];
}