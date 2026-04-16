/**
 * Language Selection screen
 * Design ref: select_language_mobile
 * Back arrow + "Language Settings" header, 3 radio options,
 * feature strip (Secure Setup / Fast Sync), Save Changes button.
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { Button, LanguageOptionRow } from '@/src/components';
import { Colors, Spacing, Typography } from '@/src/theme';
import { i18nStore, useTranslation } from '@/src/i18n';
import type { Language } from '@/src/i18n';

const LANGUAGES: { id: Language; icon: string; label: string; description: string }[] = [
  { id: 'en',     icon: '🌐', label: 'English',     description: 'Default international language' },
  { id: 'ur',     icon: '🇵🇰', label: 'اردو (Urdu)', description: 'National language' },
  { id: 'roman',  icon: '🔤', label: 'Roman Urdu',   description: 'Asaan Urdu typing mein' },
];

export default function LanguageScreen() {
  const nav = useAppNavigation();
  const { t, lang } = useTranslation();
  const [selected, setSelected] = useState<Language>(lang);

  async function handleSave() {
    await i18nStore.setLanguage(selected);
    nav.goToPhone();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.backBtn} onPress={nav.goBack}>←</Text>
        <Text style={styles.headerTitle}>{t.auth.language.screenTitle}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t.auth.language.heading}</Text>
        <Text style={styles.subtitle}>{t.auth.language.subtitle}</Text>

        {/* Language options */}
        <View style={styles.options}>
          {LANGUAGES.map((language) => (
            <LanguageOptionRow
              key={language.id}
              icon={language.icon}
              label={language.label}
              description={language.description}
              selected={selected === language.id}
              onPress={() => setSelected(language.id)}
            />
          ))}
        </View>

        {/* Feature strip */}
        <View style={styles.featureStrip}>
          <Text style={styles.featureLabel}>{t.auth.language.globalAccessibility}</Text>
          <View style={styles.featureRow}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🛡</Text>
              <Text style={styles.featureText}>{t.auth.language.secureSetup}</Text>
            </View>
            <View style={[styles.featureCard, styles.featureCardRed]}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>{t.auth.language.fastSync}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <Button label={`💾  ${t.auth.language.saveChanges}`} onPress={handleSave} variant="primary" size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  backBtn: {
    fontSize: 22,
    color: Colors.primary,
    padding: Spacing.xs,
    fontWeight: Typography.weight.medium,
  },
  headerTitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    gap: Spacing.base,
  },
  title: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: Typography.size.base * 1.5,
  },
  options: { gap: Spacing.sm },
  featureStrip: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  featureLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wider,
    textAlign: 'center',
  },
  featureRow: { flexDirection: 'row', gap: Spacing.sm },
  featureCard: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  featureCardRed: { backgroundColor: Colors.debitLight },
  featureIcon: { fontSize: 24 },
  featureText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wide,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    paddingTop: Spacing.sm,
  },
});
