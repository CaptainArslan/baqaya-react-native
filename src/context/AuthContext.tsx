/**
 * AuthContext — thin React Context wrapper over authStore.
 *
 * Exposes a simple surface:
 *   isAuthenticated  boolean — true once a token exists
 *   isLoading        boolean — true until bootstrap resolves
 *   login()          generate mock token + persist
 *   logout()         clear token + reset state
 *   bootstrap()      read stored token on app start
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { i18nStore } from '@/src/i18n';
import { authStore, type AuthStatus } from '@/src/store/authStore';

interface AuthContextValue {
  isAuthenticated: boolean;
  isOnboarding: boolean;
  isLoading: boolean;
  login: (isNewUser?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(authStore.getStatus());

  useEffect(() => {
    setStatus(authStore.getStatus());
    const unsub = authStore.subscribe(() => setStatus(authStore.getStatus()));

    void (async () => {
      await Promise.all([authStore.bootstrap(), i18nStore.bootstrap()]);
    })();

    return unsub;
  }, []);

  const value: AuthContextValue = {
    // Both onboarding and authenticated states mean a token exists
    isAuthenticated: status === 'authenticated' || status === 'onboarding',
    isOnboarding: status === 'onboarding',
    isLoading: status === 'loading',
    login: (isNewUser = true) => authStore.login(isNewUser),
    logout: () => authStore.logout(),
    bootstrap: () =>
      Promise.all([authStore.bootstrap(), i18nStore.bootstrap()]).then(() => undefined),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
