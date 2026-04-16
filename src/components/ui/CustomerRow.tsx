/**
 * CustomerRow — single row in the customers list.
 * Shows avatar, name, last active, OWES/SETTLED badge, amount.
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { formatBalance } from '../../utils';
import { Avatar } from './Avatar';

type BalanceStatus = 'owes' | 'settled' | 'toGive';

interface Props {
  name: string;
  phone?: string;
  lastActive?: string;
  balance: number;
  status: BalanceStatus;
  avatarUri?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const statusConfig: Record<BalanceStatus, { label: string; color: string; bg: string }> = {
  owes: { label: 'OWES', color: Colors.debit, bg: Colors.debitLight },
  toGive: { label: 'TO GIVE', color: Colors.credit, bg: Colors.creditLight },
  settled: { label: 'SETTLED', color: Colors.textMuted, bg: Colors.surfaceSecondary },
};

export function CustomerRow({
  name,
  phone,
  lastActive,
  balance,
  status,
  avatarUri,
  onPress,
  style,
}: Props) {
  const cfg = statusConfig[status];
  const meta = [lastActive, phone].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.row, style]}
    >
      <Avatar name={name} uri={avatarUri} size="md" />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {meta ? (
          <Text style={styles.lastActive} numberOfLines={1}>{meta}</Text>
        ) : null}
      </View>

      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
        <Text style={[styles.amount, { color: cfg.color }]}>
          {formatBalance(balance)}
        </Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
    gap: Spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  lastActive: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    gap: Spacing.xxs,
  },
  badge: {
    borderRadius: Radius.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  amount: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
  },
  chevron: {
    fontSize: 20,
    color: Colors.textMuted,
    marginLeft: -Spacing.xs,
  },
});
