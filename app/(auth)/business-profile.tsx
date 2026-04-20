import { useTranslation } from "@/src/i18n";
import { authStore } from "@/src/store/authStore";
import { Button } from "@/src/components";
import { Colors, Typography } from "@/src/theme";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function BusinessProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  function handleDeleteAccount() {
    Alert.alert(
      t.drawer.deleteAccount,
      "This will remove your account data from this device.",
      [
        { text: t.common.no, style: "cancel" },
        {
          text: t.common.yes,
          style: "destructive",
          onPress: async () => {
            await authStore.logout();
            router.replace("/(auth)");
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t.drawer.businessProfile}</Text>
      <Button
        label={t.drawer.deleteAccount}
        variant="danger"
        size="lg"
        onPress={handleDeleteAccount}
        style={styles.deleteBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    gap: 16,
  },
  text: {
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  deleteBtn: {
    maxWidth: 320,
  },
});
