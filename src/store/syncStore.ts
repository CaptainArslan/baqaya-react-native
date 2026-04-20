/**
 * Sync store — tracks offline/sync state for SyncBanner.
 * Save-locally-first pattern: data saves immediately, sync happens later.
 * Replace with real queue when backend integration begins.
 */
import { useState, useEffect } from 'react';

export type SyncState = 'synced' | 'pending' | 'syncing' | 'offline' | 'failed';

let _state: SyncState = 'synced';
let _pendingCount = 0;
let _listeners: Array<() => void> = [];

function notify() {
  _listeners.forEach((fn) => fn());
}

export const syncStore = {
  getState(): SyncState { return _state; },
  getPendingCount(): number { return _pendingCount; },

  setPending(count: number) {
    _state = 'pending';
    _pendingCount = count;
    notify();
  },

  setSyncing() {
    _state = 'syncing';
    notify();
  },

  setSynced() {
    _state = 'synced';
    _pendingCount = 0;
    notify();
  },

  setOffline() {
    _state = 'offline';
    notify();
  },

  setFailed() {
    _state = 'failed';
    notify();
  },

  subscribe(fn: () => void) {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter((l) => l !== fn); };
  },
};

export function useSyncState(): { state: SyncState; pendingCount: number } {
  const [state, setState] = useState<SyncState>(_state);
  const [pendingCount, setPendingCount] = useState(_pendingCount);

  useEffect(() => {
    const unsub = syncStore.subscribe(() => {
      setState(syncStore.getState());
      setPendingCount(syncStore.getPendingCount());
    });
    return unsub;
  }, []);

  return { state, pendingCount };
}
