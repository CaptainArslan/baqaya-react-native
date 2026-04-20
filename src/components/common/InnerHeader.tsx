/**
 * InnerHeader — light header for inner/detail screens.
 * Shows back arrow (optional avatar), title, and right slot.
 */
import { useRouter } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ViewStyle,
} from "react-native";
import { Colors, Spacing, Typography } from "../../theme";

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  leftElement?: React.ReactNode; // e.g. Avatar next to title
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export function InnerHeader({
  title,
  subtitle,
  onBack,
  leftElement,
  rightElement,
  style,
}: Props) {
  const router = useRouter();

  function handleBack() {
    if (onBack) onBack();
    else router.back();
  }

  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity
        onPress={handleBack}
        hitSlop={10}
        style={styles.backBtn}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {leftElement ? <View style={styles.leftEl}>{leftElement}</View> : null}

      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.right}>{rightElement ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    marginRight: Spacing.sm,
    padding: Spacing.xs,
  },
  backArrow: {
    fontSize: Typography.size.xxl,
    color: Colors.primary,
    fontWeight: Typography.weight.medium,
  },
  leftEl: {
    marginRight: Spacing.sm,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  right: {
    marginLeft: Spacing.sm,
    alignItems: "flex-end",
  },
});
