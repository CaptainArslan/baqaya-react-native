/**
 * Create Shop screen
 * Design ref: create_shop
 * Back + "Create Shop" header, step indicator, shop illustration,
 * title, shop name input, data safety note, Continue button.
 */
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { Button, TextInputField } from '@/src/components';
import { Colors, Radius, Spacing, Typography } from '@/src/theme';
import { authStore } from '@/src/store/authStore';
import { useTranslation } from '@/src/i18n';

export default function CreateShopScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState('');

  async function handleContinue() {
    if (!shopName.trim()) {
      setError(t.onboarding.createShop.errorEmpty);
      return;
    }
    await import('@/src/services/storage').then(({ setShopName }) => setShopName(shopName.trim()));
    await authStore.completeOnboarding();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={nav.goBack} hitSlop={10}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.stepDot} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
        </View>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Shop illustration */}
          <View style={styles.illustrationBox}>
            <Text style={styles.illustrationEmoji}>🏪</Text>
          </View>

          <Text style={styles.title}>{t.onboarding.createShop.title}</Text>
          <Text style={styles.subtitle}>{t.onboarding.createShop.subtitle}</Text>

          {/* Input */}
          <TextInputField
            label={t.onboarding.createShop.label}
            placeholder={t.onboarding.createShop.placeholder}
            value={shopName}
            onChangeText={(v) => { setShopName(v); setError(''); }}
            error={error}
            style={styles.input}
          />

          {/* Data safety note */}
          <View style={styles.safetyNote}>
            <Text style={styles.safetyIcon}>🛡</Text>
            <Text style={styles.safetyText}>
              {t.onboarding.createShop.safeTitle}{'\n'}
              <Text style={styles.safetyMuted}>{t.onboarding.createShop.safeBody}</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* CTA */}
      <View style={styles.footer}>
        <Button
          label={t.onboarding.createShop.continue}
          onPress={handleContinue}
          disabled={!shopName.trim()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backArrow: {
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  headerCenter: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
    width: 18,
    borderRadius: 3,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
    gap: Spacing.base,
  },
  illustrationBox: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.base,
  },
  illustrationEmoji: { fontSize: 48 },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.size.xxl * 1.3,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: Typography.size.base * 1.5,
  },
  input: { marginTop: Spacing.xs },
  safetyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  safetyIcon: { fontSize: 16, marginTop: 2 },
  safetyText: {
    flex: 1,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    lineHeight: Typography.size.sm * 1.5,
  },
  safetyMuted: {
    fontWeight: Typography.weight.regular,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.base,
    paddingTop: Spacing.sm,
  },
});
