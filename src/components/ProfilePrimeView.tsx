import React from 'react';
import { motion } from 'motion/react';
import {
  Crown,
  User,
  Mail,
  ShieldCheck,
  Brain,
  MessageSquare,
  Sparkles,
  RefreshCw,
  LogOut,
  Flame,
  Award,
  Clock,
  Zap,
  CreditCard,
} from 'lucide-react';
import { UserProfile } from '../types';
import { GooglePayQRCard } from './GooglePayQRCard';

interface ProfilePrimeViewProps {
  user: UserProfile;
  onOpenPrimeModal: () => void;
  onToggleMemory: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onRenewPrime: () => void;
}

export const ProfilePrimeView: React.FC<ProfilePrimeViewProps> = ({
  user,
  onOpenPrimeModal,
  onToggleMemory,
  onOpenAuth,
  onLogout,
  onRenewPrime,
}) => {
  const isPrime = user.plan === 'prime';

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-3xl object-cover border-4 border-indigo-500 shadow-md"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
                {isPrime ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-slate-950" /> Prime
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                    Free Plan (5 chats / day)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                  🔥 {user.streakDays} Day Streak
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  ⚡ {user.xp} XP Points
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!user.id ? (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-indigo-700"
              >
                Sign in with Google
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Plan Status & Features */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">Subscription & Plan Status</h3>

          {isPrime ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-indigo-700 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-black/20 rounded-full text-xs font-black uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 fill-amber-200" /> RiseBuddy Prime Active
                </span>
                <span className="text-xs font-bold text-amber-100">₹149 / Month</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black">Unlimited Access Activated!</h4>
                <p className="text-xs text-amber-100/90">
                  Enjoy unlimited AI Friend chats, AI Study Planner updates, Motivation Coaching & Long-term AI Memory.
                </p>
              </div>

              {/* Renewal Notice if within renewal window */}
              {user.primeExpiryDaysRemaining && user.primeExpiryDaysRemaining <= 3 && (
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                    <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>⏳ {user.primeExpiryDaysRemaining} days remaining for subscription renewal</span>
                  </div>
                  <button
                    onClick={onRenewPrime}
                    className="px-3.5 py-1.5 bg-white text-slate-950 font-black text-xs rounded-xl hover:bg-amber-100 transition-all shadow-sm"
                  >
                    Renew Now
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 sm:p-7 rounded-3xl bg-indigo-950 text-white shadow-lg border border-indigo-900 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-300">Free Starter Plan</span>
                <span className="text-xs font-black text-amber-300 bg-indigo-900/80 px-3 py-1 rounded-full border border-amber-400/20">
                  {user.remainingFreeChats}/5 Free Chats Today
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black tracking-tight">Unlock RiseBuddy Prime — ₹149/month</h4>
                <p className="text-xs text-indigo-200">
                  Free plan gives <strong>5 chats per day</strong>. Upgrade to Prime to remove chat limits, enable AI memory & unlock full coaching!
                </p>
              </div>

              {/* Arranged Google Pay QR Payment Card */}
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-indigo-300">
                  Scan Google Pay QR to Upgrade Directly:
                </p>
                <GooglePayQRCard
                  payeeName="Vidhi Patel"
                  upiId="unicorndreams.com@okicici"
                  amount={149}
                  onPaymentComplete={onOpenPrimeModal}
                />
              </div>

              <button
                onClick={onOpenPrimeModal}
                className="w-full py-3.5 rounded-2xl bg-white text-indigo-950 font-black text-sm shadow-md hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5 fill-indigo-950" />
                <span>👑 Confirm & Upgrade to Prime</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Memory & Privacy Preferences */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">AI Settings & Preferences</h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Long-term AI Memory</p>
                <p className="text-[11px] text-slate-500">
                  Allows RiseBuddy to remember past study reflections across sessions.
                </p>
              </div>
            </div>

            <button
              onClick={onToggleMemory}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                user.memoryEnabled
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {user.memoryEnabled ? 'Enabled ✅' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

