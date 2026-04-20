/**
 * Contact Picker — import-contacts-flow
 * Design ref: contact_picker_preview/screen.png
 * Search bar + "RECENT CONTACTS" horizontal chips + "ALL CONTACTS" list.
 * Contacts with no phone show "Missing Phone" in muted red + Action Required toast.
 */
import { Avatar, SearchBar } from "@/src/components";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils";
import { SCREEN_MOCKS } from "@/data";
import React, { useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Mock contacts ────────────────────────────────────────────────────────────

interface MockContact {
  id: string;
  name: string;
  phone: string | null; // null = no phone number
  existingBalance?: number; // positive = owes you, negative = you owe
}

const MOCK_CONTACTS: MockContact[] = [...SCREEN_MOCKS.modals.importContacts.contacts];
const RECENT_IDS = [...SCREEN_MOCKS.modals.importContacts.recentIds];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RecentChip({
  contact,
  onPress,
}: {
  contact: MockContact;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.recentChip}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Avatar name={contact.name} size="md" />
      <Text style={styles.recentChipName} numberOfLines={1}>
        {contact.name.split(" ")[0]}
      </Text>
    </TouchableOpacity>
  );
}

function ContactListRow({
  contact,
  onPress,
  onNoPhoneAction,
}: {
  contact: MockContact;
  onPress: () => void;
  onNoPhoneAction: (contact: MockContact) => void;
}) {
  const { t } = useTranslation();
  const hasPhone = !!contact.phone;

  return (
    <TouchableOpacity
      style={styles.contactRow}
      onPress={hasPhone ? onPress : () => onNoPhoneAction(contact)}
      activeOpacity={0.7}
    >
      <Avatar name={contact.name} size="md" />

      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        {hasPhone ? (
          <Text style={styles.contactPhone}>{contact.phone}</Text>
        ) : (
          <Text style={styles.noPhoneLabel}>{t.importContacts.noPhone}</Text>
        )}
      </View>

      {contact.existingBalance !== undefined && hasPhone && (
        <View
          style={[
            styles.balancePill,
            contact.existingBalance > 0
              ? styles.balancePillDebit
              : styles.balancePillCredit,
          ]}
        >
          <Text
            style={[
              styles.balancePillText,
              contact.existingBalance > 0
                ? styles.balancePillTextDebit
                : styles.balancePillTextCredit,
            ]}
          >
            {contact.existingBalance > 0
              ? `${t.importContacts.owes} ${formatCurrency(contact.existingBalance)}`
              : `${t.importContacts.advance} ${formatCurrency(Math.abs(contact.existingBalance))}`}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ImportContactsScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [noPhoneContact, setNoPhoneContact] = useState<MockContact | null>(
    null,
  );

  const recentContacts = MOCK_CONTACTS.filter((c) => RECENT_IDS.includes(c.id));

  const filtered = MOCK_CONTACTS.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.phone ?? "").includes(q);
  });

  function handleSelectContact(contact: MockContact) {
    if (!contact.phone) {
      setNoPhoneContact(contact);
      return;
    }
    // Stub: in production check contact.phoneNumbers.length > 1 → multipleNumbers sheet
    // For now navigate straight to add-customer (number pre-filled in a real implementation)
    nav.goBack();
  }

  function handleNoPhoneAction(contact: MockContact) {
    setNoPhoneContact(contact);
  }

  function dismissNoPhoneToast() {
    setNoPhoneContact(null);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={nav.goBack}
          hitSlop={10}
          style={styles.closeBtn}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.importContacts.screenTitle}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t.importContacts.searchPlaceholder}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          !query ? (
            <>
              {/* Recent contacts */}
              <Text style={styles.sectionLabel}>
                {t.importContacts.recentContacts}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentRow}
              >
                {recentContacts.map((c) => (
                  <RecentChip
                    key={c.id}
                    contact={c}
                    onPress={() => handleSelectContact(c)}
                  />
                ))}
                {/* Add New chip */}
                <TouchableOpacity
                  style={[styles.recentChip, styles.addNewChip]}
                  onPress={nav.goToAddCustomer}
                  activeOpacity={0.75}
                >
                  <View style={styles.addNewCircle}>
                    <Text style={styles.addNewIcon}>+</Text>
                  </View>
                  <Text style={styles.recentChipName}>
                    {t.importContacts.addNew}
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>
                {t.importContacts.allContacts}
              </Text>
            </>
          ) : null
        }
        renderItem={({ item }) => (
          <ContactListRow
            contact={item}
            onPress={() => handleSelectContact(item)}
            onNoPhoneAction={handleNoPhoneAction}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />

      {/* No phone number toast */}
      {noPhoneContact && (
        <View style={styles.toastWrap}>
          <View style={styles.toast}>
            <View style={styles.toastLeft}>
              <View style={styles.toastIconWrap}>
                <Text style={styles.toastIcon}>⚠</Text>
              </View>
              <View style={styles.toastTextWrap}>
                <Text style={styles.toastTitle}>
                  {t.importContacts.noPhoneToastTitle}
                </Text>
                <Text style={styles.toastBody}>
                  {t.importContacts.noPhoneToastBody}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={dismissNoPhoneToast}
              activeOpacity={0.7}
              hitSlop={8}
            >
              <Text style={styles.toastDismiss}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toastActions}>
            <TouchableOpacity
              style={styles.toastActionBtn}
              onPress={dismissNoPhoneToast}
              activeOpacity={0.7}
            >
              <Text style={styles.toastActionText}>
                {t.importContacts.skip}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toastActionBtn, styles.toastActionBtnPrimary]}
              onPress={() => {
                dismissNoPhoneToast();
                nav.goToAddCustomer();
              }}
              activeOpacity={0.85}
            >
              <Text
                style={[styles.toastActionText, styles.toastActionTextPrimary]}
              >
                {t.importContacts.addNumber}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  closeBtn: { padding: Spacing.xs },
  closeIcon: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.bold,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  headerSpacer: { width: 32 },

  // ── Search ──
  searchWrap: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },

  // ── List ──
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 120,
  },

  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
  },

  // ── Recent chips ──
  recentRow: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  recentChip: {
    alignItems: "center",
    gap: Spacing.xs,
    width: 64,
  },
  recentChipName: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    textAlign: "center",
    fontWeight: Typography.weight.medium,
  },
  addNewChip: {},
  addNewCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: "dashed",
  },
  addNewIcon: {
    fontSize: 22,
    color: Colors.primary,
    fontWeight: Typography.weight.bold,
  },

  // ── Contact row ──
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.md,
  },
  contactInfo: { flex: 1 },
  contactName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
  },
  contactPhone: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  noPhoneLabel: {
    fontSize: Typography.size.sm,
    color: Colors.debit,
    marginTop: 2,
    fontWeight: Typography.weight.medium,
  },

  // ── Balance pill ──
  balancePill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  balancePillDebit: { backgroundColor: Colors.debitLight },
  balancePillCredit: { backgroundColor: Colors.creditLight },
  balancePillText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
  },
  balancePillTextDebit: { color: Colors.debit },
  balancePillTextCredit: { color: Colors.credit },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },

  // ── No-phone toast ──
  toastWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    gap: Spacing.md,
  },
  toast: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  toastLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  toastIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.errorLight,
    alignItems: "center",
    justifyContent: "center",
  },
  toastIcon: { fontSize: 16 },
  toastTextWrap: { flex: 1 },
  toastTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  toastBody: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  toastDismiss: {
    fontSize: 14,
    color: Colors.textMuted,
    padding: Spacing.xs,
  },
  toastActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  toastActionBtn: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toastActionBtnPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toastActionText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
  toastActionTextPrimary: {
    color: Colors.textInverse,
  },
});
