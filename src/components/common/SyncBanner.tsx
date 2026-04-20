/**
 * SyncBanner — thin strip below TabHeader.
 * Variants: pending (cream), offline (grey), syncing (blue), failed (red).
 * Design ref: baqaya_home_manual_sync_banner_added_1
 *             baqaya_home_manual_sync_banner_added_2
 *             baqaya_home_refined_sync_banner
 */
import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ViewStyle,
} from "react-native";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useTranslation } from "../../i18n";
import { Colors, Spacing, Typography } from "../../theme";

export type SyncVariant = "pending" | "offline" | "syncing" | "failed";

interface Props {
  variant: SyncVariant;
  pendingCount?: number;
  onActionPress?: () => void;
  style?: ViewStyle;
}

// ─── Per-variant config ───────────────────────────────────────────────────────

const CONFIG: Record<
  SyncVariant,
  {
    bg: string;
    textColor: string;
    actionColor: string;
    iconName: "sync" | "cloud-off" | "warning-amber";
  }
> = {
  pending: {
    bg: Colors.background,
    textColor: Colors.textSecondary,
    actionColor: Colors.primary,
    iconName: "sync",
  },
  offline: {
    bg: Colors.surfaceSecondary,
    textColor: Colors.textMuted,
    actionColor: Colors.primary,
    iconName: "cloud-off",
  },
  syncing: {
    bg: Colors.syncingBg,
    textColor: Colors.info,
    actionColor: Colors.info,
    iconName: "sync",
  },
  failed: {
    bg: Colors.errorLight,
    textColor: Colors.error,
    actionColor: Colors.error,
    iconName: "warning-amber",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SyncBanner({
  variant,
  pendingCount = 0,
  onActionPress,
  style,
}: Props) {
  const { t } = useTranslation();
  const { bg, textColor, actionColor, iconName } = CONFIG[variant];
  const translateY = useRef(new Animated.Value(-24)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  function getMessage(): string {
    switch (variant) {
      case "pending": {
        const count = pendingCount;
        const suffix = count === 1 ? t.sync.pendingOne : t.sync.pending;
        return `${count} ${suffix}`;
      }
      case "offline":
        return t.sync.offline;
      case "syncing":
        return t.sync.syncing;
      case "failed":
        return t.sync.failed;
    }
  }

  function getAction(): string | null {
    if (variant === "pending") return t.sync.syncNow;
    if (variant === "failed") return t.sync.retry;
    return null;
  }

  const action = getAction();
  const message = getMessage();

  return (
    <Animated.View
      style={[
        styles.banner,
        { backgroundColor: bg, transform: [{ translateY }] },
        style,
      ]}
    >
      {/* Left: icon + message */}
      <View style={styles.left}>
        {variant === "syncing" ? (
          <ActivityIndicator
            size={11}
            color={textColor}
            style={styles.spinner}
          />
        ) : (
          <MaterialIcon
            name={iconName}
            size={Typography.size.sm}
            color={textColor}
            style={styles.icon}
          />
        )}
        <Text style={[styles.message, { color: textColor }]} numberOfLines={1}>
          {message}
        </Text>
      </View>

      {/* Right: action */}
      {action && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.7}
          hitSlop={10}
          style={styles.actionWrap}
        >
          <MaterialIcon
            name="sync"
            size={Typography.size.sm}
            color={actionColor}
            style={styles.icon}
          />
          <Text style={[styles.action, { color: actionColor }]}>{action}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs + 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  spinner: { marginRight: Spacing.xs + 2 },
  icon: {
    marginRight: Spacing.xs,
  },
  message: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    flexShrink: 1,
  },
  actionWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  action: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },
});
