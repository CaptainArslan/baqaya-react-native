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
import { MaterialIcon } from './MaterialIcon';

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

const statusConfig: Record<BalanceStatus, { color: string; bg: string }> = {
  owes: { color: Colors.debit, bg: Colors.debitLight },
  toGive: { color: Colors.credit, bg: Colors.creditLight },
  settled: { color: Colors.primary, bg: Colors.surfaceSecondary },
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
  const meta = lastActive?.trim();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.row, style]}
    >
      <View style={[styles.leftAccent, { backgroundColor: cfg.color }]} />
      <Avatar name={name} uri={avatarUri} size="md" style={styles.avatarSquare} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {meta ? (
          <Text style={styles.lastActive} numberOfLines={1}>{meta}</Text>
        ) : null}
      </View>

      <View style={styles.right}>
        <Text
          style={[styles.amount, { color: cfg.color }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {formatBalance(balance)}
        </Text>
      </View>

      <MaterialIcon name="chevron-right" size={22} color={Colors.textMuted} style={styles.chevron} />
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
    overflow: 'hidden',
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  avatarSquare: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  name: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
  },
  lastActive: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  right: {
    flexShrink: 1,
    maxWidth: '42%',
    minWidth: 88,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    textAlign: 'right',
    width: '100%',
  },
  chevron: {
    marginLeft: -Spacing.xs,
  },
});
