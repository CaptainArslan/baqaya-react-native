/**
 * TabHeader — dark green header used on all main tab screens.
 * Shows hamburger (or custom left), title, and right slot.
 */
import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ViewStyle,
} from "react-native";
import { Colors, Spacing, Typography } from "../../theme";
import { MaterialIcon } from "../ui/MaterialIcon";

interface Props {
  title?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  onMenuPress?: () => void;
  style?: ViewStyle;
}

export function TabHeader({
  title = "Baqaya",
  leftElement,
  rightElement,
  onMenuPress,
  style,
}: Props) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftRow}>
        {leftElement ?? (
          <TouchableOpacity
            onPress={onMenuPress}
            hitSlop={8}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <MaterialIcon name="menu" size={22} color={Colors.textInverse} />
          </TouchableOpacity>
        )}
        <Text
          style={styles.title}
          numberOfLines={1}
          {...(Platform.OS === "android" ? { includeFontPadding: false } : {})}
        >
          {title}
        </Text>
      </View>

      <View style={styles.right}>{rightElement ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.headerBg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
    minHeight: 48,
  },
  leftRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: Spacing.xs,
    minWidth: 0,
  },
  title: {
    flexShrink: 1,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
    letterSpacing: Typography.letterSpacing.tight,
  },
  right: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.xs,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
});
