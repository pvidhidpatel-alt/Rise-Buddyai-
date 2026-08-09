import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  RefreshCw,
  Heart,
  Smile,
  ShieldCheck,
  Trophy,
  Coffee,
  CheckSquare,
  MessageSquare,
  Volume2,
  Send,
  Bot,
} from 'lucide-react';
import { AchievementBadge, ChatMessage, DailyHabit, UserProfile } from '../types';

interface AIMotivationCoachProps {
  user: UserProfile;
  badges: AchievementBadge[];
  habits: DailyHabit[];
  onToggleHabit: (id: string) => void;
  onFetchMotivation: (type: 'daily' | 'pre-session' | 'bounce-back') => Promise<void>;
  currentQuote: { quote: string; actionTip: string };
  isLoading: boolean;
}

export const AIMotivationCoach: React.FC<AIMotivationCoachProps> = ({
  user,
  badges,
  habits,
  onToggleHabit,
  onFetchMotivation,
  currentQuote,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'pre-session' | 'bounce-back'>('daily');

  // Interactive Motivation Chatbot State
  const [motivationMessages, setMotivationMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init-1',
      sender: 'ai',
      text: `Hey ${user.name.split(' ')[0] || 'champ'}! 🏆 I'm your RiseBuddy AI Motivation Coach. What's holding you back or on your mind today? Tell me, and let's turn it into momentum!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  const handleTabChange = (type: 'daily' | 'pre-session' | 'bounce-back') => {
    setActiveTab(type);
    onFetchMotivation(type);
  };

  const handleSendMotivationChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatSending) return;

    const userText = chatInput.trim();
    setChatInput('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...motivationMessages, userMsg];
    setMotivationMessages(updated);
    setIsChatSending(true);

    try {
      const res = await fetch('/api/motivation/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated,
          userProfile: user,
        }),
      });

      const data = await res.json();
      const aiReplyText = data.reply || `💪 I hear you! Tackling "${userText}" starts with a single 5-minute pomodoro sprint. Focus on one small step right now, you've got this!`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMotivationMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Motivation chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `💪 I hear you! Tackling "${userText}" starts with a single 5-minute pomodoro sprint. Focus on one small step right now, you've got this!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMotivationMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-indigo-500 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 text-indigo-100 text-xs font-black rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                Motivation Coach
              </span>
              <span className="bg-indigo-900/60 text-indigo-100 font-bold text-xs px-3 py-1 rounded-full border border-indigo-400/30">
                ⚡ {user.xp} XP Earned
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Stay Consistent & Confident</h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1">
              Personalized daily pep talks, setback bounce-backs, and streak rewards.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-indigo-900/70 rounded-2xl border border-indigo-400/30 shrink-0">
            <p className="text-4xl">🏆</p>
            <div>
              <p className="text-3xl font-black leading-none">{user.streakDays}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quote & Pep Talk Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80 space-y-6">
        {/* Selector Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => handleTabChange('daily')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌞 Daily Motivation
          </button>
          <button
            onClick={() => handleTabChange('pre-session')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'pre-session' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📚 Study Session Booster
          </button>
          <button
            onClick={() => handleTabChange('bounce-back')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'bounce-back' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💪 Setback Bounce-Back
          </button>
        </div>

        {/* Dynamic AI Quote Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-indigo-50/50 to-amber-50/80 border border-amber-200/60 relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              AI Coach Real-time Guidance
            </span>
            <button
              onClick={() => onFetchMotivation(activeTab)}
              disabled={isLoading}
              className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-white transition-colors"
              title="Generate new motivation"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <p className="text-lg sm:text-xl font-extrabold text-slate-800 leading-relaxed italic">
            "{currentQuote.quote}"
          </p>

          <div className="pt-3 border-t border-amber-200/60 flex items-start gap-2 text-xs font-bold text-indigo-900">
            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Action Tip: {currentQuote.actionTip}</span>
          </div>
        </div>
      </div>

      {/* Interactive Motivation Chatbot Section */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Chat with Motivation Coach</h3>
              <p className="text-xs text-slate-500">Ask for quick pep talks, study advice, or overcome burnout</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-full uppercase tracking-wider">
            Live Coach Chat
          </span>
        </div>

        {/* Chat History Messages */}
        <div className="bg-slate-50 rounded-2xl p-4 max-h-72 overflow-y-auto space-y-3 border border-slate-200/70">
          {motivationMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[9px] block mt-1 text-right ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isChatSending && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                Coach is typing your pep talk...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMotivationChat} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="e.g., I'm feeling distracted, how do I focus for 1 hour?"
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isChatSending}
            className="px-5 py-2.5 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Ask Coach</span>
          </button>
        </form>
      </div>

      {/* Grid: Daily Habits Check-in & Achievement Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Positive Habits */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              Daily Consistency Habits (+50 XP)
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {habits.filter((h) => h.completed).length}/{habits.length} Done
            </span>
          </div>

          <div className="space-y-2.5">
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => onToggleHabit(habit.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  habit.completed
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      habit.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {habit.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-bold ${habit.completed ? 'line-through text-slate-500' : ''}`}>
                    {habit.title}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{habit.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Badges & Milestones */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Unlocked Badges & Milestones
            </h3>
            <span className="text-xs font-bold text-amber-600">🏆 {badges.filter((b) => b.unlocked).length} Badges</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-amber-50 to-indigo-50 border-amber-300/80 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 opacity-60 grayscale'
                }`}
              >
                <span className="text-3xl block">{badge.icon}</span>
                <p className="text-xs font-black text-slate-900">{badge.title}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{badge.description}</p>
                {badge.unlocked && (
                  <span className="inline-block px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] rounded-full">
                    Unlocked ✅
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

