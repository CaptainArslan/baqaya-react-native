/**
 * Navigation Drawer — settings-flow
 * Accessible from hamburger on any tab header.
 * Items: Language, Help/Support, Privacy, Terms, Logout.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppNavigation } from '@/src/hooks';
import { authStore } from '@/src/store/authStore';
import { Colors, Radius, Spacing, Typography } from '@/src/theme';

interface DrawerItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

function DrawerItem({ icon, label, onPress, danger = false }: DrawerItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item} activeOpacity={0.7}>
      <Text style={styles.itemIcon}>{icon}</Text>
      <Text style={[styles.itemLabel, danger && styles.danger]}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function DrawerScreen() {
  const router = useRouter();
  const nav = useAppNavigation();

  async function handleLogout() {
    await authStore.logout();
    // Root layout auth gate redirects to (auth) automatically
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Handle */}
      <View style={styles.handle} />

      {/* Brand */}
      <View style={styles.brand}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandEmoji}>🪙</Text>
        </View>
        <View>
          <Text style={styles.brandName}>Baqaya</Text>
          <Text style={styles.brandSub}>The Resilient Ledger</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Menu items */}
      <View style={styles.menu}>
        <DrawerItem icon="🌐" label="Language" onPress={() => { router.back(); nav.goToLanguage(); }} />
        <DrawerItem icon="❓" label="Help & Support" onPress={() => {}} />
        <DrawerItem icon="🔒" label="Privacy Policy" onPress={() => { router.back(); nav.goToPrivacyPolicy(); }} />
        <DrawerItem icon="📄" label="Terms & Conditions" onPress={() => { router.back(); nav.goToTerms(); }} />
      </View>

      <View style={styles.divider} />

      <DrawerItem icon="🚪" label="Logout" onPress={handleLogout} danger />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.base,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandEmoji: { fontSize: 22 },
  brandName: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  brandSub: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  menu: { gap: 2 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  itemIcon: { fontSize: 20, width: 28 },
  itemLabel: {
    flex: 1,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
  },
  danger: { color: Colors.debit },
  chevron: { fontSize: 18, color: Colors.textMuted },
});
