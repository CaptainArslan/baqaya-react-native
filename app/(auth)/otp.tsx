/**
 * OTP Verification screen
 * Design ref: verify_otp_active_state_1 / error_state_clean_inputs / rate_limit
 * Header (back + Baqaya + shield icon), title, masked phone, 4-box OTP,
 * inline error, resend countdown, Verify button, footer links, error toast.
 */
import React, { useEffect, useRef, useState } from 'react';
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
import { useLocalSearchParams } from 'expo-router';
import { useAppNavigation } from '@/src/hooks';
import { Button, Toast } from '@/src/components';
import { OtpInput } from '@/src/components/ui/OtpInput';
import { Colors, Spacing, Typography } from '@/src/theme';
import { authStore } from '@/src/store/authStore';
import { useTranslation } from '@/src/i18n';

const RESEND_SECONDS = 30;

export default function OtpScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const maskedPhone = phone ? `+92 3xx${phone.slice(-4)}` : '+92 3xx••••';

  const [otp, setOtp] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, []);

  function startTimer() {
    clearTimer();
    setResendSeconds(RESEND_SECONDS);
    timerRef.current = setInterval(() => {
      setResendSeconds((s) => {
        if (s <= 1) { clearTimer(); return 0; }
        return s - 1;
      });
    }, 1000);
  }

  function clearTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function handleVerify() {
    setFieldError('');
    setToast('');
    if (otp.length < 4) {
      setFieldError(t.auth.otp.errorEnterCode);
      return;
    }
    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    // Simulate wrong code
    if (otp === '0000') {
      setFieldError(t.auth.otp.errorInvalidCode);
      setToast(t.auth.otp.errorVerifyFailed);
      setOtp('');
      return;
    }

    // '1111' = returning user, any other valid code = new user
    // Replace with real API is_new_user flag when backend integrates
    const isNewUser = otp !== '1111';
    await authStore.login(isNewUser);
    // Root layout auth gate handles the redirect automatically
  }

  function handleResend() {
    if (resendSeconds > 0) return;
    setOtp('');
    setFieldError('');
    startTimer();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={nav.goBack} hitSlop={10}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Baqaya</Text>
        <Text style={styles.shieldIcon}>🛡</Text>
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
          <Text style={styles.title}>{t.auth.otp.heading}</Text>

          <Text style={styles.subtitle}>
            {t.auth.otp.sentTo}
            <Text style={styles.bold}>{maskedPhone}</Text>
          </Text>

          {/* Edit number link */}
          <TouchableOpacity onPress={nav.goBack} style={styles.editRow}>
            <Text style={styles.editIcon}>✏</Text>
            <Text style={styles.editLabel}>{t.auth.otp.editNumber}</Text>
          </TouchableOpacity>

          {/* OTP boxes */}
          <OtpInput
            value={otp}
            onChange={(v) => { setOtp(v); setFieldError(''); }}
            hasError={!!fieldError}
            style={styles.otpInput}
          />

          {/* Inline error */}
          {fieldError ? (
            <Text style={styles.fieldError}>{fieldError}</Text>
          ) : null}

          {/* Resend row */}
          <View style={styles.resendRow}>
            <Text style={styles.resendHint}>
              {resendSeconds > 0
                ? `⊙  ${t.auth.otp.resendIn}${String(resendSeconds).padStart(2, '0')}`
                : null}
            </Text>
            <TouchableOpacity onPress={handleResend} disabled={resendSeconds > 0}>
              <Text
                style={[styles.resendBtn, resendSeconds > 0 && styles.resendDisabled]}
              >
                {t.auth.otp.resendOtp}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify CTA */}
          <Button
            label={`${t.auth.otp.verify} 🛡`}
            onPress={handleVerify}
            loading={loading}
            disabled={otp.length < 4}
            style={styles.cta}
          />

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
  shieldIcon: { fontSize: 18, opacity: 0.5 },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
    gap: Spacing.base,
  },
  title: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.size.xxxl * 1.25,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: Typography.size.base * 1.5,
  },
  bold: { fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: -Spacing.xs,
  },
  editIcon: { fontSize: 13, color: Colors.primary },
  editLabel: {
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: Typography.weight.medium,
  },
  otpInput: { marginVertical: Spacing.sm },
  fieldError: {
    fontSize: Typography.size.sm,
    color: Colors.error,
    textAlign: 'center',
    marginTop: -Spacing.xs,
  },
  resendRow: {
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  resendHint: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  resendBtn: {
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: Typography.weight.medium,
  },
  resendDisabled: { color: Colors.textMuted },
  cta: { marginTop: Spacing.sm },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.sm,
  },
  footerLink: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
});
