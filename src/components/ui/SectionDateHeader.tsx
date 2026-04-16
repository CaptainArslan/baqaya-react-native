/**
 * SectionDateHeader — date group label in ledger / transaction lists.
 * e.g. "TODAY, 24 MAY"
 */
import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';

interface Props {
  label: string;
  style?: ViewStyle;
}

export function SectionDateHeader({ label, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wider,
  },
});
