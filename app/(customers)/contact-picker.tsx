/**
 * Contact picker — import-contacts-flow
 * Checks permission on mount → requests if missing → loads contacts.
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { useTranslation } from '@/src/i18n';
import { InnerHeader } from '@/src/components';
import { Colors, Typography } from '@/src/theme';

export default function ContactPickerScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    // Stub — replace with expo-contacts when integrating
    nav.goToPermissionRequest();
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <InnerHeader title={t.importContacts.screenTitle} onBack={nav.goBack} />
      <View style={styles.center}>
        <Text style={styles.text}>{t.permissions.checkingPermission}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: Typography.size.base, color: Colors.textSecondary },
});
