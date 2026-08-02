import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  BookOpen,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Plus,
  X,
  QrCode,
  TrendingUp,
  Brain,
  Coffee,
  CheckSquare,
  Award,
} from 'lucide-react';
import { ExamDetails, TimetableSlot, UserProfile } from '../types';

interface AIStudyPlannerProps {
  user: UserProfile;
  timetable: TimetableSlot[];
  onGeneratePlan: (details: ExamDetails) => Promise<void>;
  onToggleSlotComplete: (id: string) => void;
  onRebalanceSchedule: () => void;
  onOpenQRTab: () => void;
  isLoading: boolean;
}

export const AIStudyPlanner: React.FC<AIStudyPlannerProps> = ({
  user,
  timetable,
  onGeneratePlan,
  onToggleSlotComplete,
  onRebalanceSchedule,
  onOpenQRTab,
  isLoading,
}) => {
  const [showWizard, setShowWizard] = useState(timetable.length === 0);

  // Form State
  const [examName, setExamName] = useState(user.examDetails?.examName || 'Upcoming Exams 2026');
  const [examDate, setExamDate] = useState(user.examDetails?.examDate || '2026-08-20');
  const [subjectInput, setSubjectInput] = useState('');
  const [subjects, setSubjects] = useState<string[]>(
    user.examDetails?.subjects || []
  );
  const [weakSubjects, setWeakSubjects] = useState<string[]>(
    user.examDetails?.weakSubjects || []
  );
  const [boringSubjects, setBoringSubjects] = useState<string[]>(
    user.examDetails?.boringSubjects || []
  );
  const [preferredTimeslot, setPreferredTimeslot] = useState<'Morning' | 'Afternoon' | 'Night'>(
    user.examDetails?.preferredTimeslot || 'Morning'
  );

  const handleAddSubject = (subjectName?: string) => {
    const nameToAdd = (subjectName || subjectInput).trim();
    if (nameToAdd && !subjects.includes(nameToAdd)) {
      setSubjects([...subjects, nameToAdd]);
      setSubjectInput('');
    }
  };

  const handleSubjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubject();
    }
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter((s) => s !== sub));
    setWeakSubjects(weakSubjects.filter((s) => s !== sub));
    setBoringSubjects(boringSubjects.filter((s) => s !== sub));
  };

  const handleClearAllSubjects = () => {
    setSubjects([]);
    setWeakSubjects([]);
    setBoringSubjects([]);
  };

  const toggleWeak = (sub: string) => {
    if (weakSubjects.includes(sub)) {
      setWeakSubjects(weakSubjects.filter((s) => s !== sub));
    } else {
      setWeakSubjects([...weakSubjects, sub]);
    }
  };

  const toggleBoring = (sub: string) => {
    if (boringSubjects.includes(sub)) {
      setBoringSubjects(boringSubjects.filter((s) => s !== sub));
    } else {
      setBoringSubjects([...boringSubjects, sub]);
    }
  };

  const handleSubmitWizard = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjects.length === 0) return;

    onGeneratePlan({
      examName,
      examDate,
      subjects,
      weakSubjects,
      boringSubjects,
      preferredTimeslot,
    });
    setShowWizard(false);
  };

  // Calculate stats
  const completedSlots = timetable.filter((t) => t.isCompleted).length;
  const totalSlots = timetable.length;
  const progressPercent = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  // Calculate days until exam
  const calculateDaysLeft = () => {
    if (!examDate) return 30;
    const today = new Date();
    const target = new Date(examDate);
    const diffTime = target.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const daysLeft = calculateDaysLeft();

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Banner in Bold Typography style */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-black text-xs rounded-full border border-indigo-100 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              Smart Study Planner
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-indigo-950">
            Rise & Shine, {user.name.split(' ')[0] || 'Student'}.
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            Target Exam: <span className="text-indigo-600 font-black">{examName}</span> • Focus Area: <span className="text-indigo-600 font-black">{weakSubjects[0] || 'Core Revision'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="bg-orange-100 px-5 py-2.5 rounded-2xl border border-orange-200 text-center">
            <p className="text-[10px] font-black uppercase tracking-tighter text-orange-600">Exam Countdown</p>
            <p className="text-2xl font-black text-orange-700">{daysLeft} Days</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWizard(!showWizard)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs border border-slate-200 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">{showWizard ? 'Current Plan' : 'Preferences'}</span>
            </button>

            <button
              onClick={onOpenQRTab}
              className="p-2.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code</span>
            </button>
          </div>
        </div>
      </header>

      {/* Personalisation Wizard Form Modal/Drawer */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-100 space-y-6"
          >
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                🧠 Personalisation Flow (Smart Inputs)
              </h3>
              <p className="text-xs text-slate-500">
                Tell RiseBuddy about your upcoming exams, weak topics & difficult subjects.
              </p>
            </div>

            <form onSubmit={handleSubmitWizard} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Exam Name & Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    📆 1. Exam Name & Target Date
                  </label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g. CBSE 12th Finals, JEE, NEET, SAT"
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold mb-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>

                {/* Focus Timeslot */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    ⏰ 2. Best Time Slot For Peak Focus
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Morning', 'Afternoon', 'Night'] as const).map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setPreferredTimeslot(slot)}
                        className={`p-3 rounded-xl border text-xs font-extrabold transition-all ${
                          preferredTimeslot === slot
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {slot === 'Morning' ? '🌅 Morning' : slot === 'Afternoon' ? '☀️ Afternoon' : '🌙 Night'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    RiseBuddy schedules your hardest/weak subjects during your peak energy hours.
                  </p>
                </div>
              </div>

              {/* Custom Subject Entry & Difficulty Assessment */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                      📚 3. Type Your Subjects & Rate Difficulty
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Type each subject you are studying, then classify if it's Easy, Difficult, or Boring.
                    </p>
                  </div>
                  {subjects.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllSubjects}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 underline shrink-0"
                    >
                      Clear All Subjects
                    </button>
                  )}
                </div>

                {/* Input Bar */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyDown={handleSubjectKeyDown}
                    placeholder="Type subject name (e.g. Accountancy, History, Physics, Macroeconomics)..."
                    className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSubject()}
                    disabled={!subjectInput.trim()}
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Subject</span>
                  </button>
                </div>

                {/* Quick Add Suggestions (if few subjects) */}
                {subjects.length < 5 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Suggestions (Tap to add):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Accountancy', 'Economics', 'History', 'Computer Science', 'English Literature'].map((sub) => {
                        if (subjects.includes(sub)) return null;
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => handleAddSubject(sub)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-xs font-semibold border border-slate-200/80 transition-all"
                          >
                            + {sub}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* List of Typed Subjects with Assessment Cards */}
                {subjects.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-indigo-50/50 border border-dashed border-indigo-200 text-center space-y-1">
                    <p className="text-sm font-bold text-indigo-950">No subjects added yet</p>
                    <p className="text-xs text-indigo-700/80">
                      Type your subjects in the box above to build your custom exam study schedule.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>Your Added Subjects ({subjects.length})</span>
                      <div className="flex gap-3">
                        <span className="text-rose-600 font-extrabold">🔴 Difficult: {weakSubjects.length}</span>
                        <span className="text-purple-600 font-extrabold">😴 Boring: {boringSubjects.length}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {subjects.map((sub) => {
                        const isWeak = weakSubjects.includes(sub);
                        const isBoring = boringSubjects.includes(sub);

                        return (
                          <div
                            key={sub}
                            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                              isWeak
                                ? 'bg-amber-50/70 border-amber-200'
                                : 'bg-slate-50/70 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                              <span className="text-sm font-black text-slate-900">{sub}</span>
                            </div>

                            {/* Classification Toggles */}
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                              {/* Difficulty Toggle */}
                              <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 text-xs">
                                <button
                                  type="button"
                                  onClick={() => isWeak && toggleWeak(sub)}
                                  className={`px-2.5 py-1 rounded-lg font-extrabold transition-all ${
                                    !isWeak ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  🟢 Easy
                                </button>
                                <button
                                  type="button"
                                  onClick={() => !isWeak && toggleWeak(sub)}
                                  className={`px-2.5 py-1 rounded-lg font-extrabold transition-all ${
                                    isWeak ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  🔴 Difficult / Weak
                                </button>
                              </div>

                              {/* Engagement / Feelings Toggle */}
                              <button
                                type="button"
                                onClick={() => toggleBoring(sub)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                                  isBoring
                                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                                }`}
                              >
                                {isBoring ? '😴 Boring / Tedious' : '⚡ Engaging'}
                              </button>

                              {/* Delete Subject Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveSubject(sub)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-auto sm:ml-0"
                                title="Remove subject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || subjects.length === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-indigo-600/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span>Generate AI Personalised Timetable</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress & Quick Stats Bar */}
      {timetable.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Today's Progress</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">{progressPercent}%</span>
                <span className="text-xs text-slate-400">
                  ({completedSlots}/{totalSlots} tasks done)
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Weak Subject Focus</p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {weakSubjects.length > 0 ? weakSubjects.join(', ') : 'None selected'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
            <button
              onClick={onRebalanceSchedule}
              className="w-full p-2 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-xl transition-all border border-indigo-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Missed a Session? Re-adjust Timetable</span>
            </button>
          </div>
        </div>
      )}

      {/* Timetable List Section */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Today's Smart Study Schedule
          </h3>
          <span className="text-xs font-semibold text-slate-500">Auto-balanced by RiseBuddy AI</span>
        </div>

        {timetable.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No active study plan created yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the button below to answer 5 quick questions and generate your personalized timetable.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700"
            >
              Start Personalisation Flow
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {timetable.map((slot) => {
              const isStudy = slot.type === 'study';
              const isBreak = slot.type === 'break';
              const isRevision = slot.type === 'revision';

              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    slot.isCompleted
                      ? 'bg-slate-50/80 border-slate-200/80 opacity-70'
                      : isStudy
                      ? 'bg-white border-indigo-200 shadow-xs hover:border-indigo-400'
                      : isBreak
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => onToggleSlotComplete(slot.id)}
                      className={`mt-0.5 p-1 rounded-lg border transition-all ${
                        slot.isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-white border-slate-300 hover:border-indigo-500 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black font-mono text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                          {slot.timeSlot}
                        </span>

                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isBreak
                              ? 'bg-emerald-100 text-emerald-800'
                              : isRevision
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {slot.type}
                        </span>

                        {slot.priority === 'HIGH' && (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                            🔥 High Priority
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-base font-extrabold mt-1.5 ${
                          slot.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {slot.subject} — <span className="font-semibold text-slate-600">{slot.topic}</span>
                      </h4>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.focusNote}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-xl ${
                        slot.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {slot.isCompleted ? 'Done ✅' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
