import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  maxLength?: number;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  autoFocus?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export function TextInputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  hint,
  disabled = false,
  maxLength,
  leftElement,
  rightElement,
  style,
  inputStyle,
  autoFocus,
  onBlur,
  onFocus,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputRow,
          focused && styles.focused,
          error ? styles.errorBorder : null,
          disabled && styles.disabledBg,
        ]}
      >
        {leftElement ? <View style={styles.leftEl}>{leftElement}</View> : null}

        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          maxLength={maxLength}
          autoFocus={autoFocus}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
        />

        {rightElement ? <View style={styles.rightEl}>{rightElement}</View> : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
  },
  focused: {
    borderColor: Colors.primary,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  disabledBg: {
    backgroundColor: Colors.surfaceSecondary,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
  },
  leftEl: {
    marginRight: Spacing.sm,
  },
  rightEl: {
    marginLeft: Spacing.sm,
  },
  error: {
    fontSize: Typography.size.sm,
    color: Colors.error,
  },
  hint: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
});
