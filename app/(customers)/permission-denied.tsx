/**
 * Permission Denied screen — import-contacts-flow
 * Design ref: contacts_permission_denied/screen.png
 * Full screen. Red blocked icon in white card. Data safety note. Open Settings + Retry.
 */
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { PermissionCard } from "@/src/components/ui/PermissionCard";
import { requestContactsPermission } from "@/src/services";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { MaterialIcon } from "@/src/components";
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

  async function handleRetry() {
    const granted = await requestContactsPermission();
    if (granted) {
      nav.goToImportContacts();
      return;
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={nav.goBack}
        hitSlop={10}
      >
        <MaterialIcon name="arrow-back" size={Typography.size.xxl} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <PermissionCard
          iconNode={<MaterialIcon name="block" size={Typography.size.xxxl} color={Colors.debit} />}
          title={t.permissions.deniedTitle}
          description={t.permissions.deniedBody}
          primaryLabel={t.permissions.openSettings}
          onPrimary={handleOpenSettings}
          secondaryLabel={t.permissions.retry}
          onSecondary={handleRetry}
          style={styles.card}
        />

        <View style={styles.safetyCard}>
          <View style={styles.safetyIconBox}>
            <MaterialIcon name="shield" size={Typography.size.xl} color={Colors.textSecondary} />
          </View>
          <View style={styles.safetyTextWrap}>
            <Text style={styles.safetyTitle}>{t.permissions.dataSafetyTitle}</Text>
            <Text style={styles.safetyBody}>{t.permissions.encryptedNote}</Text>
          </View>
        </View>
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

  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    justifyContent: "center",
    gap: Spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  // ── Safety card ──
  safetyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  safetyIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  safetyTextWrap: { flex: 1 },
  safetyTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  safetyBody: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
