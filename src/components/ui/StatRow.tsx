/**
 * StatRow — two stat cards side by side (Today's Payment / Today's Ledger).
 */
import React from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { Colors, Radius, Shadows, Spacing, Typography } from "../../theme";
import { formatCurrency } from "../../utils";

interface StatItem {
  label: string;
  amount: number;
  note?: string;
  amountColor?: string;
}

interface Props {
  left: StatItem;
  right: StatItem;
  style?: ViewStyle;
}

export function StatCard({ label, amount, note, amountColor }: StatItem) {
  return (
    <View style={[styles.card, Shadows.xs]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, amountColor ? { color: amountColor } : null]}>
        {formatCurrency(amount)}
      </Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

export function StatRow({ left, right, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      <StatCard {...left} />
      <StatCard {...right} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.xxs,
  },
  label: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  amount: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  note: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
});
