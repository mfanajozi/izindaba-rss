import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { timezone } from '../utils/timezone';

export function SASTClock() {
  const [time, setTime] = useState(timezone.formatSASTTime());
  const [date, setDate] = useState(timezone.formatSASTDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(timezone.formatSASTTime());
      setDate(timezone.formatSASTDate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 shadow-sm">
      <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
        <Clock className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-slate-800 font-mono tracking-wider">
          {time} <span className="text-xs font-normal text-emerald-600 ml-1">SAST</span>
        </span>
        <span className="text-xs text-slate-500">{date}</span>
      </div>
    </div>
  );
}