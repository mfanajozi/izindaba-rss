import { useState, useEffect, useCallback, useMemo } from 'react';
import { RSSFeed, FeedItem, Category } from './types';
import { storage } from './utils/storage';
import { feedManager } from './utils/feedManager';
import { rssFetcher } from './utils/rssFetcher';
import { AddFeedForm } from './components/AddFeedForm';
import { FeedCard } from './components/FeedCard';
import { FeedItemCard } from './components/FeedItemCard';
import { StatsBar } from './components/StatsBar';
import { CategoryFilter } from './components/CategoryFilter';
import { EmptyState } from './components/EmptyState';
import { SASTClock } from './components/SASTClock';
import { FeedStatus } from './components/FeedStatus';
import { Pagination } from './components/Pagination';
import { SearchBar } from './components/SearchBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Newspaper, RefreshCw, Sparkles, Download, Search } from 'lucide-react';
import { Button } from './components/ui/button';
import { exportAsMarkdown, exportAsJSON, downloadFile } from './utils/exporter';

const DEFAULT_FEEDS: RSSFeed[] = [
  {
    id: 'stats-sa-default',
    title: 'Statistics South Africa',
    url: 'https://www.statssa.gov.za/?feed=rss2',
    category: 'South African Stats',
    createdAt: Date.now(),
  },
  {
    id: 'topauto-default',
    title: 'TopAuto South Africa',
    url: 'https://topauto.co.za/feed/',
    category: 'Auto',
    createdAt: Date.now(),
  },
];

export default function App() {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<{ success: number; failed: number } | null>(null);
  const [lastFetch, setLastFetch] = useState<string | null>(null);

  useEffect(() => {
    const state = storage.loadState();
    setCategories(state.categories);
    
    let initialFeeds = state.feeds;
    let needsSave = false;
    
    DEFAULT_FEEDS.forEach(defaultFeed => {
      const hasFeed = state.feeds.some(f => f.url === defaultFeed.url);
      if (!hasFeed) {
        initialFeeds = [defaultFeed, ...initialFeeds];
        needsSave = true;
      }
    });
    
    if (needsSave) {
      storage.saveFeeds(initialFeeds);
    }
    
    setFeeds(initialFeeds);
    
    const cleanedItems = feedManager.cleanOldItems(state.items);
    setItems(cleanedItems);
    storage.saveItems(cleanedItems);

    checkAndFetchFeeds();
    
    const interval = setInterval(checkAndFetchFeeds, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkAndFetchFeeds = useCallback(() => {
    const lastFetchKey = 'rss_last_fetch_date';
    const lastFetchDate = localStorage.getItem(lastFetchKey);
    const today = feedManager.getLastFetchDate();
    
    if (feedManager.shouldFetchNow() && lastFetchDate !== today && feeds.length > 0) {
      fetchAllFeeds();
      localStorage.setItem(lastFetchKey, today);
    }
    
    setLastFetch(feedManager.getNextFetchTime());
  }, [feeds.length]);

  const fetchAllFeeds = async () => {
    if (isFetching || feeds.length === 0) return;
    
    setIsFetching(true);
    setFetchStatus(null);
    
    const newItems: FeedItem[] = [];
    const updatedFeeds = [...feeds];
    let successCount = 0;
    let failedCount = 0;
    
    for (const feed of feeds) {
      try {
        const feedItems = await rssFetcher.fetchFeed(feed);
        newItems.push(...feedItems);
        
        const feedIndex = updatedFeeds.findIndex(f => f.id === feed.id);
        if (feedIndex !== -1) {
          updatedFeeds[feedIndex] = { ...updatedFeeds[feedIndex], lastFetched: Date.now() };
        }
        
        successCount++;
      } catch (error) {
        console.error(`Failed to fetch feed: ${feed.title}`, error);
        failedCount++;
      }
    }
    
    setFeeds(updatedFeeds);
    storage.saveFeeds(updatedFeeds);
    
    setItems(prev => {
      const allItems = [...newItems, ...prev];
      return feedManager.cleanOldItems(allItems);
    });
    
    storage.saveItems(feedManager.cleanOldItems([...newItems, ...items]));
    
    setFetchStatus({ success: successCount, failed: failedCount });
    setIsFetching(false);
  };

  const handleAddFeed = (url: string, category: string, title: string) => {
    const newFeed: RSSFeed = {
      id: feedManager.generateId(),
      url,
      category,
      title,
      createdAt: Date.now(),
    };
    
    const updatedFeeds = [...feeds, newFeed];
    setFeeds(updatedFeeds);
    storage.saveFeeds(updatedFeeds);
  };

  const handleExport = (format: 'markdown' | 'json') => {
    const now = new Date().toLocaleString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    const dateSlug = new Date().toISOString().slice(0, 10);

    if (format === 'markdown') {
      const md = exportAsMarkdown(feeds, items, categories, now);
      downloadFile(md, `izindaba-export-${dateSlug}.md`, 'text/markdown');
    } else {
      const json = exportAsJSON(feeds, items, categories);
      downloadFile(json, `izindaba-export-${dateSlug}.json`, 'application/json');
    }
  };

  const handleDeleteFeed = (id: string) => {
    const isProtected = DEFAULT_FEEDS.some(f => f.id === id);
    if (isProtected) {
      return;
    }
    
    const updatedFeeds = feeds.filter(f => f.id !== id);
    setFeeds(updatedFeeds);
    storage.saveFeeds(updatedFeeds);
    
    const updatedItems = items.filter(i => i.feedId !== id);
    setItems(updatedItems);
    storage.saveItems(updatedItems);
  };

  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return '#059669';
    
    const colors: Record<string, string> = {
      emerald: '#059669',
      amber: '#d97706',
      blue: '#2563eb',
      purple: '#9333ea',
      red: '#dc2626',
      teal: '#0d9488',
      pink: '#db2777',
      orange: '#ea580c',
    };
    return colors[category.color] || colors.emerald;
  };

  const filteredItems = items.filter(i => {
    if (selectedCategory && i.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = i.title.toLowerCase().includes(q)
        || i.description.toLowerCase().includes(q)
        || i.category.toLowerCase().includes(q)
        || i.feedTitle.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const itemCounts: Record<string, number> = {};
  items.forEach(item => {
    itemCounts[item.category] = (itemCounts[item.category] || 0) + 1;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const ITEMS_PER_PAGE = isDesktop ? 24 : 12;

  const sortedItems = useMemo(
    () => filteredItems.sort((a, b) => b.fetchedAt - a.fetchedAt),
    [filteredItems]
  );

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = sortedItems.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <header className="bg-white border-b border-amber-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-200 shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight truncate">
                  Izindaba
                </h1>
                <p className="text-xs sm:text-sm text-emerald-600 font-medium truncate">
                  Your South African RSS Library
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <SASTClock />

              <div className="flex items-center gap-2 flex-wrap">
                <FeedStatus isFetching={isFetching} fetchStatus={fetchStatus} />

                <div className="relative group shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => handleExport('markdown')}
                    disabled={items.length === 0}
                    className="border-amber-200 hover:bg-amber-50 text-slate-700 shadow-sm text-xs sm:text-sm px-3 sm:px-4"
                    title="Export data"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    <span className="hidden xs:inline">Export</span>
                    <span className="xs:hidden">Export</span>
                  </Button>
                  <div className="absolute right-0 top-full mt-1 w-36 sm:w-40 bg-white rounded-lg border border-amber-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button
                      onClick={() => handleExport('markdown')}
                      disabled={items.length === 0}
                      className="w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-amber-50 first:rounded-t-lg disabled:opacity-40"
                    >
                      Markdown Report
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      disabled={items.length === 0}
                      className="w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-amber-50 last:rounded-b-lg disabled:opacity-40"
                    >
                      JSON Backup
                    </button>
                  </div>
                </div>

                <Button
                  onClick={fetchAllFeeds}
                  disabled={isFetching || feeds.length === 0}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-200 text-xs sm:text-sm px-3 sm:px-4 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
                  {isFetching ? 'Fetching...' : 'Fetch Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsBar feeds={feeds} items={items} />
        
        <AddFeedForm categories={categories} onAddFeed={handleAddFeed} />

        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="bg-white border border-amber-200 shadow-sm">
            <TabsTrigger value="items" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Newspaper className="w-4 h-4 mr-2" />
              Feed Items ({items.length})
            </TabsTrigger>
            <TabsTrigger value="feeds" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              My Feeds ({feeds.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            {items.length > 0 && (
              <>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex-1 w-full sm:w-auto">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      totalResults={filteredItems.length}
                    />
                  </div>
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    itemCounts={itemCounts}
                  />
                </div>
              </>
            )}
            
            {filteredItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedItems.map(item => (
                    <FeedItemCard
                      key={item.id}
                      item={item}
                      categoryColor={getCategoryColor(item.category)}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  totalItems={sortedItems.length}
                  perPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <EmptyState type="items" searchQuery={searchQuery} />
            )}
          </TabsContent>

          <TabsContent value="feeds" className="space-y-6">
            {feeds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feeds.map(feed => (
                  <FeedCard
                    key={feed.id}
                    feed={feed}
                    itemCount={items.filter(i => i.feedId === feed.id).length}
                    onDelete={handleDeleteFeed}
                    categoryColor={getCategoryColor(feed.category)}
                    isProtected={DEFAULT_FEEDS.some(f => f.id === feed.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="feeds" />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t border-amber-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-emerald-600">Izindaba</span> — Feeds retained for 16 days, released after 20 days
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>Auto-fetch: 6 AM SAST daily</span>
              <span>•</span>
              <span>Local Storage</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}