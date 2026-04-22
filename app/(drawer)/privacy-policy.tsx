import { MaterialIcon } from "@/src/components";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function SectionCard({
  index,
  title,
  body,
  icon,
  highlighted,
}: {
  index: number;
  title: string;
  body: string;
  icon: React.ComponentProps<typeof MaterialIcon>["name"];
  highlighted?: boolean;
}) {
  return (
    <View style={[styles.sectionCard, highlighted && styles.sectionCardHighlighted]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconWrap, highlighted && styles.sectionIconWrapHighlighted]}>
          <MaterialIcon
            name={icon}
            size={18}
            color={highlighted ? Colors.textInverse : Colors.primary}
          />
        </View>
        <Text style={[styles.sectionTitle, highlighted && styles.sectionTitleHighlighted]}>
          {index}. {title}
        </Text>
      </View>
      <Text style={[styles.sectionBody, highlighted && styles.sectionBodyHighlighted]}>{body}</Text>
    </View>
  );
}

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcon name="arrow-back" size={22} color={Colors.textInverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.notice}>
          <Text style={styles.noticeLabel}>NOTICE</Text>
          <Text style={styles.noticeText}>Last updated: October 24, 2023</Text>
        </View>

        <SectionCard
          index={1}
          icon="description"
          title="Introduction"
          body="Baqaya is committed to protecting your privacy. Our platform is designed to help you track credit (Udhaar) and payments efficiently."
        />

        <SectionCard
          index={2}
          icon="folder"
          title="Data We Collect"
          body="Identity details, account verification data, transaction history, credit entries and payment logs."
        />

        <SectionCard
          index={3}
          icon="tune"
          title="How We Use Data"
          body="We use your data to manage ledger records, generate insights, and send reminders so business cash flow stays healthy."
        />

        <SectionCard
          index={4}
          icon="security"
          title="Data Security"
          body="We apply industry-standard encryption and secure cloud storage to protect all financial records from unauthorized access."
          highlighted
        />

        <SectionCard
          index={5}
          icon="share"
          title="Data Sharing"
          body="We do not sell your personal data. WhatsApp integration is used strictly for sending reminder messages."
        />

        <SectionCard
          index={6}
          icon="person"
          title="User Control"
          body="You can edit profile info, export your data, and request account deletion from Support & Account settings."
        />

        <SectionCard
          index={7}
          icon="support-agent"
          title="Need Help?"
          body="Our support team is available to assist with any privacy concern."
        />

        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
          <MaterialIcon name="mail" size={18} color={Colors.textInverse} />
          <Text style={styles.primaryBtnText}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    fontSize: Typography.size.base,
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  notice: { gap: 2 },
  noticeLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.6,
  },
  noticeText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  sectionCardHighlighted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  sectionIconWrap: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionIconWrapHighlighted: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  sectionTitle: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.bold,
  },
  sectionTitleHighlighted: { color: Colors.textInverse },
  sectionBody: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.size.sm * 1.45,
  },
  sectionBodyHighlighted: { color: "rgba(255,255,255,0.9)" },
  primaryBtn: {
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.xs,
  },
  primaryBtnText: {
    fontSize: Typography.size.base,
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
  },
});
