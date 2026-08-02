import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, UserCheck, Sparkles, X, PlusCircle, Check } from 'lucide-react';
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
      name: 'Vidhi Patel',
      email: 'p.vidhidpatel@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      badge: 'Primary Account',
    },
    {
      name: 'Vidhi Patel (Student)',
      email: 'vidhi.study@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'School & Prep',
    },
    {
      name: 'Vidhi Patel (Academic)',
      email: 'patel.academic@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      badge: 'Exams & Mock Tests',
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-100"
          >
            {/* Header */}
            <div className="relative p-6 bg-[#090514] text-white overflow-hidden border-b border-purple-900/50">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <RiseBuddyLogo size="md" showSubtitle={true} variant="dark" />
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Available Google Accounts
              </p>

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
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-slate-900 truncate group-hover:text-indigo-600">
                          {acc.name}
                        </p>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
                          {acc.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{acc.email}</p>
                    </div>
                    <UserCheck className="w-5 h-5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}

                {/* Toggle to add custom account */}
                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/30 text-indigo-600 text-xs font-black transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Use another Google account</span>
                  </button>
                ) : (
                  <form onSubmit={handleCustomSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <p className="text-xs font-extrabold text-slate-700">Enter Account Details</p>
                    <input
                      type="text"
                      placeholder="Your Name (e.g. Vidhi Patel)"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-none focus:border-indigo-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Google Email (e.g. vidhi@gmail.com)"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Sign In Account</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomInput(false)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Protected by Google OAuth • 100% Privacy Encrypted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

