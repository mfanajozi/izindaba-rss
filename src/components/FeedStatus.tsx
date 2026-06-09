import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface FeedStatusProps {
  isFetching: boolean;
  fetchStatus: { success: number; failed: number } | null;
}

export function FeedStatus({ isFetching, fetchStatus }: FeedStatusProps) {
  if (isFetching) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-teal-50 text-teal-700 border border-teal-200">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Fetching feeds...</span>
      </div>
    );
  }
  
  if (!fetchStatus) return null;
  
  if (fetchStatus.failed === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-4 h-4" />
        <span>{fetchStatus.success} feed{fetchStatus.success !== 1 ? 's' : ''} updated</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
      <AlertCircle className="w-4 h-4" />
      <span>{fetchStatus.success} success, {fetchStatus.failed} failed</span>
    </div>
  );
}