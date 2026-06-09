import { Rss, Trash2, Shield, ExternalLink } from 'lucide-react';
import { RSSFeed } from '../types';
import { Button } from './ui/button';

interface FeedCardProps {
  feed: RSSFeed;
  itemCount: number;
  onDelete: (id: string) => void;
  categoryColor: string;
  isProtected?: boolean;
}

export function FeedCard({ feed, itemCount, onDelete, categoryColor, isProtected }: FeedCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${categoryColor}20` }}>
            <Rss className="w-4 h-4" style={{ color: categoryColor }} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{feed.title}</h3>
            {isProtected && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <Shield className="w-3 h-3" />
                Default
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
            {feed.category}
          </span>
        </div>
        
        <a
          href={feed.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {feed.url.length > 40 ? `${feed.url.substring(0, 40)}...` : feed.url}
        </a>
        
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Added: {formatDate(feed.createdAt)}</span>
          {feed.lastFetched && (
            <span>Last fetch: {formatDate(feed.lastFetched)}</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-sm text-slate-600">
          <span className="font-semibold text-emerald-600">{itemCount}</span> items
        </span>
        
        {!isProtected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(feed.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}