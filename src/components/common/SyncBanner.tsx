/**
 * SyncBanner — sits directly below TabHeader.
 * Variants: pending (orange), offline (orange), syncing (blue).
 */
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';

type Variant = 'pending' | 'offline' | 'syncing';

interface Props {
  variant: Variant;
  pendingCount?: number;
  onSyncPress?: () => void;
  style?: ViewStyle;
}

const config: Record<Variant, { bg: string; text: string }> = {
  pending: { bg: Colors.syncPending, text: Colors.syncPendingText },
  offline: { bg: Colors.offlineBg, text: Colors.offlineText },
  syncing: { bg: Colors.syncingBg, text: Colors.info },
};

export function SyncBanner({ variant, pendingCount = 0, onSyncPress, style }: Props) {
  const { bg, text } = config[variant];

  function getMessage() {
    if (variant === 'offline') return 'You are offline. Changes will sync later.';
    if (variant === 'syncing') return 'Syncing changes…';
    return `${pendingCount} ${pendingCount === 1 ? 'change' : 'changes'} pending sync`;
  }

  return (
    <View style={[styles.banner, { backgroundColor: bg }, style]}>
      <View style={styles.left}>
        {variant === 'syncing' && (
          <ActivityIndicator size={12} color={text} style={styles.spinner} />
        )}
        {variant !== 'syncing' && <Text style={[styles.dot, { color: text }]}>↻ </Text>}
        <Text style={[styles.message, { color: text }]}>{getMessage()}</Text>
      </View>

      {variant === 'pending' && onSyncPress && (
        <TouchableOpacity onPress={onSyncPress} hitSlop={8}>
          <Text style={[styles.action, { color: text }]}>Sync Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs + 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  spinner: {
    marginRight: Spacing.xs,
  },
  dot: {
    fontSize: Typography.size.sm,
  },
  message: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    flexShrink: 1,
  },
  action: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    marginLeft: Spacing.sm,
  },
});
