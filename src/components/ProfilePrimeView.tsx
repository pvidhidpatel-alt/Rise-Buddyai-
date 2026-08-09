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
  onResetPlan?: () => void;
}

export const ProfilePrimeView: React.FC<ProfilePrimeViewProps> = ({
  user,
  onOpenPrimeModal,
  onToggleMemory,
  onOpenAuth,
  onLogout,
  onRenewPrime,
  onResetPlan,
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

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{user.id ? 'Switch Google Account' : 'Sign Up with Google'}</span>
            </button>
            {user.id && (
              <button
                onClick={onLogout}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
            {onResetPlan && (
              <button
                onClick={onResetPlan}
                className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5"
                title="Reset this account back to Free Plan to test new account payment flow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Plan to Free
              </button>
            )}
          </div>
        </div>

        {/* Account Info Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 space-y-1">
            <p className="font-extrabold">Account-Based Prime Subscription Policy</p>
            <p className="leading-relaxed font-medium">
              Prime activations are tied to your specific Google Account (<strong className="underline">{user.email || 'active account'}</strong>). When you sign up or switch to a different account, each account requires its own separate 28-day Prime payment via Google Pay QR or UPI ID (<strong className="font-mono bg-amber-100 px-1 py-0.5 rounded">unicorndreams.com@okicici</strong>).
            </p>
          </div>
        </div>

        {/* Plan Status & Features */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">Subscription & Plan Status</h3>

          {isPrime ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-indigo-700 text-white shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-black/20 rounded-full text-xs font-black uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 fill-amber-200" /> RiseBuddy Prime Active
                </span>
                <span className="text-xs font-bold text-amber-100">₹149 / 28 Days Pass</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xl font-black">Unlimited Access Activated!</h4>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950">
                    28 Days Active
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  Active account: <strong className="text-white underline">{user.email}</strong>. Enjoy unlimited AI chats, study planners, & long-term memory for {user.primeExpiryDaysRemaining ?? 28} days.
                </p>
              </div>

              {/* QR Code & UPI ID Card Reference even when Prime */}
              <div className="pt-2 border-t border-white/20 space-y-3">
                <p className="text-xs font-extrabold text-amber-200 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-300" />
                  <span>Google Pay QR & UPI ID Reference (unicorndreams.com@okicici):</span>
                </p>
                <div className="bg-slate-950/90 rounded-2xl p-4 border border-white/10 text-slate-100">
                  <GooglePayQRCard
                    payeeName="Vidhi Patel"
                    upiId="unicorndreams.com@okicici"
                    amount={149}
                  />
                </div>
              </div>

              {/* Renewal Notice if within renewal window */}
              {user.primeExpiryDaysRemaining && user.primeExpiryDaysRemaining <= 5 && (
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
                <h4 className="text-2xl font-black tracking-tight">Unlock RiseBuddy Prime — ₹149 / 28 Days</h4>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  Free plan gives <strong>5 chats per day</strong> for <strong className="text-white underline">{user.email || 'this account'}</strong>. Scan the Google Pay QR or pay via UPI ID (<code className="text-amber-300 bg-indigo-900 px-1 py-0.5 rounded">unicorndreams.com@okicici</code>) to activate 28 days of unlimited access!
                </p>
              </div>

              {/* Google Pay QR Payment Card */}
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-indigo-300">
                  Scan Google Pay QR Code to Pay ₹149:
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
                <span>👑 Confirm Payment & Activate 28 Days Prime</span>
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

