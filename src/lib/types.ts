export type PlanType = "free" | "basic" | "standard" | "premium";

export interface PlanConfig {
  id: PlanType;
  name: string;
  price: number;
  callSessions: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: PlanConfig[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    callSessions: 0,
    description: "Try the experience",
    features: [
      "Hear the AI voice",
      "No wisdom sessions",
      "Generic demo number",
      "No profile storage",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: 19.9,
    callSessions: 5,
    description: "Start your legacy",
    features: [
      "5 wisdom call sessions",
      "Personal call code",
      "Session recordings saved",
      "Basic legacy profile",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 49.9,
    callSessions: 20,
    description: "Build your legacy",
    features: [
      "20 wisdom call sessions",
      "Personal call code",
      "Session recordings saved",
      "Full legacy profile",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 99.9,
    callSessions: 45,
    description: "Complete legacy journey",
    features: [
      "45 wisdom call sessions",
      "Personal call code",
      "Session recordings saved",
      "Full legacy profile",
      "Priority support",
      "AI legacy avatar (coming soon)",
    ],
  },
];

export type UserType =
  | "ceo_executive"
  | "entrepreneur"
  | "professional"
  | "elder_senior"
  | "alzheimers_patient"
  | "retiree"
  | "parent_grandparent"
  | "other";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type?: UserType;
  organization?: string;
  bio?: string;
  legacy_goals?: string;
  plan: PlanType;
  plan_activated_at?: string;
  profile_completed: boolean;
  call_sessions_used: number;
  call_sessions_total: number;
  created_at: string;
}

export interface CallerProfile {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  phone?: string;
  notes?: string;
  created_at: string;
}

export interface ScheduledCall {
  id: string;
  user_id: string;
  caller_profile_id?: string | null; // null = self
  caller_name: string;
  scheduled_date: string;
  time_start: string;
  time_end: string;
  status: "scheduled" | "completed" | "missed" | "cancelled";
  call_code: string;
  call_number: string;
  notes?: string;
  created_at: string;
}

export interface CallRecording {
  id: string;
  user_id: string;
  scheduled_call_id: string;
  caller_name: string;
  call_date: string;
  call_duration_minutes?: number;
  session_number: number;
  status: "saved";
  created_at: string;
}

// Legacy LovedOne type kept for backward compat
export interface LovedOne {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  relationship: string;
  birth_year?: number;
  notes?: string;
  created_at: string;
}
