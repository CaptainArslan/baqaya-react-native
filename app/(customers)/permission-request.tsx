/**
 * Contacts permission request — import-contacts-flow
 * Shown before requesting system permission.
 * Allow → request system permission → if granted go to picker, if denied go to denied screen.
 * Not now → go back.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { InnerHeader, PermissionCard } from '@/src/components';
import { Colors, Spacing } from '@/src/theme';

export default function PermissionRequestScreen() {
  const nav = useAppNavigation();

  function handleAllow() {
    // TODO: call expo-contacts requestPermissionsAsync()
    // Stub: simulate granted → go back to contact-picker main flow
    // For now just go back to add screen
    nav.goBack();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <InnerHeader title="Import from Contacts" onBack={nav.goBack} />

      <View style={styles.content}>
        <PermissionCard
          icon="📇"
          title="Access Your Contacts"
          description="Baqaya needs access to your contacts to help you quickly add customers from your phonebook."
          primaryLabel="Allow Access"
          onPrimary={handleAllow}
          secondaryLabel="Not Now"
          onSecondary={nav.goBack}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.base,
  },
});
