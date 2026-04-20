/**
 * WhatsAppButton — branded action button for sending WhatsApp reminders.
 * Accepts `disabled` when customer has no phone number.
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
import { Colors, Radius, Spacing, Typography } from "../../theme";

interface Props {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function WhatsAppButton({
  onPress,
  label = "WhatsApp Reminder",
  disabled = false,
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.75}
      style={[styles.btn, disabled && styles.btnDisabled, style]}
    >
      <View style={styles.iconWrap}>
        <MaterialIcon
          name="chat-bubble-outline"
          size={Typography.size.md}
          color={disabled ? Colors.textMuted : Colors.primary}
          style={disabled && styles.iconDisabled}
        />
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
      {disabled && <Text style={styles.noPhoneHint}> (no number)</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  btnDisabled: {
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSecondary,
  },
  iconWrap: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconDisabled: { opacity: 0.4 },
  label: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  labelDisabled: {
    color: Colors.textMuted,
  },
  noPhoneHint: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
});
