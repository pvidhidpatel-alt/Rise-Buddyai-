import React from 'react';

interface RiseBuddyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'transparent';
  className?: string;
}

export const RiseBuddyLogo: React.FC<RiseBuddyLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  variant = 'light',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Emblem Icon */}
      <div className={`${iconSizes[size]} shrink-0 rounded-2xl overflow-hidden shadow-md shadow-indigo-500/20 relative bg-[#0f0728] border border-purple-500/30 flex items-center justify-center p-1`}>
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <defs>
            <linearGradient id="logoPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0abfc" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sparkle Stars */}
          <path d="M180 130 Q180 150 160 150 Q180 150 180 170 Q180 150 200 150 Q180 150 180 130 Z" fill="#f5f3ff" filter="url(#logoGlow)" />
          <path d="M152 170 Q152 178 144 178 Q152 178 152 186 Q152 178 160 178 Q152 178 152 170 Z" fill="#d8b4fe" />

          {/* Book Pages Wing on Left */}
          <path d="M148 220 Q185 242 225 285" fill="#ffffff" opacity="0.95" />
          <path d="M140 248 Q180 262 225 298" fill="#e9d5ff" opacity="0.85" />
          <path d="M146 276 Q185 285 225 310" fill="#c084fc" opacity="0.75" />

          {/* Center Person Figure */}
          <circle cx="238" cy="188" r="16" fill="#ffffff" filter="url(#logoGlow)" />
          <path d="M192 180 Q238 210 292 180 Q252 240 290 315 Q245 318 215 270 Q205 235 192 180 Z" fill="url(#logoPurpleGrad)" />

          {/* Stylized Large R */}
          <path d="M195 118 L305 118 Q350 118 350 178 Q350 238 285 238 L260 238 L355 318 Q320 318 280 268 L260 238 L260 152 L300 152 Q318 152 318 178 Q318 204 300 204 L260 204 Z" fill="#ffffff" filter="url(#logoGlow)" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 leading-none">
          <span className={`font-black tracking-tight ${textSizes[size]} ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Rise
          </span>
          <span className={`font-black tracking-tight ${textSizes[size]} bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent`}>
            Buddy
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase mt-0.5 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>
            AI Friend • Study Planner • Motivation Coach
          </span>
        )}
      </div>
    </div>
  );
};
