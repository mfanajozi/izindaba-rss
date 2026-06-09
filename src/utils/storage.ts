import { RSSFeed, FeedItem, Category, AppState } from '../types';

const STORAGE_KEYS = {
  FEEDS: 'rss_library_feeds',
  ITEMS: 'rss_library_items',
  CATEGORIES: 'rss_library_categories',
};

const getDefaultCategories = (): Category[] => [
  { id: '1', name: 'Technology', color: 'blue' },
  { id: '2', name: 'News', color: 'red' },
  { id: '3', name: 'Business', color: 'green' },
  { id: '4', name: 'Entertainment', color: 'purple' },
  { id: '5', name: 'Sports', color: 'orange' },
  { id: '6', name: 'Science', color: 'teal' },
  { id: '7', name: 'South African Stats', color: 'amber' },
];

export const storage = {
  getFeeds: (): RSSFeed[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveFeeds: (feeds: RSSFeed[]): void => {
    localStorage.setItem(STORAGE_KEYS.FEEDS, JSON.stringify(feeds));
  },

  getItems: (): FeedItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveItems: (items: FeedItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  },

  getCategories: (): Category[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : getDefaultCategories();
    } catch {
      return getDefaultCategories();
    }
  },

  saveCategories: (categories: Category[]): void => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  loadState: (): AppState => ({
    feeds: storage.getFeeds(),
    items: storage.getItems(),
    categories: storage.getCategories(),
  }),
};