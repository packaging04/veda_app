
export type Profile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  subscription_plan: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
};

// export type LovedOne = {
//   id: string;
//   user_id: string;
//   name: string;
//   relationship: string | null;
//   age: number | null;
//   phone: string | null;
//   notes: string | null;
//   status: string;
//   created_at: string;
//   updated_at: string;
// };

export interface LovedOne {
  id: string;
  user_id: string;
  name: string;
  relationship: string | null;
  age: number | null;
  phone: string | null;
  notes: string | null;
  profile_image_1: string | null;
  profile_image_2: string | null;
  favorite_things: string[];
  personality_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}


export type ScheduledCall = {
  id: string;
  user_id: string;
  loved_one_id: string;
  scheduled_date: string;
  duration_minutes: number | null;
  status: string;
  notes: string | null;
  created_at: string;
};

export type Recording = {
  id: string;
  user_id: string;
  loved_one_id: string;
  title: string;
  description: string | null;
  duration_seconds: number | null;
  file_url: string | null;
  transcript: string | null;
  created_at: string;
};
