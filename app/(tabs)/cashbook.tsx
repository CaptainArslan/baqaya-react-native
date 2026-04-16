/**
 * Cashbook tab — cashbook-flow
 * Entry list (credit / debit). FAB opens add-entry modal.
 * Filters: All / Received / Given (via SegmentedTabs).
 */
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { useSyncState } from '@/src/store/syncStore';
import { TabHeader, SyncBanner, SegmentedTabs, EmptyState, FAB } from '@/src/components';
import { Colors, Spacing } from '@/src/theme';

const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'received', label: 'Received' },
  { id: 'given',    label: 'Given' },
];

export default function CashbookScreen() {
  const nav = useAppNavigation();
  const { state: syncState, pendingCount } = useSyncState();
  const [filter, setFilter] = useState('all');

  const showSyncBanner = syncState !== 'synced';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TabHeader title="Baqaya" onMenuPress={nav.goToDrawer} />

      {showSyncBanner && (
        <SyncBanner
          variant={syncState === 'offline' ? 'offline' : syncState === 'syncing' ? 'syncing' : 'pending'}
          pendingCount={pendingCount}
          onSyncPress={() => {}}
        />
      )}

      <SegmentedTabs
        tabs={FILTERS}
        activeId={filter}
        onChange={setFilter}
        style={styles.filters}
      />

      <EmptyState
        icon={<Text style={styles.emptyIcon}>📒</Text>}
        title="No entries yet"
        description="Tap + to record your first payment or amount given."
      />

      {/* add-entry modal — customerId empty means cashbook-level entry */}
      <FAB icon="+" onPress={() => nav.goToAddEntry('', 'udhaar')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  filters: { margin: Spacing.base },
  emptyIcon: { fontSize: 40 },
});
