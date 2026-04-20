/**
 * Home tab
 * Design ref: welcome_add_new_customer_only (new user)
 *             baqaya_home_top_debtors_active_mobile (active user)
 *             baqaya_home_manual_sync_banner_added_1 (sync states)
 */
import {
  BalanceCard,
  CustomerRow,
  MaterialIcon,
  SegmentedTabs,
  StatRow,
  SyncBannerStack,
  TabHeader,
} from "@/src/components";
import {
  getAllMockCustomers,
} from "@/src/constants/mockData";
import { SCREEN_MOCKS } from "@/data";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation, type TranslationMap } from "@/src/i18n";
import { useAuthStatus } from "@/src/store/authStore";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import type { Customer, Transaction } from "@/src/types";
import { formatCurrency } from "@/src/utils";
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

const HOME_MOCK = SCREEN_MOCKS.home;

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
  activeTabId,
  onTabChange,
  customers,
}: {
  nav: ReturnType<typeof useAppNavigation>;
  t: TranslationMap;
  activeTabId: string;
  onTabChange: (id: string) => void;
  customers: Customer[];
}) {
  const tabs = [
    { id: "recent", label: t.home.recentTransactions },
    { id: "debtors", label: t.home.topDebtors },
  ];

  const recentTransactions = HOME_MOCK.recentTransactions as Transaction[];
  const topDebtors = HOME_MOCK.topDebtors as Customer[];
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
        balance={HOME_MOCK.stats.totalBalance}
        label={t.home.totalBalance.toUpperCase()}
        addEntryLabel={`+ ${t.customerDetail.udhaarAdd}`}
        onAddEntry={() => nav.goToAddEntry("", "udhaar")}
        variant="debit"
      />

      {/* Stat row */}
      <StatRow
        left={{
          label: t.home.todayPayment.toUpperCase(),
          amount: HOME_MOCK.stats.todayPayment,
          note: "—",
        }}
        right={{
          label: t.home.todayLedger.toUpperCase(),
          amount: HOME_MOCK.stats.todayLedger,
          note: t.home.noEntriesToday,
        }}
      />

      {/* Segmented tabs */}
      <SegmentedTabs
        tabs={tabs}
        activeId={activeTabId}
        onChange={onTabChange}
      />
      <Text style={styles.offlineHint}>{t.home.offlineHint}</Text>

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
            {isDebtorsTab ? "All your accounts are settled." : t.home.noEntriesToday}
          </Text>
        </View>
      ) : activeTabId === "recent" ? (
        recentTransactions.map((tx) => (
          <View key={tx.id} style={styles.txRow}>
            <Text style={styles.txName}>{tx.customerName}</Text>
            <Text
              style={[
                styles.txAmount,
                { color: tx.type === "debit" ? Colors.debit : Colors.credit },
              ]}
            >
              {tx.type === "debit" ? "-" : "+"}
              {formatCurrency(tx.amount)}
            </Text>
          </View>
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
          />
        ))
      )}

        <View style={styles.listPadBottom} />
      </ScrollView>

      {isDebtorsTab && listData.length === 0 ? (
        <TouchableOpacity
          style={styles.floatingAddCustomerBtn}
          onPress={nav.goToAddCustomer}
          activeOpacity={0.85}
        >
          <MaterialIcon name="person-add" size={20} color={Colors.textInverse} />
          <Text style={styles.floatingAddCustomerText}>{t.customers.addCustomer}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const { isNewUser } = useAuthStatus();
  const [activeTab, setActiveTab] = useState("recent");
  const [customers, setCustomers] = useState<Customer[]>(getAllMockCustomers);

  useFocusEffect(
    useCallback(() => {
      setCustomers(getAllMockCustomers());
    }, []),
  );

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

      {isNewUser ? (
        <NewUserState onAddCustomer={nav.goToAddCustomer} t={t} />
      ) : (
        <ActiveState
          nav={nav}
          t={t}
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
    paddingBottom: 90,
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
  floatingAddCustomerBtn: {
    position: "absolute",
    right: Spacing.lg,
    bottom: 14,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  floatingAddCustomerText: {
    color: Colors.textInverse,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  txName: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  txAmount: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
  listPadBottom: { height: Spacing.xl },
});
