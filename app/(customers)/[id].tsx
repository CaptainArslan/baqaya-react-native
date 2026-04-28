/**
 * Customer Detail screen
 * Design ref: customer_ledger_empty_state_reference_updated_1
 */
import {
    Avatar,
    EmptyState,
    InnerHeader,
    LedgerActionRow,
    MaterialIcon,
    NetBalanceCard,
    WhatsAppButton,
} from "@/src/components";
import { SCREEN_MOCKS } from "@/data";
import {
  deleteMockCustomer,
  getMockCustomer,
  getMockTransactionsForCustomer,
} from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/theme";
import type { Transaction } from "@/src/types";
import { formatCurrency, formatRelativeDate } from "@/src/utils";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    FlatList,
    Modal,
    Pressable,
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
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const EMPTY_STATE_CUSTOMER = SCREEN_MOCKS.customers.customerDetail.emptyStateCustomer;

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const customer = React.useMemo(
    () =>
      getMockCustomer(id ?? "") ?? {
        ...EMPTY_STATE_CUSTOMER,
        id: id ?? EMPTY_STATE_CUSTOMER.id,
      },
    [EMPTY_STATE_CUSTOMER, id, refreshKey],
  );

  const entries = React.useMemo(
    () => getMockTransactionsForCustomer(customer.id),
    [customer.id, refreshKey],
  );
  const hasEntries = entries.length > 0;
  const displayBalance = hasEntries ? Math.abs(customer.balance) : 0;

  const balanceStatus =
    displayBalance > 0
      ? customer.balance > 0
        ? "owed"
        : "toGive"
      : "settled";

  const balanceLabel =
    balanceStatus === "owed"
      ? t.customerDetail.youllGet
      : balanceStatus === "toGive"
        ? t.customerDetail.youllGive
        : t.customerDetail.netBalanceDue;

  const canWhatsApp = !!customer.phone?.trim();

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <InnerHeader
        title={customer.name}
        subtitle={customer.phone || undefined}
        onBack={nav.goBack}
        leftElement={<Avatar name={customer.name} size="sm" style={styles.headerAvatar} />}
        rightElement={
          <TouchableOpacity
            hitSlop={10}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        }
      />

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.75}
              onPress={() => {
                setMenuVisible(false);
                nav.goToEditCustomer(customer.id);
              }}
            >
              <MaterialIcon name="edit" size={22} color={Colors.textSecondary} />
              <Text style={styles.menuLabel}>Edit Profile</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.75}
              onPress={() => {
                setMenuVisible(false);
                setDeleteConfirmVisible(true);
              }}
            >
              <MaterialIcon name="delete" size={22} color={Colors.debit} />
              <Text style={styles.menuLabelDanger}>Delete Customer</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={deleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <Pressable
          style={styles.confirmOverlay}
          onPress={() => setDeleteConfirmVisible(false)}
        >
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconWrap}>
              <MaterialIcon name="delete" size={30} color={Colors.debit} />
            </View>
            <Text style={styles.confirmTitle}>Delete Customer?</Text>
            <Text style={styles.confirmBody}>
              Are you sure you want to delete {customer.name}? This action cannot be
              undone.
            </Text>
            <TouchableOpacity
              style={styles.confirmDeleteBtn}
              activeOpacity={0.85}
              onPress={() => {
                setDeleteConfirmVisible(false);
                deleteMockCustomer(customer.id);
                nav.goBack();
              }}
            >
              <Text style={styles.confirmDeleteText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmCancelBtn}
              activeOpacity={0.75}
              onPress={() => setDeleteConfirmVisible(false)}
            >
              <Text style={styles.confirmCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.headerStack}>
            {/* Balance card */}
            <NetBalanceCard
              balance={displayBalance}
              status={balanceStatus}
              entryCount={entries.length}
              showMeta={false}
              style={styles.balanceCard}
            />

            {/* Action buttons */}
            <LedgerActionRow
              udhaarLabel={t.customerDetail.udhaarAdd}
              paymentLabel={t.customerDetail.paymentAdd}
              onUdhaarPress={() => nav.goToAddEntry(customer.id, "udhaar")}
              onPaymentPress={() => nav.goToAddEntry(customer.id, "payment")}
              style={styles.actionRow}
            />

            {/* WhatsApp reminder */}
            <WhatsAppButton
              label={t.whatsapp.buttonLabel}
              onPress={() => {
                if (!canWhatsApp) return;
                nav.goToWhatsAppReminder(customer.id);
              }}
              disabled={!canWhatsApp}
              style={styles.whatsappBtn}
            />

            {/* Section header */}
            {entries.length > 0 && (
              <Text style={styles.sectionLabel}>
                {t.customerDetail.entries}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={
              <View style={styles.emptyIconCard}>
                <MaterialIcon
                  name="receipt-long"
                  size={44}
                  color={Colors.textMuted}
                />
              </View>
            }
            title={t.customerDetail.noEntries}
            description={t.customerDetail.noEntriesBody}
            style={styles.emptyState}
          />
        }
        renderItem={({ item }: { item: Transaction }) => (
          <TouchableOpacity
            style={styles.txTile}
            activeOpacity={0.8}
            onPress={() => nav.goToTransactionDetail(item.id)}
          >
            <View
              style={[
                styles.txAccent,
                { backgroundColor: item.type === "debit" ? Colors.debit : Colors.credit },
              ]}
            />
            <View style={styles.txHead}>
              <Text style={styles.txTitle} numberOfLines={1}>
                {(item.note ??
                  (item.type === "debit"
                    ? t.customerDetail.typeUdhaar
                    : t.customerDetail.typePayment)
                )
                  .trim()
                  .split(" ")
                  .slice(0, 3)
                  .join(" ")}
              </Text>
              <Text
                style={[
                  styles.txAmount,
                  { color: item.type === "debit" ? Colors.debit : Colors.credit },
                ]}
              >
                {item.type === "debit" ? "+" : "-"}
                {formatCurrency(item.amount)}
              </Text>
              <MaterialIcon
                name="chevron-right"
                size={20}
                color={Colors.textMuted}
                style={styles.txChevron}
              />
            </View>
            <View style={styles.txMetaRow}>
              <View style={styles.txTimeWrap}>
                <MaterialIcon
                  name="schedule"
                  size={14}
                  color={Colors.textMuted}
                />
                <Text style={styles.txDate}>
                  {new Date(item.createdAt).toLocaleTimeString("en-PK", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
              </View>
              <Text style={styles.txTypeTag}>
                {item.type === "debit"
                  ? t.customerDetail.typeUdhaar.toUpperCase()
                  : t.customerDetail.typePayment.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  menuDots: {
    fontSize: Typography.size.xxl,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.bold,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  menuCard: {
    position: "absolute",
    top: 76,
    right: Spacing.base,
    width: 240,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: Spacing.xs,
    ...Shadows.md,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.base,
  },
  menuLabel: {
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  menuLabelDanger: {
    fontSize: Typography.size.lg,
    color: Colors.debit,
    fontWeight: Typography.weight.medium,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  confirmCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: "center",
    ...Shadows.md,
  },
  confirmIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.lg,
    backgroundColor: Colors.debitLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  confirmTitle: {
    fontSize: Typography.size.xxl,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.bold,
    textAlign: "center",
  },
  confirmBody: {
    marginTop: Spacing.sm,
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Typography.size.base * 1.5,
    marginBottom: Spacing.lg,
  },
  confirmDeleteBtn: {
    width: "100%",
    borderRadius: Radius.lg,
    backgroundColor: Colors.debit,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  confirmDeleteText: {
    color: Colors.textInverse,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
  confirmCancelBtn: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  confirmCancelText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.medium,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  headerStack: {
    gap: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  balanceCard: {
    alignSelf: "stretch",
  },
  actionRow: {
    alignSelf: "stretch",
  },
  whatsappBtn: {
    alignSelf: "stretch",
  },
  headerAvatar: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: Spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: Spacing.xxl,
  },
  emptyIconCard: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  txTile: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    gap: 4,
    overflow: "hidden",
    position: "relative",
  },
  txAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  txHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  txTitle: {
    flex: 1,
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  txMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 1,
  },
  txTimeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  txDate: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  txTypeTag: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.bold,
  },
  txAmount: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
  },
  txChevron: {
    marginLeft: -Spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
});
