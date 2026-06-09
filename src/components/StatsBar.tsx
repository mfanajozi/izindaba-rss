import { Rss, Newspaper, Sparkles } from 'lucide-react';
import { RSSFeed, FeedItem } from '../types';

interface StatsBarProps {
  feeds: RSSFeed[];
  items: FeedItem[];
}

export function StatsBar({ feeds, items }: StatsBarProps) {
  const categories = [...new Set(items.map(item => item.category))];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Rss className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{feeds.length}</p>
            <p className="text-sm text-slate-500">RSS Feeds</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Newspaper className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{items.length}</p>
            <p className="text-sm text-slate-500">Feed Items</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{categories.length}</p>
            <p className="text-sm text-slate-500">Categories</p>
          </div>
        </div>
      </div>
    </div>
  );
}