/**
 * Language Selection screen
 * Design ref: select_language_mobile
 */
import { MaterialIcon, type MaterialIconName } from "@/src/components";
import { useAppNavigation } from "@/src/hooks";
import type { Language } from "@/src/i18n";
import { i18nStore, useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Language display names are intentionally hardcoded in their own script —
// they must be recognisable to speakers of that language regardless of active locale.
const LANGUAGE_NAMES: Record<
  Language,
  { icon: MaterialIconName | null; abbrev: string; label: string }
> = {
  en: { icon: "language", abbrev: "EN", label: "English" },
  ur: { icon: null, abbrev: "اع", label: "اردو (Urdu)" },
  roman: { icon: null, abbrev: "Aa", label: "Roman Urdu" },
};

export default function LanguageScreen() {
  const nav = useAppNavigation();
  const { t, lang } = useTranslation();
  const [selected, setSelected] = useState<Language>(lang);

  async function handleSave() {
    await i18nStore.setLanguage(selected);
    nav.goToPhone();
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={nav.goBack}
          hitSlop={8}
          style={styles.backBtn}
        >
          <MaterialIcon
            name="arrow-back"
            size={22}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.auth.language.screenTitle}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{t.auth.language.heading}</Text>
        <Text style={styles.subtitle}>{t.auth.language.subtitle}</Text>

        {/* Language options */}
        <View style={styles.options}>
          {(Object.keys(LANGUAGE_NAMES) as Language[]).map((id) => {
            const active = selected === id;
            const { icon, abbrev, label } = LANGUAGE_NAMES[id];
            const desc =
              id === "en"
                ? t.auth.language.langEnDesc
                : id === "ur"
                  ? t.auth.language.langUrDesc
                  : t.auth.language.langRomanDesc;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.optionRow, active && styles.optionRowActive]}
                onPress={() => setSelected(id)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, active && styles.iconBoxActive]}>
                  {icon ? (
                    <MaterialIcon
                      name={icon}
                      size={22}
                      color={active ? Colors.primary : Colors.textSecondary}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.iconAbbrev,
                        active && styles.iconAbbrevActive,
                      ]}
                    >
                      {abbrev}
                    </Text>
                  )}
                </View>

                <View style={styles.optionText}>
                  <Text
                    style={[
                      styles.optionLabel,
                      active && styles.optionLabelActive,
                    ]}
                  >
                    {label}
                  </Text>
                  <Text style={styles.optionDesc}>{desc}</Text>
                </View>

                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bento / feature section */}
      </ScrollView>

      {/* Sticky footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <View style={styles.saveBtnInner}>
            <MaterialIcon name="save" size={20} color={Colors.textInverse} />
            <Text style={styles.saveBtnText}>
              {t.auth.language.saveChanges}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },

  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },

  heading: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.size.xxxl * 1.2,
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: Typography.size.base * 1.5,
    marginTop: -Spacing.sm,
  },

  options: { gap: Spacing.sm },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.md,
  },
  optionRowActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxActive: { backgroundColor: Colors.primaryLight },
  iconAbbrev: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textSecondary,
  },
  iconAbbrevActive: { color: Colors.primary },
  optionText: { flex: 1 },
  optionLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  optionLabelActive: { color: Colors.primary },
  optionDesc: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkmark: {
    fontSize: Typography.size.sm,
    color: Colors.textInverse,
    fontWeight: Typography.weight.bold,
  },

  bento: { gap: Spacing.sm },
  bentoHero: {
    height: 120,
    borderRadius: Radius.xl,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: Spacing.md,
  },
  bentoHeroBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    opacity: 0.85,
  },
  bentoHeroLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
    letterSpacing: Typography.letterSpacing.wider,
  },
  bentoRow: { flexDirection: "row", gap: Spacing.sm },
  bentoCard: {
    flex: 1,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bentoCardLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.wide,
    color: Colors.textPrimary,
    textAlign: "center",
  },

  footer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.base,
    backgroundColor: Colors.background,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
  },
  saveBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  saveBtnText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
});
