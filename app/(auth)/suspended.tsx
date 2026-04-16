/**
 * Account Suspended screen
 * Design ref: account_suspended_auth_flow
 * "Security Status" header, red warning icon, title, reason text,
 * violation category box, Contact Support + Review Terms buttons,
 * data security note, Back to Login.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { Button } from '@/src/components';
import { Colors, Radius, Spacing, Typography } from '@/src/theme';

export default function SuspendedScreen() {
  const nav = useAppNavigation();

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerShield}>🛡</Text>
        <Text style={styles.headerTitle}>Security Status</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning icon */}
        <View style={styles.warningBox}>
          <Text style={styles.warningEmoji}>⚠️</Text>
        </View>

        <Text style={styles.title}>Account{'\n'}Suspended</Text>

        <Text style={styles.body}>
          Access to your{' '}
          <Text style={styles.bold}>Baqaya</Text>
          {' '}ledger has been restricted due to a violation of our
          community safety and professional conduct policies.
        </Text>

        {/* Violation box */}
        <View style={styles.violationBox}>
          <View style={styles.violationHeader}>
            <Text style={styles.violationIcon}>ℹ</Text>
            <Text style={styles.violationLabel}>VIOLATION CATEGORY</Text>
          </View>
          <Text style={styles.violationTitle}>
            Standard Operating Policy{'\n'}Violation (SOP-402)
          </Text>
          <Text style={styles.violationNote}>
            Suspension issued for multiple reports of unauthorized transaction entries or
            inconsistent ledger verification.
          </Text>
        </View>

        {/* Actions */}
        <Button
          label="📞  Contact Support"
          onPress={() => {}}
          variant="primary"
          size="lg"
        />
        <Button
          label="📄  Review Terms & Conditions"
          onPress={nav.goToTerms}
          variant="outline"
          size="lg"
        />

        {/* Security note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Your financial data remains encrypted and secure.
          </Text>
        </View>

        {/* Back to login */}
        <Text style={styles.backLink} onPress={() => nav.goToPhone()}>
          ← Back to Login
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerShield: { fontSize: 16, color: Colors.primary },
  headerTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
    gap: Spacing.base,
    alignItems: 'center',
  },
  warningBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.debitLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  warningEmoji: { fontSize: 36 },
  title: {
    fontSize: Typography.size.display,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: Typography.size.display * 1.2,
  },
  body: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.size.base * 1.55,
  },
  bold: { fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  violationBox: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  violationHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  violationIcon: { fontSize: 14, color: Colors.textMuted },
  violationLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
  },
  violationTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    lineHeight: Typography.size.base * 1.4,
  },
  violationNote: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.size.sm * 1.5,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  securityIcon: { fontSize: 14, color: Colors.textMuted },
  securityText: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  backLink: {
    fontSize: Typography.size.base,
    color: Colors.primary,
    fontWeight: Typography.weight.medium,
    marginTop: Spacing.sm,
  },
});
