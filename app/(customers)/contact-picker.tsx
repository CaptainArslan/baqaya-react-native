/**
 * Contact picker — import-contacts-flow
 * Checks permission on mount → requests if missing → loads contacts.
 * Tapping a contact autofills add-customer form.
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { InnerHeader, EmptyState, Button } from '@/src/components';
import { Colors, Spacing, Typography } from '@/src/theme';

type PermissionStatus = 'checking' | 'granted' | 'denied' | 'blocked';

export default function ContactPickerScreen() {
  const nav = useAppNavigation();
  const [permission, setPermission] = useState<PermissionStatus>('checking');

  useEffect(() => {
    // Stub — replace with expo-contacts when integrating
    // expo-contacts not installed yet; navigate to permission-request screen
    nav.goToPermissionRequest();
  }, []);

  // Render minimal fallback while redirecting
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <InnerHeader title="Import from Contacts" onBack={nav.goBack} />
      <View style={styles.center}>
        <Text style={styles.text}>Checking permission…</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: Typography.size.base, color: Colors.textSecondary },
});
