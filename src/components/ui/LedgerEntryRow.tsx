/**
 * LedgerEntryRow — single transaction in a customer ledger or cashbook.
 * Shows title, time, amount (+/-), and entry type tag.
 */
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ViewStyle,
} from "react-native";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { formatCurrency } from "../../utils";

type EntryType = "udhaar" | "payment";

interface Props {
  title: string;
  time: string;
  amount: number;
  type: EntryType;
  onPress?: () => void;
  style?: ViewStyle;
}

const typeConfig: Record<
  EntryType,
  { label: string; sign: string; color: string }
> = {
  udhaar: { label: "UDHAAR", sign: "+", color: Colors.debit },
  payment: { label: "PAYMENT", sign: "-", color: Colors.credit },
};

export function LedgerEntryRow({
  title,
  time,
  amount,
  type,
  onPress,
  style,
}: Props) {
  const cfg = typeConfig[type];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.row, style]}
    >
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.time}>🕐 {time}</Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, { color: cfg.color }]}>
          {cfg.sign}
          {formatCurrency(amount)}
        </Text>
        <View
          style={[
            styles.tag,
            {
              backgroundColor:
                type === "udhaar" ? Colors.debitLight : Colors.creditLight,
            },
          ]}
        >
          <Text style={[styles.tagText, { color: cfg.color }]}>
            {cfg.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
    gap: Spacing.md,
  },
  info: {
    flex: 1,
    gap: Spacing.xxs + 1,
  },
  title: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
  },
  time: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  right: {
    alignItems: "flex-end",
    gap: Spacing.xxs + 1,
  },
  amount: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
  },
  tag: {
    borderRadius: Radius.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
