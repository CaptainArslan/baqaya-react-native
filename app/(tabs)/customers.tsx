/**
 * Customers tab — customers-flow
 * Empty state with Add Customer + Import from Contacts.
 * Populated: searchable list, customer row taps to detail.
 * FAB: Add Customer.
 */
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { useSyncState } from '@/src/store/syncStore';
import {
  TabHeader, SyncBanner, SearchBar, EmptyState,
  CustomerRow, FAB,
} from '@/src/components';
import { Colors, Spacing } from '@/src/theme';
import type { Customer } from '@/src/types';

// Mock — replaced by store when backend integrates
const MOCK_CUSTOMERS: Customer[] = [];

export default function CustomersScreen() {
  const nav = useAppNavigation();
  const { state: syncState, pendingCount } = useSyncState();
  const [query, setQuery] = useState('');

  const filtered = MOCK_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const showSyncBanner = syncState !== 'synced';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TabHeader
        title="Baqaya"
        onMenuPress={nav.goToDrawer}
        rightElement={
          <TouchableOpacity hitSlop={8}>
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

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search customer name..."
        style={styles.search}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Text style={styles.emptyIcon}>👥</Text>}
          title="No customers found"
          description="Add your first customer to start your ledger and track payments."
          actionLabel="Import from Contacts"
          onAction={nav.goToContactPicker}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomerRow
              name={item.name}
              phone={item.phone}
              balance={item.balance}
              status={item.balance > 0 ? 'owes' : item.balance < 0 ? 'toGive' : 'settled'}
              lastActive={item.lastActivity}
              onPress={() => nav.goToCustomerDetail(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB icon="+" onPress={nav.goToAddCustomer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  syncIcon: { fontSize: 20, color: Colors.textInverse },
  search: { margin: Spacing.base },
  list: { paddingBottom: 80 },
  emptyIcon: { fontSize: 40 },
});
