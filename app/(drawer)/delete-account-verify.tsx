import { MaterialIcon, OtpInput } from "@/src/components";
import { authStore } from "@/src/store/authStore";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DeleteAccountVerifyScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const canDelete = /^\d{4}$/.test(otp);

  async function handleDelete() {
    if (otp.length !== 4) {
      setHasError(true);
      return;
    }

    setLoading(true);
    try {
      await authStore.logout();
      router.replace("/(auth)");
    } finally {
      setLoading(false);
    }
  }

  function handleResend() {
    Alert.alert("OTP Sent", "A new 4-digit OTP has been sent to your number.");
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcon name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support & Account</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.warningMini}>
          <MaterialIcon name="warning" size={18} color={Colors.debit} />
        </View>
        <Text style={styles.title}>Verify Deletion</Text>
        <Text style={styles.subtitle}>
          We have sent a 4-digit code to your registered mobile number to confirm
          account deletion.
        </Text>

        <OtpInput
          value={otp}
          onChange={(value) => {
            setOtp(value);
            if (hasError && value.length === 4) setHasError(false);
          }}
          hasError={hasError}
          style={styles.otp}
        />

        <TouchableOpacity
          style={[styles.deleteBtn, (!canDelete || loading) && styles.disabledBtn]}
          onPress={handleDelete}
          activeOpacity={0.85}
          disabled={loading || !canDelete}
        >
          <Text style={styles.deleteBtnText}>
            {loading ? "Deleting..." : "Delete My Account Permanently"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendBtn}
          onPress={handleResend}
          activeOpacity={0.75}
        >
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <MaterialIcon name="info" size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            This action is irreversible. All your ledger data, customer history,
            and pending balances will be permanently erased.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    fontSize: Typography.size.lg,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
  card: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  warningMini: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.errorLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: Typography.size.display,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.bold,
    lineHeight: Typography.size.display * 1.2,
    textAlign: "center",
  },
  subtitle: {
    marginTop: Spacing.sm,
    fontSize: Typography.size.base,
    lineHeight: Typography.size.base * 1.5,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: Spacing.xs,
  },
  otp: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  deleteBtn: {
    backgroundColor: Colors.debit,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  disabledBtn: { opacity: 0.6 },
  deleteBtnText: {
    fontSize: Typography.size.lg,
    color: Colors.textInverse,
    fontWeight: Typography.weight.semibold,
    textAlign: "center",
    paddingHorizontal: Spacing.md,
  },
  resendBtn: { alignItems: "center", paddingVertical: Spacing.md },
  resendText: {
    color: Colors.info,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
  infoBox: {
    marginTop: Spacing.base,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: Typography.size.base,
    lineHeight: Typography.size.base * 1.45,
    color: Colors.textSecondary,
  },
});
