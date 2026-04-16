/**
 * Phone Number Entry screen
 * Design ref: phone_number_entry_active_state_1 / error_toast_state
 * Inner header (back + "Baqaya"), lock icon, title, phone input,
 * privacy note, Send OTP button, Terms link, footer links, error toast.
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
import { useRouter } from 'expo-router';
import { useAppNavigation } from '@/src/hooks';
import { Button, Toast } from '@/src/components';
import { PhoneInputField } from '@/src/components/ui/PhoneInputField';
import { Colors, Radius, Spacing, Typography } from '@/src/theme';
import { useTranslation } from '@/src/i18n';

function validate(phone: string) {
  return /^3[0-9]{9}$/.test(phone.replace(/\s/g, ''));
}

export default function PhoneScreen() {
  const nav = useAppNavigation();
  const router = useRouter();
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSend() {
    setFieldError('');
    setToast('');
    if (!validate(phone)) {
      setFieldError(t.auth.phone.errorInvalidFormat);
      setToast(t.auth.phone.errorSendFailed);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Pass phone so OTP screen can show masked number
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    }, 800);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={nav.goBack} hitSlop={10}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Baqaya</Text>
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
          {/* Lock icon */}
          <View style={styles.iconBox}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>

          <Text style={styles.title}>{t.auth.phone.heading}</Text>
          <Text style={styles.subtitle}>{t.auth.phone.subtitle}</Text>

          {/* Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.auth.phone.label}</Text>
            <PhoneInputField
              value={phone}
              onChangeText={(v) => { setPhone(v); setFieldError(''); }}
              hasError={!!fieldError}
            />
            {fieldError ? <Text style={styles.fieldError}>{fieldError}</Text> : null}
          </View>

          {/* Privacy note */}
          <View style={styles.privacyRow}>
            <Text style={styles.privacyIcon}>ℹ</Text>
            <Text style={styles.privacyText}>{t.auth.phone.privacyNote}</Text>
          </View>

          {/* CTA */}
          <Button
            label={t.auth.phone.sendOtp}
            onPress={handleSend}
            loading={loading}
            style={styles.cta}
          />

          <Text style={styles.terms}>
            {t.auth.phone.termsPrefix}
            <Text style={styles.termsLink} onPress={nav.goToTerms}>
              {t.auth.phone.termsLink}
            </Text>
          </Text>

          {/* Footer links */}
          <View style={styles.footerLinks}>
            <TouchableOpacity hitSlop={8}>
              <Text style={styles.footerLink}>❓ {t.common.needHelp}</Text>
            </TouchableOpacity>
            <TouchableOpacity hitSlop={8}>
              <Text style={styles.footerLink}>📞 {t.common.contactSupport}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Error toast */}
      <Toast
        visible={!!toast}
        message={toast}
        type="error"
        onDismiss={() => setToast('')}
      />
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
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
    gap: Spacing.base,
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  lockIcon: { fontSize: 28 },
  title: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: Typography.size.xxxl * 1.25,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.size.base * 1.5,
  },
  inputGroup: { width: '100%', gap: Spacing.xs },
  inputLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  fieldError: {
    fontSize: Typography.size.sm,
    color: Colors.error,
    marginTop: 2,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.infoLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: '100%',
  },
  privacyIcon: { fontSize: 14, color: Colors.info, marginTop: 1 },
  privacyText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.info,
    lineHeight: Typography.size.sm * 1.5,
  },
  cta: { width: '100%', marginTop: Spacing.sm },
  terms: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: Typography.weight.medium,
    textDecorationLine: 'underline',
  },
  footerLinks: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginTop: Spacing.sm,
  },
  footerLink: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
});
