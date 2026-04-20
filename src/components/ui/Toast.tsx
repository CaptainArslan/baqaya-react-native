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
import { MaterialIcon } from './MaterialIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '../../theme';

type ToastType = 'error' | 'success' | 'warning' | 'info';

const toastConfig: Record<ToastType, { bg: string; iconName: 'warning-amber' | 'check-circle-outline' | 'info-outline' }> = {
  error:   { bg: Colors.debit,   iconName: 'warning-amber' },
  success: { bg: Colors.credit,  iconName: 'check-circle-outline' },
  warning: { bg: Colors.warning, iconName: 'warning-amber' },
  info:    { bg: Colors.info,    iconName: 'info-outline' },
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
      <MaterialIcon name={cfg.iconName} size={Typography.size.lg} color={Colors.white} />
      <Text style={styles.message} numberOfLines={2}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} activeOpacity={0.7} hitSlop={8}>
          <MaterialIcon name="close" size={Typography.size.base} color={Colors.white} style={styles.close} />
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
  message: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.white,
    fontWeight: Typography.weight.medium,
  },
  close: { opacity: 0.8 },
});
