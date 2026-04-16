/**
 * FAB — floating action button, positioned bottom-right.
 * Wrap parent in position:relative or use absolute positioning from screen.
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';
import { Colors, Radius, Shadows } from '../../theme';

interface Props {
  icon: string;           // emoji or text icon
  onPress: () => void;
  style?: ViewStyle;
  size?: number;
  backgroundColor?: string;
}

export function FAB({
  icon,
  onPress,
  style,
  size = 56,
  backgroundColor = Colors.primary,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: Radius.full,
          backgroundColor,
        },
        Shadows.lg,
        style,
      ]}
    >
      <Text style={[styles.icon, { fontSize: size * 0.38 }]}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: Colors.textInverse,
  },
});
