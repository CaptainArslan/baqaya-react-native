/**
 * Customer detail screen — customer-details-flow
 * Shows: name, balance, entry list, action buttons.
 * Actions: Add Entry (udhaar/payment), WhatsApp Reminder, back.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useAppNavigation } from '@/src/hooks';
import {
  InnerHeader, NetBalanceCard, LedgerActionRow,
  WhatsAppButton, EmptyState,
} from '@/src/components';
import { Colors, Spacing } from '@/src/theme';

export default function CustomerDetailScreen() {
  const nav = useAppNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Placeholder — replace with store lookup by id
  const customer = { id: id ?? '', name: 'Customer', phone: '', balance: 0 };

  function handleWhatsApp() {
    if (!customer.phone) return;
    nav.openWhatsAppReminder(customer.phone, customer.name, 'Rs. 0');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <InnerHeader
        title={customer.name}
        onBack={nav.goBack}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <NetBalanceCard
          balance={customer.balance}
          status="settled"
          entryCount={0}
          style={styles.balanceCard}
        />

        <LedgerActionRow
          onUdhaarPress={() => nav.goToAddEntry(id ?? '', 'udhaar')}
          onPaymentPress={() => nav.goToAddEntry(id ?? '', 'payment')}
          style={styles.actions}
        />

        <WhatsAppButton
          onPress={handleWhatsApp}
          style={styles.whatsapp}
        />

        <EmptyState
          icon={<Text style={styles.emptyIcon}>📋</Text>}
          title="No entries found"
          description="Start by adding your first transaction for this customer."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, gap: Spacing.base, paddingBottom: Spacing.huge },
  balanceCard: {},
  actions: {},
  whatsapp: {},
  emptyIcon: { fontSize: 40 },
});
