import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Crown,
  CheckCircle2,
  Zap,
  Sparkles,
  X,
  CreditCard,
  QrCode,
  ShieldAlert,
  Brain,
  MessageSquare,
  Calendar,
  Flame,
} from 'lucide-react';
import { UserProfile } from '../types';
import { GooglePayQRCard } from './GooglePayQRCard';

interface PrimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  isChatLimitReached?: boolean;
  user?: UserProfile;
}

export const PrimeModal: React.FC<PrimeModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
  isChatLimitReached = false,
  user,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInstantPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onUpgradeSuccess();
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/50 my-8 max-h-[90vh] flex flex-col"
          >
            {/* Top Glowing Header */}
            <div className="relative p-6 sm:p-7 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  RiseBuddy Prime
                </span>
                <span className="text-xs font-bold text-indigo-300">₹149 / Month</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
                Unlock Unlimited AI & Memory
              </h2>

              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed font-medium">
                {isChatLimitReached
                  ? "You've reached your limit of 5 free chats / day. Upgrade to Prime to continue talking endlessly!"
                  : 'Free plan gives 5 chats / day. Upgrade to Prime for unlimited AI Friend chats, study plans & AI memory.'}
              </p>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 sm:p-7 space-y-6 overflow-y-auto">
              {/* Account Indicator Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                    Target Account for 28-Day Prime
                  </p>
                  <p className="text-xs font-black text-slate-900 truncate">
                    {user?.email || user?.name || 'Active Student Account'}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-extrabold bg-amber-200 text-amber-950 px-2.5 py-1 rounded-lg">
                  28 Days Pass
                </span>
              </div>

              {/* Premium Benefits List */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5">
                  Included Prime Benefits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                    <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Unlimited AI Friend</p>
                      <p className="text-[11px] text-slate-500">Remove 5 chats/day limit</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Smart Study Planner</p>
                      <p className="text-[11px] text-slate-500">Unlimited schedule generation</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                    <Flame className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Motivation Chatbot</p>
                      <p className="text-[11px] text-slate-500">24/7 energetic pep talks</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                    <Brain className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Long-term AI Memory</p>
                      <p className="text-[11px] text-slate-500">Remembers study context</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Google Pay Payment QR Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Scan Google Pay QR to Upgrade
                  </h4>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Instant Activation
                  </span>
                </div>

                <GooglePayQRCard
                  payeeName="Vidhi Patel"
                  upiId="unicorndreams.com@okicici"
                  amount={149}
                  onPaymentComplete={handleInstantPayment}
                />
              </div>

              {/* Instant Activation Action Button */}
              <button
                onClick={handleInstantPayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:scale-[1.01] active:scale-[0.99] text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Activating 28-Day Prime Access...</span>
                  </div>
                ) : (
                  <>
                    <Crown className="w-5 h-5 fill-slate-950 text-slate-950 group-hover:scale-110 transition-transform" />
                    <span>👑 I Have Paid — Activate 28 Days Prime</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400 font-medium">
                ⚡ Instant 1-click activation for 28 full days upon clicking "I Have Paid".
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

