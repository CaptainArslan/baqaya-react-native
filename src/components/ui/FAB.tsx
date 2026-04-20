/**
 * FAB — floating action button, positioned bottom-right.
 * `icon` can be a string (e.g. "+") or a React node (e.g. <MaterialIcon ... />).
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';

interface Props {
  icon: React.ReactNode;
  /** Pill FAB with text (e.g. "+ Add Customer"). */
  label?: string;
  onPress: () => void;
  style?: ViewStyle;
  size?: number;
  backgroundColor?: string;
}

export function FAB({
  icon,
  label,
  onPress,
  style,
  size = 56,
  backgroundColor = Colors.primary,
}: Props) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 12,
      stiffness: 180,
    }).start();
  }, []);

  const iconEl =
    typeof icon === 'string' || typeof icon === 'number' ? (
      <Text style={[styles.iconGlyph, { fontSize: size * 0.38 }]}>{icon}</Text>
    ) : (
      icon
    );

  return (
    <Animated.View style={[styles.fab, { transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[
          styles.btn,
          label ? styles.btnExtended : null,
          !label && {
            width: size,
            height: size,
            borderRadius: Radius.full,
            backgroundColor,
          },
          label && {
            minHeight: size,
            borderRadius: Radius.full,
            backgroundColor,
          },
          Shadows.lg,
        ]}
      >
        <View style={[styles.iconWrap, label ? styles.iconWrapExtended : null]}>
          {iconEl}
          {label ? (
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnExtended: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapExtended: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconGlyph: {
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
  },
  label: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
});
