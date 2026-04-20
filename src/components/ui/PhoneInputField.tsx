/**
 * PhoneInputField — country code prefix + number input.
 * Used on phone entry screen.
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { DEFAULT_COUNTRY_CODE } from '../../constants';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  hasError?: boolean;
  countryCode?: string;
  style?: ViewStyle;
}

export function PhoneInputField({
  value,
  onChangeText,
  hasError = false,
  countryCode = DEFAULT_COUNTRY_CODE,
  style,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        focused && styles.focused,
        hasError && styles.errorBorder,
        style,
      ]}
    >
      <View style={styles.codeBox}>
        <Text style={styles.flag}>🇵🇰</Text>
        <Text style={styles.code}>{countryCode}</Text>
      </View>
      <View style={styles.divider} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="3XX XXXXXXX"
        placeholderTextColor={Colors.textMuted}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        maxLength={10}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    height: 56,
    overflow: 'hidden',
  },
  focused: { borderColor: Colors.primary },
  errorBorder: { borderColor: Colors.error },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  flag: { fontSize: Typography.size.xl },
  code: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    paddingRight: Spacing.md,
  },
});
