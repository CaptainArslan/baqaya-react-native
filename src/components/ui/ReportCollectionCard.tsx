/**
 * ReportCollectionCard — dark green card on reports screen.
 * "You need to collect Rs. X" with optional date range label.
 */
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ViewStyle,
} from "react-native";
import { Colors, Radius, Shadows, Spacing, Typography } from "../../theme";
import { formatBalance } from "../../utils";

interface Props {
  amount: number;
  dateRange?: string;
  onDateRangePress?: () => void;
  style?: ViewStyle;
}

export function ReportCollectionCard({
  amount,
  dateRange,
  onDateRangePress,
  style,
}: Props) {
  return (
    <View style={[styles.card, Shadows.md, style]}>
      <Text style={styles.eyebrow}>YOU NEED TO COLLECT</Text>
      <Text style={styles.amount}>{formatBalance(amount)}</Text>

      {dateRange && (
        <TouchableOpacity
          onPress={onDateRangePress}
          activeOpacity={0.75}
          style={styles.dateBtn}
        >
          <Text style={styles.dateLabel}>📅 {dateRange}</Text>
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
    alignItems: "center",
    gap: Spacing.sm,
  },
  eyebrow: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
    letterSpacing: Typography.letterSpacing.wider,
    opacity: 0.75,
  },
  amount: {
    fontSize: Typography.size.display,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
    letterSpacing: Typography.letterSpacing.tight,
  },
  dateBtn: {
    marginTop: Spacing.xxs,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  dateLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textInverse,
    fontWeight: Typography.weight.medium,
  },
});
