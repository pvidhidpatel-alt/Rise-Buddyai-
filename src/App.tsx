import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { PrimeModal } from './components/PrimeModal';
import { AIFriendChat } from './components/AIFriendChat';
import { AIStudyPlanner } from './components/AIStudyPlanner';
import { AIMotivationCoach } from './components/AIMotivationCoach';
import { QRCodeAccessView } from './components/QRCodeAccessView';
import { ProfilePrimeView } from './components/ProfilePrimeView';
import { RenewalBanner } from './components/RenewalBanner';
import {
  AchievementBadge,
  ChatMessage,
  DailyHabit,
  ExamDetails,
  TabType,
  TimetableSlot,
  UserProfile,
} from './types';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('ai-friend');

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPrimeModalOpen, setIsPrimeModalOpen] = useState(false);

  // User Profile State
  const [user, setUser] = useState<UserProfile>({
    id: 'p.vidhidpatel@gmail.com',
    name: 'Vidhi Patel',
    email: 'p.vidhidpatel@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    plan: 'free',
    remainingFreeChats: 5,
    primeExpiryDaysRemaining: 3, // Shows renewal alert when prime
    memoryEnabled: true,
    xp: 450,
    streakDays: 5,
    examDetails: {
      examName: 'Final Board Exams 2026',
      examDate: '2026-08-20',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
      weakSubjects: ['Physics', 'Mathematics'],
      boringSubjects: ['Chemistry'],
      preferredTimeslot: 'Morning',
    },
  });

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: "Hey Vidhi! 🌟 I'm RiseBuddy, your AI Friend, Study Planner & Motivation Coach. How are you feeling about your studies today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Timetable State
  const [timetable, setTimetable] = useState<TimetableSlot[]>([
    {
      id: 'slot-1',
      timeSlot: '08:00 AM - 09:30 AM',
      type: 'study',
      subject: 'Physics',
      topic: 'Electromagnetism & Formula Review',
      priority: 'HIGH',
      focusNote: 'Fresh morning energy! Focus on weak concepts first.',
      isCompleted: true,
    },
    {
      id: 'slot-2',
      timeSlot: '09:30 AM - 09:45 AM',
      type: 'break',
      subject: 'Break',
      topic: 'Hydrate, stretch & step away from screen',
      priority: 'LOW',
      focusNote: '15 min active recovery',
      isCompleted: true,
    },
    {
      id: 'slot-3',
      timeSlot: '09:45 AM - 10:30 AM',
      type: 'study',
      subject: 'Chemistry',
      topic: 'Organic Reaction Mechanisms',
      priority: 'MEDIUM',
      focusNote: 'Shorter 45m session for boring/difficult topic',
      isCompleted: false,
    },
    {
      id: 'slot-4',
      timeSlot: '11:00 AM - 12:00 PM',
      type: 'revision',
      subject: 'Mathematics',
      topic: 'Integration Past Exam Questions',
      priority: 'HIGH',
      focusNote: 'Active recall & problem solving',
      isCompleted: false,
    },
  ]);
  const [isPlannerLoading, setIsPlannerLoading] = useState(false);

  // Motivation State
  const [currentQuote, setCurrentQuote] = useState({
    quote: "Success isn't about being the best; it's about being better than you were yesterday.",
    actionTip: 'Take 3 deep breaths and start with 15 minutes of uninterrupted focus.',
  });
  const [isMotivationLoading, setIsMotivationLoading] = useState(false);

  // Habits & Badges State
  const [habits, setHabits] = useState<DailyHabit[]>([
    { id: 'h1', title: 'Complete 1 High-Priority Weak Subject Session', category: 'Study', completed: true },
    { id: 'h2', title: 'Take 15-min Active Hydration Break', category: 'Health', completed: true },
    { id: 'h3', title: 'Night Active Recall Revision (20 min)', category: 'Revision', completed: false },
    { id: 'h4', title: 'Reflect on Progress with RiseBuddy AI', category: 'Mindset', completed: false },
  ]);

  const [badges, setBadges] = useState<AchievementBadge[]>([
    { id: 'b1', title: '5-Day Streak', description: 'Maintained 5 consecutive study days', icon: '🔥', unlocked: true },
    { id: 'b2', title: 'Exam Crusher', description: 'Completed 10 weak subject modules', icon: '🎯', unlocked: true },
    { id: 'b3', title: 'Consistency King', description: 'Finished all daily habits 3 days in a row', icon: '👑', unlocked: false },
    { id: 'b4', title: 'Early Bird', description: 'Started morning study slot before 8:30 AM', icon: '🌅', unlocked: true },
  ]);

  // ---------------- HANDLERS ----------------

  // 1. AI Friend Chat Handler with Free Limit Counter
  const handleSendMessage = async (text: string) => {
    // Check limit
    if (user.plan === 'free' && user.remainingFreeChats <= 0) {
      setIsPrimeModalOpen(true);
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    // Decrement free chats counter
    const nextRemaining = user.plan === 'free' ? Math.max(0, user.remainingFreeChats - 1) : 99;
    setUser((prev) => ({
      ...prev,
      remainingFreeChats: nextRemaining,
      xp: prev.xp + 10,
    }));

    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          userProfile: user,
          memoryEnabled: user.memoryEnabled,
        }),
      });

      const data = await res.json();
      const aiReplyText = data.reply || "I'm right here with you! Tell me more about what's on your mind.";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Pop upgrade modal automatically when user hits 0 remaining
      if (user.plan === 'free' && nextRemaining === 0) {
        setTimeout(() => setIsPrimeModalOpen(true), 800);
      }
    } catch (err) {
      console.error('Chat API Error:', err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm always here to support you! Let's keep working together towards your goals.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 2. Generate Personalised AI Study Plan
  const handleGeneratePlan = async (details: ExamDetails) => {
    setIsPlannerLoading(true);
    setUser((prev) => ({ ...prev, examDetails: details }));

    try {
      const res = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });

      const data = await res.json();
      if (data.schedule && Array.isArray(data.schedule)) {
        const mappedSchedule: TimetableSlot[] = data.schedule.map((item: any, idx: number) => ({
          id: `gen-${idx}-${Date.now()}`,
          timeSlot: item.timeSlot,
          type: item.type || 'study',
          subject: item.subject,
          topic: item.topic,
          priority: item.priority || 'MEDIUM',
          focusNote: item.focusNote || 'Study block',
          isCompleted: false,
        }));
        setTimetable(mappedSchedule);
      }
    } catch (err) {
      console.error('Planner API error:', err);
    } finally {
      setIsPlannerLoading(false);
    }
  };

  // 3. Toggle Slot Completed
  const handleToggleSlotComplete = (id: string) => {
    setTimetable((prev) =>
      prev.map((slot) => {
        if (slot.id === id) {
          const nextState = !slot.isCompleted;
          if (nextState) {
            setUser((u) => ({ ...u, xp: u.xp + 25 }));
          }
          return { ...slot, isCompleted: nextState };
        }
        return slot;
      })
    );
  };

  // 4. Re-balance Schedule if Missed
  const handleRebalanceSchedule = () => {
    if (timetable.length === 0) return;
    const rebalanced = timetable.map((slot) => {
      if (!slot.isCompleted) {
        return {
          ...slot,
          focusNote: `🔄 Re-adjusted focus note: Bit-sized 25m focus to comfortably catch up without stress!`,
        };
      }
      return slot;
    });
    setTimetable(rebalanced);
  };

  // 5. Fetch Motivation Quote
  const handleFetchMotivation = async (type: 'daily' | 'pre-session' | 'bounce-back') => {
    setIsMotivationLoading(true);
    try {
      const res = await fetch('/api/motivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          userContext: user.examDetails,
          streakDays: user.streakDays,
        }),
      });
      const data = await res.json();
      if (data.quote) {
        setCurrentQuote({ quote: data.quote, actionTip: data.actionTip || 'Take a 5-minute breather.' });
      }
    } catch (err) {
      console.error('Motivation API error:', err);
    } finally {
      setIsMotivationLoading(false);
    }
  };

  // 6. Toggle Habit
  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextComp = !h.completed;
          if (nextComp) {
            setUser((u) => ({ ...u, xp: u.xp + 50 }));
          }
          return { ...h, completed: nextComp };
        }
        return h;
      })
    );
  };

  // 7. Toggle Memory
  const handleToggleMemory = () => {
    setUser((prev) => ({ ...prev, memoryEnabled: !prev.memoryEnabled }));
  };

  // 8. Select Account from Google Auth Modal
  const handleSelectAccount = (accountData: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...accountData,
    }));
  };

  // 9. Prime Upgrade Success
  const handleUpgradeSuccess = () => {
    setUser((prev) => ({
      ...prev,
      plan: 'prime',
      remainingFreeChats: 99999,
      primeExpiryDaysRemaining: 30,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPrimeModal={() => setIsPrimeModalOpen(true)}
        onLogout={() =>
          setUser((prev) => ({
            ...prev,
            id: '',
            name: 'Guest User',
            email: '',
          }))
        }
      />

      {/* Subscription Renewal Reminder Banner */}
      {user.plan === 'prime' && user.primeExpiryDaysRemaining && (
        <RenewalBanner
          daysRemaining={user.primeExpiryDaysRemaining}
          onRenewClick={() => setIsPrimeModalOpen(true)}
        />
      )}

      {/* Main Active Tab Content */}
      <main className="flex-1 pb-16 md:pb-6">
        {activeTab === 'ai-friend' && (
          <AIFriendChat
            user={user}
            messages={messages}
            onSendMessage={handleSendMessage}
            onToggleMemory={handleToggleMemory}
            onOpenPrimeModal={() => setIsPrimeModalOpen(true)}
            isLoading={isChatLoading}
          />
        )}

        {activeTab === 'study-planner' && (
          <AIStudyPlanner
            user={user}
            timetable={timetable}
            onGeneratePlan={handleGeneratePlan}
            onToggleSlotComplete={handleToggleSlotComplete}
            onRebalanceSchedule={handleRebalanceSchedule}
            onOpenQRTab={() => setActiveTab('qr-access')}
            isLoading={isPlannerLoading}
          />
        )}

        {activeTab === 'motivation-coach' && (
          <AIMotivationCoach
            user={user}
            badges={badges}
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onFetchMotivation={handleFetchMotivation}
            currentQuote={currentQuote}
            isLoading={isMotivationLoading}
          />
        )}

        {activeTab === 'qr-access' && (
          <QRCodeAccessView
            user={user}
            timetable={timetable}
            onOpenPlanner={() => setActiveTab('study-planner')}
          />
        )}

        {activeTab === 'profile-prime' && (
          <ProfilePrimeView
            user={user}
            onOpenPrimeModal={() => setIsPrimeModalOpen(true)}
            onToggleMemory={handleToggleMemory}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={() =>
              setUser((prev) => ({
                ...prev,
                id: '',
                name: 'Guest User',
                email: '',
              }))
            }
            onRenewPrime={() => setIsPrimeModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectAccount={handleSelectAccount}
      />

      <PrimeModal
        isOpen={isPrimeModalOpen}
        onClose={() => setIsPrimeModalOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        isChatLimitReached={user.plan === 'free' && user.remainingFreeChats <= 0}
      />
    </div>
  );
}
