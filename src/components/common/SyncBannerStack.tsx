/**
 * SyncBannerStack — drop-in replacement for all manual banner logic in tab screens.
 *
 * Renders the correct combination of banners based on syncStore state:
 *   synced              → nothing
 *   syncing             → syncing strip
 *   pending (online)    → pending strip (+ Sync Now action)
 *   offline, no pending → offline strip
 *   offline + pending   → pending strip + offline strip (stacked, matches design)
 *   failed              → failed strip (+ Retry action)
 *
 * Usage:  <SyncBannerStack onSyncPress={handleSync} />
 */
import React from 'react';
import { syncStore, useSyncState } from '../../store/syncStore';
import { SyncBanner } from './SyncBanner';

interface Props {
  /** Called when user taps "Sync Now" or "Retry". Wire to your sync trigger. */
  onSyncPress?: () => void;
}

export function SyncBannerStack({ onSyncPress }: Props) {
  const { state, pendingCount } = useSyncState();

  if (state === 'synced') return null;

  if (state === 'syncing') {
    return <SyncBanner variant="syncing" />;
  }

  if (state === 'failed') {
    return <SyncBanner variant="failed" onActionPress={onSyncPress} />;
  }

  if (state === 'pending') {
    return (
      <SyncBanner
        variant="pending"
        pendingCount={pendingCount}
        onActionPress={onSyncPress}
      />
    );
  }

  // state === 'offline'
  // Show pending banner above offline banner if there are unsynced changes
  return (
    <>
      {pendingCount > 0 && (
        <SyncBanner
          variant="pending"
          pendingCount={pendingCount}
          onActionPress={undefined} // no sync while offline
        />
      )}
      <SyncBanner variant="offline" />
    </>
  );
}
