/**
 * OTP Verification screen
 * Design ref: verify_otp_active_state_1
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppNavigation } from '@/src/hooks';
import { MaterialIcon, OtpInput, Toast } from '@/src/components';
import { Colors, Radius, Spacing, Typography } from '@/src/theme';
import { useAuth } from '@/src/context/AuthContext';
import { useTranslation } from '@/src/i18n';

const RESEND_SECONDS = 30;

export default function OtpScreen() {
  const nav = useAppNavigation();
  const router = useRouter();
  const { t } = useTranslation();
  const { login } = useAuth();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const maskedPhone = phone ? `+92 3xx xxx${phone.slice(-4)}` : '+92 3xx xxx••••';

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
    try {
      await new Promise((r) => setTimeout(r, 900));

      if (otp === '0000') {
        setFieldError(t.auth.otp.errorInvalidCode);
        setToast(t.auth.otp.errorVerifyFailed);
        setOtp('');
        return;
      }

      // Mock: any code except 0000 succeeds. `login()` generates a token and persists it
      // (see authStore.login). '1111' = returning user — skip onboarding.
      const isNewUser = otp !== '1111';
      await login(isNewUser);
      router.replace(isNewUser ? '/(onboarding)/create-shop' : '/(drawer)/(tabs)');
    } finally {
      setLoading(false);
    }
  }

  function handleResend() {
    if (resendSeconds > 0) return;
    setOtp('');
    setFieldError('');
    startTimer();
  }

  const canVerify = otp.replace(/\s/g, '').length === 4 && !loading;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={nav.goBack} hitSlop={10} style={styles.backBtn}>
          <MaterialIcon name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.common.appName}</Text>
        <View style={styles.shieldBadge}>
          <MaterialIcon name="shield" size={18} color={Colors.primary} />
        </View>
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
          {/* Hero text — left aligned */}
          <Text style={styles.heading}>{t.auth.otp.heading}</Text>
          <Text style={styles.subtitle}>
            {t.auth.otp.sentTo}
            <Text style={styles.boldPhone}>{maskedPhone}</Text>
          </Text>

          <TouchableOpacity onPress={nav.goBack} style={styles.editRow} hitSlop={8}>
            <MaterialIcon name="edit" size={16} color={Colors.primary} />
            <Text style={styles.editLabel}>{t.auth.otp.editNumber}</Text>
          </TouchableOpacity>

          {/* OTP input */}
          <View style={styles.otpWrapper}>
            <OtpInput
              value={otp}
              onChange={(v) => { setOtp(v); setFieldError(''); }}
              hasError={!!fieldError}
            />
            {fieldError ? (
              <Text style={styles.fieldError}>{fieldError}</Text>
            ) : null}
          </View>

          {/* Resend section */}
          <View style={styles.resendSection}>
            {resendSeconds > 0 ? (
              <View style={styles.timerPill}>
                <MaterialIcon name="timer" size={16} color={Colors.textMuted} />
                <Text style={styles.timerText}>
                  {t.auth.otp.resendIn}
                  <Text style={styles.timerBold}>
                    0:{String(resendSeconds).padStart(2, '0')}
                  </Text>
                </Text>
              </View>
            ) : null}

            <TouchableOpacity onPress={handleResend} activeOpacity={0.7} disabled={resendSeconds > 0} hitSlop={8}>
              <Text style={[styles.resendText, resendSeconds > 0 && styles.resendDisabled]}>
                {t.auth.otp.resendOtp}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Sticky bottom CTA */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.ctaBtn, !canVerify && styles.ctaBtnDisabled]}
            onPress={handleVerify}
            disabled={!canVerify}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={Colors.textInverse} size="small" />
              : (
                <View style={styles.ctaBtnInner}>
                  <Text style={styles.ctaBtnText}>{t.auth.otp.verify}</Text>
                  <MaterialIcon name="check" size={20} color={Colors.textInverse} />
                </View>
              )
            }
          </TouchableOpacity>

          <View style={styles.footerLinks}>
            <TouchableOpacity activeOpacity={0.7} hitSlop={8}>
              <View style={styles.footerLinkInner}>
                <MaterialIcon name="help-outline" size={16} color={Colors.primary} />
                <Text style={styles.footerLink}>{t.common.needHelp}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} hitSlop={8}>
              <View style={styles.footerLinkInner}>
                <MaterialIcon name="phone-in-talk" size={16} color={Colors.primary} />
                <Text style={styles.footerLink}>{t.common.contactSupport}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
  screen: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  shieldBadge: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },

  heading: {
    fontSize: Typography.size.display,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.size.display * 1.2,
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: Typography.size.base * 1.5,
    marginTop: -Spacing.sm,
  },
  boldPhone: {
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },

  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: -Spacing.sm,
  },
  editLabel: {
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },

  otpWrapper: { gap: Spacing.sm },
  fieldError: {
    fontSize: Typography.size.sm,
    color: Colors.error,
    textAlign: 'center',
  },

  resendSection: { alignItems: 'center', gap: Spacing.sm },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
  },
  timerText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  timerBold: {
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  resendText: {
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
  resendDisabled: { color: Colors.textMuted },

  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
  },
  ctaBtnDisabled: { opacity: 0.45 },
  ctaBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ctaBtnText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  footerLinkInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  footerLink: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
});
