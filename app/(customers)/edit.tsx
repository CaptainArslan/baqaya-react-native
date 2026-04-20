import { Avatar, MaterialIcon, TextInputField } from "@/src/components";
import {
  deleteMockCustomer,
  getMockCustomer,
  updateMockCustomer,
} from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/theme";
import { formatCurrency, formatRelativeDate } from "@/src/utils";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditCustomerScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const customer = useMemo(() => getMockCustomer(id ?? ""), [id]);
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [avatarUri, setAvatarUri] = useState(customer?.avatarUrl ?? "");
  const [nameError, setNameError] = useState("");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.9,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.9,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  function handleAvatarPress() {
    Alert.alert("Update Photo", "Choose image source", [
      { text: "Take Photo", onPress: () => void takePhoto() },
      { text: "Choose from Gallery", onPress: () => void pickFromGallery() },
      { text: t.common.cancel, style: "cancel" },
    ]);
  }

  function handleSave() {
    if (!id) return;
    if (!name.trim()) {
      setNameError(t.addCustomer.errorNameRequired);
      return;
    }
    updateMockCustomer(id, {
      name: name.trim(),
      phone: phone.trim(),
      avatarUrl: avatarUri || undefined,
    });
    nav.goToCustomerDetail(id);
  }

  function handleRemoveCustomer() {
    if (!id) return;
    setDeleteConfirmVisible(true);
  }

  const lastVisit = customer?.lastActivity
    ? formatRelativeDate(customer.lastActivity)
    : "No history";
  const balanceAmount = customer?.balance ?? 0;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={nav.goBack} hitSlop={10} style={styles.backBtn}>
          <MaterialIcon name="arrow-back" size={Typography.size.xl} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Customer</Text>
        <TouchableOpacity
          hitSlop={10}
          style={styles.saveBtnHead}
          onPress={handleSave}
          disabled={!name.trim()}
        >
          <Text
            style={[styles.saveHeadText, !name.trim() && styles.saveHeadTextDisabled]}
          >
            {t.common.save}
          </Text>
        </TouchableOpacity>
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
          <TouchableOpacity
            style={styles.avatarWrap}
            activeOpacity={0.85}
            onPress={handleAvatarPress}
          >
            <Avatar
              name={name.trim() || customer?.name || "Customer"}
              uri={avatarUri || undefined}
              size="xl"
              style={styles.avatar}
            />
            <View style={styles.cameraBadge}>
              <MaterialIcon name="photo-camera" size={Typography.size.sm} color={Colors.textInverse} />
            </View>
          </TouchableOpacity>
          <Text style={styles.updatePhotoText}>UPDATE PHOTO</Text>

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
            />

            <TextInputField
              label={t.addCustomer.phoneLabel}
              placeholder={t.addCustomer.phonePlaceholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialIcon
                name="history"
                size={Typography.size.xl}
                color={Colors.info}
              />
              <Text style={styles.statLabel}>LAST VISIT</Text>
              <Text style={styles.statValue}>{lastVisit}</Text>
            </View>

            <View style={[styles.statCard, styles.balanceCard]}>
              <MaterialIcon
                name="payments"
                size={Typography.size.xl}
                color={Colors.debit}
              />
              <Text style={[styles.statLabel, styles.balanceLabel]}>BALANCE</Text>
              <Text style={styles.balanceValue}>{formatCurrency(balanceAmount)}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <TouchableOpacity
            onPress={handleRemoveCustomer}
            activeOpacity={0.75}
            style={styles.removeBtn}
          >
            <MaterialIcon
              name="delete"
              size={Typography.size.xl}
              color={Colors.debit}
            />
            <Text style={styles.removeText}>Remove Customer</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={deleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <Pressable
          style={styles.confirmOverlay}
          onPress={() => setDeleteConfirmVisible(false)}
        >
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconWrap}>
              <MaterialIcon name="delete" size={30} color={Colors.debit} />
            </View>
            <Text style={styles.confirmTitle}>Delete Customer?</Text>
            <Text style={styles.confirmBody}>
              Are you sure you want to delete {name.trim() || customer?.name || "this customer"}? This action cannot be undone.
            </Text>
            <TouchableOpacity
              style={styles.confirmDeleteBtn}
              activeOpacity={0.85}
              onPress={() => {
                if (!id) return;
                setDeleteConfirmVisible(false);
                deleteMockCustomer(id);
                nav.goBack();
              }}
            >
              <Text style={styles.confirmDeleteText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmCancelBtn}
              activeOpacity={0.75}
              onPress={() => setDeleteConfirmVisible(false)}
            >
              <Text style={styles.confirmCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    flex: 1,
    textAlign: "left",
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.primaryText,
    marginLeft: Spacing.sm,
  },
  saveBtnHead: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  saveHeadText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  saveHeadTextDisabled: { opacity: 0.4 },
  content: {
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.huge,
    gap: Spacing.base,
  },
  avatarWrap: {
    position: "relative",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  avatar: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  updatePhotoText: {
    marginTop: Spacing.sm,
    fontSize: Typography.size.sm,
    letterSpacing: 1.2,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
  fields: {
    width: "100%",
    gap: Spacing.md,
  },
  statsRow: {
    width: "100%",
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  statValue: {
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
    textAlign: "center",
  },
  balanceCard: {
    backgroundColor: Colors.debitLight,
    borderColor: Colors.debitLight,
  },
  balanceLabel: { color: Colors.debit },
  balanceValue: {
    fontSize: Typography.size.lg,
    color: Colors.debit,
    fontWeight: Typography.weight.semibold,
    textAlign: "center",
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginTop: Spacing.md,
  },
  removeBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
  },
  removeText: {
    color: Colors.debit,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  confirmCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: "center",
    ...Shadows.md,
  },
  confirmIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.lg,
    backgroundColor: Colors.debitLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  confirmTitle: {
    fontSize: Typography.size.xxl,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.bold,
    textAlign: "center",
  },
  confirmBody: {
    marginTop: Spacing.sm,
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Typography.size.base * 1.5,
    marginBottom: Spacing.lg,
  },
  confirmDeleteBtn: {
    width: "100%",
    borderRadius: Radius.lg,
    backgroundColor: Colors.debit,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  confirmDeleteText: {
    color: Colors.textInverse,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
  confirmCancelBtn: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  confirmCancelText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.medium,
  },
});
