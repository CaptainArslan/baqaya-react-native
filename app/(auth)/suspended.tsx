/**
 * Account Suspended screen
 * Design ref: account_suspended_auth_flow
 */
import { Button, MaterialIcon } from "@/src/components";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuspendedScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const s = t.auth.suspended;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcon name="shield" size={Typography.size.lg} color={Colors.primary} />
        <Text style={styles.headerTitle}>{s.screenTitle}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.warningBox}>
          <MaterialIcon name="warning-amber" size={36} color={Colors.debit} />
        </View>

        <Text style={styles.title}>{s.title}</Text>
        <Text style={styles.body}>{s.body}</Text>

        {/* Violation box */}
        <View style={styles.violationBox}>
          <View style={styles.violationHeader}>
            <MaterialIcon name="info-outline" size={Typography.size.base} color={Colors.textMuted} />
            <Text style={styles.violationLabel}>{s.violationLabel}</Text>
          </View>
          <Text style={styles.violationTitle}>{s.violationTitle}</Text>
          <Text style={styles.violationNote}>{s.violationNote}</Text>
        </View>

        <Button
          label={s.contactSupport}
          onPress={() =>
            Alert.alert(
              "Contact Support",
              "Email: support@baqaya.app\nPhone: 0800-BAQAYA\n\nOur team will review your account within 24 hours.",
              [{ text: "OK" }],
            )
          }
          variant="primary"
          size="lg"
        />
        <Button
          label={s.reviewTerms}
          onPress={nav.goToTerms}
          variant="outline"
          size="lg"
        />

        <View style={styles.securityNote}>
          <MaterialIcon name="lock" size={Typography.size.base} color={Colors.textMuted} />
          <Text style={styles.securityText}>{s.securityNote}</Text>
        </View>

        <Text style={styles.backLink} onPress={nav.goToPhone}>
          {s.backToLogin}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
    gap: Spacing.base,
    alignItems: "center",
  },
  warningBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.debitLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
    lineHeight: Typography.size.xxxl * 1.2,
  },
  body: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Typography.size.base * 1.55,
  },
  violationBox: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  violationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  violationLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
  },
  violationTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    lineHeight: Typography.size.base * 1.4,
  },
  violationNote: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.size.sm * 1.5,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  securityText: { fontSize: Typography.size.sm, color: Colors.textMuted },
  backLink: {
    fontSize: Typography.size.base,
    color: Colors.primary,
    fontWeight: Typography.weight.medium,
    marginTop: Spacing.sm,
  },
});
