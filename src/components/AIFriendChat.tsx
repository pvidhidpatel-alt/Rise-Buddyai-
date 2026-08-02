import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Sparkles,
  Lock,
  Crown,
  Brain,
  RefreshCw,
  Heart,
  Smile,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface AIFriendChatProps {
  user: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onToggleMemory: () => void;
  onOpenPrimeModal: () => void;
  isLoading: boolean;
}

export const AIFriendChat: React.FC<AIFriendChatProps> = ({
  user,
  messages,
  onSendMessage,
  onToggleMemory,
  onOpenPrimeModal,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isPrime = user.plan === 'prime';
  const remainingChats = user.remainingFreeChats;
  const isLocked = !isPrime && remainingChats <= 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    if (isLocked) {
      onOpenPrimeModal();
      return;
    }

    const textToSend = inputText;
    setInputText('');
    onSendMessage(textToSend);
  };

  const reflectionChips = [
    '🌱 Help me reflect on my day today',
    '😰 I feeling anxious about my upcoming exam',
    '🎯 How should I structure my study goals?',
    '🎉 Celebrated a win today! Want to share',
    '💪 Need some encouragement right now',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] max-w-5xl mx-auto p-2 sm:p-4">
      {/* Top AI Companion Card Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black italic shadow-lg shadow-indigo-200">
                R
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-indigo-950">RiseBuddy AI Friend</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                  Always Here 💙
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Human-like, non-judgmental companion for study & personal growth
              </p>
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
            {/* Long Term Memory Toggle */}
            <button
              onClick={onToggleMemory}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                user.memoryEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800'
              }`}
              title="When enabled, RiseBuddy remembers past context"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Memory: {user.memoryEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Chat Counter Badge */}
            {!isPrime ? (
              <button
                onClick={onOpenPrimeModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-900 border border-indigo-800 text-white text-xs font-black shadow-sm hover:bg-indigo-950 transition-colors"
              >
                <span>Free Chats:</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-white font-black">
                  {remainingChats}/5 per day
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>Unlimited 👑</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-xs flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-slate-400 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs p-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-200" />
              <span className="text-slate-500">RiseBuddy is reflecting...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Reflection Starter Chips */}
        {messages.length < 3 && (
          <div className="pt-4 border-t border-slate-200/60">
            <p className="text-xs font-bold text-slate-500 mb-2">Suggested reflections for today:</p>
            <div className="flex flex-wrap gap-2">
              {reflectionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (isLocked) {
                      onOpenPrimeModal();
                    } else {
                      onSendMessage(chip);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs text-slate-700 font-medium transition-all shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lock Notice Banner if 0/5 remaining */}
      {isLocked && (
        <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-200 shrink-0" />
            <p className="text-xs font-extrabold">
              You've used all 5 free AI chats. Upgrade to Prime to continue unlimited conversations!
            </p>
          </div>
          <button
            onClick={onOpenPrimeModal}
            className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs rounded-xl shrink-0 transition-transform active:scale-95 flex items-center gap-1"
          >
            <Crown className="w-3.5 h-3.5 fill-amber-300" />
            <span>Unlock Prime</span>
          </button>
        </div>
      )}

      {/* Input Field Form */}
      <form onSubmit={handleSubmit} className="mt-3 relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLocked || isLoading}
          placeholder={
            isLocked
              ? '🔒 Free chats completed (0/5). Click Upgrade to unlock unlimited AI chats!'
              : 'Message RiseBuddy... (e.g. "I scored 80% on my mock test!")'
          }
          className={`w-full pl-4 pr-12 py-3.5 rounded-2xl border text-sm font-medium transition-all shadow-xs ${
            isLocked
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
          }`}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLocked || isLoading}
          className={`absolute right-2 top-2 p-2 rounded-xl transition-all ${
            inputText.trim() && !isLocked && !isLoading
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
