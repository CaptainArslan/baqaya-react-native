/**
 * LedgerActionRow — "Udhaar add" (debit/red) + "Payment add" (credit/green) side by side.
 * Used on customer detail screen.
 */
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ViewStyle,
} from "react-native";
import { MaterialIcon } from "./MaterialIcon";
import { Colors, Radius, Shadows, Spacing, Typography } from "../../theme";

interface Props {
  onUdhaarPress?: () => void;
  onPaymentPress?: () => void;
  udhaarLabel?: string;
  paymentLabel?: string;
  style?: ViewStyle;
}

export function LedgerActionRow({
  onUdhaarPress,
  onPaymentPress,
  udhaarLabel = "Udhaar add",
  paymentLabel = "Payment add",
  style,
}: Props) {
  return (
    <View style={[styles.row, style]}>
      <TouchableOpacity
        onPress={onUdhaarPress}
        activeOpacity={0.85}
        style={[styles.btn, styles.udhaar, Shadows.sm]}
      >
        <MaterialIcon name="trending-up" size={20} color={Colors.textInverse} />
        <Text style={styles.label}>{udhaarLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPaymentPress}
        activeOpacity={0.85}
        style={[styles.btn, styles.payment, Shadows.sm]}
      >
        <MaterialIcon name="payments" size={20} color={Colors.textInverse} />
        <Text style={styles.label}>{paymentLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
  },
  udhaar: {
    backgroundColor: Colors.debit,
  },
  payment: {
    backgroundColor: Colors.primaryMid,
  },
  label: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
});
