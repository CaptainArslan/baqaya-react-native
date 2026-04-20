/**
 * BalanceCard — large dark green card on Home screen.
 * Shows total balance + Add Entry CTA.
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

type Variant = "primary" | "debit";

interface Props {
  balance: number;
  label?: string;
  addEntryLabel?: string;
  onAddEntry?: () => void;
  variant?: Variant;
  style?: ViewStyle;
}

export function BalanceCard({
  balance,
  label = "TOTAL BALANCE",
  addEntryLabel = "+ Add Entry",
  onAddEntry,
  variant = "debit",
  style,
}: Props) {
  const cardBg =
    balance === 0
      ? Colors.primary
      : variant === "debit"
        ? Colors.debit
        : Colors.primary;
  const btnBg = variant === "debit" ? Colors.surface : Colors.debit;
  const btnColor = variant === "debit" ? Colors.debit : Colors.textInverse;

  return (
    <View style={[styles.card, { backgroundColor: cardBg }, Shadows.md, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>{formatBalance(balance)}</Text>

      {onAddEntry && (
        <TouchableOpacity
          onPress={onAddEntry}
          activeOpacity={0.85}
          style={[styles.addBtn, { backgroundColor: btnBg }]}
        >
          <Text style={[styles.addBtnText, { color: btnColor }]}>
            {addEntryLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: "flex-start",
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
    textAlign: "left",
    width: "100%",
  },
  addBtn: {
    marginTop: Spacing.xs,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.sm + 2,
    alignSelf: "stretch",
    alignItems: "center",
  },
  addBtnText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
});
