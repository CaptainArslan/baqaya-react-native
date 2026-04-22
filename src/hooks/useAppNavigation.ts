/**
 * useAppNavigation — typed navigation helpers for all flows.
 * Keeps route strings out of screen files.
 *
 * WhatsApp reminders: use useWhatsAppReminder hook directly in screens.
 * openWhatsAppReminder is kept here only for legacy call sites.
 */
import {
  openWhatsAppReminder as _openWA,
  buildReminderMessage,
} from "@/src/utils/whatsapp";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";

export function useAppNavigation() {
  const router = useRouter();
  const navigation = useNavigation();

  const openDrawer = () => {
    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch {
      /* No drawer in navigation tree (e.g. some auth screens) — ignore */
    }
  };

  const goBackOr = (fallbackRoute: string) => {
    if (navigation.canGoBack()) {
      router.back();
      return;
    }
    router.replace(fallbackRoute as any);
  };

  return {
    // ─── Auth (auth-flow) ──────────────────────────────────
    goToLanguage: () => router.push("/(auth)/language"),
    goToPhone: () => router.push("/(auth)/phone"),
    goToOtp: () => router.push("/(auth)/otp"),
    goToMaintenance: () => router.replace("/(auth)/maintenance"),
    goToSuspended: () => router.replace("/(auth)/suspended"),
    goToPrivacyPolicy: () => router.push("/(auth)/privacy-policy"),
    goToTerms: () => router.push("/(auth)/terms"),

    // ─── Onboarding (onboarding-flow) ──────────────────────
    goToCreateShop: () => router.replace("/(onboarding)/create-shop"),

    // ─── Main tabs (bottom-navigation-flow) ────────────────
    goToHome: () => router.replace("/(drawer)/(tabs)"),
    goToCustomers: () => router.push("/(drawer)/(tabs)/customers"),
    goToCashbook: () => router.push("/(drawer)/(tabs)/cashbook"),
    goToReports: () => router.push("/(drawer)/(tabs)/reports"),

    // ─── Drawer / Settings (settings-flow) ─────────────────
    goToDrawer: openDrawer,
    goToSettings: openDrawer,

    // ─── Customer flow (customers-flow + add-customer-flow) ─
    goToAddCustomer: () => router.push("/(customers)/add"),
    goToEditCustomer: (id: string) =>
      router.push({
        pathname: "/(customers)/edit",
        params: { id },
      }),
    goToCustomerDetail: (id: string) => router.push(`/(customers)/${id}`),
    goToAddEntry: (customerId: string, type: "udhaar" | "payment") =>
      router.push({
        pathname: "/(customers)/add-entry",
        params: { customerId, type },
      }),
    goToTransactionDetail: (id: string) =>
      router.push({
        pathname: "/(customers)/transaction-detail",
        params: { id },
      }),
    goToEditTransaction: (id: string) =>
      router.push({
        pathname: "/(customers)/edit-transaction",
        params: { id },
      }),
    goToWhatsAppReminder: (customerId: string) =>
      router.push({
        pathname: "/(customers)/whatsapp-reminder",
        params: { customerId },
      }),
    goToDuplicateWarning: (existingId: string, phone: string) =>
      router.push({
        pathname: "/(customers)/duplicate-warning",
        params: { existingId, phone },
      }),

    // ─── Import contacts (import-contacts-flow) ─────────────
    goToImportContacts: () => router.push("/(modals)/import-contacts"),
    goToContactPicker: () => router.push("/(customers)/contact-picker"),
    goToPermissionRequest: () => router.push("/(customers)/permission-request"),
    goToPermissionDenied: () => router.push("/(customers)/permission-denied"),
    goToMultipleNumbers: (contactName: string) =>
      router.push({
        pathname: "/(modals)/multiple-numbers" as any,
        params: { contactName },
      }),

    // ─── Reminders (reminders-flow) ─────────────────────────
    // Prefer useWhatsAppReminder hook in screens for full error handling.
    openWhatsAppReminder: (phone: string, name: string, balance: string) => {
      const message = buildReminderMessage(
        "Hi {name}, you have a pending balance of {balance}. Please settle at your earliest convenience. — Baqaya",
        name,
        balance,
      );
      _openWA(phone, message); // fire-and-forget; use hook for error feedback
    },

    // ─── Generic ───────────────────────────────────────────
    goBack: () => router.back(),
    goBackOr,
  };
}
