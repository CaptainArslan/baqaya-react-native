import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { InnerHeader } from "@/src/components";
import { requestContactsPermission } from "@/src/services";
import { Colors, Typography } from "@/src/theme";

export default function ContactPickerScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const granted = await requestContactsPermission();
      if (!mounted) return;
      if (granted) {
        nav.goToImportContacts();
      } else {
        nav.goToPermissionDenied();
      }
    })();
    return () => {
      mounted = false;
    };
  }, [nav]);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <InnerHeader title={t.importContacts.screenTitle} onBack={nav.goBack} />
      <View style={styles.center}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.text}>{t.permissions.checkingPermission}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  text: { fontSize: Typography.size.base, color: Colors.textSecondary },
});
