/**
 * SearchBar — search input with optional filter/icon slots.
 * Used on customers list, cashbook, etc.
 */
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    type ViewStyle,
} from "react-native";
import { Colors, Radius, Spacing, Typography } from "../../theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  onCalendarPress?: () => void;
  style?: ViewStyle;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search…",
  onFilterPress,
  onCalendarPress,
  style,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.focused, style]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
      />
      {onFilterPress && (
        <TouchableOpacity
          onPress={onFilterPress}
          hitSlop={8}
          style={styles.iconBtn}
        >
          <Text style={styles.actionIcon}>⚙</Text>
        </TouchableOpacity>
      )}
      {onCalendarPress && (
        <TouchableOpacity
          onPress={onCalendarPress}
          hitSlop={8}
          style={styles.iconBtn}
        >
          <Text style={styles.actionIcon}>📅</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.xs,
  },
  focused: {
    borderColor: Colors.primary,
  },
  searchIcon: {
    fontSize: 15,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  actionIcon: {
    fontSize: 16,
    opacity: 0.6,
  },
});
