/**
 * LanguageOptionRow — selectable language option in language settings.
 * Shows icon, language name, description, and radio indicator.
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
  icon: string;
  label: string;
  description?: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function LanguageOptionRow({
  icon,
  label,
  description,
  selected = false,
  onPress,
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.row, selected && styles.selectedRow, style]}
    >
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
        {description ? <Text style={styles.desc}>{description}</Text> : null}
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.md,
  },
  selectedRow: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: Typography.size.xl,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  selectedLabel: {
    color: Colors.primary,
  },
  desc: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
});
