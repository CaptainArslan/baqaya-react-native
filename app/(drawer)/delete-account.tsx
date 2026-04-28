import { MaterialIcon } from "@/src/components";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function RiskCard({
  icon,
  title,
  body,
}: {
  icon: React.ComponentProps<typeof MaterialIcon>["name"];
  title: string;
  body: string;
}) {
  return (
    <View style={styles.riskCard}>
      <View style={styles.riskBar} />
      <View style={styles.riskContent}>
        <View style={styles.riskTitleRow}>
          <MaterialIcon name={icon} size={18} color={Colors.debit} />
          <Text style={styles.riskTitle}>{title}</Text>
        </View>
        <Text style={styles.riskBody}>{body}</Text>
      </View>
    </View>
  );
}

export default function DeleteAccountScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcon name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support & Account</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.heroIconWrap}>
          <View style={styles.heroIcon}>
            <MaterialIcon name="warning" size={44} color={Colors.textInverse} />
          </View>
        </View>

        <Text style={styles.title}>Delete Account?</Text>
        <Text style={styles.subtitle}>
          Deleting your account will permanently remove all your shop data,
          customers, and ledger history. This action cannot be undone.
        </Text>

        <View style={styles.riskList}>
          <RiskCard
            icon="history-toggle-off"
            title="Data Loss"
            body="All financial records and transaction logs will be wiped from your secure storage."
          />
          <RiskCard
            icon="person-off"
            title="Customer Access"
            body="Linked customer profiles and pending balances will no longer be accessible."
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.keepBtn}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.keepBtnText}>Keep Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteLinkBtn}
          onPress={() => router.push("/(drawer)/delete-account-verify")}
          activeOpacity={0.75}
        >
          <Text style={styles.deleteLinkText}>Continue to Delete</Text>
        </TouchableOpacity>
      </View>
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
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    fontSize: Typography.size.lg,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  heroIconWrap: { alignItems: "center", marginBottom: Spacing.lg },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: Radius.lg,
    backgroundColor: Colors.debit,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    textAlign: "center",
    fontSize: Typography.size.display,
    lineHeight: Typography.size.display * 1.2,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.bold,
  },
  subtitle: {
    marginTop: Spacing.sm,
    textAlign: "center",
    fontSize: Typography.size.base,
    lineHeight: Typography.size.base * 1.5,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.xs,
  },
  riskList: { marginTop: Spacing.xl, gap: Spacing.md },
  riskCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  riskBar: {
    width: 4,
    backgroundColor: Colors.debit,
  },
  riskContent: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  riskTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  riskTitle: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  riskBody: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: Typography.size.base * 1.45,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  keepBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
  },
  keepBtnText: {
    color: Colors.textInverse,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
  deleteLinkBtn: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  deleteLinkText: {
    color: Colors.debit,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
});
