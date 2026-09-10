import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'red' | 'amber' | 'blue' | 'emerald' | 'purple';
  trend?: string;
  isAlert?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  isAlert
}) => {
  const colorStyles = {
    red: {
      bg: 'bg-rose-950/30 border-rose-800/40',
      iconBg: 'bg-rose-600/20 text-rose-400 border-rose-600/30',
      text: 'text-rose-400',
      glow: 'shadow-rose-950/30'
    },
    amber: {
      bg: 'bg-amber-950/30 border-amber-800/40',
      iconBg: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
      text: 'text-amber-400',
      glow: 'shadow-amber-950/30'
    },
    blue: {
      bg: 'bg-blue-950/30 border-blue-800/40',
      iconBg: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
      text: 'text-blue-400',
      glow: 'shadow-blue-950/30'
    },
    emerald: {
      bg: 'bg-emerald-950/30 border-emerald-800/40',
      iconBg: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-950/30'
    },
    purple: {
      bg: 'bg-purple-950/30 border-purple-800/40',
      iconBg: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
      text: 'text-purple-400',
      glow: 'shadow-purple-950/30'
    }
  }[color];

  return (
    <div className={`relative p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.02] shadow-lg ${colorStyles.bg} ${colorStyles.glow} ${isAlert ? 'ring-1 ring-rose-500/60 animate-pulse-slow' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg border ${colorStyles.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className={`text-2xl sm:text-3xl font-black tracking-tight font-mono text-white`}>
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-slate-400">
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 truncate">{subtitle}</p>
      )}
    </div>
  );
};
