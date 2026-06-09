import { RSSFeed, FeedItem } from '../types';

const RETENTION_DAYS = 16;
const RELEASE_DAYS = 20;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const feedManager = {
  isItemRetained: (item: FeedItem): boolean => {
    const age = Date.now() - item.fetchedAt;
    return age <= RETENTION_DAYS * MS_PER_DAY;
  },

  shouldReleaseItem: (item: FeedItem): boolean => {
    const age = Date.now() - item.fetchedAt;
    return age > RELEASE_DAYS * MS_PER_DAY;
  },

  getRetainedItems: (items: FeedItem[]): FeedItem[] => {
    return items.filter(item => !feedManager.shouldReleaseItem(item));
  },

  cleanOldItems: (items: FeedItem[]): FeedItem[] => {
    return items.filter(item => !feedManager.shouldReleaseItem(item));
  },

  getDaysUntilRelease: (item: FeedItem): number => {
    const age = Date.now() - item.fetchedAt;
    const daysOld = Math.floor(age / MS_PER_DAY);
    return Math.max(0, RELEASE_DAYS - daysOld);
  },

  getDaysRetained: (item: FeedItem): number => {
    const age = Date.now() - item.fetchedAt;
    return Math.floor(age / MS_PER_DAY);
  },

  generateId: (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  getNextFetchTime: (): string => {
    const now = new Date();
    const saTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    
    let nextFetch = new Date(saTime);
    nextFetch.setHours(6, 0, 0, 0);
    
    if (saTime.getHours() >= 6) {
      nextFetch.setDate(nextFetch.getDate() + 1);
    }
    
    return nextFetch.toLocaleString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  },

  shouldFetchNow: (): boolean => {
    const now = new Date();
    const saTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    const hour = saTime.getHours();
    const minute = saTime.getMinutes();
    
    return hour === 6 && minute < 30;
  },

  getLastFetchDate: (): string => {
    return new Date().toLocaleDateString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  },
};