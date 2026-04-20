import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/theme";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcon } from "../ui/MaterialIcon";

export function GlobalAddCustomerFab() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === "android" ? 6 : 0);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          right: Spacing.lg,
          bottom: 52 + bottomInset + Spacing.sm,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.button, Shadows.lg]}
        onPress={nav.goToAddCustomer}
        activeOpacity={0.85}
      >
        <MaterialIcon name="person-add" size={22} color={Colors.textInverse} />
        <Text style={styles.label}>{t.customers.addCustomer}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
  },
  button: {
    minHeight: 56,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  label: {
    color: Colors.textInverse,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
});
