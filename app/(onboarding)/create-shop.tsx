/**
 * Create Shop screen
 * Design ref: design-reference/screens/create_shop
 */
import { MaterialIcon, TextInputField } from "@/src/components";
import { useTranslation } from "@/src/i18n";
import { setShopName } from "@/src/services/storage";
import { authStore } from "@/src/store/authStore";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateShopScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [shopName, setShopNameState] = useState("");
  const [error, setError] = useState("");

  async function handleContinue() {
    const trimmed = shopName.trim();
    if (!trimmed) {
      setError(t.onboarding.createShop.errorEmpty);
      return;
    }
    await setShopName(trimmed);
    await authStore.completeOnboarding();
    router.replace("/(drawer)/(tabs)");
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {t.onboarding.createShop.screenTitle}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Accent bar */}
          <View style={styles.accentBar} />

          {/* Heading */}
          <Text style={styles.heading}>{t.onboarding.createShop.title}</Text>
          <Text style={styles.subtitle}>
            {t.onboarding.createShop.subtitle}
          </Text>

          {/* Hero card — 16:9 wide panel with step dots */}
          <View style={styles.heroCard}>
            <View style={styles.heroIconCircle}>
              <MaterialIcon name="storefront" size={34} color={Colors.primary} />
            </View>
            <View style={styles.stepDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* Input */}
          <TextInputField
            label={t.onboarding.createShop.label}
            placeholder={t.onboarding.createShop.placeholder}
            value={shopName}
            onChangeText={(v) => {
              setShopNameState(v);
              setError("");
            }}
            error={error}
            hint={t.onboarding.createShop.hint}
          />

          {/* Safety note */}
          <View style={styles.safetyCard}>
            <View style={styles.safetyIconBox}>
              <MaterialIcon name="shield" size={22} color={Colors.primary} />
            </View>
            <View style={styles.safetyText}>
              <Text style={styles.safetyTitle}>
                {t.onboarding.createShop.safeTitle}
              </Text>
              <Text style={styles.safetyBody}>
                {t.onboarding.createShop.safeBody}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Sticky CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.ctaBtn, !shopName.trim() && styles.ctaBtnDisabled]}
            onPress={handleContinue}
            disabled={!shopName.trim()}
            activeOpacity={0.85}
          >
            <View style={styles.ctaBtnInner}>
              <Text style={styles.ctaBtnText}>
                {t.onboarding.createShop.continue}
              </Text>
              <MaterialIcon name="arrow-forward" size={20} color={Colors.textInverse} />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },

  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxl,
    gap: Spacing.base,
  },

  accentBar: {
    width: 64,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    marginBottom: Spacing.xs,
  },

  heading: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.size.xxxl * 1.2,
    marginTop: -Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: Typography.size.base * 1.5,
  },

  // 16:9 hero card
  heroCard: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    overflow: "hidden",
  },
  heroIconCircle: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDots: {
    flexDirection: "row",
    gap: Spacing.xs,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },

  safetyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  safetyIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  safetyText: { flex: 1, gap: 2 },
  safetyTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  safetyBody: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.size.sm * 1.5,
  },

  footer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
  },
  ctaBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  ctaBtnDisabled: { opacity: 0.45 },
  ctaBtnText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textInverse,
  },
});
