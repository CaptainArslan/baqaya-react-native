import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { MaterialIcon } from '../ui/MaterialIcon';
import { Colors, Spacing, Typography } from '../../theme';

interface Props {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightElement,
  leftElement,
  transparent = false,
  style,
}: Props) {
  return (
    <View
      style={[
        styles.header,
        transparent ? styles.transparent : styles.solid,
        style,
      ]}
    >
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <MaterialIcon name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}
        {leftElement}
      </View>

      <View style={styles.center}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.right}>{rightElement ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  solid: {
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  transparent: {
    backgroundColor: Colors.transparent,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  backBtn: {
    marginRight: Spacing.xs,
    padding: Spacing.xs,
  },
});
