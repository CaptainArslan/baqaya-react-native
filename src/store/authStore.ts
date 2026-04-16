/**
 * authStore — persisted auth state backed by AsyncStorage.
 *
 * Lifecycle:
 *   bootstrap()  → called once at app start, reads token from storage
 *   login()      → called on OTP success, writes token + isNewUser to storage
 *   logout()     → clears storage, resets to unauthenticated
 *
 * Status flow:
 *   loading → unauthenticated     (no token found)
 *   loading → onboarding          (token exists, isNewUser = true)
 *   loading → authenticated       (token exists, isNewUser = false)
 *   onboarding → authenticated    (create-shop completed)
 *   authenticated → unauthenticated (logout)
 */
import { useState, useEffect } from 'react';
import {
  getToken, setToken, getIsNewUser,
  setIsNewUser, clearAuthData,
} from '../services/storage';

export type AuthStatus = 'loading' | 'unauthenticated' | 'onboarding' | 'authenticated';

// ─── Module-level singleton ──────────────────────────────────

let _status: AuthStatus = 'loading';
let _isNewUser = false;
let _listeners: Array<() => void> = [];

function notify() {
  _listeners.forEach((fn) => fn());
}

// ─── Store ───────────────────────────────────────────────────

export const authStore = {
  getStatus(): AuthStatus { return _status; },
  isNewUser(): boolean { return _isNewUser; },

  /** Called once on app start. Reads token from AsyncStorage. */
  async bootstrap(): Promise<void> {
    try {
      const token = await getToken();
      if (!token) {
        _status = 'unauthenticated';
        _isNewUser = false;
      } else {
        const newUser = await getIsNewUser();
        _isNewUser = newUser;
        _status = newUser ? 'onboarding' : 'authenticated';
      }
    } catch {
      _status = 'unauthenticated';
    }
    notify();
  },

  /** Called on OTP success. Generates mock token, persists state. */
  async login(isNewUser: boolean): Promise<void> {
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await setToken(token);
    await setIsNewUser(isNewUser);
    _isNewUser = isNewUser;
    _status = isNewUser ? 'onboarding' : 'authenticated';
    notify();
  },

  /** Called when user completes create-shop onboarding. */
  async completeOnboarding(): Promise<void> {
    await setIsNewUser(false);
    _isNewUser = false;
    _status = 'authenticated';
    notify();
  },

  /** Called on logout. Clears all auth data. */
  async logout(): Promise<void> {
    await clearAuthData();
    _status = 'unauthenticated';
    _isNewUser = false;
    notify();
  },

  subscribe(fn: () => void) {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter((l) => l !== fn); };
  },
};

// ─── Hook ────────────────────────────────────────────────────

export function useAuthStatus(): { status: AuthStatus; isNewUser: boolean } {
  const [status, setStatus] = useState<AuthStatus>(_status);
  const [isNewUser, setIsNewUser_] = useState(_isNewUser);

  useEffect(() => {
    // Sync with current store state in case bootstrap already ran
    setStatus(authStore.getStatus());
    setIsNewUser_(authStore.isNewUser());

    const unsub = authStore.subscribe(() => {
      setStatus(authStore.getStatus());
      setIsNewUser_(authStore.isNewUser());
    });
    return unsub;
  }, []);

  return { status, isNewUser };
}
