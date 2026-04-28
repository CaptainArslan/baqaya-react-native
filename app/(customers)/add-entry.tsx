/**
 * Add Ledger Entry — modal screen
 * Reached from: Customer Detail → Udhaar / Payment buttons
 *               Home / Cashbook → Add Entry FAB
 */
import { Avatar, MaterialIcon } from "@/src/components";
import {
  addMockTransaction,
  getAllMockCustomers,
  getMockCustomer,
  updateMockCustomer,
} from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { toast } from "@/src/services";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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

export default function AddEntryScreen() {
  const nav = useAppNavigation();
  const { customerId, type } = useLocalSearchParams<{
    customerId: string;
    type: "udhaar" | "payment";
  }>();

  const allCustomers = useMemo(() => getAllMockCustomers(), []);
  const initialCustomerId =
    (customerId && getMockCustomer(customerId)?.id) || allCustomers[0]?.id || "";
  const [selectedCustomerId, setSelectedCustomerId] = useState(initialCustomerId);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const selectedCustomer = getMockCustomer(selectedCustomerId);
  const customerName = selectedCustomer?.name ?? "Customer";
  const [entryType, setEntryType] = useState<"udhaar" | "payment">(
    type === "payment" ? "payment" : "udhaar",
  );
  const isUdhaar = entryType === "udhaar";

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [billName] = useState("Bill_240ct.jpg");
  const [billSize] = useState("1.2MB");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank" | "online">("cash");
  const [amountError, setAmountError] = useState("");

  const quickAmounts = [100, 500, 1000];
  const todayLabel = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const parsedAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const customerBalance = Math.max(selectedCustomer?.balance ?? 0, 0);
  const newBalance = Math.max(customerBalance - parsedAmount, 0);
  const hasCustomers = allCustomers.length > 0;
  const filteredCustomers = allCustomers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.trim().toLowerCase()),
  );

  function handleSave() {
    if (!selectedCustomer) {
      setAmountError("Please select a customer first");
      return;
    }
    const parsed = parseFloat(amount.replace(/,/g, ""));
    if (!amount.trim() || isNaN(parsed) || parsed <= 0) {
      setAmountError("Enter a valid amount greater than 0");
      return;
    }
    const txType = isUdhaar ? "debit" : "credit";
    const nowIso = new Date().toISOString();

    addMockTransaction({
      id: `tx_${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      type: txType,
      amount: parsed,
      note: note.trim() || undefined,
      createdAt: nowIso,
      synced: false, // offline-first: local-first write, sync later
    });

    const currentBalance = selectedCustomer.balance ?? 0;
    const nextBalance = isUdhaar
      ? currentBalance + parsed
      : Math.max(currentBalance - parsed, 0);

    updateMockCustomer(selectedCustomer.id, {
      balance: nextBalance,
      lastActivity: nowIso,
    });

    toast.success(
      isUdhaar ? "Entry saved successfully" : "Payment saved successfully",
      { durationMs: 3000 },
    );
    nav.goBack();
  }

  const canSave = amount.trim().length > 0 && !!selectedCustomer;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={nav.goBack} style={styles.headerIconBtn} hitSlop={10}>
          <MaterialIcon name="close" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Entry</Text>
        <TouchableOpacity style={styles.headerIconBtn} hitSlop={10}>
          <MaterialIcon name="history" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.typeTabs}>
            <TouchableOpacity
              style={[styles.typeTab, isUdhaar && styles.typeTabActive]}
              activeOpacity={0.8}
              onPress={() => setEntryType("udhaar")}
            >
              <MaterialIcon
                name="south"
                size={20}
                color={Colors.textSecondary}
              />
              <Text style={[styles.typeTabText, isUdhaar && styles.typeTabTextActive]}>
                Gave (Udhaar)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeTab, !isUdhaar && styles.typeTabActive]}
              activeOpacity={0.8}
              onPress={() => setEntryType("payment")}
            >
              <MaterialIcon
                name="north"
                size={20}
                color={Colors.textSecondary}
              />
              <Text style={[styles.typeTabText, !isUdhaar && styles.typeTabTextActive]}>
                Received
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Customer / Grahak</Text>
          {!hasCustomers ? (
            <View style={styles.emptyCustomerBox}>
              <Text style={styles.emptyCustomerTitle}>No customer available</Text>
              <Text style={styles.emptyCustomerBody}>
                Add a customer first, then create entry.
              </Text>
              <TouchableOpacity
                style={styles.emptyCustomerBtn}
                activeOpacity={0.85}
                onPress={nav.goToAddCustomer}
              >
                <MaterialIcon name="person-add" size={18} color={Colors.textInverse} />
                <Text style={styles.emptyCustomerBtnText}>Add Customer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.customerDropdownWrap}>
              <TouchableOpacity
                style={styles.customerDropdownBtn}
                activeOpacity={0.85}
                onPress={() =>
                  setShowCustomerDropdown((v) => {
                    const next = !v;
                    if (!next) setCustomerSearch("");
                    return next;
                  })
                }
              >
                <View style={styles.customerDropdownLeft}>
                  <Avatar name={customerName} size="sm" />
                  <View>
                    <Text style={styles.customerDropdownName}>{customerName}</Text>
                    <Text style={styles.customerDropdownSub}>
                      Balance: {formatCurrency(customerBalance)}
                    </Text>
                  </View>
                </View>
                <MaterialIcon
                  name={showCustomerDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={22}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>

              {showCustomerDropdown ? (
                <View style={styles.customerDropdownMenu}>
                  <View style={styles.customerSearchRow}>
                    <MaterialIcon name="search" size={18} color={Colors.textMuted} />
                    <TextInput
                      value={customerSearch}
                      onChangeText={setCustomerSearch}
                      placeholder="Search customer..."
                      placeholderTextColor={Colors.textMuted}
                      style={styles.customerSearchInput}
                    />
                  </View>
                  {filteredCustomers.map((c) => {
                    const active = c.id === selectedCustomerId;
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.customerOption, active && styles.customerOptionActive]}
                        activeOpacity={0.8}
                        onPress={() => {
                          setSelectedCustomerId(c.id);
                          setCustomerSearch("");
                          setShowCustomerDropdown(false);
                        }}
                      >
                        <Avatar name={c.name} size="sm" />
                        <View style={styles.customerOptionMeta}>
                          <Text style={styles.customerOptionName} numberOfLines={1}>
                            {c.name}
                          </Text>
                          <Text style={styles.customerOptionSub}>
                            {formatCurrency(Math.max(c.balance ?? 0, 0))}
                          </Text>
                        </View>
                        {active ? (
                          <MaterialIcon name="check-circle" size={18} color={Colors.primary} />
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                  {filteredCustomers.length === 0 ? (
                    <View style={styles.customerNoResult}>
                      <Text style={styles.customerNoResultText}>No customer found</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          )}

          {isUdhaar ? (
            <>
              <Text style={styles.label}>Amount / Raqam</Text>
              <View
                style={[
                  styles.amountField,
                  { borderColor: amountError ? Colors.debit : Colors.primary },
                ]}
              >
                <Text style={styles.currencyPrefix}>Rs.</Text>
                <TextInput
                  value={amount}
                  onChangeText={(v) => {
                    setAmount(v.replace(/[^0-9.]/g, ""));
                    setAmountError("");
                  }}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  style={styles.amountInput}
                />
                <View style={styles.amountArrows}>
                  <MaterialIcon name="keyboard-arrow-up" size={16} color={Colors.textMuted} />
                  <MaterialIcon name="keyboard-arrow-down" size={16} color={Colors.textMuted} />
                </View>
              </View>
              {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}

              <View style={styles.quickAmountRow}>
                {quickAmounts.map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={styles.quickAmount}
                    activeOpacity={0.8}
                    onPress={() => {
                      setAmount(String(v));
                      setAmountError("");
                    }}
                  >
                    <Text style={styles.quickPlus}>+</Text>
                    <Text style={styles.quickAmountText}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Details (Optional)</Text>
              <View style={styles.inputRow}>
                <MaterialIcon name="edit-note" size={20} color={Colors.textMuted} />
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="What is this for?"
                  placeholderTextColor={Colors.textMuted}
                  style={styles.inputText}
                />
              </View>

              <Text style={styles.label}>Transaction Date</Text>
              <View style={styles.inputRow}>
                <MaterialIcon name="calendar-month" size={20} color={Colors.textMuted} />
                <Text style={styles.inputValue}>Today, {todayLabel}</Text>
                <MaterialIcon
                  name="keyboard-arrow-down"
                  size={20}
                  color={Colors.textMuted}
                  style={styles.rowEndIcon}
                />
              </View>

              <Text style={styles.label}>Add Bill/Receipt (Optional)</Text>
              <View style={styles.billRow}>
                <View style={styles.billThumb}>
                  <MaterialIcon name="receipt-long" size={42} color={Colors.textSecondary} />
                  <Text style={styles.billBrand}>Baqaya</Text>
                </View>
                <View style={styles.billMeta}>
                  <TouchableOpacity activeOpacity={0.8} style={styles.updateBillBtn}>
                    <MaterialIcon name="photo-camera" size={18} color={Colors.textSecondary} />
                    <Text style={styles.updateBillText}>Update Bill</Text>
                  </TouchableOpacity>
                  <Text style={styles.billFileText}>
                    {billName} • {billSize}
                  </Text>
                </View>
              </View>

              <View style={styles.customerCard}>
                <Avatar name={customerName} size="md" />
                <View style={styles.customerMeta}>
                  <Text style={styles.customerMetaLabel}>Adding for</Text>
                  <Text style={styles.customerMetaName} numberOfLines={1}>
                    {customerName}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setShowCustomerDropdown(true)}
                >
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </View>

            </>
          ) : (
            <>
              <View style={styles.customerSummaryCard}>
                <View style={styles.customerSummaryTop}>
                  <Text style={styles.customerSummaryLabel}>CUSTOMER NAME / NAM</Text>
                  <Text style={styles.customerSummaryLabel}>BALANCE</Text>
                </View>
                <View style={styles.customerSummaryBottom}>
                  <Text style={styles.customerSummaryName}>{customerName}</Text>
                  <Text style={styles.customerSummaryBalance}>
                    {formatCurrency(customerBalance)}
                  </Text>
                </View>
              </View>

              <Text style={styles.label}>Amount Received / Wasool Rakam</Text>
              <View
                style={[
                  styles.amountField,
                  { borderColor: amountError ? Colors.debit : Colors.primary },
                ]}
              >
                <Text style={styles.currencyPrefix}>Rs.</Text>
                <TextInput
                  value={amount}
                  onChangeText={(v) => {
                    setAmount(v.replace(/[^0-9.]/g, ""));
                    setAmountError("");
                  }}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  style={styles.amountInput}
                />
                <View style={styles.amountArrows}>
                  <MaterialIcon name="keyboard-arrow-up" size={16} color={Colors.textMuted} />
                  <MaterialIcon name="keyboard-arrow-down" size={16} color={Colors.textMuted} />
                </View>
              </View>
              {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}

              <Text style={styles.label}>Payment Method / Zariya-e-Adayegi</Text>
              <View style={styles.methodRow}>
                {[
                  { id: "cash", label: "CASH", sub: "Naqad", icon: "payments" as const },
                  { id: "bank", label: "BANK", sub: "Bank Se", icon: "account-balance" as const },
                  { id: "online", label: "ONLINE", sub: "Digital", icon: "account-balance-wallet" as const },
                ].map((m) => {
                  const active = paymentMethod === m.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      style={[styles.methodCard, active && styles.methodCardActive]}
                      activeOpacity={0.8}
                      onPress={() => setPaymentMethod(m.id as "cash" | "bank" | "online")}
                    >
                      <MaterialIcon
                        name={m.icon}
                        size={22}
                        color={active ? Colors.textInverse : Colors.textSecondary}
                      />
                      <Text style={[styles.methodTitle, active && styles.methodTitleActive]}>
                        {m.label}
                      </Text>
                      <Text style={[styles.methodSub, active && styles.methodSubActive]}>{m.sub}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.label}>Add Note / Tafseel (Optional)</Text>
              <View style={styles.noteBox}>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Write any details here..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  style={styles.noteInput}
                />
              </View>

              <View style={styles.newBalanceCard}>
                <View style={styles.newBalanceIconWrap}>
                  <MaterialIcon name="calculate" size={22} color={Colors.textSecondary} />
                </View>
                <View style={styles.newBalanceMeta}>
                  <Text style={styles.newBalanceLabel}>NEW BALANCE / NAYA BAQI</Text>
                  <Text style={styles.newBalanceSub}>Updated ledger amount</Text>
                </View>
                <Text style={styles.newBalanceValue}>{formatCurrency(newBalance)}</Text>
              </View>

              <Text style={styles.secureText}>TRANSACTION IS SECURED & ENCRYPTED</Text>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: Colors.primary },
              !canSave && styles.saveBtnDisabled,
            ]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.85}
          >
            <MaterialIcon name="check-circle" size={20} color={Colors.textInverse} />
            <Text style={styles.saveBtnText}>
              {isUdhaar ? "Save / Save Karein" : "SAVE PAYMENT"}
            </Text>
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
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.primaryText,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  typeTabs: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.md,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  customerDropdownWrap: {
    gap: Spacing.xs,
  },
  customerDropdownBtn: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  customerDropdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  customerDropdownName: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  customerDropdownSub: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  customerDropdownMenu: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    overflow: "hidden",
  },
  customerSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surfaceSecondary,
  },
  customerSearchInput: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  customerOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  customerOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  customerOptionMeta: {
    flex: 1,
  },
  customerOptionName: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  customerOptionSub: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  customerNoResult: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  customerNoResultText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  emptyCustomerBox: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  emptyCustomerTitle: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  emptyCustomerBody: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.size.sm * 1.45,
  },
  emptyCustomerBtn: {
    marginTop: Spacing.xs,
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  emptyCustomerBtnText: {
    fontSize: Typography.size.base,
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
  },
  typeTab: {
    flex: 1,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xs,
  },
  typeTabActive: {
    backgroundColor: Colors.surface,
  },
  typeTabText: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
  },
  typeTabTextActive: {
    color: Colors.primaryText,
  },
  label: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
    marginTop: Spacing.xs,
  },
  amountField: {
    borderWidth: 2,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  currencyPrefix: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.semibold,
    color: Colors.primaryText,
    marginRight: Spacing.xs,
  },
  amountText: {
    flex: 1,
    fontSize: Typography.size.xxl,
    color: Colors.textPrimary,
  },
  amountInput: {
    flex: 1,
    fontSize: Typography.size.xxl,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  amountArrows: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: Colors.debit,
    fontSize: Typography.size.sm,
    marginTop: -Spacing.sm,
  },
  quickAmountRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  quickAmount: {
    flex: 1,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md + 2,
    gap: 2,
  },
  quickPlus: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  quickAmountText: {
    fontSize: Typography.size.xl,
    color: Colors.primaryText,
    fontWeight: Typography.weight.semibold,
  },
  inputRow: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  inputPlaceholder: {
    fontSize: Typography.size.base,
    color: Colors.textMuted,
  },
  inputText: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  inputValue: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
  },
  rowEndIcon: { marginLeft: "auto" },
  billRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  billThumb: {
    width: 98,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    gap: 2,
  },
  billBrand: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  billMeta: { flex: 1 },
  updateBillBtn: {
    alignSelf: "flex-start",
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  updateBillText: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  billFileText: {
    marginTop: Spacing.xs,
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
  customerCard: {
    marginTop: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  customerMeta: { flex: 1 },
  customerMetaLabel: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
  customerMetaName: {
    fontSize: Typography.size.lg,
    color: Colors.primaryText,
    fontWeight: Typography.weight.semibold,
  },
  changeText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
  customerSummaryCard: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  customerSummaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  customerSummaryLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.6,
  },
  customerSummaryBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerSummaryName: {
    fontSize: Typography.size.xxl,
    color: Colors.primaryText,
    fontWeight: Typography.weight.bold,
    flex: 1,
    marginRight: Spacing.sm,
  },
  customerSummaryBalance: {
    fontSize: Typography.size.xxl,
    color: Colors.primaryText,
    fontWeight: Typography.weight.bold,
  },
  methodRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  methodCard: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
    paddingVertical: Spacing.md,
    gap: 2,
  },
  methodCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  methodTitle: {
    marginTop: Spacing.xs,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  methodTitleActive: {
    color: Colors.textInverse,
  },
  methodSub: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  methodSubActive: {
    color: Colors.textInverse,
    opacity: 0.9,
  },
  noteBox: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSecondary,
    minHeight: 96,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  noteInput: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    textAlignVertical: "top",
  },
  newBalanceCard: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  newBalanceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  newBalanceMeta: {
    flex: 1,
  },
  newBalanceLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.6,
  },
  newBalanceSub: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
  newBalanceValue: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.primaryText,
  },
  secureText: {
    textAlign: "center",
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
  },
  saveBtn: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
});
