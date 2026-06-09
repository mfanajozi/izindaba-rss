import { RSSFeed, FeedItem } from '../types';

const NETLIFY_FUNCTION_URL = '/.netlify/functions/fetch-rss';

const CORS_PROXIES = [
  {
    name: 'AllOrigins',
    buildUrl: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'CorsProxy.io',
    buildUrl: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  },
  {
    name: 'CodeTabs',
    buildUrl: (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  },
  {
    name: 'ThingProxy',
    buildUrl: (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
  },
];

async function fetchViaNetlifyFunction(url: string): Promise<string> {
  const response = await fetch(`${NETLIFY_FUNCTION_URL}?url=${encodeURIComponent(url)}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${response.status}`);
  }

  const text = await response.text();
  if (!text || text.length < 50) {
    throw new Error('Response too short');
  }
  return text;
}

export const rssFetcher = {
  async fetchWithProxy(url: string): Promise<string> {
    const errors: string[] = [];

    for (const proxy of CORS_PROXIES) {
      try {
        console.log(`Trying ${proxy.name}...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const proxyUrl = proxy.buildUrl(url);

        const response = await fetch(proxyUrl, {
          method: 'GET',
          signal: controller.signal,
          mode: 'cors',
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const text = await response.text();

        if (text && text.length > 50) {
          console.log(`${proxy.name} succeeded`);
          return text;
        }

        throw new Error('Response too short');
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${proxy.name}: ${errorMsg}`);
        console.warn(`${proxy.name} failed:`, errorMsg);
      }
    }

    throw new Error(`All proxies failed:\n${errors.join('\n')}`);
  },

  parseRSSFeed(xmlText: string, feed: RSSFeed): FeedItem[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('XML Parse Error:', parseError.textContent);
      throw new Error('Invalid RSS/XML format');
    }

    const items: FeedItem[] = [];
    const rssItems = xmlDoc.querySelectorAll('item');

    console.log(`Found ${rssItems.length} items in feed`);

    rssItems.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent?.trim() || 'Untitled';
      const link = item.querySelector('link')?.textContent?.trim() || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';

      const cleanDescription = description
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 300);

      const uniqueId = `${feed.id}-${Date.now()}-${index}`;

      items.push({
        id: uniqueId,
        feedId: feed.id,
        title,
        link,
        description: cleanDescription,
        pubDate: pubDate || new Date().toISOString(),
        fetchedAt: Date.now(),
        category: feed.category,
        feedTitle: feed.title,
      });
    });

    return items;
  },

  async fetchFeed(feed: RSSFeed): Promise<FeedItem[]> {
    console.log(`Fetching: ${feed.title}`);
    console.log(`URL: ${feed.url}`);

    let xmlText: string;

    try {
      xmlText = await fetchViaNetlifyFunction(feed.url);
      console.log('Netlify function succeeded');
    } catch (fnError) {
      console.warn('Netlify function failed, trying CORS proxies:', fnError);
      try {
        xmlText = await this.fetchWithProxy(feed.url);
      } catch (proxyError) {
        console.error(`All fetch methods failed for ${feed.title}`, proxyError);
        throw proxyError;
      }
    }

    const items = this.parseRSSFeed(xmlText, feed);
    console.log(`Success: ${items.length} items from ${feed.title}`);
    return items;
  },
};
