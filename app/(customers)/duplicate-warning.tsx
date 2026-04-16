/**
 * Duplicate customer warning — add-customer-flow
 * Shown when a customer with the same phone already exists.
 * View existing → go to that customer's detail. Add anyway → go back to add screen.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useAppNavigation } from '@/src/hooks';
import { InnerHeader, Button } from '@/src/components';
import { Colors, Radius, Spacing, Typography } from '@/src/theme';

export default function DuplicateWarningScreen() {
  const nav = useAppNavigation();
  const { existingId, phone } = useLocalSearchParams<{ existingId: string; phone: string }>();

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <InnerHeader title="Duplicate Customer" onBack={nav.goBack} />

      <View style={styles.content}>
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.title}>Customer Already Exists</Text>
          <Text style={styles.body}>
            A customer with phone number{' '}
            <Text style={styles.bold}>{phone}</Text>
            {' '}is already in your ledger.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            label="View Existing Customer"
            onPress={() => nav.goToCustomerDetail(existingId ?? '')}
            variant="primary"
          />
          <Button
            label="Add Anyway"
            onPress={nav.goBack}
            variant="outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    padding: Spacing.base,
    gap: Spacing.xl,
    justifyContent: 'center',
  },
  warningBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  warningIcon: { fontSize: 44 },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.size.base * 1.5,
  },
  bold: { fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  actions: { gap: Spacing.sm },
});
