/**
 * Contacts permission denied — import-contacts-flow
 * Shown when user has blocked contacts permission.
 * Open Settings → user can manually grant. Or go back.
 */
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { InnerHeader, PermissionCard } from '@/src/components';
import { Colors, Spacing } from '@/src/theme';

export default function PermissionDeniedScreen() {
  const nav = useAppNavigation();

  function openSettings() {
    Linking.openSettings();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <InnerHeader title="Import from Contacts" onBack={nav.goBack} />

      <View style={styles.content}>
        <PermissionCard
          icon="🚫"
          title="Contacts Access Denied"
          description="You've denied contacts access. To import from contacts, please enable it in your device Settings."
          primaryLabel="Open Settings"
          onPrimary={openSettings}
          secondaryLabel="Add Manually"
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
