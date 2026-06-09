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
    <div className="bg-white rounded-xl border border-amber-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${categoryColor}20` }}>
          <Rss className="w-4 h-4" style={{ color: categoryColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-800 break-words">{feed.title}</h3>
          {isProtected && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
              <Shield className="w-3 h-3 shrink-0" />
              Default
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap" style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
            {feed.category}
          </span>
        </div>

        <a
          href={feed.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ExternalLink className="w-3 h-3 shrink-0" />
          <span className="truncate">{feed.url}</span>
        </a>

        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 text-xs text-slate-400">
          <span className="truncate">Added: {formatDate(feed.createdAt)}</span>
          {feed.lastFetched && (
            <span className="truncate">Last fetch: {formatDate(feed.lastFetched)}</span>
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
            className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
