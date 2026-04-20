/**
 * Customer Detail screen
 * Design ref: customer_ledger_empty_state_reference_updated_1
 */
import {
    Avatar,
    EmptyState,
    InnerHeader,
    LedgerActionRow,
    NetBalanceCard,
    WhatsAppButton,
} from "@/src/components";
import { getMockCustomer, MOCK_TRANSACTIONS } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { useWhatsAppReminder } from "@/src/hooks/useWhatsAppReminder";
import { useTranslation } from "@/src/i18n";
import { Colors, Spacing, Typography } from "@/src/theme";
import type { Transaction } from "@/src/types";
import { formatCurrency, formatRelativeDate } from "@/src/utils";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomerDetailScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const customer = getMockCustomer(id ?? "") ?? {
    id: id ?? "",
    name: "Customer",
    phone: "",
    balance: 0,
    createdAt: new Date().toISOString(),
  };

  const entries = MOCK_TRANSACTIONS.filter(
    (tx) => tx.customerId === customer.id,
  );

  const balanceStatus =
    customer.balance > 0 ? "owed" : customer.balance < 0 ? "toGive" : "settled";

  const balanceLabel =
    balanceStatus === "owed"
      ? t.customerDetail.youllGet
      : balanceStatus === "toGive"
        ? t.customerDetail.youllGive
        : t.customerDetail.netBalanceDue;

  const { send: sendWhatsApp, canSend: canWhatsApp } = useWhatsAppReminder({
    phone: customer.phone,
    name: customer.name,
    balance: customer.balance,
  });

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <InnerHeader
        title={customer.name}
        subtitle={customer.phone || undefined}
        onBack={nav.goBack}
        leftElement={<Avatar name={customer.name} size="sm" />}
        rightElement={
          <TouchableOpacity
            hitSlop={10}
            onPress={() =>
              Alert.alert(customer.name, "What would you like to do?", [
                { text: "Edit Customer", onPress: () => {} },
                {
                  text: "Delete Customer",
                  style: "destructive",
                  onPress: nav.goBack,
                },
                { text: "Cancel", style: "cancel" },
              ])
            }
          >
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            {/* Balance card */}
            <NetBalanceCard
              balance={Math.abs(customer.balance)}
              status={balanceStatus}
              entryCount={entries.length}
            />

            {/* Action buttons */}
            <LedgerActionRow
              udhaarLabel={t.customerDetail.udhaarAdd}
              paymentLabel={t.customerDetail.paymentAdd}
              onUdhaarPress={() => nav.goToAddEntry(customer.id, "udhaar")}
              onPaymentPress={() => nav.goToAddEntry(customer.id, "payment")}
            />

            {/* WhatsApp reminder */}
            <WhatsAppButton
              label={t.whatsapp.buttonLabel}
              onPress={sendWhatsApp}
              disabled={!canWhatsApp}
            />

            {/* Section header */}
            {entries.length > 0 && (
              <Text style={styles.sectionLabel}>
                {t.customerDetail.entries}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Text style={styles.emptyIcon}>🧾</Text>}
            title={t.customerDetail.noEntries}
            description={t.customerDetail.noEntriesBody}
            style={styles.emptyState}
          />
        }
        renderItem={({ item }: { item: Transaction }) => (
          <View style={styles.txRow}>
            <View style={styles.txLeft}>
              <Text style={styles.txType}>
                {item.type === "debit" ? "↗" : "↙"}
              </Text>
              <View>
                <Text style={styles.txNote}>
                  {item.note ??
                    (item.type === "debit"
                      ? t.customerDetail.typeUdhaar
                      : t.customerDetail.typePayment)}
                </Text>
                <Text style={styles.txDate}>
                  {formatRelativeDate(item.createdAt)}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.txAmount,
                { color: item.type === "debit" ? Colors.debit : Colors.credit },
              ]}
            >
              {item.type === "debit" ? "+" : "-"}
              {formatCurrency(item.amount)}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  menuDots: {
    fontSize: 22,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.bold,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: Spacing.xs,
  },
  emptyState: { marginTop: Spacing.xl },
  emptyIcon: { fontSize: 36 },

  txRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  txLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  txType: { fontSize: 18 },
  txNote: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  txDate: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  txAmount: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
});
