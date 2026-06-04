'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthSession, Role } from '@/types/peoplecore';

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; locked?: boolean; remainingAttempts?: number }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.session) {
          setSession(data.session);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
      }
      return data;
    },
    []
  );

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession(null);
  }, []);

  const refreshSession = useCallback(async () => {
    await fetch('/api/auth/session', { method: 'PUT' });
  }, []);

  // Refresh activity on user interaction
  useEffect(() => {
    if (!session) return;
    const handler = () => refreshSession();
    const events = ['click', 'keydown', 'scroll'];
    // Throttle: only refresh every 5 minutes
    let lastRefresh = Date.now();
    const throttledHandler = () => {
      if (Date.now() - lastRefresh > 5 * 60 * 1000) {
        lastRefresh = Date.now();
        handler();
      }
    };
    events.forEach((e) => window.addEventListener(e, throttledHandler, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, throttledHandler));
  }, [session, refreshSession]);

  return (
    <AuthContext.Provider value={{ session, loading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useRole(): Role | null {
  const { session } = useAuth();
  return session?.role ?? null;
}

export function useEmployee() {
  const { session } = useAuth();
  return { employeeId: session?.employeeId ?? null, email: session?.email ?? null };
}
