/**
 * Cashbook tab
 * Design ref: baqaya_cashbook_empty_state
 *             baqaya_cashbook_grey_sync_name_search
 */
import {
    DateRangeSelectionSheet,
    EmptyState,
    MaterialIcon,
    SearchBar,
    SyncBannerStack,
    TabHeader,
} from "@/src/components";
import { addMockCustomer, getAllMockCustomers } from "@/src/constants/mockData";
import { getCashbookMockData } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation, type TranslationMap } from "@/src/i18n";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils";
import React, { useState } from "react";
import type { DateRangeSelection } from "@/src/components/common/DateRangeSelectionSheet";
import {
    Alert,
    Modal,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EntryType = "credit" | "debit"; // credit = Cash In/received, debit = Udhaar/gave
type NoteKey = "cashIn" | "udhaar" | "payment";

interface CashbookEntry {
  id: string;
  customerId: string;
  customerName: string;
  type: EntryType;
  amount: number;
  createdAt: string;
  timeLabel: string; // e.g. "10:45 AM"
  noteKey: NoteKey; // resolved to translated label at render time
  section: string; // section key: 'today' | 'yesterday'
}

const PAGE_SIZE = 15;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Two compact bento stat cards */
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
    <View style={statStyles.grid}>
      <View style={[statStyles.widget, statStyles.widgetLedger, Shadows.xs]}>
        <Text style={statStyles.label}>{t.cashbook.todayLedger}</Text>
        <Text style={statStyles.amountLedger}>{formatCurrency(todayLedger)}</Text>
        <View style={statStyles.noteRow}>
          <MaterialIcon
            name={todayLedger >= 0 ? "trending-up" : "trending-down"}
            size={12}
            color={Colors.debit}
          />
          <Text style={statStyles.note}>{t.cashbook.vsYesterday}</Text>
        </View>
      </View>

      <View style={[statStyles.widget, statStyles.widgetReceived, Shadows.xs]}>
        <Text style={statStyles.label}>{t.cashbook.totalReceived}</Text>
        <Text style={statStyles.amountBlue}>{formatCurrency(totalReceived)}</Text>
        <View style={statStyles.noteRow}>
          <MaterialIcon name="payments" size={12} color={Colors.info} />
          <Text style={statStyles.note}>
            {collections} {t.cashbook.collections}
          </Text>
        </View>
      </View>
    </View>
  );
}

const statStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginHorizontal: Spacing.base,
  },
  widget: {
    flex: 1,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xxs,
    borderLeftWidth: 4,
  },
  widgetLedger: {
    backgroundColor: Colors.surface,
    borderLeftColor: Colors.debit,
  },
  widgetReceived: {
    backgroundColor: Colors.surface,
    borderLeftColor: Colors.info,
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.4,
  },
  amountLedger: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.debit,
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
function EntryRow({
  entry,
  t,
  onPress,
}: {
  entry: CashbookEntry;
  t: TranslationMap;
  onPress: () => void;
}) {
  const isCredit = entry.type === "credit";
  const noteLabel: string =
    entry.noteKey === "cashIn"
      ? t.cashbook.typeCashIn
      : entry.noteKey === "udhaar"
        ? t.cashbook.filterGiven
        : /* payment */ t.customerDetail.typePayment;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
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
          {formatCurrency(entry.amount)}
        </Text>
      </View>
      <MaterialIcon
        name="chevron-right"
        size={20}
        color={Colors.textMuted}
        style={entryStyles.chevron}
      />
    </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
  chevron: {
    marginLeft: -Spacing.xs,
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CashbookScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [dateSheetVisible, setDateSheetVisible] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeSelection | null>(null);
  const [appliedSort, setAppliedSort] = useState<"newest" | "oldest">("newest");
  const [selectedSort, setSelectedSort] = useState<"newest" | "oldest">("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const cashbookMock = getCashbookMockData();

  // Filter entries by search query + date range, then sort by date.
  const filteredEntries = cashbookMock.entries
    .filter((e) => e.customerName.toLowerCase().includes(query.toLowerCase()))
    .filter((e) => {
      if (!dateRange) return true;
      const ts = new Date(e.createdAt).getTime();
      return ts >= dateRange.from.getTime() && ts <= dateRange.to.getTime();
    })
    .sort((a, b) =>
      appliedSort === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const visibleEntries = filteredEntries.slice(0, visibleCount);
  const hasMoreEntries = visibleCount < filteredEntries.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, appliedSort, dateRange?.from?.getTime(), dateRange?.to?.getTime()]);

  function handleLoadMore() {
    if (!hasMoreEntries || isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredEntries.length));
      setIsLoadingMore(false);
    }, 220);
  }

  const hasEntries = visibleEntries.length > 0;

  // Group into SectionList sections
  const grouped = visibleEntries.reduce<Record<string, CashbookEntry[]>>((acc, e) => {
    const key =
      e.section === "today"
        ? t.cashbook.sectionToday
        : e.section === "yesterday"
          ? t.cashbook.sectionYesterday
          : e.section;
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});
  const sections = Object.entries(grouped).map(([title, data]) => ({ title, data }));

  function handleOpenCustomer(entry: CashbookEntry) {
    if (entry.customerId) {
      nav.goToCustomerDetail(entry.customerId);
      return;
    }

    const existing = getAllMockCustomers().find(
      (c) => c.name.toLowerCase() === entry.customerName.toLowerCase(),
    );
    if (existing) {
      nav.goToCustomerDetail(existing.id);
      return;
    }

    const generatedId = `cb-${entry.id}`;
    addMockCustomer({
      id: generatedId,
      name: entry.customerName,
      phone: "",
      balance: entry.type === "debit" ? entry.amount : -entry.amount,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    });
    nav.goToCustomerDetail(generatedId);
  }

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
          todayLedger={cashbookMock.summary.todayLedger}
          totalReceived={cashbookMock.summary.totalReceived}
          collections={cashbookMock.summary.collections}
          t={t}
        />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchRow}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder={t.cashbook.searchPlaceholder}
            style={styles.searchBar}
          />
          <TouchableOpacity
            style={styles.searchAction}
            onPress={() => setDateSheetVisible(true)}
            activeOpacity={0.75}
          >
            <MaterialIcon
              name="calendar-today"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
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
        <>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t.tabs.cashbook}</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedSort(appliedSort);
                setSortModalVisible(true);
              }}
              hitSlop={8}
              style={styles.sectionSortBtn}
            >
              <MaterialIcon name="sort" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.35}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            renderItem={({ item }) => (
              <EntryRow
                entry={item}
                t={t}
                onPress={() => handleOpenCustomer(item)}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            SectionSeparatorComponent={() => <View style={styles.sectionSep} />}
            ListFooterComponent={
              hasMoreEntries || isLoadingMore ? (
                <View style={styles.paginationFooter}>
                  {isLoadingMore ? (
                    <MaterialIcon name="hourglass-top" size={18} color={Colors.primary} />
                  ) : null}
                </View>
              ) : (
                <View style={styles.paginationFooter} />
              )
            }
          />
        </>
      )}

      <Modal
        visible={sortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSortModalVisible(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort & Filter</Text>
              <TouchableOpacity
                hitSlop={8}
                onPress={() => setSortModalVisible(false)}
              >
                <MaterialIcon name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {[
              { id: "newest" as const, label: "Newest First", icon: "north" },
              { id: "oldest" as const, label: "Oldest First", icon: "south" },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.sortRow}
                activeOpacity={0.8}
                onPress={() => setSelectedSort(option.id)}
              >
                <View style={styles.sortLeft}>
                  <MaterialIcon
                    name={option.icon as any}
                    size={20}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.sortLabel}>{option.label}</Text>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    selectedSort === option.id && styles.radioOuterActive,
                  ]}
                >
                  {selectedSort === option.id ? <View style={styles.radioInner} /> : null}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.applyBtn}
              activeOpacity={0.85}
              onPress={() => {
                setAppliedSort(selectedSort);
                setSortModalVisible(false);
              }}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DateRangeSelectionSheet
        visible={dateSheetVisible}
        onClose={() => setDateSheetVisible(false)}
        onApply={(selection) => {
          setDateRange(selection);
          setDateSheetVisible(false);
        }}
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
    paddingVertical: Spacing.sm,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  searchBar: { flex: 1, height: 52 },
  searchAction: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  sectionSortBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
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

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 52,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.border,
  },
  modalHeader: {
    marginTop: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  sortLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  sortLabel: {
    fontSize: Typography.size.xl,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  applyBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    alignItems: "center",
    paddingVertical: Spacing.md + 2,
  },
  applyBtnText: {
    color: Colors.textInverse,
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.semibold,
  },

  // ── Empty ──
  emptyState: { marginTop: Spacing.xl },
  paginationFooter: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
});
