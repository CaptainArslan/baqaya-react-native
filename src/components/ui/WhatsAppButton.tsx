/**
 * WhatsAppButton — outlined button with WhatsApp branding.
 * Used on customer detail screen.
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

interface Props {
  onPress?: () => void;
  label?: string;
  style?: ViewStyle;
}

export function WhatsAppButton({
  onPress,
  label = 'WhatsApp Reminder',
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.btn, style]}
    >
      <View style={styles.waIcon}>
        <Text style={styles.waEmoji}>💬</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  waIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waEmoji: {
    fontSize: 16,
  },
  label: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
});
