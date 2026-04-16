/**
 * useAppNavigation — typed navigation helpers for all flows.
 * Keeps route strings out of screen files.
 */
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';

export function useAppNavigation() {
  const router = useRouter();

  return {
    // ─── Auth (auth-flow) ──────────────────────────────────
    goToLanguage:    () => router.push('/(auth)/language'),
    goToPhone:       () => router.push('/(auth)/phone'),
    goToOtp:         () => router.push('/(auth)/otp'),
    goToMaintenance: () => router.replace('/(auth)/maintenance'),
    goToSuspended:   () => router.replace('/(auth)/suspended'),
    goToPrivacyPolicy: () => router.push('/(auth)/privacy-policy'),
    goToTerms:       () => router.push('/(auth)/terms'),

    // ─── Onboarding (onboarding-flow) ──────────────────────
    goToCreateShop: () => router.replace('/(onboarding)/create-shop'),

    // ─── Main tabs (bottom-navigation-flow) ────────────────
    goToHome:      () => router.replace('/(tabs)'),
    goToCustomers: () => router.push('/(tabs)/customers'),
    goToCashbook:  () => router.push('/(tabs)/cashbook'),
    goToReports:   () => router.push('/(tabs)/reports'),

    // ─── Drawer / Settings (settings-flow) ─────────────────
    goToDrawer:   () => router.push('/drawer'),
    goToSettings: () => router.push('/drawer'),

    // ─── Customer flow (customers-flow + add-customer-flow) ─
    goToAddCustomer:     () => router.push('/(customers)/add'),
    goToCustomerDetail:  (id: string) => router.push(`/(customers)/${id}`),
    goToAddEntry:        (customerId: string, type: 'udhaar' | 'payment') =>
      router.push({ pathname: '/(customers)/add-entry', params: { customerId, type } }),
    goToTransactionDetail: (id: string) =>
      router.push({ pathname: '/(customers)/transaction-detail', params: { id } }),
    goToDuplicateWarning: (existingId: string, phone: string) =>
      router.push({ pathname: '/(customers)/duplicate-warning', params: { existingId, phone } }),

    // ─── Import contacts (import-contacts-flow) ─────────────
    goToContactPicker:       () => router.push('/(customers)/contact-picker'),
    goToPermissionRequest:   () => router.push('/(customers)/permission-request'),
    goToPermissionDenied:    () => router.push('/(customers)/permission-denied'),

    // ─── Reminders (reminders-flow) ─────────────────────────
    // Opens WhatsApp with prefilled message. Never auto-sends.
    openWhatsAppReminder: (phone: string, name: string, balance: string) => {
      const text = encodeURIComponent(
        `Hi ${name}, you have a pending balance of ${balance}. Please settle at your earliest convenience. - Sent via Baqaya`
      );
      const url = `whatsapp://send?phone=92${phone.replace(/^0/, '')}&text=${text}`;
      Linking.openURL(url).catch(() => {
        // WhatsApp not installed — no-op for now, screen can handle error
      });
    },

    // ─── Generic ───────────────────────────────────────────
    goBack: () => router.back(),
  };
}
