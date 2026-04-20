/**
 * Permission Denied screen — import-contacts-flow
 * Design ref: contacts_permission_denied/screen.png
 * Full screen. Red blocked icon in white card. Data safety note. Open Settings + Retry.
 */
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import React from "react";
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PermissionDeniedScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();

  function handleOpenSettings() {
    Linking.openSettings();
  }

  function handleRetry() {
    // Navigate back so they can re-trigger the permission request
    nav.goBack();
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Back arrow */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={nav.goBack}
        hitSlop={10}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Red icon card */}
        <View style={styles.iconCard}>
          <Text style={styles.iconEmoji}>🚫</Text>
        </View>

        <Text style={styles.title}>{t.permissions.deniedTitle}</Text>
        <Text style={styles.body}>{t.permissions.deniedBody}</Text>

        {/* Data safety note card */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyIconBox}>
            <Text style={styles.safetyIcon}>🛡️</Text>
          </View>
          <View style={styles.safetyTextWrap}>
            <Text style={styles.safetyTitle}>
              {t.permissions.dataSafetyTitle}
            </Text>
            <Text style={styles.safetyBody}>{t.permissions.encryptedNote}</Text>
          </View>
        </View>
      </View>

      {/* Sticky footer buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleOpenSettings}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {t.permissions.openSettings}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={handleRetry}
          activeOpacity={0.7}
        >
          <Text style={styles.outlineBtnText}>{t.permissions.retry}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backBtn: {
    padding: Spacing.base,
    alignSelf: "flex-start",
  },
  backIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
  },

  // ── Icon card ──
  iconCard: {
    width: 120,
    height: 120,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.errorLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  iconEmoji: { fontSize: 56 },

  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  body: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Typography.size.base * 1.6,
  },

  // ── Safety card ──
  safetyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.infoLight,
    borderWidth: 1,
    borderColor: Colors.info,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignSelf: "stretch",
    marginTop: Spacing.sm,
  },
  safetyIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  safetyIcon: { fontSize: 20 },
  safetyTextWrap: { flex: 1 },
  safetyTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.info,
  },
  safetyBody: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
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
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
  },
  outlineBtnText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.primary,
  },
});
