/**
 * TabHeader — dark green header used on all main tab screens.
 * Shows hamburger (or custom left), title, and right slot.
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';

interface Props {
  title?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  onMenuPress?: () => void;
  style?: ViewStyle;
}

export function TabHeader({
  title = 'Baqaya',
  leftElement,
  rightElement,
  onMenuPress,
  style,
}: Props) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.left}>
        {leftElement ?? (
          <TouchableOpacity onPress={onMenuPress} hitSlop={8} style={styles.iconBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.right}>{rightElement ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    flex: 2,
    textAlign: 'center',
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
    letterSpacing: Typography.letterSpacing.tight,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  menuIcon: {
    fontSize: 20,
    color: Colors.textInverse,
  },
});
