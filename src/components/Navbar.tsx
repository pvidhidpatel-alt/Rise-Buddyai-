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
  Target,
  Layers,
  FileText,
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
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'study-planner'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-white/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Planner</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-quiz')}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'ai-quiz'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-white/60'
              }`}
            >
              <Target className="w-4 h-4 text-purple-500" />
              <span>AI Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-flashcards')}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'ai-flashcards'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-white/60'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-notes')}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'ai-notes'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-white/60'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('motivation-coach')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
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
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'qr-access'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-white/60'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Plan</span>
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
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 border border-slate-200/70 transition-all text-left"
                title="Switch Google Account"
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-indigo-500/80"
                  />
                  {/* Google G Emblem Overlay */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full p-0.5 shadow-xs border border-slate-200 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                </div>
                <div className="hidden lg:flex flex-col text-left leading-tight pr-1">
                  <span className="text-xs font-black text-slate-800 truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-bold text-indigo-600">Google Linked</span>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border-2 border-indigo-600 text-indigo-950 font-black text-xs transition-all shadow-sm active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign Up with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-200/80 p-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ai-friend')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold shrink-0 ${
            activeTab === 'ai-friend' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>AI Friend</span>
        </button>

        <button
          onClick={() => setActiveTab('study-planner')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold shrink-0 ${
            activeTab === 'study-planner' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Planner</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-quiz')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold shrink-0 ${
            activeTab === 'ai-quiz' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Target className="w-4 h-4 text-purple-600" />
          <span>Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-flashcards')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold shrink-0 ${
            activeTab === 'ai-flashcards' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Flashcards</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-notes')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold shrink-0 ${
            activeTab === 'ai-notes' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('motivation-coach')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold shrink-0 ${
            activeTab === 'motivation-coach' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Coach</span>
        </button>

        <button
          onClick={() => setActiveTab('qr-access')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold shrink-0 ${
            activeTab === 'qr-access' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Plan</span>
        </button>
      </div>
    </header>
  );
};
