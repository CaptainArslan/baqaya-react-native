import { MaterialIcon } from "@/src/components";
import { getMockTransaction, updateMockTransaction } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditTransactionScreen() {
  const nav = useAppNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tx = useMemo(() => getMockTransaction(id ?? ""), [id]);

  const [amount, setAmount] = useState(tx ? String(tx.amount) : "");
  const [note, setNote] = useState(tx?.note ?? "");
  const txDate = tx ? new Date(tx.createdAt) : new Date();
  const isPayment = tx?.type === "credit";
  const accentColor = isPayment ? Colors.credit : Colors.debit;
  const accentLight = isPayment ? Colors.creditLight : Colors.debitLight;
  const accentBorder = isPayment ? Colors.credit : Colors.debit;
  const flowLabel = isPayment ? "Payment" : "Ledger";
  const dateLabel = txDate.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeLabel = txDate.toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const txCode = `#${tx?.id.slice(-6).toUpperCase() ?? "000000"}`;

  function handleSave() {
    if (!id || !tx) return;
    const parsed = parseFloat(amount.replace(/,/g, ""));
    if (Number.isNaN(parsed) || parsed <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount.");
      return;
    }
    updateMockTransaction(id, { amount: parsed, note: note.trim() || undefined });
    nav.goToTransactionDetail(id);
  }

  if (!tx) {
    return (
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={nav.goBack} hitSlop={10} style={styles.headerIconBtn}>
            <MaterialIcon name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Transaction</Text>
          <View style={styles.headerIdChip}>
            <Text style={styles.headerIdText}>{txCode}</Text>
          </View>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Transaction not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={nav.goBack} hitSlop={10} style={styles.headerIconBtn}>
          <MaterialIcon name="close" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Transaction</Text>
        <View style={styles.headerIdChip}>
          <Text style={styles.headerIdText}>ID: {txCode}</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <View style={[styles.infoAccent, { backgroundColor: accentBorder }]} />
            <Text style={styles.infoSubtitle}>Editing Transaction for</Text>
            <Text style={styles.infoName}>{tx.customerName}</Text>
            <View style={styles.infoNotice}>
              <MaterialIcon name="info" size={16} color={accentColor} />
              <Text style={[styles.infoNoticeText, { color: accentColor }]}>
                Editing this {flowLabel.toLowerCase()} entry will automatically update the customer&apos;s total outstanding balance.
              </Text>
            </View>
          </View>

          <Text style={styles.label}>AMOUNT</Text>
          <View style={[styles.inputRow, { borderColor: accentBorder }]}>
            <Text style={styles.currency}>PKR</Text>
            <TextInput
              value={amount}
              onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ""))}
              keyboardType="decimal-pad"
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <Text style={styles.label}>DATE</Text>
          <View style={styles.metaRow}>
            <View style={styles.iconLine}>
              <MaterialIcon name="calendar-month" size={18} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{dateLabel}</Text>
            </View>
            <MaterialIcon name="edit" size={16} color={Colors.textSecondary} />
          </View>

          <Text style={styles.label}>TIME</Text>
          <View style={styles.metaRow}>
            <View style={styles.iconLine}>
              <MaterialIcon name="schedule" size={18} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{timeLabel}</Text>
            </View>
            <MaterialIcon name="edit" size={16} color={Colors.textSecondary} />
          </View>

          <Text style={styles.label}>TRANSACTION NOTES</Text>
          <View style={styles.noteBox}>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Write notes..."
              placeholderTextColor={Colors.textMuted}
              multiline
              style={styles.noteInput}
            />
          </View>

          <Text style={styles.label}>REFERENCE IMAGE</Text>
          <View style={styles.imageRow}>
            <View style={styles.imagePreview}>
              <MaterialIcon name="description" size={36} color={Colors.textSecondary} />
            </View>
            <TouchableOpacity style={styles.updateBillCard} activeOpacity={0.8}>
              <MaterialIcon name="add-a-photo" size={20} color={Colors.textSecondary} />
              <Text style={styles.updateBillText}>UPDATE BILL</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={nav.goBack} activeOpacity={0.8}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: accentColor }]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <MaterialIcon name="check-circle" size={18} color={Colors.textInverse} />
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  headerIconBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.size.lg,
    color: Colors.primaryText,
    fontWeight: Typography.weight.semibold,
  },
  headerIdChip: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  headerIdText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  label: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.7,
  },
  infoCard: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    paddingLeft: Spacing.lg,
    position: "relative",
    gap: Spacing.xs,
  },
  infoAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.debit,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  infoSubtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
  infoName: {
    fontSize: Typography.size.xxl,
    color: Colors.primaryText,
    fontWeight: Typography.weight.bold,
  },
  infoNotice: {
    marginTop: Spacing.xs,
    flexDirection: "row",
    gap: Spacing.xs,
    alignItems: "flex-start",
  },
  infoNoticeText: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: Typography.size.base * 1.4,
  },
  inputRow: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
    marginRight: Spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: Typography.size.xxl,
    color: Colors.textPrimary,
    paddingVertical: 0,
    fontWeight: Typography.weight.bold,
  },
  metaRow: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  metaText: {
    fontSize: Typography.size.xl,
    color: Colors.primaryText,
    fontWeight: Typography.weight.medium,
  },
  noteBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    minHeight: 110,
    padding: Spacing.md,
  },
  noteInput: {
    fontSize: Typography.size.xl,
    color: Colors.textPrimary,
    textAlignVertical: "top",
    lineHeight: Typography.size.xl * 1.4,
  },
  imageRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  imagePreview: {
    width: 96,
    height: 96,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  updateBillCard: {
    width: 96,
    height: 96,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.background,
  },
  updateBillText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.background,
    flexDirection: "row",
    gap: Spacing.sm,
  },
  cancelBtn: {
    flex: 0.9,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSecondary,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  saveBtn: {
    flex: 1.8,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  saveText: {
    fontSize: Typography.size.lg,
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontSize: Typography.size.base,
    color: Colors.textMuted,
  },
});

