import { MaterialIcon } from "@/src/components";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TermsSection = {
  id: number;
  title: string;
  body: string;
  icon: React.ComponentProps<typeof MaterialIcon>["name"];
  borderColor: string;
  iconBg: string;
  titleColor: string;
  bodyStyle?: "italic";
};

export default function TermsScreen() {
  const { t } = useTranslation();
  const nav = useAppNavigation();

  const sections: TermsSection[] = [
    {
      id: 1,
      title: t.auth.terms.section1Title,
      body: t.auth.terms.section1Body,
      icon: "assignment-turned-in",
      borderColor: Colors.primary,
      iconBg: Colors.primaryLight,
      titleColor: Colors.primaryText,
    },
    {
      id: 2,
      title: t.auth.terms.section2Title,
      body: t.auth.terms.section2Body,
      icon: "account-balance-wallet",
      borderColor: Colors.info,
      iconBg: Colors.infoLight,
      titleColor: Colors.info,
    },
    {
      id: 3,
      title: t.auth.terms.section3Title,
      body: t.auth.terms.section3Body,
      icon: "verified",
      borderColor: Colors.primaryMid,
      iconBg: Colors.creditLight,
      titleColor: Colors.primaryMid,
    },
    {
      id: 4,
      title: t.auth.terms.section4Title,
      body: t.auth.terms.section4Body,
      icon: "folder-shared",
      borderColor: Colors.textMuted,
      iconBg: Colors.surfaceSecondary,
      titleColor: Colors.textPrimary,
    },
    {
      id: 5,
      title: t.auth.terms.section5Title,
      body: t.auth.terms.section5Body,
      icon: "warning",
      borderColor: Colors.debit,
      iconBg: Colors.debitLight,
      titleColor: Colors.debit,
      bodyStyle: "italic",
    },
    {
      id: 6,
      title: t.auth.terms.section6Title,
      body: t.auth.terms.section6Body,
      icon: "update",
      borderColor: Colors.info,
      iconBg: Colors.infoLight,
      titleColor: Colors.info,
    },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBackOr("/(auth)/phone")} hitSlop={10} style={styles.backBtn}>
          <MaterialIcon name="arrow-back" size={22} color={Colors.textInverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.auth.terms.screenTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.title}>{t.auth.terms.title}</Text>
          <View style={styles.updatedPill}>
            <Text style={styles.updatedText}>{t.auth.terms.lastUpdated}</Text>
          </View>
        </View>

        <View style={styles.cardsWrap}>
          {sections.map((section) => (
            <View key={section.id} style={[styles.card, { borderLeftColor: section.borderColor }]}>
              <View style={[styles.iconWrap, { backgroundColor: section.iconBg }]}>
                <MaterialIcon name={section.icon} size={18} color={section.titleColor} />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: section.titleColor }]}>
                  {section.id}. {section.title}
                </Text>
                <Text style={[styles.cardText, section.bodyStyle === "italic" && styles.cardTextItalic]}>
                  {section.body}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => nav.goBackOr("/(auth)/phone")}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaText}>{t.auth.terms.cta}</Text>
          <MaterialIcon name="check-circle" size={18} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: Spacing.base,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.base,
  },
  hero: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.size.hero,
    fontWeight: Typography.weight.bold,
    color: Colors.primaryText,
    letterSpacing: Typography.letterSpacing.tight,
  },
  updatedPill: {
    alignSelf: "flex-start",
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 1,
  },
  updatedText: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
    letterSpacing: Typography.letterSpacing.wider,
    textTransform: "uppercase",
  },
  cardsWrap: {
    gap: Spacing.base,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderLeftWidth: 3,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: Spacing.xs,
  },
  cardTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
  },
  cardText: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    lineHeight: Typography.size.md * Typography.lineHeight.relaxed,
  },
  cardTextItalic: {
    fontStyle: "italic",
  },
  bottomBar: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  ctaButton: {
    height: 50,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  ctaText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
  },
});
