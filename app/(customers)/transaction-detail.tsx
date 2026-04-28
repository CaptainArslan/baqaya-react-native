/**
 * Transaction Detail screen
 * Shows full detail of a single ledger entry.
 */
import { InnerHeader, MaterialIcon } from "@/src/components";
import { deleteMockTransaction, getAllMockTransactions } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionDetailScreen() {
  const nav = useAppNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const tx = React.useMemo(
    () => getAllMockTransactions().find((t) => t.id === id),
    [id, refreshKey],
  );
  const isCredit = tx?.type === "credit";
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const statusLabel = isCredit ? "PAYMENT RECEIVED" : "CREDIT ADDED";
  const toneColor = isCredit ? Colors.credit : Colors.debit;
  const toneBgColor = isCredit ? Colors.creditLight : Colors.debitLight;
  const txId = tx ? `#TXN-${tx.id.slice(-6).toUpperCase()}` : "#TXN-000000";
  const hasAttachment = !!tx?.imageUrl?.trim();
  const attachmentName = hasAttachment
    ? tx!.imageUrl!.split("/").pop() || "receipt.jpg"
    : "";
  const txDateTime = tx
    ? new Date(tx.createdAt).toLocaleString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <InnerHeader
        title="Transaction Details"
        onBack={nav.goBack}
        rightElement={
          <View style={styles.headerAvatar}>
            <MaterialIcon name="person" size={14} color={Colors.surface} />
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tx ? (
          <>
            <View style={styles.amountCard}>
              <View style={[styles.leftAccent, { backgroundColor: toneColor }]} />
              <Text style={[styles.amountChip, { color: toneColor, backgroundColor: toneBgColor }]}>
                {statusLabel}
              </Text>
              <Text style={styles.amountTitle}>TRANSACTION AMOUNT</Text>
              <Text style={[styles.amountValue, { color: toneColor }]}>
                {formatCurrency(tx.amount)}
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.infoLabel}>TRANSACTION ID</Text>
              <View style={styles.copyRow}>
                <Text style={styles.infoValue}>{txId}</Text>
                <MaterialIcon name="content-copy" size={16} color={Colors.textMuted} />
              </View>

              <Text style={styles.infoLabel}>DATE & TIME</Text>
              <Text style={styles.infoValue}>{txDateTime}</Text>

              <Text style={styles.infoLabel}>CUSTOMER</Text>
              <View style={styles.iconLine}>
                <View style={styles.customerIconWrap}>
                  <MaterialIcon name="person" size={14} color={Colors.textSecondary} />
                </View>
                <Text style={styles.infoValue}>{tx.customerName}</Text>
              </View>

              <Text style={styles.infoLabel}>ADDED BY</Text>
              <Text style={styles.infoValue}>Shop Owner (Me)</Text>

              <Text style={styles.infoLabel}>PAYMENT METHOD</Text>
              <View style={styles.iconLine}>
                <MaterialIcon name="payments" size={18} color={Colors.textSecondary} />
                <Text style={styles.infoValue}>{isCredit ? "Cash" : "Credit"}</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.infoLabel}>NOTES</Text>
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>
                  {tx.note?.trim() || "No additional notes."}
                </Text>
              </View>
            </View>

            <View style={styles.receiptCard}>
              <View style={styles.iconLine}>
                <MaterialIcon name="description" size={20} color={Colors.textSecondary} />
                <View style={styles.receiptMeta}>
                  <Text style={styles.receiptTitle}>
                    {hasAttachment ? "Bill Receipt Image" : "No Bill Receipt Attached"}
                  </Text>
                  <Text style={styles.receiptSub}>
                    {hasAttachment
                      ? attachmentName
                      : "Add attachment from Edit Transaction"}
                  </Text>
                </View>
              </View>
              {hasAttachment ? (
                <TouchableOpacity activeOpacity={0.75}>
                  <MaterialIcon name="download" size={20} color={Colors.primaryText} />
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.editBtn}
              activeOpacity={0.85}
              onPress={() => tx?.id && nav.goToEditTransaction(tx.id)}
            >
              <MaterialIcon name="edit" size={18} color={Colors.primaryText} />
              <Text style={styles.editBtnText}>Edit Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              activeOpacity={0.75}
              onPress={() => setDeleteConfirmVisible(true)}
            >
              <MaterialIcon name="delete" size={18} color={Colors.debit} />
              <Text style={styles.deleteBtnText}>Delete Transaction</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.notFound}>
            <MaterialIcon
              name="receipt-long"
              size={Typography.size.xxxl}
              color={Colors.textMuted}
              style={styles.notFoundIcon}
            />
            <Text style={styles.notFoundText}>Transaction not found</Text>
          </View>
        )}
      </ScrollView>

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
            <Text style={styles.confirmTitle}>Delete Transaction?</Text>
            <Text style={styles.confirmBody}>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </Text>
            <TouchableOpacity
              style={styles.confirmDeleteBtn}
              activeOpacity={0.85}
              onPress={() => {
                if (!tx?.id) return;
                deleteMockTransaction(tx.id);
                setDeleteConfirmVisible(false);
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  amountCard: {
    position: "relative",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
    overflow: "hidden",
  },
  leftAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  amountChip: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  amountTitle: {
    fontSize: Typography.size.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  amountValue: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.xs,
  },
  infoLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.8,
    marginTop: Spacing.sm,
  },
  infoValue: {
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  copyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  iconLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  customerIconWrap: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  noteBox: {
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  noteText: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    lineHeight: Typography.size.base * 1.5,
    fontStyle: "italic",
  },
  receiptCard: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  receiptMeta: { marginLeft: Spacing.xs },
  receiptTitle: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  receiptSub: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  editBtnText: {
    fontSize: Typography.size.base,
    color: Colors.primaryText,
    fontWeight: Typography.weight.semibold,
  },
  deleteBtn: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  deleteBtnText: {
    fontSize: Typography.size.base,
    color: Colors.debit,
    fontWeight: Typography.weight.bold,
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryText,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
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
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  notFoundIcon: { opacity: 0.4 },
  notFoundText: {
    fontSize: Typography.size.base,
    color: Colors.textMuted,
  },
});
