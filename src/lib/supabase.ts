import { createClient } from '@supabase/supabase-js'
import { LovedOne, Profile, Recording, ScheduledCall } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
  console.error('Make sure you have created .env.local with:');
  console.error('VITE_SUPABASE_URL=your_project_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_anon_key');
  throw new Error('Missing Supabase environment variables. Check console for details.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database helper functions
export const db = {
  // Profile operations
  profiles: {
    get: async (userId: string) => {
      return await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    },
    update: async (userId: string, updates: Partial<Profile>) => {
      return await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
    }
  },

  // Loved ones operations
  lovedOnes: {
    getAll: async (userId: string) => {
      return await supabase
        .from('loved_ones')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    },
    create: async (lovedOne: Omit<LovedOne, 'id' | 'created_at' | 'updated_at'>) => {
      return await supabase
        .from('loved_ones')
        .insert(lovedOne)
        .select()
        .single();
    },
    update: async (id: string, updates: Partial<LovedOne>) => {
      return await supabase
        .from('loved_ones')
        .update(updates)
        .eq('id', id);
    },
    delete: async (id: string) => {
      return await supabase
        .from('loved_ones')
        .delete()
        .eq('id', id);
    }
  },

  // Scheduled calls operations
  scheduledCalls: {
    getAll: async (userId: string) => {
      return await supabase
        .from('scheduled_calls')
        .select('*, loved_ones(name)')
        .eq('user_id', userId)
        .order('scheduled_date', { ascending: true });
    },
    create: async (call: Omit<ScheduledCall, 'id' | 'created_at'>) => {
      return await supabase
        .from('scheduled_calls')
        .insert(call)
        .select()
        .single();
    },
    update: async (id: string, updates: Partial<ScheduledCall>) => {
      return await supabase
        .from('scheduled_calls')
        .update(updates)
        .eq('id', id);
    }
  },

  // Recordings operations
  recordings: {
    getAll: async (userId: string) => {
      return await supabase
        .from('recordings')
        .select('*, loved_ones(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    },
    create: async (recording: Omit<Recording, 'id' | 'created_at'>) => {
      return await supabase
        .from('recordings')
        .insert(recording)
        .select()
        .single();
    }
  }
};
