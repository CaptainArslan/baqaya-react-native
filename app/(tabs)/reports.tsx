/**
 * Reports tab — reports-flow
 * Period tabs: Today / Week / Month.
 * Priority: collection amount → late payers → top debtors → stats.
 * Empty state when no data.
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { TabHeader, SegmentedTabs, EmptyState } from '@/src/components';
import { Colors, Spacing } from '@/src/theme';

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'week',  label: 'Week' },
  { id: 'month', label: 'Month' },
];

export default function ReportsScreen() {
  const nav = useAppNavigation();
  const [period, setPeriod] = useState('today');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TabHeader title="Reports" onMenuPress={nav.goToDrawer} />

      <SegmentedTabs
        tabs={PERIODS}
        activeId={period}
        onChange={setPeriod}
        style={styles.periods}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <EmptyState
          icon={<Text style={styles.emptyIcon}>📊</Text>}
          title="No report data yet"
          description="Add customers and transactions to see collection insights here."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  periods: { margin: Spacing.base },
  content: { flexGrow: 1 },
  emptyIcon: { fontSize: 40 },
});
