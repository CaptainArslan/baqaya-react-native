/**
 * Reports tab
 * Design ref: baqaya_reports_populated_data_mobile
 *             baqaya_reports_date_range_update
 */
import { Avatar, MaterialIcon, TabHeader } from "@/src/components";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation, type TranslationMap } from "@/src/i18n";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils";
import { SCREEN_MOCKS } from "@/data";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Mock data ────────────────────────────────────────────────────────────────

interface LatePayer {
  id: string;
  name: string;
  daysPending: number;
}

interface TopDebtor {
  id: string;
  name: string;
  txCount: number;
  balance: number;
}

const REPORTS_MOCK = SCREEN_MOCKS.reports;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Red hero card */
function CollectCard({
  amount,
  pendingCount,
  t,
}: {
  amount: number;
  pendingCount: number;
  t: TranslationMap;
}) {
  const isEmpty = amount === 0;
  return (
    <View style={heroStyles.card}>
      {/* decorative circle top-right */}
      <View style={heroStyles.decor} />
      <Text style={heroStyles.eyebrow}>{t.reports.youNeedToCollect}</Text>
      <Text style={heroStyles.amount}>
        Rs.{"\n"}
        {formatCurrency(amount)}
      </Text>
      <View style={heroStyles.pill}>
        <Text style={heroStyles.pillText}>
          {isEmpty
            ? t.reports.allSettled
            : `${pendingCount} ${t.reports.pendingSettlements}`}
        </Text>
      </View>
    </View>
  );
}

const heroStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.debit,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.base,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.sm,
    overflow: "hidden",
  },
  decor: {
    position: "absolute",
    top: -24,
    right: -24,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  eyebrow: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
    letterSpacing: 1,
    opacity: 0.85,
  },
  amount: {
    fontSize: Typography.size.hero + 4,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
    textAlign: "center",
    lineHeight: (Typography.size.hero + 4) * 1.1,
  },
  pill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  pillText: {
    fontSize: Typography.size.sm,
    color: Colors.textInverse,
    fontWeight: Typography.weight.medium,
  },
});

/** Period selector row */
function PeriodRow({
  period,
  onPress,
  t,
}: {
  period: "today" | "week" | "month";
  onPress: () => void;
  t: TranslationMap;
}) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <TouchableOpacity
      style={periodStyles.row}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={periodStyles.calIcon}>
        <MaterialIcon name="calendar-today" size={20} color={Colors.primary} />
      </View>
      <View style={periodStyles.info}>
        <Text style={periodStyles.label}>{t.reports.viewingPeriod}</Text>
        <Text style={periodStyles.range}>
          {fmt(start)} – {fmt(end)}
        </Text>
      </View>
      <MaterialIcon name="chevron-right" size={22} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

const periodStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.base,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.xs,
  },
  calIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  range: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
    marginTop: 2,
  },
});

/** Section card wrapper */
function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={sectionStyles.card}>
      <View style={sectionStyles.header}>
        <Text style={sectionStyles.title}>{title}</Text>
        <View>{icon}</View>
      </View>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.base,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
});

/** Late payers section */
function LatePayersSection({
  payers,
  t,
}: {
  payers: LatePayer[];
  t: TranslationMap;
}) {
  function handleRemind(name: string) {
    Alert.alert(
      "Reminder Sent",
      `A WhatsApp reminder has been sent to ${name}.`,
      [{ text: "OK" }],
    );
  }

  return (
    <SectionCard
      title={t.reports.latePayers}
      icon={<MaterialIcon name="schedule" size={22} color={Colors.textMuted} />}
    >
      {payers.length === 0 ? (
        <View style={lpStyles.empty}>
          <View style={lpStyles.emptyIconWrap}>
            <MaterialIcon
              name="verified-user"
              size={28}
              color={Colors.textMuted}
            />
          </View>
          <Text style={lpStyles.emptyTitle}>{t.reports.noLatePayers}</Text>
          <Text style={lpStyles.emptyBody}>{t.reports.noLatePayersBody}</Text>
        </View>
      ) : (
        payers.map((p, i) => (
          <View key={p.id}>
            {i > 0 && <View style={lpStyles.divider} />}
            <View style={lpStyles.row}>
              <Avatar name={p.name} size="sm" />
              <View style={lpStyles.info}>
                <Text style={lpStyles.name}>{p.name}</Text>
                <Text style={lpStyles.days}>
                  {p.daysPending} {t.reports.daysPending}
                </Text>
              </View>
              <TouchableOpacity
                style={lpStyles.remindBtn}
                activeOpacity={0.75}
                onPress={() => handleRemind(p.name)}
              >
                <Text style={lpStyles.remindText}>{t.reports.remind}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </SectionCard>
  );
}

const lpStyles = StyleSheet.create({
  empty: { alignItems: "center", paddingVertical: Spacing.lg, gap: Spacing.sm },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  emptyBody: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    textAlign: "center",
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  info: { flex: 1 },
  name: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
  },
  days: {
    fontSize: Typography.size.sm,
    color: Colors.debit,
    marginTop: 2,
  },
  remindBtn: {
    borderWidth: 1,
    borderColor: Colors.debit,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  remindText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.debit,
    letterSpacing: 0.4,
  },
});

/** Top debtors section */
function TopDebtorsSection({
  debtors,
  t,
}: {
  debtors: TopDebtor[];
  t: TranslationMap;
}) {
  return (
    <SectionCard
      title={t.reports.topDebtors}
      icon={
        <MaterialIcon name="trending-down" size={22} color={Colors.textMuted} />
      }
    >
      {debtors.length === 0 ? (
        <View style={tdStyles.empty}>
          <MaterialIcon name="block" size={24} color={Colors.textMuted} />
          <Text style={tdStyles.emptyText}>{t.reports.noDebtors}</Text>
        </View>
      ) : (
        debtors.map((d, i) => (
          <View key={d.id}>
            {i > 0 && <View style={tdStyles.divider} />}
            <View style={tdStyles.row}>
              <View style={tdStyles.info}>
                <Text style={tdStyles.name}>{d.name}</Text>
                <Text style={tdStyles.meta}>
                  {d.txCount} {t.reports.transactions}
                </Text>
              </View>
              <Text style={tdStyles.amount}>
                Rs. {formatCurrency(d.balance)}
              </Text>
            </View>
          </View>
        ))
      )}
    </SectionCard>
  );
}

const tdStyles = StyleSheet.create({
  empty: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  info: { flex: 1 },
  name: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  amount: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
});

/** Report summary with two mini-cards + chart placeholder */
function ReportSummarySection({
  totalToCollect,
  totalReceived,
  hasData,
  t,
}: {
  totalToCollect: number;
  totalReceived: number;
  hasData: boolean;
  t: TranslationMap;
}) {
  // Softened bar chart: 4 bars (W1–W4) with mock heights when data exists
  const MOCK_BARS = REPORTS_MOCK.weeklyBars;

  return (
    <View style={summaryStyles.card}>
      {/* Header */}
      <View style={summaryStyles.header}>
        <Text style={summaryStyles.title}>{t.reports.reportSummary}</Text>
        <View style={summaryStyles.periodPill}>
          <Text style={summaryStyles.periodPillText}>
            {t.reports.selectedPeriod}
          </Text>
        </View>
      </View>

      {/* Two mini-cards */}
      <View style={summaryStyles.miniRow}>
        <View style={[summaryStyles.miniCard, summaryStyles.miniCardDebit]}>
          <Text style={summaryStyles.miniLabel}>
            {t.reports.totalToCollect}
          </Text>
          <Text
            style={[summaryStyles.miniAmount, summaryStyles.miniAmountDebit]}
          >
            Rs. {formatCurrency(totalToCollect)}
          </Text>
        </View>
        <View style={[summaryStyles.miniCard, summaryStyles.miniCardCredit]}>
          <Text style={summaryStyles.miniLabel}>{t.reports.totalReceived}</Text>
          <Text
            style={[summaryStyles.miniAmount, summaryStyles.miniAmountCredit]}
          >
            Rs. {formatCurrency(totalReceived)}
          </Text>
        </View>
      </View>

      {/* Chart area */}
      <View
        style={[
          summaryStyles.chartBox,
          !hasData && summaryStyles.chartBoxEmpty,
        ]}
      >
        <Text style={summaryStyles.chartLabel}>
          {t.reports.weeklyCollections}
        </Text>
        {hasData ? (
          <View style={summaryStyles.bars}>
            {MOCK_BARS.map((h, i) => (
              <View key={i} style={summaryStyles.barCol}>
                <View style={[summaryStyles.bar, { height: h * 80 }]} />
                <Text style={summaryStyles.barLabel}>W{i + 1}</Text>
              </View>
            ))}
          </View>
        ) : (
          <>
            {/* Ghost bars */}
            <View style={summaryStyles.bars}>
              {[0.5, 0.3, 0.7, 0.4].map((h, i) => (
                <View key={i} style={summaryStyles.barCol}>
                  <View style={[summaryStyles.barGhost, { height: h * 80 }]} />
                  <Text style={summaryStyles.barLabel}>W{i + 1}</Text>
                </View>
              ))}
            </View>
            <Text style={summaryStyles.noChartTitle}>
              {t.reports.noChartData}
            </Text>
            <Text style={summaryStyles.noChartBody}>
              {t.reports.noChartDataBody}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.base,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  periodPill: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodPillText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.4,
  },

  // ── Mini cards ──
  miniRow: { flexDirection: "row", gap: Spacing.sm },
  miniCard: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderLeftWidth: 3,
    backgroundColor: Colors.surfaceSecondary,
  },
  miniCardDebit: { borderLeftColor: Colors.debit },
  miniCardCredit: { borderLeftColor: Colors.credit },
  miniLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  miniAmount: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
  },
  miniAmountDebit: { color: Colors.textPrimary },
  miniAmountCredit: { color: Colors.primary },

  // ── Chart ──
  chartBox: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    gap: Spacing.sm,
    minHeight: 160,
    justifyContent: "flex-end",
  },
  chartBoxEmpty: { alignItems: "center", justifyContent: "center" },
  chartLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    alignSelf: "flex-start",
    marginBottom: Spacing.xs,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 100,
  },
  barCol: { alignItems: "center", gap: Spacing.xs, flex: 1 },
  bar: {
    width: 28,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xs,
    opacity: 0.85,
  },
  barGhost: {
    width: 28,
    backgroundColor: Colors.border,
    borderRadius: Radius.xs,
  },
  barLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
  noChartTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  noChartBody: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    textAlign: "center",
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ReportsScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<"today" | "week" | "month">("month");

  // Toggle mock data via period — month shows populated, others show empty
  const periodData = REPORTS_MOCK.periods[period];
  const hasData =
    periodData.latePayers.length > 0 || periodData.topDebtors.length > 0;
  const latePayers = periodData.latePayers as LatePayer[];
  const topDebtors = periodData.topDebtors as TopDebtor[];
  const collectAmt = periodData.totalToCollect;
  const receivedAmt = periodData.totalReceived;
  const pendingCount = latePayers.length + topDebtors.length;

  const periodTabs = [
    { id: "today", label: t.reports.today },
    { id: "week", label: t.reports.week },
    { id: "month", label: t.reports.month },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <TabHeader title={t.tabs.reports} onMenuPress={nav.goToDrawer} />

      {/* Period tabs just below header */}
      <View style={styles.tabRow}>
        {periodTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, period === tab.id && styles.tabActive]}
            onPress={() => setPeriod(tab.id as typeof period)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.tabText,
                period === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <CollectCard amount={collectAmt} pendingCount={pendingCount} t={t} />
        <PeriodRow
          period={period}
          onPress={() => {
            const next: Record<typeof period, typeof period> = {
              today: "week",
              week: "month",
              month: "today",
            };
            setPeriod(next[period]);
          }}
          t={t}
        />
        <LatePayersSection payers={latePayers} t={t} />
        <TopDebtorsSection debtors={topDebtors} t={t} />
        <ReportSummarySection
          totalToCollect={collectAmt}
          totalReceived={receivedAmt}
          hasData={hasData}
          t={t}
        />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => nav.goToAddEntry("", "udhaar")}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnIcon}>⊕</Text>
          <Text style={styles.addBtnText}>{t.reports.addNewEntry}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  // ── Period tabs ──
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
  },

  // ── Scroll ──
  content: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  // ── Footer CTA ──
  footer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.base,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    gap: Spacing.sm,
  },
  addBtnIcon: {
    fontSize: Typography.size.lg,
    color: Colors.textInverse,
    fontWeight: Typography.weight.bold,
  },
  addBtnText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
});
