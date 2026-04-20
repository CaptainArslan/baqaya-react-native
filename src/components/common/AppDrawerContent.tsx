/**
 * Left drawer menu for main app (language, legal, logout).
 */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { MaterialIcon } from "../ui/MaterialIcon";
import { Colors, Radius, Spacing, Typography } from "../../theme";
import { useTranslation } from "../../i18n";
import { authStore } from "../../store/authStore";

function Row({
  label,
  icon,
  onPress,
  danger,
}: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcon>["name"];
  onPress: () => void;
  danger?: boolean;
}) {
  const iconColor = danger ? Colors.debit : Colors.textPrimary;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <MaterialIcon name={icon} size={22} color={iconColor} />
      <Text style={[styles.rowLabel, danger && styles.rowDanger]}>{label}</Text>
      <MaterialIcon name="chevron-right" size={20} color={Colors.textMuted} />
    </Pressable>
  );
}

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const { t } = useTranslation();

  function closeThen(fn: () => void) {
    props.navigation.closeDrawer();
    fn();
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.scroll}
      style={styles.drawer}
    >
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <MaterialIcon name="storefront" size={26} color={Colors.textInverse} />
        </View>
        <Text style={styles.heroTitle}>{t.common.appName}</Text>
        <Text style={styles.heroSub}>{t.tabs.home}</Text>
      </View>

      <View style={styles.section}>
        <Row
          label={t.auth.language.screenTitle}
          icon="language"
          onPress={() =>
            closeThen(() => router.push("/(auth)/language"))
          }
        />
        <Row
          label={t.drawer.privacy}
          icon="privacy-tip"
          onPress={() =>
            closeThen(() => router.push("/(auth)/privacy-policy"))
          }
        />
        <Row
          label={t.drawer.terms}
          icon="description"
          onPress={() => closeThen(() => router.push("/(auth)/terms"))}
        />
        <Row
          label={t.drawer.logout}
          icon="logout"
          danger
          onPress={() =>
            closeThen(async () => {
              await authStore.logout();
              router.replace("/(auth)");
            })
          }
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawer: { backgroundColor: Colors.surface },
  scroll: { paddingBottom: Spacing.xl },
  hero: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary,
    marginBottom: Spacing.sm,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
  },
  heroSub: {
    fontSize: Typography.size.sm,
    color: "rgba(255, 255, 255, 0.65)",
    marginTop: Spacing.xxs,
  },
  section: {
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xxs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
  },
  rowPressed: { backgroundColor: Colors.surfaceSecondary },
  rowLabel: {
    flex: 1,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
  },
  rowDanger: { color: Colors.debit },
});
