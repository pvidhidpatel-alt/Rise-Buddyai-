import React from 'react';
import { Clock, Crown, Zap, RefreshCw } from 'lucide-react';

interface RenewalBannerProps {
  daysRemaining: number;
  onRenewClick: () => void;
}

export const RenewalBanner: React.FC<RenewalBannerProps> = ({
  daysRemaining,
  onRenewClick,
}) => {
  if (daysRemaining > 3 || daysRemaining <= 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-700 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-black/20 rounded-lg">
            <Clock className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <span>
            ⏳ <strong className="font-extrabold text-amber-200">{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left</strong> to renew your RiseBuddy Prime access!
          </span>
        </div>

        <button
          onClick={onRenewClick}
          className="px-4 py-1.5 rounded-xl bg-white text-slate-900 font-extrabold hover:bg-amber-100 transition-all shadow-sm flex items-center gap-1.5 text-xs group active:scale-95 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-180 transition-transform duration-500" />
          <span>Renew Prime Now — ₹149</span>
        </button>
      </div>
    </div>
  );
};
