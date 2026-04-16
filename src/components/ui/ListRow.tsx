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
  title: string;
  subtitle?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  showDivider?: boolean;
}

export function ListRow({
  title,
  subtitle,
  leftElement,
  rightElement,
  onPress,
  style,
  showDivider = true,
}: Props) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.row, showDivider && styles.divider, style]}
    >
      {leftElement ? <View style={styles.left}>{leftElement}</View> : null}

      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  left: {
    marginRight: Spacing.md,
  },
  center: {
    flex: 1,
    gap: 2,
  },
  right: {
    marginLeft: Spacing.sm,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
});
