/**
 * Add Customer screen
 * Design ref: add_customer_with_avatar
 */
import { Avatar, MaterialIcon, TextInputField } from "@/src/components";
import { addMockCustomer } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
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

export default function AddCustomerScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");

  function handleSave() {
    if (!name.trim()) {
      setNameError(t.addCustomer.errorNameRequired);
      return;
    }
    const newId = Date.now().toString();
    addMockCustomer({
      id: newId,
      name: name.trim(),
      phone: phone.trim(),
      balance: 0,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    });
    nav.goToCustomerDetail(newId);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Header — × dismiss style */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={nav.goBack}
          hitSlop={10}
          style={styles.dismissBtn}
        >
          <MaterialIcon name="close" size={Typography.size.xl} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.addCustomer.screenTitle}</Text>
        <View style={styles.headerSpacer} />
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
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <Avatar name={name || "?"} size="xl" />
            <View style={styles.cameraBadge}>
              <MaterialIcon name="photo-camera" size={Typography.size.sm} color={Colors.textInverse} />
            </View>
          </View>

          <Text style={styles.heading}>{t.addCustomer.heading}</Text>
          <Text style={styles.subheading}>{t.addCustomer.subheading}</Text>

          <View style={styles.fields}>
            <TextInputField
              label={t.addCustomer.nameLabel}
              placeholder={t.addCustomer.namePlaceholder}
              value={name}
              onChangeText={(v) => {
                setName(v);
                setNameError("");
              }}
              error={nameError}
              autoFocus
            />

            <TextInputField
              label={t.addCustomer.phoneLabel}
              placeholder={t.addCustomer.phonePlaceholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            {/* Import from contacts */}
            <TouchableOpacity
              onPress={nav.goToImportContacts}
              style={styles.importRow}
              activeOpacity={0.7}
            >
              <MaterialIcon name="contact-page" size={Typography.size.xxl} color={Colors.primary} />
              <View style={styles.importText}>
                <Text style={styles.importLabel}>
                  {t.addCustomer.importLabel}
                </Text>
                <Text style={styles.importSub}>{t.addCustomer.importSub}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Sticky CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!name.trim()}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>{t.addCustomer.save} →</Text>
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
  dismissBtn: { padding: Spacing.xs },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  headerSpacer: { width: 32 },

  content: {
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.huge,
    gap: Spacing.sm,
  },

  avatarWrap: {
    position: "relative",
    marginBottom: Spacing.sm,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.background,
  },

  heading: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  subheading: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },

  fields: { width: "100%", gap: Spacing.md },

  importRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  importText: { flex: 1 },
  importLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  importSub: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  footer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textInverse,
  },
});
