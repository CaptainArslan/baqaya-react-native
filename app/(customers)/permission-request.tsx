/**
 * Permission Request screen — import-contacts-flow
 * Design ref: contacts_permission_request/screen.png
 * Bottom-sheet style: dark green hero top, white action area below.
 */
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { PermissionCard } from "@/src/components/ui/PermissionCard";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { MaterialIcon } from "@/src/components";
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
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <TouchableOpacity style={styles.backBtn} onPress={nav.goBack} hitSlop={10}>
        <MaterialIcon name="arrow-back" size={Typography.size.xxl} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <PermissionCard
          iconNode={<MaterialIcon name="contacts" size={Typography.size.xxxl} color={Colors.primary} />}
          title={t.permissions.contactsTitle}
          description={t.permissions.contactsBody}
          primaryLabel={t.permissions.allowAccess}
          onPrimary={handleAllow}
          secondaryLabel={t.permissions.notNow}
          onSecondary={nav.goBack}
          style={styles.card}
        />

        <View style={styles.footer}>
          <MaterialIcon name="lock" size={Typography.size.sm} color={Colors.textMuted} />
          <Text style={styles.footerText}>{t.permissions.encryptedNote}</Text>
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
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
});
