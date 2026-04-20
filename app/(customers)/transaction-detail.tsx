/**
 * Transaction Detail screen
 * Shows full detail of a single ledger entry.
 */
import { InnerHeader } from "@/src/components";
import { MOCK_TRANSACTIONS } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { formatCurrency, formatRelativeDate } from "@/src/utils";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionDetailScreen() {
  const nav = useAppNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const tx = MOCK_TRANSACTIONS.find((t) => t.id === id);
  const isCredit = tx?.type === "credit";
  const accentColor = isCredit ? Colors.credit : Colors.debit;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <InnerHeader
        title={isCredit ? "Payment Received" : "Udhaar Given"}
        subtitle={tx?.customerName}
        onBack={nav.goBack}
      />

      <View style={styles.content}>
        {tx ? (
          <>
            {/* Amount hero */}
            <View style={[styles.amountCard, { borderColor: accentColor }]}>
              <Text style={[styles.amountLabel, { color: accentColor }]}>
                {isCredit ? "RECEIVED" : "GIVEN"}
              </Text>
              <Text style={[styles.amount, { color: accentColor }]}>
                Rs. {formatCurrency(tx.amount)}
              </Text>
            </View>

            {/* Details */}
            <View style={styles.detailCard}>
              <DetailRow label="Customer" value={tx.customerName} />
              <DetailRow label="Type" value={isCredit ? "Payment" : "Udhaar"} />
              {tx.note && <DetailRow label="Note" value={tx.note} />}
              <DetailRow
                label="Date"
                value={formatRelativeDate(tx.createdAt)}
              />
              <DetailRow label="Synced" value={tx.synced ? "Yes" : "Pending"} />
            </View>
          </>
        ) : (
          <View style={styles.notFound}>
            <Text style={styles.notFoundIcon}>🧾</Text>
            <Text style={styles.notFoundText}>Transaction not found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weight.medium,
  },
  value: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  amountCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 2,
    gap: Spacing.xs,
  },
  amountLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    letterSpacing: 1,
  },
  amount: {
    fontSize: Typography.size.hero,
    fontWeight: Typography.weight.bold,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  notFoundIcon: { fontSize: 48, opacity: 0.4 },
  notFoundText: {
    fontSize: Typography.size.base,
    color: Colors.textMuted,
  },
});
