/**
 * BalanceCard — large dark green card on Home screen.
 * Shows total balance + Add Entry CTA.
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { formatBalance } from '../../utils';

interface Props {
  balance: number;
  label?: string;
  onAddEntry?: () => void;
  style?: ViewStyle;
}

export function BalanceCard({
  balance,
  label = 'TOTAL BALANCE',
  onAddEntry,
  style,
}: Props) {
  return (
    <View style={[styles.card, Shadows.md, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>{formatBalance(balance)}</Text>

      {onAddEntry && (
        <TouchableOpacity
          onPress={onAddEntry}
          activeOpacity={0.85}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>+ Add Entry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
    letterSpacing: Typography.letterSpacing.wider,
    opacity: 0.8,
  },
  amount: {
    fontSize: Typography.size.hero,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
    letterSpacing: Typography.letterSpacing.tight,
  },
  addBtn: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.debit,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.textInverse,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
});
