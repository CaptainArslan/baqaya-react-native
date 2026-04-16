import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';

type Status = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface Props {
  label: string;
  status?: Status;
  style?: ViewStyle;
}

export function StatusBadge({ label, status = 'neutral', style }: Props) {
  return (
    <View style={[styles.badge, statusStyles[status].container, style]}>
      <Text style={[styles.label, statusStyles[status].text]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs + 1,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
  },
});

const statusStyles: Record<Status, { container: object; text: object }> = {
  success: {
    container: { backgroundColor: Colors.successLight },
    text: { color: Colors.success },
  },
  error: {
    container: { backgroundColor: Colors.errorLight },
    text: { color: Colors.error },
  },
  warning: {
    container: { backgroundColor: Colors.warningLight },
    text: { color: Colors.warning },
  },
  info: {
    container: { backgroundColor: Colors.infoLight },
    text: { color: Colors.info },
  },
  neutral: {
    container: { backgroundColor: Colors.surfaceSecondary },
    text: { color: Colors.textSecondary },
  },
};
