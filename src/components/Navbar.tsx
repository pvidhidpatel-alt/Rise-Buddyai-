import React from 'react';
import {
  Sparkles,
  MessageSquare,
  Calendar,
  Flame,
  QrCode,
  Crown,
  User,
  LogOut,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { TabType, UserProfile } from '../types';
import { RiseBuddyLogo } from './RiseBuddyLogo';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenPrimeModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenPrimeModal,
  onLogout,
}) => {
  const isPrime = user.plan === 'prime';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <div className="cursor-pointer py-1" onClick={() => setActiveTab('ai-friend')}>
            <RiseBuddyLogo size="md" showSubtitle={true} variant="light" />
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('ai-friend')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'ai-friend'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-white/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Friend</span>
              {!isPrime && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === 'ai-friend'
                      ? 'bg-indigo-800 text-indigo-100'
                      : user.remainingFreeChats > 0
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {user.remainingFreeChats}/5
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('study-planner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'study-planner'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-white/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Study Planner</span>
            </button>

            <button
              onClick={() => setActiveTab('motivation-coach')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'motivation-coach'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-white/60'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Motivation</span>
            </button>

            <button
              onClick={() => setActiveTab('qr-access')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'qr-access'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-white/60'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Access</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200/60 text-xs font-bold text-amber-800">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{user.streakDays} Day Streak</span>
            </div>

            {/* Plan Badge or Upgrade Button */}
            {isPrime ? (
              <button
                onClick={() => setActiveTab('profile-prime')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-sm hover:brightness-105 transition-all"
              >
                <Crown className="w-4 h-4 fill-slate-950" />
                <span className="hidden sm:inline">Prime Active</span>
                <span className="sm:hidden">Prime</span>
              </button>
            ) : (
              <button
                onClick={onOpenPrimeModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Crown className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-bounce" />
                <span>Prime ₹149</span>
              </button>
            )}

            {/* User Profile / Auth Button */}
            {user.id ? (
              <div className="relative group">
                <button
                  onClick={() => setActiveTab('profile-prime')}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/80"
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Google Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-200/80 p-2">
        <button
          onClick={() => setActiveTab('ai-friend')}
          className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-[11px] font-bold ${
            activeTab === 'ai-friend' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>AI Friend</span>
        </button>

        <button
          onClick={() => setActiveTab('study-planner')}
          className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-[11px] font-bold ${
            activeTab === 'study-planner' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Planner</span>
        </button>

        <button
          onClick={() => setActiveTab('motivation-coach')}
          className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-[11px] font-bold ${
            activeTab === 'motivation-coach' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span>Coach</span>
        </button>

        <button
          onClick={() => setActiveTab('qr-access')}
          className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-[11px] font-bold ${
            activeTab === 'qr-access' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span>QR Plan</span>
        </button>
      </div>
    </header>
  );
};
