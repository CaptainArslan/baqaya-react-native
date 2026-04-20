/**
 * Toast — fixed bottom error/success banner.
 * Appears when `visible` is true.
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '../../theme';

type ToastType = 'error' | 'success' | 'warning' | 'info';

const toastConfig: Record<ToastType, { bg: string; icon: string }> = {
  error:   { bg: Colors.debit,   icon: '⚠' },
  success: { bg: Colors.credit,  icon: '✓' },
  warning: { bg: Colors.warning, icon: '⚠' },
  info:    { bg: Colors.info,    icon: 'ℹ' },
};

interface Props {
  visible: boolean;
  message: string;
  type?: ToastType;
  onDismiss?: () => void;
  style?: ViewStyle;
}

export function Toast({
  visible,
  message,
  type = 'error',
  onDismiss,
  style,
}: Props) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const cfg = toastConfig[type];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : 20,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  // Keep mounted so the hide animation can play; pointer events blocked when hidden
  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.toast,
        { backgroundColor: cfg.bg, bottom: insets.bottom + Spacing.base, opacity, transform: [{ translateY }] },
        style,
      ]}
    >
      <Text style={styles.icon}>{cfg.icon}</Text>
      <Text style={styles.message} numberOfLines={2}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} activeOpacity={0.7} hitSlop={8}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  icon: { fontSize: 16, color: Colors.white },
  message: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.white,
    fontWeight: Typography.weight.medium,
  },
  close: { fontSize: 14, color: Colors.white, opacity: 0.8 },
});
