import type { LucideIcon } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

export interface Subject {
  slug: string;
  name: string;
  shortName: string;
  lessons: string;
  progress: number;
  icon: LucideIcon;
  accent: string;
  tint: string;
  description: string;
  tracks: string[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  subjectSlug: string;
  subject: string;
  level: string;
  instructor: string;
  rating: string;
  progress: number;
  lessons: number;
  duration: string;
  image: string;
  avatar: string;
  description: string;
  outcomes: string[];
  accent: string;
  tint: string;
  icon: LucideIcon;
}

export interface Stat {
  value: string;
  label: string;
}

export interface JourneyStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Badge {
  label: string;
  icon: LucideIcon;
  accent: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  level: string;
  xp: string;
  streak: number;
  image: string;
  highlight?: boolean;
  current?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  rating: number;
  quote: string;
  image: string;
}

export interface QuizQuestion {
  topic: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export interface LearningPath {
  title: string;
  description: string;
  icon: LucideIcon;
  courses: number;
  accent: string;
}

export interface CommunityPost {
  title: string;
  author: string;
  replies: number;
  tag: string;
}

export interface SearchBoost {
  title: string;
  icon: LucideIcon;
  to: string;
}

export interface NavItem {
  label: string;
  to: string;
}

export interface Toast {
  id: string;
  message: string;
}

export interface AuthContextValue {
  user: NonNullable<Session>["user"] | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signUpWithEmail: (creds: {
    name: string;
    email: string;
    password: string;
    grade: string;
    school: string;
    learningGoal: string;
  }) => Promise<{ error: Error | null; data?: { session: Session | null } }>;
  signInWithEmail: (creds: { email: string; password: string }) => Promise<{ error: Error | null; data?: { session: Session | null } }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

export interface SearchItem {
  title: string;
  eyebrow: string;
  Icon: LucideIcon;
  accent: string;
  to: string;
}
