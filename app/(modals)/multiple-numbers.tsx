/**
 * Multiple Numbers Selection — import-contacts-flow
 * Design ref: multiple_numbers_selection/screen.png
 * Bottom sheet: contact name subtitle, phone rows with selection, Confirm/Cancel.
 */
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { useLocalSearchParams } from "expo-router";
import { SCREEN_MOCKS } from "@/data";
import { MaterialIcon } from "@/src/components";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Mock: phone numbers for a contact ───────────────────────────────────────
// In production these come from expo-contacts selectedContact.phoneNumbers[]
// Labels resolved from translation keys at render time (see getMockNumbers below)
const MOCK_NUMBER_VALUES = [...SCREEN_MOCKS.modals.multipleNumbers.numbers];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MultipleNumbersScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const { contactName } = useLocalSearchParams<{ contactName: string }>();

  const numbers = MOCK_NUMBER_VALUES.map((n) => ({
    ...n,
    label: t.multipleNumbers[n.labelKey],
  }));

  const [selected, setSelected] = useState<string>(numbers[0].id);

  function handleConfirm() {
    // TODO: pass selected number back to add-customer flow via router params or store
    nav.goBack();
  }

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      {/* Sheet handle */}
      <View style={styles.sheetHandle} />

      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{t.multipleNumbers.title}</Text>
          {contactName ? (
            <Text style={styles.subtitle}>
              {t.multipleNumbers.contactPrefix}
              {contactName}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={nav.goBack} hitSlop={10}>
          <MaterialIcon name="close" size={Typography.size.xl} color={Colors.textSecondary} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>

      {/* Phone number rows */}
      <View style={styles.numberList}>
        {numbers.map((num) => {
          const isSelected = num.id === selected;
          return (
            <TouchableOpacity
              key={num.id}
              style={[styles.numberRow, isSelected && styles.numberRowSelected]}
              onPress={() => setSelected(num.id)}
              activeOpacity={0.75}
            >
              {/* Phone icon */}
              <View
                style={[
                  styles.phoneIconWrap,
                  isSelected && styles.phoneIconWrapSelected,
                ]}
              >
                <MaterialIcon name="call" size={Typography.size.xxl} color={Colors.textSecondary} />
              </View>

              {/* Label + number */}
              <View style={styles.numberInfo}>
                <Text
                  style={[
                    styles.numberLabel,
                    isSelected && styles.numberLabelSelected,
                  ]}
                >
                  {num.label}
                </Text>
                <Text
                  style={[
                    styles.numberValue,
                    isSelected && styles.numberValueSelected,
                  ]}
                >
                  {num.value}
                </Text>
              </View>

              {/* Checkmark */}
              {isSelected && (
                <View style={styles.checkWrap}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>{t.multipleNumbers.confirm}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={nav.goBack}
          activeOpacity={0.7}
        >
          <Text style={styles.ghostBtnText}>{t.multipleNumbers.cancel}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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

  // ── Header ──
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  headerText: { flex: 1 },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  closeIcon: { padding: Spacing.xs },

  // ── Number list ──
  numberList: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  numberRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },

  phoneIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  phoneIconWrapSelected: {
    backgroundColor: Colors.primaryLight,
  },

  numberInfo: { flex: 1 },
  numberLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  numberLabelSelected: { color: Colors.primaryText },
  numberValue: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  numberValueSelected: { color: Colors.primary },

  checkWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    color: Colors.textInverse,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.lg,
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
