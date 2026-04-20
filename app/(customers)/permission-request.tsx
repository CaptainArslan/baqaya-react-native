/**
 * Permission Request screen — import-contacts-flow
 * Design ref: contacts_permission_request/screen.png
 * Bottom-sheet style: dark green hero top, white action area below.
 */
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PermissionRequestScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();

  function handleAllow() {
    // TODO: call expo-contacts requestPermissionsAsync()
    // On grant  → show contact picker (the import-contacts modal)
    // On deny   → go to permission-denied screen
    // Stub: simulate granted
    nav.goToImportContacts();
  }

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      {/* ── Dark green hero ── */}
      <View style={styles.hero}>
        {/* Icon badge */}
        <View style={styles.iconBadge}>
          <Text style={styles.iconEmoji}>📇</Text>
          <View style={styles.plusBadge}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{t.permissions.heroTitle}</Text>
        <Text style={styles.heroTagline}>{t.permissions.heroTagline}</Text>
      </View>

      {/* ── White action sheet ── */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        <Text style={styles.title}>{t.permissions.contactsTitle}</Text>
        <Text style={styles.body}>{t.permissions.contactsBody}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleAllow}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              {t.permissions.allowAccess}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={nav.goBack}
            activeOpacity={0.7}
          >
            <Text style={styles.ghostBtnText}>{t.permissions.notNow}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.footerText}>{t.permissions.encryptedNote}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  // ── Hero ──
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.xxl,
  },
  iconBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryMid,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
    position: "relative",
  },
  iconEmoji: { fontSize: 44 },
  plusBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  plusText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: Typography.weight.bold,
    lineHeight: 18,
  },
  heroTitle: {
    fontSize: Typography.size.xxl + 4,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
    letterSpacing: 0.5,
  },
  heroTagline: {
    fontSize: Typography.size.base,
    color: "rgba(255,255,255,0.65)",
    marginTop: Spacing.xs,
  },

  // ── Sheet ──
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  body: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Typography.size.base * 1.55,
    marginBottom: Spacing.xl,
  },

  // ── Buttons ──
  actions: { gap: Spacing.sm },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
  ghostBtn: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
  },
  ghostBtnText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },

  // ── Footer ──
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    marginTop: Spacing.lg,
  },
  lockIcon: { fontSize: 13 },
  footerText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
});
