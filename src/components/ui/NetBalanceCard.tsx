/**
 * NetBalanceCard — shown on customer detail screen.
 * Light bg, large balance, status badge row.
 */
import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { formatBalance } from '../../utils';

type BalanceStatus = 'owed' | 'toGive' | 'settled';

interface Props {
  balance: number;
  status: BalanceStatus;
  entryCount?: number;
  style?: ViewStyle;
}

const statusConfig: Record<BalanceStatus, { label: string; color: string; badgeBg: string }> = {
  owed: { label: "You'll Get", color: Colors.credit, badgeBg: Colors.creditLight },
  toGive: { label: "You'll Give", color: Colors.debit, badgeBg: Colors.debitLight },
  settled: { label: 'Settled', color: Colors.textSecondary, badgeBg: Colors.surfaceSecondary },
};

export function NetBalanceCard({ balance, status, entryCount, style }: Props) {
  const cfg = statusConfig[status];

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.netLabel}>Net Balance Due</Text>
      <Text style={[styles.amount, { color: cfg.color }]}>
        {formatBalance(balance)}
      </Text>

      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: cfg.badgeBg }]}>
          <Text style={[styles.badgeText, { color: cfg.color }]}>↑ {cfg.label}</Text>
        </View>
        {entryCount !== undefined && (
          <View style={[styles.badge, { backgroundColor: Colors.surfaceSecondary }]}>
            <Text style={styles.entryText}>{entryCount} Entries</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  netLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  amount: {
    fontSize: Typography.size.display,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.tight,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xxs,
  },
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs + 1,
  },
  badgeText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
  },
  entryText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
});
