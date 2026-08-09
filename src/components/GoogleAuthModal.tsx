import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, UserCheck, Sparkles, X, PlusCircle, Check, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { RiseBuddyLogo } from './RiseBuddyLogo';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (user: Partial<UserProfile>) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const sampleAccounts = [
    {
      name: 'Patel Vidhi',
      email: 'Patelvidhi4842@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Account 1',
    },
    {
      name: 'Vidhi Patel',
      email: 'p.vidhidpatel@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      badge: 'Account 2',
    },
    {
      name: 'Vidhi Patel (Academic)',
      email: 'patel.academic@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      badge: 'Account 3',
    },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    onSelectAccount({
      id: customEmail.trim(),
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customName || customEmail)}`,
    });
    onClose();
  };

  const GoogleGIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-100 my-8"
          >
            {/* Header */}
            <div className="relative p-6 bg-[#090514] text-white overflow-hidden border-b border-purple-900/50">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <RiseBuddyLogo size="md" showSubtitle={true} variant="dark" />
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Main Banner */}
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Sign in or Sign up with Google
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Connect your Google Account to sync AI memory, study planners & streak points.
                </p>
              </div>

              {/* Instant 1-Click Google Sign In Main Button */}
              <button
                onClick={() => {
                  onSelectAccount({
                    id: sampleAccounts[0].email,
                    name: sampleAccounts[0].name,
                    email: sampleAccounts[0].email,
                    avatar: sampleAccounts[0].avatar,
                  });
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-500 text-slate-800 font-black text-sm shadow-sm transition-all flex items-center justify-center gap-3 group active:scale-[0.99]"
              >
                <GoogleGIcon />
                <span>Continue with Google Account</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all ml-auto" />
              </button>

              <div className="flex items-center gap-2">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select or Enter Google Account
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Google Account Cards List */}
              <div className="space-y-2.5">
                {sampleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => {
                      onSelectAccount({
                        id: acc.email,
                        name: acc.name,
                        email: acc.email,
                        avatar: acc.avatar,
                      });
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-slate-900 truncate group-hover:text-indigo-600">
                          {acc.name}
                        </p>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
                          {acc.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                    </div>
                    <UserCheck className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}

                {/* Toggle to add custom account */}
                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/30 text-indigo-600 text-xs font-black transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Sign up with a new Google Email</span>
                  </button>
                ) : (
                  <form onSubmit={handleCustomSubmit} className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                    <p className="text-xs font-black text-indigo-950">Enter Google Account Details</p>
                    <input
                      type="text"
                      placeholder="Your Full Name (e.g. Vidhi Patel)"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold outline-none focus:border-indigo-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Google Email (e.g. vidhi@gmail.com)"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <GoogleGIcon />
                        <span>Sign Up with Google</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomInput(false)}
                        className="px-3 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Privacy Footer */}
              <div className="pt-3 border-t border-slate-100 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Protected by Google OAuth 2.0 • SSL Encrypted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


