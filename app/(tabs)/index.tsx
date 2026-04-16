/**
 * Home tab — home-flow
 * New user: welcome state, Add Customer primary action.
 * Active user: balance summary, Add Entry primary action.
 * SyncBanner driven by useSyncState.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { useAuthStatus } from '@/src/store/authStore';
import { useSyncState } from '@/src/store/syncStore';
import { SyncBanner, TabHeader, FAB, EmptyState } from '@/src/components';
import { Colors, Spacing, Typography } from '@/src/theme';

export default function HomeScreen() {
  const nav = useAppNavigation();
  const { isNewUser } = useAuthStatus();
  const { state: syncState, pendingCount } = useSyncState();

  const showSyncBanner = syncState !== 'synced';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TabHeader
        title="Baqaya"
        onMenuPress={nav.goToDrawer}
        rightElement={
          <TouchableOpacity onPress={() => {}} hitSlop={8}>
            <Text style={styles.syncIcon}>↻</Text>
          </TouchableOpacity>
        }
      />

      {showSyncBanner && (
        <SyncBanner
          variant={syncState === 'offline' ? 'offline' : syncState === 'syncing' ? 'syncing' : 'pending'}
          pendingCount={pendingCount}
          onSyncPress={() => {}}
        />
      )}

      <View style={styles.content}>
        {isNewUser ? (
          <EmptyState
            icon={<Text style={styles.emptyIcon}>📋</Text>}
            title="No transactions found"
            description="Your latest activity will appear here"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Home Dashboard</Text>
            <Text style={styles.placeholderSub}>Balance summary goes here</Text>
          </View>
        )}
      </View>

      <FAB
        icon={isNewUser ? '👤' : '+'}
        onPress={isNewUser ? nav.goToAddCustomer : () => nav.goToAddEntry('', 'udhaar')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  syncIcon: { fontSize: 20, color: Colors.textInverse },
  content: { flex: 1 },
  emptyIcon: { fontSize: 40 },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  placeholderText: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  placeholderSub: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
});
