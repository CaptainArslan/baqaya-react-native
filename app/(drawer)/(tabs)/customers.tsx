/**
 * Customers tab
 * Design ref: baqaya_customers_updated_nav_background (empty)
 *             baqaya_customers_updated_nav_with_sync (populated)
 */
import {
  CustomerRow,
  DateRangeSelectionSheet,
  EmptyState,
  MaterialIcon,
  SearchBar,
  SyncBannerStack,
  TabHeader,
} from "@/src/components";
import { getAllMockCustomers } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import type { Customer } from "@/src/types";
import type { DateRangeSelection } from "@/src/components/common/DateRangeSelectionSheet";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 20;

export default function CustomersScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [dateSheetVisible, setDateSheetVisible] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeSelection | null>(null);
  const [appliedSort, setAppliedSort] = useState<
    "highest" | "lowest" | "alphabetical"
  >("highest");
  const [selectedSort, setSelectedSort] = useState<
    "highest" | "lowest" | "alphabetical"
  >("highest");

  useEffect(() => {
    // Relational mock API response (same source shared across screens).
    setAllCustomers(getAllMockCustomers());
  }, []);

  const filtered = allCustomers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        (c.phone ?? "").includes(query),
    )
    .filter((c) => {
      if (!dateRange || !c.lastActivity) return true;
      const ts = new Date(c.lastActivity).getTime();
      return ts >= dateRange.from.getTime() && ts <= dateRange.to.getTime();
    })
    .sort((a, b) => {
      if (appliedSort === "highest") return b.balance - a.balance;
      if (appliedSort === "lowest") return a.balance - b.balance;
      return a.name.localeCompare(b.name);
    });
  const paginatedCustomers = filtered.slice(0, visibleCount);
  const hasMoreCustomers = visibleCount < filtered.length;
  const hasRegisteredCustomers = allCustomers.length > 0;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, appliedSort, dateRange?.from?.getTime(), dateRange?.to?.getTime(), allCustomers.length]);

  function handleLoadMore() {
    if (!hasMoreCustomers || isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
      setIsLoadingMore(false);
    }, 220);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
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

      {hasRegisteredCustomers ? (
        <View style={styles.searchWrap}>
          <View style={styles.searchRow}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder={t.customers.searchPlaceholder}
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
      ) : null}

      {!hasRegisteredCustomers ? (
        <EmptyState
          icon={
            <View style={styles.emptyIconCard}>
              <MaterialIcon name="person-search" size={58} color={Colors.textMuted} />
            </View>
          }
          title={t.customers.emptyTitle}
          description={t.customers.emptyBody}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <MaterialIcon
              name="person-search"
              size={56}
              color={Colors.textMuted}
            />
          }
          title={t.customers.emptyTitle}
          description={t.customers.emptyBody}
        />
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.customers.allCustomers}</Text>
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

          <FlatList
            data={paginatedCustomers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CustomerRow
                name={item.name}
                phone={item.phone}
                balance={item.balance}
                status={
                  item.balance > 0
                    ? "owes"
                    : item.balance < 0
                      ? "toGive"
                      : "settled"
                }
                lastActive={item.lastActivity}
                onPress={() => nav.goToCustomerDetail(item.id)}
                style={styles.customerTile}
              />
            )}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.tileGap} />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.35}
            ListFooterComponent={
              hasMoreCustomers || isLoadingMore ? (
                <View style={styles.paginationFooter}>
                  {isLoadingMore ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
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
              { id: "highest" as const, label: "Highest Balance", icon: "trending-up" },
              { id: "lowest" as const, label: "Lowest Balance", icon: "trending-down" },
              {
                id: "alphabetical" as const,
                label: "Alphabetical (A-Z)",
                icon: "sort-by-alpha",
              },
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  searchWrap: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  sectionSortBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconCard: {
    width: 150,
    height: 150,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  list: {
    paddingBottom: 100,
    paddingTop: Spacing.xs,
    paddingHorizontal: Spacing.base,
  },
  customerTile: {
    borderRadius: Radius.lg,
    borderBottomWidth: 0,
  },
  tileGap: {
    height: Spacing.md,
  },
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
    fontSize: Typography.size.xl,
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
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
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
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
  paginationFooter: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
});
