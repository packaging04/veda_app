import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName }
          }
        });
        if (signUpError) throw signUpError;
        
        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName
          });
        }
        setMessage('Account created! Please check your email to verify.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1a2332]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#1a2332]/40 hover:text-[#1a2332]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 48 48" className="text-[#d4af37]">
              <path d="M8 12 L24 38 L40 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ml-2 text-xl font-serif tracking-wider text-[#1a2332]">VEDA</span>
          </div>
          <h3 className="text-2xl font-serif text-[#1a2332]">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h3>
          <p className="text-[#1a2332]/60 text-sm mt-2">
            {mode === 'login' ? 'Sign in to manage your legacy journey' : 'Start preserving your family\'s wisdom'}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1a2332] mb-1">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                  className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a2332] mb-1">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                  className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37]" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#1a2332] mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2332] mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37]" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-semibold rounded-sm hover:from-[#e5c55a] hover:to-[#d4af37] transition-all disabled:opacity-50">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#1a2332]/60 mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}
            className="text-[#d4af37] font-medium hover:underline">
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
