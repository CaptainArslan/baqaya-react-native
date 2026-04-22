import { MaterialIcon } from "@/src/components";
import { useTranslation } from "@/src/i18n";
import {
  getBusinessProfile,
  getShopName,
  setBusinessProfile,
  setShopName,
  type BusinessProfile,
} from "@/src/services/storage";
import { Colors, Radius, Spacing, Typography } from "@/src/theme";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_PROFILE: BusinessProfile = {
  shopName: "",
  ownerName: "",
  category: "General Store",
  phonePrimary: "+92 300 1234567",
  whatsappEnabled: true,
  whatsappNumber: "+92 300 1234567",
  email: "",
  address: "",
  city: "",
};

export default function BusinessProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [initialProfile, setInitialProfile] =
    useState<BusinessProfile>(DEFAULT_PROFILE);
  const [profile, setProfile] = useState<BusinessProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    (async () => {
      const saved = await getBusinessProfile();
      const shopName = await getShopName();
      const merged: BusinessProfile = {
        ...DEFAULT_PROFILE,
        ...(saved ?? {}),
        shopName: saved?.shopName || shopName || "",
      };
      setInitialProfile(merged);
      setProfile(merged);
    })();
  }, []);

  const isDirty = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  async function handleSave() {
    if (!profile.shopName.trim()) {
      Alert.alert(t.drawer.businessProfile, "Shop name is required.");
      return;
    }

    const normalized: BusinessProfile = {
      ...profile,
      shopName: profile.shopName.trim(),
      ownerName: profile.ownerName.trim(),
      category: profile.category.trim(),
      whatsappNumber: profile.whatsappNumber.trim(),
      email: profile.email.trim(),
      address: profile.address.trim(),
      city: profile.city.trim(),
    };

    await setBusinessProfile(normalized);
    await setShopName(normalized.shopName);
    setInitialProfile(normalized);
    setProfile(normalized);
    Alert.alert(t.common.ok, "Business profile updated.");
  }

  function handleDiscard() {
    setProfile(initialProfile);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcon name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.drawer.businessProfile}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcon name="storefront" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Basic Information</Text>
          </View>
          <View style={styles.card}>
            <Field
              label="Shop Name"
              value={profile.shopName}
              onChangeText={(v) => setProfile((p) => ({ ...p, shopName: v }))}
              placeholder="Enter shop name"
            />
            <Field
              label="Owner Name"
              value={profile.ownerName}
              onChangeText={(v) => setProfile((p) => ({ ...p, ownerName: v }))}
              placeholder="Enter owner name"
            />
            <Field
              label="Business Category"
              value={profile.category}
              onChangeText={(v) => setProfile((p) => ({ ...p, category: v }))}
              placeholder="e.g. Grocery"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcon name="contact-phone" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Contact Details</Text>
          </View>
          <View style={styles.card}>
            <Field label="Phone Number (Primary)" value={profile.phonePrimary} editable={false} />
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Enable WhatsApp</Text>
              <Switch
                value={profile.whatsappEnabled}
                onValueChange={(v) =>
                  setProfile((p) => ({
                    ...p,
                    whatsappEnabled: v,
                    whatsappNumber: v ? p.whatsappNumber : "",
                  }))
                }
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={profile.whatsappEnabled ? Colors.primary : Colors.textMuted}
              />
            </View>
            {profile.whatsappEnabled ? (
              <Field
                label="WhatsApp Number"
                value={profile.whatsappNumber}
                onChangeText={(v) =>
                  setProfile((p) => ({ ...p, whatsappNumber: v }))
                }
                placeholder="Enter WhatsApp number"
              />
            ) : null}
            <Field
              label="Business Email"
              value={profile.email}
              onChangeText={(v) => setProfile((p) => ({ ...p, email: v }))}
              placeholder="Enter business email"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcon name="location-on" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Business Location</Text>
          </View>
          <View style={styles.card}>
            <Field
              label="Address"
              value={profile.address}
              onChangeText={(v) => setProfile((p) => ({ ...p, address: v }))}
              placeholder="Enter full address"
              multiline
            />
            <Field
              label="City"
              value={profile.city}
              onChangeText={(v) => setProfile((p) => ({ ...p, city: v }))}
              placeholder="Enter city"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.secondaryBtn, !isDirty && styles.btnDisabled]}
          onPress={handleDiscard}
          disabled={!isDirty}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>{t.common.cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryBtn, !isDirty && styles.btnDisabled]}
          onPress={handleSave}
          disabled={!isDirty}
          activeOpacity={0.85}
        >
          <MaterialIcon name="check-circle" size={18} color={Colors.textInverse} />
          <Text style={styles.primaryBtnText}>{t.common.save}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  editable?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          !editable && styles.inputReadOnly,
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
      />
    </View>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    fontSize: Typography.size.lg,
    color: Colors.primary,
    fontWeight: Typography.weight.bold,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.base,
    paddingBottom: 120,
  },
  section: { gap: Spacing.sm },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: Spacing.xs },
  sectionTitle: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  fieldWrap: { gap: Spacing.xs },
  fieldLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputMultiline: {
    minHeight: 86,
    textAlignVertical: "top",
  },
  inputReadOnly: {
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  switchLabel: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.base,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
  },
  primaryBtn: {
    flex: 1.2,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.xs,
  },
  primaryBtnText: {
    fontSize: Typography.size.base,
    color: Colors.textInverse,
    fontWeight: Typography.weight.bold,
  },
  btnDisabled: { opacity: 0.5 },
});
