import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  color = 'slate'
}) => {
  const colorStyles = {
    slate: 'bg-slate-900 text-white',
    amber: 'bg-amber-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    blue: 'bg-blue-600 text-white',
    red: 'bg-red-600 text-white'
  };

  const isPositive = trend && !trend.startsWith('-');

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            {title}
          </p>
          <h3 className="font-serif text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorStyles[color] || colorStyles.slate}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-stone-100 text-xs">
          {isPositive ? (
            <span className="flex items-center text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {trend}
            </span>
          ) : (
            <span className="flex items-center text-red-600 font-bold">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {trend}
            </span>
          )}
          <span className="text-stone-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
