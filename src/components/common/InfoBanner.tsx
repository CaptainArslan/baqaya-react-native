import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ViewStyle,
} from "react-native";
import { Colors, Radius, Spacing, Typography } from "../../theme";

type BannerType = "offline" | "sync" | "warning" | "info" | "success" | "error";

interface Props {
  type: BannerType;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

const bannerConfig: Record<
  BannerType,
  { bg: string; border: string; text: string; action: string }
> = {
  offline: {
    bg: Colors.offlineBg,
    border: Colors.offlineBorder,
    text: Colors.offlineText,
    action: Colors.warning,
  },
  sync: {
    bg: Colors.syncingBg,
    border: Colors.infoLight,
    text: Colors.info,
    action: Colors.info,
  },
  warning: {
    bg: Colors.warningLight,
    border: Colors.warning,
    text: Colors.offlineText,
    action: Colors.warning,
  },
  info: {
    bg: Colors.infoLight,
    border: Colors.info,
    text: Colors.info,
    action: Colors.info,
  },
  success: {
    bg: Colors.successLight,
    border: Colors.success,
    text: Colors.success,
    action: Colors.success,
  },
  error: {
    bg: Colors.errorLight,
    border: Colors.error,
    text: Colors.error,
    action: Colors.error,
  },
};

export function InfoBanner({
  type,
  message,
  actionLabel,
  onAction,
  style,
}: Props) {
  const config = bannerConfig[type];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        style,
      ]}
    >
      <Text style={[styles.message, { color: config.text }]}>{message}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={[styles.action, { color: config.action }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  action: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
  },
});
