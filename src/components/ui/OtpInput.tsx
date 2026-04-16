/**
 * OtpInput — 4 individual digit boxes.
 * Auto-advances focus on input, handles backspace.
 */
import React, { useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';

const OTP_LENGTH = 4;

interface Props {
  value: string;           // e.g. "54" (partial) or "5400" (full)
  onChange: (val: string) => void;
  hasError?: boolean;
  style?: ViewStyle;
}

export function OtpInput({ value, onChange, hasError = false, style }: Props) {
  const inputs = useRef<Array<TextInput | null>>([]);

  function handleChange(text: string, index: number) {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const arr = value.split('');
    arr[index] = digit;
    // fill gaps
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => arr[i] ?? '').join('');
    onChange(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const arr = value.split('');
      arr[index - 1] = '';
      onChange(arr.join(''));
    }
  }

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <TextInput
          key={i}
          ref={(r) => { inputs.current[i] = r; }}
          style={[
            styles.box,
            value[i] ? styles.filled : null,
            hasError ? styles.error : null,
          ]}
          value={value[i] ?? ''}
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
          keyboardType="number-pad"
          maxLength={1}
          textContentType="oneTimeCode"
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 64,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    textAlign: 'center',
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  filled: {
    borderColor: Colors.primary,
  },
  error: {
    borderColor: Colors.error,
  },
});
