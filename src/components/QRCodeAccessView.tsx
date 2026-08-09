import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  QrCode,
  Smartphone,
  Clock,
  BookOpen,
  Coffee,
  RotateCcw,
  Sparkles,
  Share2,
  Copy,
  Check,
  Zap,
  Crown,
} from 'lucide-react';
import { TimetableSlot, UserProfile } from '../types';
import { GooglePayQRCard } from './GooglePayQRCard';

interface QRCodeAccessViewProps {
  user: UserProfile;
  timetable: TimetableSlot[];
  onOpenPlanner: () => void;
}

export const QRCodeAccessView: React.FC<QRCodeAccessViewProps> = ({
  user,
  timetable,
  onOpenPlanner,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrType, setQrType] = useState<'schedule' | 'prime'>('schedule');

  // Generate unique schedule URL
  const timetableShareUrl = `${window.location.origin}/timetable?user=${encodeURIComponent(
    user.name || 'student'
  )}&updated=${Date.now()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(timetableShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Identify current, next, break, revision slots
  const currentSlot = timetable.find((t) => !t.isCompleted) || timetable[0];
  const nextSlot = timetable.filter((t) => !t.isCompleted)[1] || timetable[1];
  const breakSlot = timetable.find((t) => t.type === 'break');
  const revisionSlots = timetable.filter((t) => t.type === 'revision');

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-md border border-indigo-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-white/20 text-indigo-100 font-black text-xs rounded-full uppercase tracking-wider flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                Timetable QR Access
              </span>
              <span className="text-xs font-black text-amber-300">📱 Mobile Quick Access</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Scan Today's Study Plan</h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1">
              Scan this QR code with your phone camera to view live updates & schedule tasks anywhere!
            </p>
          </div>

          <button
            onClick={onOpenPlanner}
            className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-black text-xs hover:bg-indigo-50 transition-all shadow-sm"
          >
            Edit Timetable
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-2xl w-fit">
        <button
          onClick={() => setQrType('schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            qrType === 'schedule'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4 text-indigo-600" />
          <span>Timetable QR</span>
        </button>

        <button
          onClick={() => setQrType('prime')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            qrType === 'prime'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span>Prime Google Pay QR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* QR Code Card */}
        <div className="md:col-span-5">
          {qrType === 'schedule' ? (
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200/80 text-center flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-inner">
                <QRCodeCanvas value={timetableShareUrl} size={180} level="H" includeMargin />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">Your Timetable QR Code</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Updates automatically whenever your AI study plan changes.
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Copy Schedule Link</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <GooglePayQRCard
              payeeName="Vidhi Patel"
              upiId="unicorndreams.com@okicici"
              amount={149}
            />
          )}
        </div>

        {/* Live Plan Dashboard View */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 shadow-lg border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              Live Timetable Dashboard Preview
            </h3>
            <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live Syncing 🔄
            </span>
          </div>

          {timetable.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No active timetable found. Generate your plan in the AI Study Planner tab first!
            </div>
          ) : (
            <div className="space-y-3">
              {/* 1. What to study now */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md space-y-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-indigo-200 flex items-center gap-1">
                  🎯 What to Study Right Now
                </span>
                {currentSlot ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-black">{currentSlot.subject}</h4>
                      <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                        {currentSlot.timeSlot}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-100 font-medium">{currentSlot.topic}</p>
                    <p className="text-[11px] text-indigo-200 italic mt-1">"{currentSlot.focusNote}"</p>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-emerald-200">All study tasks completed for today! 🎉</p>
                )}
              </div>

              {/* 2. Next Subject */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">⏭️ Next Up</span>
                    <p className="text-sm font-extrabold text-slate-900">
                      {nextSlot ? `${nextSlot.subject} (${nextSlot.topic})` : 'End of daily schedule'}
                    </p>
                  </div>
                </div>
                {nextSlot && <span className="text-xs font-mono font-bold text-slate-500">{nextSlot.timeSlot}</span>}
              </div>

              {/* 3. Break Time */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">☕ Break Time</span>
                    <p className="text-sm font-extrabold text-emerald-950">
                      {breakSlot ? breakSlot.topic : '15-min hydration break after session'}
                    </p>
                  </div>
                </div>
                {breakSlot && <span className="text-xs font-mono font-bold text-emerald-700">{breakSlot.timeSlot}</span>}
              </div>

              {/* 4. Revision Tasks */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase">📝 Revision Tasks</span>
                    <p className="text-sm font-extrabold text-amber-950">
                      {revisionSlots.length > 0
                        ? revisionSlots.map((r) => r.subject).join(', ')
                        : 'Active recall flashcards before sleep'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-700">Scheduled</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
