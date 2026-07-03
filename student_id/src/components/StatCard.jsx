import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend, trendLabel, suffix = '' }) => {
  const colorMap = {
    indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-900/20',  icon: 'text-indigo-600 dark:text-indigo-400',  ring: 'ring-indigo-500/20' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/20' },
    rose:    { bg: 'bg-rose-50 dark:bg-rose-900/20',       icon: 'text-rose-600 dark:text-rose-400',       ring: 'ring-rose-500/20' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-900/20',     icon: 'text-amber-600 dark:text-amber-400',     ring: 'ring-amber-500/20' },
    violet:  { bg: 'bg-violet-50 dark:bg-violet-900/20',   icon: 'text-violet-600 dark:text-violet-400',   ring: 'ring-violet-500/20' },
  };
  const c = colorMap[color] || colorMap.indigo;
  const isPositive = trend >= 0;

  return (
    <div className="card p-5 hover:shadow-md transition-shadow duration-300 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2 animate-count">
            {value}{suffix}
          </p>
          {trendLabel && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trendLabel}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center ring-4 ${c.ring} shrink-0`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
