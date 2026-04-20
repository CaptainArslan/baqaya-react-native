import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcon } from "../ui/MaterialIcon";

export type DatePreset = "today" | "yesterday" | "week" | "month" | "custom";

export interface DateRangeSelection {
  preset: DatePreset;
  from: Date;
  to: Date;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (selection: DateRangeSelection) => void;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(cursor: Date) {
  const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const lastOfMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const startOffset = firstOfMonth.getDay(); // 0 Sunday
  const total = 42; // 6 rows * 7 days
  const startDate = new Date(firstOfMonth);
  startDate.setDate(firstOfMonth.getDate() - startOffset);

  return Array.from({ length: total }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return {
      date: d,
      inCurrentMonth: d.getMonth() === cursor.getMonth(),
      isToday: sameDay(d, new Date()),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      isLastInWeek: i % 7 === 6,
      monthStart: firstOfMonth,
      monthEnd: lastOfMonth,
    };
  });
}

export function DateRangeSelectionSheet({ visible, onClose, onApply }: Props) {
  const now = new Date();
  const insets = useSafeAreaInsets();
  const [preset, setPreset] = useState<DatePreset>("week");
  const [customFrom, setCustomFrom] = useState<Date>(
    startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)),
  );
  const [customTo, setCustomTo] = useState<Date>(startOfDay(now));
  const [monthCursor, setMonthCursor] = useState<Date>(new Date());

  const computed = useMemo(() => {
    if (preset === "today") {
      return { from: startOfDay(now), to: endOfDay(now) };
    }
    if (preset === "yesterday") {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      return { from: startOfDay(d), to: endOfDay(d) };
    }
    if (preset === "week") {
      const d = new Date(now);
      d.setDate(d.getDate() - 6);
      return { from: startOfDay(d), to: endOfDay(now) };
    }
    if (preset === "month") {
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: endOfDay(now),
      };
    }
    const from = customFrom <= customTo ? customFrom : customTo;
    const to = customFrom <= customTo ? customTo : customFrom;
    return { from: startOfDay(from), to: endOfDay(to) };
  }, [preset, now, customFrom, customTo]);

  const calendarDays = useMemo(() => buildCalendarDays(monthCursor), [monthCursor]);

  function handlePickDate(day: Date) {
    setPreset("custom");
    const d = startOfDay(day);

    // If no range or full range already selected, start a new range.
    if (!customFrom || (customFrom && customTo && !sameDay(customFrom, customTo))) {
      setCustomFrom(d);
      setCustomTo(d);
      return;
    }

    if (d < customFrom) {
      setCustomTo(customFrom);
      setCustomFrom(d);
      return;
    }
    setCustomTo(d);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Spacing.lg + Math.max(insets.bottom, 8) },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Select Date Range</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={8}>
                <MaterialIcon name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.presetWrap}>
              {[
                { id: "today", label: "Today" },
                { id: "yesterday", label: "Yesterday" },
                { id: "week", label: "This Week" },
                { id: "month", label: "This Month" },
              ].map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.presetBtn,
                    preset === p.id && styles.presetBtnActive,
                  ]}
                  onPress={() => setPreset(p.id as DatePreset)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.presetText,
                      preset === p.id && styles.presetTextActive,
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarMonth}>
                  {monthCursor.toLocaleDateString("en-PK", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <View style={styles.calendarNav}>
                  <TouchableOpacity
                    onPress={() =>
                      setMonthCursor(
                        new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1),
                      )
                    }
                    hitSlop={8}
                  >
                    <MaterialIcon name="chevron-left" size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      setMonthCursor(
                        new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1),
                      )
                    }
                    hitSlop={8}
                  >
                    <MaterialIcon name="chevron-right" size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.weekRow}>
                {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
                  <Text key={d} style={styles.weekDay}>
                    {d}
                  </Text>
                ))}
              </View>
              <View style={styles.grid}>
                {calendarDays.map((day) => {
                  const inRange =
                    day.date.getTime() >= startOfDay(computed.from).getTime() &&
                    day.date.getTime() <= startOfDay(computed.to).getTime();
                  const isStart = sameDay(day.date, computed.from);
                  const isEnd = sameDay(day.date, computed.to);
                  return (
                    <TouchableOpacity
                      key={day.date.toISOString()}
                      style={styles.dayCell}
                      activeOpacity={0.8}
                      onPress={() => handlePickDate(day.date)}
                    >
                      <View
                        style={[
                          styles.dayFill,
                          inRange && styles.dayMiddle,
                          isStart && styles.dayStart,
                          isEnd && styles.dayEnd,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            !day.inCurrentMonth && styles.dayOutside,
                            (isStart || isEnd) && styles.dayTextInverse,
                          ]}
                        >
                          {day.date.getDate()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.fromToRow}>
              <View style={styles.dateBoxWrap}>
                <Text style={styles.label}>FROM</Text>
                <View style={styles.dateBox}>
                  <MaterialIcon name="calendar-today" size={14} color={Colors.primary} />
                  <Text style={styles.dateText}>{formatDate(computed.from)}</Text>
                </View>
              </View>
              <View style={styles.dateBoxWrap}>
                <Text style={styles.label}>TO</Text>
                <View style={styles.dateBox}>
                  <MaterialIcon name="calendar-today" size={14} color={Colors.primary} />
                  <Text style={styles.dateText}>{formatDate(computed.to)}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => onApply({ preset, from: computed.from, to: computed.to })}
              activeOpacity={0.85}
            >
              <Text style={styles.applyText}>Apply Selection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setPreset("week");
                const d = new Date();
                const from = new Date(d);
                from.setDate(d.getDate() - 6);
                setCustomFrom(startOfDay(from));
                setCustomTo(startOfDay(d));
                setMonthCursor(new Date());
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    maxHeight: "92%",
  },
  content: {
    gap: Spacing.md,
    paddingTop: Spacing.xs,
  },
  handle: {
    width: 52,
    height: 6,
    borderRadius: 999,
    alignSelf: "center",
    backgroundColor: Colors.border,
  },
  header: {
    marginTop: Spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  presetWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  presetBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  presetBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetText: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  presetTextActive: {
    color: Colors.textInverse,
  },
  calendarCard: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarMonth: {
    color: Colors.primary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.semibold,
  },
  calendarNav: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekDay: {
    width: 30,
    textAlign: "center",
    color: Colors.textSecondary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.285%",
    aspectRatio: 1,
    paddingVertical: 1,
  },
  dayFill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayStart: {
    backgroundColor: Colors.primaryDark,
    borderTopLeftRadius: Radius.md,
    borderBottomLeftRadius: Radius.md,
  },
  dayMiddle: {
    backgroundColor: Colors.primaryLight,
  },
  dayEnd: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
  },
  dayText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
  },
  dayOutside: {
    color: Colors.textMuted,
    opacity: 0.5,
  },
  dayTextInverse: {
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
  },
  fromToRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  dateBoxWrap: {
    flex: 1,
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.6,
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  dateText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.medium,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    alignItems: "center",
    paddingVertical: Spacing.md + 2,
    marginTop: Spacing.sm,
  },
  applyText: {
    color: Colors.textInverse,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.semibold,
  },
  resetBtn: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  resetText: {
    color: Colors.primary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.medium,
  },
});
