/**
 * Add Customer screen — add-customer-flow
 * Name (required) + phone (optional).
 * On save: duplicate check → show warning or save locally → go to detail.
 * Import from Contacts shortcut at bottom.
 */
import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '@/src/hooks';
import { InnerHeader, TextInputField, Button } from '@/src/components';
import { Colors, Radius, Spacing, Typography } from '@/src/theme';

export default function AddCustomerScreen() {
  const nav = useAppNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');

  function handleSave() {
    if (!name.trim()) {
      setNameError('Customer name is required.');
      return;
    }
    // TODO: check for duplicate by phone → nav.goToDuplicateWarning(existingId, phone)
    // Save locally, then navigate to the new customer's detail
    const newId = Date.now().toString(); // placeholder id
    nav.goToCustomerDetail(newId);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <InnerHeader title="Add Customer" onBack={nav.goBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>

          <Text style={styles.heading}>New Connection</Text>
          <Text style={styles.subheading}>
            Add a customer to start recording transactions.
          </Text>

          <TextInputField
            label="CUSTOMER NAME *"
            placeholder="Enter name (e.g. Aslam Bhai)"
            value={name}
            onChangeText={(t) => { setName(t); setNameError(''); }}
            error={nameError}
          />

          <TextInputField
            label="PHONE NUMBER (OPTIONAL)"
            placeholder="03XX-XXXXXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {/* Import from contacts shortcut */}
          <TouchableOpacity
            onPress={nav.goToContactPicker}
            style={styles.importRow}
          >
            <Text style={styles.importIcon}>📇</Text>
            <View>
              <Text style={styles.importLabel}>Import from Contacts</Text>
              <Text style={styles.importSub}>Speed up by selecting from your phonebook.</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button
          label="Save / Save Karein  →"
          onPress={handleSave}
          disabled={!name.trim()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  flex: { flex: 1 },
  content: {
    padding: Spacing.base,
    gap: Spacing.base,
    alignItems: 'center',
    paddingBottom: Spacing.huge,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  avatarEmoji: { fontSize: 32 },
  heading: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  subheading: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  importRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: '100%',
  },
  importIcon: { fontSize: 22 },
  importLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  importSub: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  footer: {
    padding: Spacing.base,
    paddingBottom: Spacing.lg,
  },
});
