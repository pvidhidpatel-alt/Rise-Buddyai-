export type TabType = 'ai-friend' | 'study-planner' | 'motivation-coach' | 'qr-access' | 'profile-prime';

export type UserPlan = 'free' | 'prime';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: UserPlan;
  remainingFreeChats: number; // starts at 5, decrements 5,4,3,2,1,0
  primeExpiryDaysRemaining?: number; // e.g. 3, 2, 1 for renewal alert
  memoryEnabled: boolean;
  xp: number;
  streakDays: number;
  examDetails?: ExamDetails;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  mood?: string;
}

export interface ExamDetails {
  examName: string;
  examDate: string; // YYYY-MM-DD
  subjects: string[];
  weakSubjects: string[];
  boringSubjects: string[];
  preferredTimeslot: 'Morning' | 'Afternoon' | 'Night';
}

export interface TimetableSlot {
  id: string;
  timeSlot: string;
  type: 'study' | 'break' | 'revision' | 'practice';
  subject: string;
  topic: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  focusNote: string;
  isCompleted: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  dateUnlocked?: string;
}

export interface DailyHabit {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}
