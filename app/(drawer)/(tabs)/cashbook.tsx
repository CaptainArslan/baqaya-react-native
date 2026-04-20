/**
 * Cashbook tab
 * Design ref: baqaya_cashbook_empty_state
 *             baqaya_cashbook_grey_sync_name_search
 */
import {
    EmptyState,
    FAB,
    MaterialIcon,
    SearchBar,
    SyncBannerStack,
    TabHeader,
} from "@/src/components";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation, type TranslationMap } from "@/src/i18n";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils";
import { SCREEN_MOCKS } from "@/data";
import React, { useState } from "react";
import {
    Alert,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

type EntryType = "credit" | "debit"; // credit = Cash In/received, debit = Udhaar/gave
type NoteKey = "cashIn" | "udhaar" | "payment";

interface CashbookEntry {
  id: string;
  customerName: string;
  type: EntryType;
  amount: number;
  timeLabel: string; // e.g. "10:45 AM"
  noteKey: NoteKey; // resolved to translated label at render time
  section: string; // section key: 'today' | 'yesterday'
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ENTRIES: CashbookEntry[] = [...SCREEN_MOCKS.cashbook.entries];

const MOCK_TODAY_LEDGER = MOCK_ENTRIES.filter(
  (e) => e.section === "today",
).reduce((s, e) => s + (e.type === "credit" ? e.amount : -e.amount), 0);
const MOCK_TOTAL_RECEIVED = MOCK_ENTRIES.filter(
  (e) => e.type === "credit",
).reduce((s, e) => s + e.amount, 0);
const MOCK_COLLECTIONS = MOCK_ENTRIES.filter((e) => e.type === "credit").length;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Two-panel stat card with vertical blue divider */
function CashbookStatCard({
  todayLedger,
  totalReceived,
  collections,
  t,
}: {
  todayLedger: number;
  totalReceived: number;
  collections: number;
  t: TranslationMap;
}) {
  return (
    <View style={[statStyles.card, Shadows.xs]}>
      {/* Left: today's ledger */}
      <View style={statStyles.panel}>
        <Text style={statStyles.label}>{t.cashbook.todayLedger}</Text>
        <Text style={statStyles.amountGreen}>
          Rs. {formatCurrency(todayLedger)}
        </Text>
        <View style={statStyles.noteRow}>
          <MaterialIcon
            name={todayLedger >= 0 ? "trending-up" : "trending-down"}
            size={14}
            color={Colors.textMuted}
          />
          <Text style={statStyles.note}>{t.cashbook.vsYesterday}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={statStyles.divider} />

      {/* Right: total received */}
      <View style={statStyles.panel}>
        <Text style={statStyles.label}>{t.cashbook.totalReceived}</Text>
        <Text style={statStyles.amountBlue}>
          Rs. {formatCurrency(totalReceived)}
        </Text>
        <View style={statStyles.noteRow}>
          <MaterialIcon name="download" size={14} color={Colors.textMuted} />
          <Text style={statStyles.note}>
            {collections} {t.cashbook.collections}
          </Text>
        </View>
      </View>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.base,
  },
  panel: { flex: 1, gap: Spacing.xxs },
  divider: {
    width: 1.5,
    backgroundColor: Colors.info,
    marginHorizontal: Spacing.md,
    borderRadius: 1,
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.4,
  },
  amountGreen: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  amountBlue: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.info,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
  },
  note: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
});

/** Single cashbook entry row */
function EntryRow({ entry, t }: { entry: CashbookEntry; t: TranslationMap }) {
  const isCredit = entry.type === "credit";
  const noteLabel: string =
    entry.noteKey === "cashIn"
      ? t.cashbook.typeCashIn
      : entry.noteKey === "udhaar"
        ? t.customerDetail.typeUdhaar
        : /* payment */ t.customerDetail.typePayment;
  return (
    <View
      style={[
        entryStyles.row,
        isCredit ? entryStyles.rowCredit : entryStyles.rowDebit,
      ]}
    >
      {/* Left accent */}
      <View
        style={[
          entryStyles.accent,
          isCredit ? entryStyles.accentCredit : entryStyles.accentDebit,
        ]}
      />

      {/* Icon */}
      <View
        style={[
          entryStyles.iconWrap,
          isCredit ? entryStyles.iconWrapCredit : entryStyles.iconWrapDebit,
        ]}
      >
        <MaterialIcon
          name={isCredit ? "payments" : "shopping-bag"}
          size={20}
          color={isCredit ? Colors.info : Colors.debit}
        />
      </View>

      {/* Info */}
      <View style={entryStyles.info}>
        <Text style={entryStyles.name} numberOfLines={1}>
          {entry.customerName}
        </Text>
        <Text style={entryStyles.meta}>
          {entry.timeLabel} • {noteLabel}
        </Text>
      </View>

      {/* Amount */}
      <View style={entryStyles.amountWrap}>
        <Text
          style={[
            entryStyles.amount,
            isCredit ? entryStyles.amountCredit : entryStyles.amountDebit,
          ]}
        >
          Rs. {formatCurrency(entry.amount)}
        </Text>
        <Text
          style={[
            entryStyles.badge,
            isCredit ? entryStyles.badgeCredit : entryStyles.badgeDebit,
          ]}
        >
          {isCredit ? t.cashbook.typeReceived : t.cashbook.typeGave}
        </Text>
      </View>
    </View>
  );
}

const entryStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    borderRadius: Radius.lg,
    overflow: "hidden",
    paddingRight: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  rowCredit: {},
  rowDebit: {},

  accent: { width: 4, alignSelf: "stretch", borderRadius: 0 },
  accentCredit: { backgroundColor: Colors.info },
  accentDebit: { backgroundColor: Colors.debit },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapCredit: { backgroundColor: Colors.infoLight },
  iconWrapDebit: { backgroundColor: Colors.debitLight },
  info: { flex: 1 },
  name: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },

  amountWrap: { alignItems: "flex-end" },
  amount: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
  },
  amountCredit: { color: Colors.info },
  amountDebit: { color: Colors.debit },

  badge: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  badgeCredit: { color: Colors.info },
  badgeDebit: { color: Colors.debit },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CashbookScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

  // Filter entries by search + type
  const filteredEntries = MOCK_ENTRIES.filter((e) => {
    const matchesQuery = e.customerName
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "credit" && e.type === "credit") ||
      (filter === "debit" && e.type === "debit");
    return matchesQuery && matchesFilter;
  });

  const hasEntries = filteredEntries.length > 0;

  // Group into SectionList sections
  const todayEntries = filteredEntries.filter((e) => e.section === "today");
  const yesterdayEntries = filteredEntries.filter(
    (e) => e.section === "yesterday",
  );
  const sections = [
    ...(todayEntries.length
      ? [{ title: t.cashbook.sectionToday, data: todayEntries }]
      : []),
    ...(yesterdayEntries.length
      ? [{ title: t.cashbook.sectionYesterday, data: yesterdayEntries }]
      : []),
  ];

  const filterTabs = [
    { id: "all", label: t.cashbook.filterAll },
    { id: "credit", label: t.cashbook.filterReceived },
    { id: "debit", label: t.cashbook.filterGiven },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <TabHeader
        title={t.common.appName}
        onMenuPress={nav.goToDrawer}
        rightElement={
          <TouchableOpacity
            hitSlop={8}
            onPress={() => Alert.alert(t.sync.synced, t.sync.syncedBody)}
          >
            <MaterialIcon name="sync" size={22} color={Colors.textInverse} />
          </TouchableOpacity>
        }
      />

      <SyncBannerStack onSyncPress={() => {}} />

      {/* Stat card */}
      <View style={styles.statWrap}>
        <CashbookStatCard
          todayLedger={MOCK_TODAY_LEDGER}
          totalReceived={MOCK_TOTAL_RECEIVED}
          collections={MOCK_COLLECTIONS}
          t={t}
        />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t.cashbook.searchPlaceholder}
        />
      </View>

      {/* Date filter + sort row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterChip}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert(
              "Date Filter",
              "Select a date range to filter entries.\n\n(Coming soon)",
            )
          }
        >
          <MaterialIcon
            name="calendar-today"
            size={18}
            color={Colors.textMuted}
          />
          <Text style={styles.filterChipText}>{t.cashbook.dateFilter}</Text>
        </TouchableOpacity>

        {/* Type filter chips */}
        <View style={styles.typeChips}>
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.typeChip,
                filter === tab.id && styles.typeChipActive,
              ]}
              onPress={() => setFilter(tab.id as typeof filter)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.typeChipText,
                  filter === tab.id && styles.typeChipTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.sortChip}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert("Sort", "Sort by newest or oldest.\n\n(Coming soon)")
          }
        >
          <MaterialIcon name="sort" size={18} color={Colors.textMuted} />
          <Text style={styles.filterChipText}>{t.cashbook.sort}</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {!hasEntries ? (
        <EmptyState
          icon={
            <MaterialIcon
              name="receipt-long"
              size={56}
              color={Colors.textMuted}
            />
          }
          title={t.cashbook.emptyTitle}
          description={t.cashbook.emptyBody}
          actionLabel={t.cashbook.newEntry}
          onAction={() => nav.goToAddEntry("", "udhaar")}
          style={styles.emptyState}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => <EntryRow entry={item} t={t} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          SectionSeparatorComponent={() => <View style={styles.sectionSep} />}
        />
      )}

      <FAB
        icon={<MaterialIcon name="add" size={30} color={Colors.textInverse} />}
        onPress={() => nav.goToAddEntry("", "udhaar")}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  statWrap: { paddingTop: Spacing.md },

  searchWrap: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },

  // ── Filter row ──
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: Colors.surface,
  },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: Colors.surface,
  },
  filterChipText: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  typeChips: {
    flex: 1,
    flexDirection: "row",
    gap: Spacing.xs,
  },
  typeChip: {
    flex: 1,
    alignItems: "center",
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeChipText: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  typeChipTextActive: {
    color: Colors.textInverse,
  },

  // ── List ──
  listContent: {
    paddingVertical: Spacing.sm,
    paddingBottom: 100,
    gap: Spacing.sm,
  },
  sectionHeader: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xs,
  },
  separator: { height: Spacing.xs },
  sectionSep: { height: Spacing.md },

  // ── Empty ──
  emptyState: { marginTop: Spacing.xl },
});
