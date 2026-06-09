import { Rss, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'items' | 'feeds';
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === 'items') {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <Rss className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">No Feed Items Yet</h3>
        <p className="text-slate-500 mb-4">Click "Fetch Now" to pull the latest articles from your RSS feeds.</p>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
        <Sparkles className="w-8 h-8 text-teal-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">No RSS Feeds Added</h3>
      <p className="text-slate-500 mb-4">Add your first RSS feed to start collecting articles.</p>
    </div>
  );
}