import { Avatar, InnerHeader, MaterialIcon } from "@/src/components";
import { getMockCustomer } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { toast } from "@/src/services";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { buildReminderMessage, formatCurrency, openWhatsAppReminder } from "@/src/utils";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tone = "friendly" | "normal" | "strict";

const TONE_TEMPLATES: Record<Tone, string> = {
  friendly:
    "Bhaijaan, umeed hai khairiyat se honge. Aap ka {balance} ka purana hisab baki hai.\n\nAgar aaj clear kar dein toh meherbani hogi. Shukriya!",
  normal:
    "Assalam o Alaikum {name}, aap ka {balance} ka balance pending hai.\n\nMeharbani karke aaj payment clear kar dein. Shukriya.",
  strict:
    "Reminder: {name}, aap ka {balance} ka outstanding balance abhi tak clear nahi hua.\n\nPlease payment turant clear karein.",
};

export default function WhatsAppReminderScreen() {
  const nav = useAppNavigation();
  const { customerId } = useLocalSearchParams<{ customerId: string }>();

  const customer = useMemo(
    () => getMockCustomer(customerId ?? ""),
    [customerId],
  );
  const [tone, setTone] = useState<Tone>("normal");
  const [customMessage, setCustomMessage] = useState("");

  const balanceText = formatCurrency(Math.abs(customer?.balance ?? 0));
  const canSend = !!customer?.phone?.trim();

  const generatedMessage = buildReminderMessage(
    TONE_TEMPLATES[tone],
    customer?.name ?? "Customer",
    balanceText,
  );
  const message = customMessage.trim() ? customMessage : generatedMessage;

  async function handleSend() {
    if (!customer?.phone?.trim()) {
      toast.error("Phone number missing for this customer.", { throttleKey: "wa:no-phone" });
      return;
    }
    const result = await openWhatsAppReminder(customer.phone, message);
    if (result === "opened") return;
    if (result === "no_phone") toast.error("Phone number missing for this customer.", { throttleKey: "wa:no-phone" });
    if (result === "no_app") toast.warning("Could not open WhatsApp.", { throttleKey: "wa:no-app" });
  }

  if (!customer) {
    return (
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <InnerHeader title="WhatsApp Reminder" onBack={nav.goBack} />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Customer not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <InnerHeader title="WhatsApp Reminder" onBack={nav.goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.customerCard}>
          <Avatar name={customer.name} size="md" />
          <View style={styles.customerMeta}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerSub}>Verified Customer</Text>
          </View>
          <View style={styles.balanceWrap}>
            <Text style={styles.balanceAmount}>{balanceText}</Text>
            <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>SELECT MESSAGE TONE</Text>
        <View style={styles.toneRow}>
          {([
            ["friendly", "mood", "Friendly"],
            ["normal", "sentiment-neutral", "Normal"],
            ["strict", "mood-bad", "Strict"],
          ] as const).map(([id, icon, label]) => {
            const active = tone === id;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.toneCard, active && styles.toneCardActive]}
                activeOpacity={0.85}
                onPress={() => {
                  setTone(id);
                  setCustomMessage("");
                }}
              >
                <MaterialIcon
                  name={icon}
                  size={22}
                  color={active ? Colors.textInverse : Colors.textSecondary}
                />
                <Text style={[styles.toneText, active && styles.toneTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.previewHeader}>
          <Text style={styles.sectionTitle}>MESSAGE PREVIEW</Text>
          <Text style={styles.editHint}>Edit Text</Text>
        </View>
        <View style={styles.previewCard}>
          <TextInput
            value={message}
            onChangeText={setCustomMessage}
            multiline
            style={styles.messageInput}
            textAlignVertical="top"
          />
          <Text style={styles.dynamicLabel}>DYNAMIC MESSAGE</Text>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <MaterialIcon name="verified-user" size={18} color={Colors.textSecondary} />
          </View>
          <Text style={styles.tipText}>Payment reminders increase recovery rate by 40%.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
          activeOpacity={0.85}
          disabled={!canSend}
          onPress={handleSend}
        >
          <MaterialIcon name="chat" size={18} color={Colors.textInverse} />
          <Text style={styles.sendBtnText}>Send via WhatsApp</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>INSTANT RECOVERY THROUGH DIRECT MESSAGING</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  customerCard: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  customerMeta: { flex: 1 },
  customerName: {
    fontSize: Typography.size.xl,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  customerSub: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
  balanceWrap: { alignItems: "flex-end" },
  balanceAmount: {
    fontSize: Typography.size.xxl,
    color: Colors.debit,
    fontWeight: Typography.weight.bold,
  },
  balanceLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.7,
  },
  sectionTitle: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.8,
  },
  toneRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  toneCard: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  toneCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toneText: {
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  toneTextActive: { color: Colors.textInverse },
  previewHeader: {
    marginTop: Spacing.xs,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editHint: {
    fontSize: Typography.size.base,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
  previewCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
  },
  messageInput: {
    minHeight: 148,
    fontSize: Typography.size.xl,
    lineHeight: Typography.size.xl * 1.4,
    color: Colors.textPrimary,
  },
  dynamicLabel: {
    marginTop: Spacing.xs,
    alignSelf: "flex-end",
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 1,
  },
  tipCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: {
    flex: 1,
    fontSize: Typography.size.lg,
    color: Colors.primaryText,
    fontWeight: Typography.weight.medium,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
    gap: Spacing.sm,
  },
  sendBtn: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  sendBtnDisabled: { opacity: 0.45 },
  sendBtnText: {
    fontSize: Typography.size.xl,
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
  },
  footerNote: {
    textAlign: "center",
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
    letterSpacing: 1.2,
  },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: {
    fontSize: Typography.size.base,
    color: Colors.textMuted,
  },
});

