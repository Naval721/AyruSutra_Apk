import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'auth:user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const u: AuthUser = { id: data.user!.id, email: data.user!.email || email };
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
      return;
    }
    const mockUser: AuthUser = { id: crypto.randomUUID(), email };
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signup = async (email: string, password: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      const u: AuthUser = { id: data.user!.id, email: data.user!.email || email };
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
      return;
    }
    const mockUser: AuthUser = { id: crypto.randomUUID(), email };
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading…</div>;
  if (!user) {
    window.location.href = '/auth';
    return null;
  }
  return <>{children}</>;
}


