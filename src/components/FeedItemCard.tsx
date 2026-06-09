import { ExternalLink, Calendar, Sparkles } from 'lucide-react';
import { FeedItem } from '../types';

interface FeedItemCardProps {
  item: FeedItem;
  categoryColor: string;
}

export function FeedItemCard({ item, categoryColor }: FeedItemCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const daysRetained = Math.floor((Date.now() - item.fetchedAt) / (1000 * 60 * 60 * 24));
  const daysUntilRelease = 20 - daysRetained;

  return (
    <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
              {item.category}
            </span>
            <span className="text-xs text-slate-400">via {item.feedTitle}</span>
          </div>
          
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors mb-2 flex items-center gap-2">
              {item.title}
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
          </a>
          
          {item.description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {item.description}...
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(item.fetchedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {daysRetained} days retained
            </span>
            <span className={`px-2 py-0.5 rounded-full ${
              daysUntilRelease <= 4 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {daysUntilRelease} days until release
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}