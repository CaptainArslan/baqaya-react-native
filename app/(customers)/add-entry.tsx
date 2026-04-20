/**
 * Add Ledger Entry — modal screen
 * Reached from: Customer Detail → Udhaar / Payment buttons
 *               Home / Cashbook → Add Entry FAB
 */
import { InnerHeader, TextInputField } from "@/src/components";
import { getMockCustomer } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
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

  const customer = getMockCustomer(customerId ?? "");
  const customerName = customer?.name ?? "Customer";
  const isUdhaar = type !== "payment";

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [amountError, setAmountError] = useState("");

  const accentColor = isUdhaar ? Colors.debit : Colors.credit;
  const typeLabel = isUdhaar ? "Udhaar — You Gave" : "Payment — You Received";
  const typeIcon = isUdhaar ? "↗" : "↙";

  function handleSave() {
    const parsed = parseFloat(amount.replace(/,/g, ""));
    if (!amount.trim() || isNaN(parsed) || parsed <= 0) {
      setAmountError("Enter a valid amount greater than 0");
      return;
    }
    Alert.alert(
      "Entry Saved",
      `${isUdhaar ? "Udhaar" : "Payment"} of Rs. ${formatCurrency(parsed)} recorded for ${customerName}.`,
      [{ text: "Done", onPress: nav.goBack }],
    );
  }

  const canSave = amount.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Type indicator bar */}
      <View style={[styles.typeBar, { backgroundColor: accentColor }]}>
        <Text style={styles.typeBarText}>
          {typeIcon} {typeLabel}
        </Text>
      </View>

      <InnerHeader
        title={customerName}
        subtitle={isUdhaar ? "Give Udhaar" : "Record Payment"}
        onBack={nav.goBack}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Amount card */}
          <View style={[styles.amountCard, { borderColor: accentColor }]}>
            <Text style={[styles.amountCardLabel, { color: accentColor }]}>
              AMOUNT (RS.)
            </Text>
            <TextInputField
              label=""
              placeholder="0"
              value={amount}
              onChangeText={(v) => {
                setAmount(v);
                setAmountError("");
              }}
              keyboardType="numeric"
              error={amountError}
              autoFocus
            />
            {!amountError && amount.trim() && !isNaN(parseFloat(amount)) && (
              <Text style={[styles.amountPreview, { color: accentColor }]}>
                Rs. {formatCurrency(parseFloat(amount.replace(/,/g, "")))}
              </Text>
            )}
          </View>

          {/* Note field */}
          <TextInputField
            label="Note (optional)"
            placeholder="e.g. Grocery, Rent, Loan…"
            value={note}
            onChangeText={setNote}
          />

          {/* Quick note chips */}
          <View style={styles.chips}>
            {["Grocery", "Rent", "Loan", "Services"].map((chip) => (
              <TouchableOpacity
                key={chip}
                style={styles.chip}
                onPress={() => setNote(chip)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Sticky footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: accentColor },
              !canSave && styles.saveBtnDisabled,
            ]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>
              {isUdhaar ? "Record Udhaar" : "Record Payment"} →
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

  typeBar: {
    paddingVertical: Spacing.xs + 2,
    alignItems: "center",
  },
  typeBarText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
    letterSpacing: 0.4,
  },

  content: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.huge,
  },

  amountCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    gap: Spacing.xs,
  },
  amountCardLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.8,
  },
  amountPreview: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    marginTop: Spacing.xs,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface,
  },
  chipText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },

  footer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  saveBtn: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
});
