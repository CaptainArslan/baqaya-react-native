/**
 * Phone Number Entry screen
 * Design ref: phone_number_entry_active_state_1
 */
import { MaterialIcon, Toast } from "@/src/components";
import { PhoneInputField } from "@/src/components/ui/PhoneInputField";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function validate(phone: string) {
  return /^3[0-9]{9}$/.test(phone.replace(/\s/g, ""));
}

export default function PhoneScreen() {
  const nav = useAppNavigation();
  const router = useRouter();
  const { t } = useTranslation();

  const [phone, setPhone] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const canSendOtp = validate(phone);

  function handleSend() {
    setFieldError("");
    setToast("");
    if (!validate(phone)) {
      setFieldError(t.auth.phone.errorInvalidFormat);
      setToast(t.auth.phone.errorSendFailed);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({ pathname: "/(auth)/otp", params: { phone } });
    }, 800);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={nav.goBack}
            hitSlop={10}
            style={styles.backBtn}
          >
            <MaterialIcon name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.common.appName}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Scrollable content */}
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.heroSection}>
            <View style={styles.iconBox}>
              <MaterialIcon name="lock" size={34} color={Colors.primary} />
            </View>
            <Text style={styles.heading}>{t.auth.phone.heading}</Text>
            <Text style={styles.subtitle}>{t.auth.phone.subtitle}</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>{t.auth.phone.label}</Text>
            <PhoneInputField
              value={phone}
              onChangeText={(v) => {
                setPhone(v);
                setFieldError("");
              }}
              hasError={!!fieldError}
            />
            {fieldError ? (
              <Text style={styles.fieldError}>{fieldError}</Text>
            ) : null}

            {/* <View style={styles.privacyBox}>
              <MaterialIcon
                name="info-outline"
                size={18}
                color={Colors.textMuted}
                style={styles.privacyIcon}
              />
              <Text style={styles.privacyText}>{t.auth.phone.privacyNote}</Text>
            </View> */}
          </View>
        </ScrollView>

        {/* Sticky bottom CTA */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              (!canSendOtp || loading) && styles.ctaBtnDisabled,
            ]}
            onPress={handleSend}
            disabled={loading || !canSendOtp}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={Colors.textInverse} size="small" />
            ) : (
              <Text style={styles.ctaBtnText}>{t.auth.phone.sendOtp}</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.terms}>
            {t.auth.phone.termsPrefix}
            <Text style={styles.termsLink} onPress={nav.goToTerms}>
              {t.auth.phone.termsLink}
            </Text>
          </Text>

          <View style={styles.footerLinks}>
            <TouchableOpacity activeOpacity={0.7} hitSlop={8} style={styles.footerLinkRow}>
              <MaterialIcon name="help-outline" size={18} color={Colors.textMuted} />
              <Text style={styles.footerLink}>{t.common.needHelp}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} hitSlop={8} style={styles.footerLinkRow}>
              <MaterialIcon name="phone-in-talk" size={18} color={Colors.textMuted} />
              <Text style={styles.footerLink}>{t.common.contactSupport}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Toast
        visible={!!toast}
        message={toast}
        type="error"
        onDismiss={() => setToast("")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },

  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.xxl,
  },

  heroSection: {
    alignItems: "center",
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
    lineHeight: Typography.size.xxxl * 1.2,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Typography.size.base * 1.5,
  },

  formSection: { gap: Spacing.md },
  inputLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  fieldError: {
    fontSize: Typography.size.sm,
    color: Colors.error,
  },
  privacyBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  privacyIcon: { marginTop: 1 },
  privacyText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.size.sm * 1.5,
  },

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
    alignItems: "center",
  },
  ctaBtnDisabled: { opacity: 0.6 },
  ctaBtnText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
  terms: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: Typography.weight.medium,
    textDecorationLine: "underline",
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.lg,
    flexWrap: "wrap",
  },
  footerLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  footerLink: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
});
