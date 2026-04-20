/**
 * Home tab
 * Design ref: welcome_add_new_customer_only (new user)
 *             baqaya_home_top_debtors_active_mobile (active user)
 *             baqaya_home_manual_sync_banner_added_1 (sync states)
 */
import {
    Avatar,
    BalanceCard,
    CustomerRow,
    MaterialIcon,
    SegmentedTabs,
    StatRow,
    SyncBannerStack,
    TabHeader,
} from "@/src/components";
import { getAllMockCustomers, getHomeMockData } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation, type TranslationMap } from "@/src/i18n";
import { useAuthStatus } from "@/src/store/authStore";
import { useSyncState } from "@/src/store/syncStore";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import type { Customer, Transaction } from "@/src/types";
import { formatCurrency, formatRelativeDate } from "@/src/utils";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── New-user empty state ────────────────────────────────────────────────────

function NewUserState({
  onAddCustomer,
  t,
}: {
  onAddCustomer: () => void;
  t: TranslationMap;
}) {
  return (
    <View style={styles.newUserContainer}>
      {/* Illustration card */}
      <View style={styles.illustrationCard}>
        <View style={styles.illustrationBg} />
        <MaterialIcon
          name="show-chart"
          size={72}
          color="rgba(255,255,255,0.35)"
        />
      </View>

      <Text style={styles.welcomeTitle}>{t.home.welcomeTitle}</Text>
      <Text style={styles.welcomeBody}>{t.home.welcomeBody}</Text>

      {/* Step dots */}
      <View style={styles.stepDots}>
        <View style={styles.stepDot} />
        <View style={[styles.stepDot, styles.stepDotActive]} />
        <View style={styles.stepDot} />
      </View>

      {/* CTA */}
      <View style={styles.newUserFooter}>
        <TouchableOpacity
          style={styles.addFirstBtn}
          onPress={onAddCustomer}
          activeOpacity={0.85}
        >
          <View style={styles.addFirstBtnInner}>
            <MaterialIcon
              name="person-add"
              size={22}
              color={Colors.textInverse}
            />
            <Text style={styles.addFirstBtnText}>
              {t.customers.addCustomer}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Active state ────────────────────────────────────────────────────────────

function ActiveState({
  nav,
  t,
  isOnline,
  activeTabId,
  onTabChange,
  customers,
}: {
  nav: ReturnType<typeof useAppNavigation>;
  t: TranslationMap;
  isOnline: boolean;
  activeTabId: string;
  onTabChange: (id: string) => void;
  customers: Customer[];
}) {
  const tabs = [
    { id: "recent", label: t.home.recentTransactions },
    { id: "debtors", label: t.home.topDebtors },
  ];

  const homeMock = getHomeMockData();
  const recentTransactions = homeMock.recentTransactions as Transaction[];
  const topDebtors = homeMock.topDebtors as Customer[];
  const listData = activeTabId === "recent" ? recentTransactions : topDebtors;
  const isDebtorsTab = activeTabId === "debtors";

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.activeContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance card */}
        <BalanceCard
          balance={homeMock.stats.totalBalance}
          label={t.home.totalBalance.toUpperCase()}
          addEntryLabel={`+ ${t.customerDetail.udhaarAdd}`}
          onAddEntry={() => nav.goToAddEntry("", "udhaar")}
          variant="debit"
        />

        {/* Stat row */}
        <StatRow
          left={{
            label: t.home.todayPayment.toUpperCase(),
            amount: homeMock.stats.todayPayment,
            note: "—",
            amountColor: Colors.credit,
          }}
          right={{
            label: t.home.todayLedger.toUpperCase(),
            amount: homeMock.stats.todayLedger,
            note: t.home.noEntriesToday,
            amountColor: Colors.debit,
          }}
        />

        {/* Segmented tabs */}
        <SegmentedTabs
          tabs={tabs}
          activeId={activeTabId}
          onChange={onTabChange}
        />
      {!isOnline ? <Text style={styles.offlineHint}>{t.home.offlineHint}</Text> : null}

        {/* List */}
        {listData.length === 0 ? (
          <View style={styles.listEmpty}>
            <MaterialIcon
              name={isDebtorsTab ? "groups" : "history"}
              size={36}
              color={Colors.textMuted}
              style={styles.listEmptyIcon}
            />
            <Text style={styles.listEmptyTitle}>
              {isDebtorsTab ? "No debtors found" : t.home.emptyTitle}
            </Text>
            <Text style={styles.listEmptyBody}>
              {isDebtorsTab
                ? "All your accounts are settled."
                : t.home.noEntriesToday}
            </Text>
          </View>
        ) : activeTabId === "recent" ? (
          recentTransactions.map((tx) => (
          <TouchableOpacity
            key={tx.id}
            style={styles.txTile}
            activeOpacity={0.75}
            onPress={() => nav.goToCustomerDetail(tx.customerId)}
          >
            <View
              style={[
                styles.txAccent,
                { backgroundColor: tx.type === "debit" ? Colors.debit : Colors.credit },
              ]}
            />
            <Avatar
              name={tx.customerName}
              size="md"
              style={styles.txAvatar}
            />
            <View style={styles.txLeft}>
              <Text style={styles.txName}>{tx.customerName}</Text>
              <Text style={styles.txMeta}>
                {formatRelativeDate(tx.createdAt)}
              </Text>
            </View>
            <Text
              style={[
                styles.txAmount,
                { color: tx.type === "debit" ? Colors.debit : Colors.credit },
              ]}
            >
              {tx.type === "debit" ? "-" : "+"}
              {formatCurrency(tx.amount)}
            </Text>
            <MaterialIcon
              name="chevron-right"
              size={20}
              color={Colors.textMuted}
              style={styles.txChevron}
            />
            </TouchableOpacity>
          ))
        ) : (
          topDebtors.map((c) => (
            <CustomerRow
              key={c.id}
              name={c.name}
              phone={c.phone}
              balance={c.balance}
              status={
                c.balance > 0 ? "owes" : c.balance < 0 ? "toGive" : "settled"
              }
              lastActive={c.lastActivity}
              onPress={() => nav.goToCustomerDetail(c.id)}
            style={styles.debtorTile}
            />
          ))
        )}

        <View style={styles.listPadBottom} />
      </ScrollView>

    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const nav = useAppNavigation();
  const { state: syncState } = useSyncState();
  const isOnline = syncState !== "offline";
  const { t } = useTranslation();
  const { isNewUser } = useAuthStatus();
  const [activeTab, setActiveTab] = useState("recent");
  const [customers, setCustomers] = useState<Customer[]>(getAllMockCustomers);

  useFocusEffect(
    useCallback(() => {
      setCustomers(getAllMockCustomers());
    }, []),
  );

  const homeMock = getHomeMockData();
  const hasHomeMockData =
    homeMock.recentTransactions.length > 0 || homeMock.topDebtors.length > 0;
  const showNewUserState = isNewUser && !hasHomeMockData;

  return (
    <View style={styles.screen}>
      <View style={[styles.headerBar, { paddingTop: insets.top }]}>
        <TabHeader
          title={t.common.appName}
          onMenuPress={nav.goToDrawer}
          rightElement={
            <TouchableOpacity
              style={styles.headerIconBtn}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t.sync.syncNow}
              onPress={() => Alert.alert(t.sync.synced, t.sync.syncedBody)}
            >
              <MaterialIcon name="sync" size={22} color={Colors.textInverse} />
            </TouchableOpacity>
          }
        />
      </View>

      <SyncBannerStack onSyncPress={() => {}} />

      {showNewUserState ? (
        <NewUserState onAddCustomer={nav.goToAddCustomer} t={t} />
      ) : (
        <ActiveState
          nav={nav}
          t={t}
          isOnline={isOnline}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          customers={customers}
        />
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  headerBar: { backgroundColor: Colors.headerBg },
  headerIconBtn: { padding: Spacing.xs },
  flex: { flex: 1 },

  // ── New user ──
  newUserContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  illustrationCard: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: Radius.xl,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  illustrationBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primaryDark,
  },
  welcomeTitle: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  welcomeBody: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Typography.size.base * 1.6,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  stepDots: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginTop: Spacing.lg,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  stepDotActive: {
    width: 24,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  newUserFooter: {
    position: "absolute",
    bottom: Spacing.xl,
    left: Spacing.xl,
    right: Spacing.xl,
  },
  addFirstBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
  },
  addFirstBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  addFirstBtnText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },

  // ── Active ──
  activeContent: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: 128,
  },
  offlineHint: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: -Spacing.xs,
  },
  listEmpty: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: Radius.lg,
  },
  listEmptyIcon: { opacity: 0.45 },
  listEmptyTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
  },
  listEmptyBody: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  txTile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    overflow: "hidden",
    marginTop: Spacing.xs,
  },
  txAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  txLeft: {
    flex: 1,
  },
  txAvatar: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  txName: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  txMeta: {
    marginTop: 2,
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  txAmount: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
  txChevron: {
    marginLeft: -Spacing.xs,
  },
  debtorTile: {
    borderRadius: Radius.lg,
    borderBottomWidth: 0,
    marginTop: Spacing.xs,
  },
  listPadBottom: { height: Spacing.xxl },
});
