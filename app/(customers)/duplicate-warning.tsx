/**
 * Duplicate Customer Warning — add-customer-flow / import-contacts-flow
 * Design ref: duplicate_customer_warning/screen.png
 * Modal sheet: person+exclamation icon, customer preview card, View/Cancel actions.
 */
import { Avatar } from "@/src/components";
import { getMockCustomer } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DuplicateWarningScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const { existingId, phone } = useLocalSearchParams<{
    existingId: string;
    phone: string;
  }>();

  const existing = getMockCustomer(existingId ?? "");
  const name = existing?.name ?? "Customer";
  const balance = existing?.balance ?? 0;
  const existingPhone = existing?.phone ?? phone ?? "";

  function handleViewCustomer() {
    nav.goToCustomerDetail(existingId ?? "");
  }

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      {/* Sheet handle */}
      <View style={styles.sheetHandle} />

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconWrap}>
          <Text style={styles.iconEmoji}>👤</Text>
          <View style={styles.exclBadge}>
            <Text style={styles.exclText}>!</Text>
          </View>
        </View>

        <Text style={styles.title}>{t.duplicate.title}</Text>
        <Text style={styles.body}>{t.duplicate.body}</Text>

        {/* Customer preview card */}
        <View style={styles.previewCard}>
          <Avatar name={name} size="md" />
          <View style={styles.previewInfo}>
            <Text style={styles.previewName}>{name}</Text>
            {existingPhone ? (
              <Text style={styles.previewPhone}>
                {t.duplicate.phone}: {existingPhone}
              </Text>
            ) : null}
          </View>
          {balance > 0 && (
            <View style={styles.balanceBadge}>
              <Text style={styles.balanceLabel}>{t.duplicate.owes}</Text>
              <Text style={styles.balanceAmount}>
                Rs {formatCurrency(balance)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleViewCustomer}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>{t.duplicate.viewExisting}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={nav.goBack}
          activeOpacity={0.7}
        >
          <Text style={styles.ghostBtnText}>{t.duplicate.cancel}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },

  // ── Icon ──
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.errorLight,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: Spacing.sm,
  },
  iconEmoji: { fontSize: 40 },
  exclBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  exclText: {
    color: Colors.textInverse,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },

  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  body: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Typography.size.base * 1.55,
  },

  // ── Preview card ──
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  previewInfo: { flex: 1 },
  previewName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  previewPhone: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  balanceBadge: { alignItems: "flex-end" },
  balanceLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.debit,
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.debit,
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
});
