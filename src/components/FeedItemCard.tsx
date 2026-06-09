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
    <div className="bg-white rounded-xl border border-amber-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all min-w-0">
      <div className="flex items-start gap-2 mb-2 flex-wrap">
        <span className="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap" style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
          {item.category}
        </span>
        <span className="text-xs text-slate-400 truncate min-w-0">via {item.feedTitle}</span>
      </div>

      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors mb-2 flex items-start gap-2 break-words">
          <span className="min-w-0">{item.title}</span>
          <ExternalLink className="w-4 h-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
      </a>

      {item.description && (
        <p className="text-sm text-slate-600 line-clamp-2 mb-3 break-words">
          {item.description}...
        </p>
      )}

      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 text-xs text-slate-400 flex-wrap">
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Calendar className="w-3 h-3 shrink-0" />
          {formatDate(item.fetchedAt)}
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Sparkles className="w-3 h-3 shrink-0" />
          {daysRetained}d retained
        </span>
        <span className={`px-2 py-0.5 rounded-full whitespace-nowrap ${
          daysUntilRelease <= 4 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {daysUntilRelease}d until release
        </span>
      </div>
    </div>
  );
}
