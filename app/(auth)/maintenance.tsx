/**
 * System Maintenance screen
 * Design ref: system_maintenance_simplified_view
 */
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MaintenanceScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Minimal header */}
      <View style={styles.header}>
        <Text style={styles.brandDot}>• {t.common.appName}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity hitSlop={8} style={styles.iconBtn}>
            <Text style={styles.headerIcon}>❓</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8} style={styles.iconBtn}>
            <Text style={styles.headerIcon}>↻</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.illustrationBox}>
          <Text style={styles.illustrationEmoji}>🔧</Text>
        </View>

        <Text style={styles.title}>{t.auth.maintenance.title}</Text>
        <Text style={styles.subtitle}>{t.auth.maintenance.subtitle}</Text>

        <View style={styles.retryNote}>
          <Text style={styles.retryDot}>●</Text>
          <Text style={styles.retryText}>{t.auth.maintenance.retryNote}</Text>
        </View>
      </View>

      {/* Protocol footer — static technical string, intentionally not translated */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>PROTOCOL 4.0 • NODE: ASIA-9</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0F5F3" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  brandDot: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  headerRight: { flexDirection: "row", gap: Spacing.sm },
  iconBtn: { padding: Spacing.xs },
  headerIcon: { fontSize: 18, color: Colors.textSecondary },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.base,
  },
  illustrationBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  illustrationEmoji: { fontSize: 44 },
  title: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
    lineHeight: Typography.size.xxxl * 1.25,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Typography.size.base * 1.5,
  },
  retryNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  retryDot: { fontSize: 8, color: Colors.primary },
  retryText: {
    fontSize: Typography.size.sm,
    color: Colors.primaryText,
    fontWeight: Typography.weight.medium,
  },
  footer: {
    alignItems: "center",
    paddingBottom: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
