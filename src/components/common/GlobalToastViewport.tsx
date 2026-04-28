import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcon } from "@/src/components/ui/MaterialIcon";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { toast, type ToastItem, type ToastType } from "@/src/services/toast";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/theme";

const ICON_BY_TYPE: Record<ToastType, React.ComponentProps<typeof MaterialIcon>["name"]> = {
  success: "check-circle-outline",
  error: "error-outline",
  warning: "warning-amber",
  info: "info-outline",
};

const EXIT_MS = 140;
const ENTER_MS = 190;

function surfaceByType(type: ToastType, dark: boolean): { bg: string; border: string } {
  if (dark) {
    const darkBase = "#111827";
    if (type === "success") return { bg: darkBase, border: "#2ea777" };
    if (type === "error") return { bg: darkBase, border: "#e05656" };
    if (type === "warning") return { bg: darkBase, border: "#f4a833" };
    return { bg: darkBase, border: "#60a5fa" };
  }

  if (type === "success") return { bg: Colors.surface, border: Colors.success };
  if (type === "error") return { bg: Colors.surface, border: Colors.error };
  if (type === "warning") return { bg: Colors.surface, border: Colors.warning };
  return { bg: Colors.surface, border: Colors.info };
}

function textColor(type: ToastType, dark: boolean): string {
  if (dark) return "#E5E7EB";
  if (type === "error") return Colors.textPrimary;
  return Colors.textPrimary;
}

export function GlobalToastViewport() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";
  const snapshot = useSyncExternalStore(toast.subscribe, toast.getSnapshot);

  const [rendered, setRendered] = useState<ToastItem | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    void toast.hydrate();
  }, []);

  useEffect(() => {
    const incoming = snapshot.current;
    if (!incoming && !rendered) return;

    if (!incoming && rendered) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: EXIT_MS, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 10, duration: EXIT_MS, useNativeDriver: true }),
      ]).start(() => setRendered(null));
      return;
    }

    if (incoming && !rendered) {
      setRendered(incoming);
      opacity.setValue(0);
      translateY.setValue(10);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: ENTER_MS, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: ENTER_MS, useNativeDriver: true }),
      ]).start();
      return;
    }

    if (incoming && rendered && incoming.id !== rendered.id) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: EXIT_MS, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 10, duration: EXIT_MS, useNativeDriver: true }),
      ]).start(() => {
        setRendered(incoming);
        opacity.setValue(0);
        translateY.setValue(10);
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: ENTER_MS, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: ENTER_MS, useNativeDriver: true }),
        ]).start();
      });
    }
  }, [opacity, rendered, snapshot.current, translateY]);

  if (!rendered) return null;

  const palette = surfaceByType(rendered.type, dark);
  const contentColor = textColor(rendered.type, dark);

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Animated.View
        style={[
          styles.toast,
          {
            bottom: insets.bottom + Spacing.base,
            backgroundColor: palette.bg,
            borderColor: palette.border,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <MaterialIcon name={ICON_BY_TYPE[rendered.type]} size={18} color={palette.border} />
        <Text style={[styles.message, { color: contentColor }]} numberOfLines={3}>
          {rendered.message}
        </Text>

        {rendered.action ? (
          <TouchableOpacity
            onPress={() => toast.actionPress(rendered)}
            hitSlop={8}
            style={styles.actionBtn}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionText, { color: palette.border }]}>{rendered.action.label}</Text>
          </TouchableOpacity>
        ) : null}

        {rendered.dismissible ? (
          <TouchableOpacity onPress={() => toast.dismiss(rendered.id)} hitSlop={8} activeOpacity={0.75}>
            <MaterialIcon name="close" size={16} color={contentColor} />
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "box-none",
  },
  toast: {
    position: "absolute",
    left: Spacing.base,
    right: Spacing.base,
    minHeight: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  message: {
    flex: 1,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    lineHeight: Typography.size.sm * Typography.lineHeight.relaxed,
  },
  actionBtn: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxs + 1,
  },
  actionText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
  },
});
