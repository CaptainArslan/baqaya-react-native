/**
 * System Maintenance screen
 * Design ref: system_maintenance_simplified_view
 * Light bg, centered illustration, title, subtitle, retry note, protocol footer.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '@/src/theme';

export default function MaintenanceScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Minimal header */}
      <View style={styles.header}>
        <Text style={styles.brandDot}>• Baqaya</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity hitSlop={8} style={styles.iconBtn}>
            <Text style={styles.headerIcon}>❓</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8} style={styles.iconBtn}>
            <Text style={styles.headerIcon}>↻</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Illustration box */}
        <View style={styles.illustrationBox}>
          <Text style={styles.illustrationEmoji}>🔧</Text>
        </View>

        <Text style={styles.title}>Updating Our{'\n'}Infrastructure</Text>
        <Text style={styles.subtitle}>
          {"We're making improvements to serve you better."}
        </Text>

        {/* Retry note */}
        <View style={styles.retryNote}>
          <Text style={styles.retryDot}>●</Text>
          <Text style={styles.retryText}>Please try again in a few minutes.</Text>
        </View>
      </View>

      {/* Protocol footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>PROTOCOL 4.0  •  NODE: ASIA-9</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F5F3' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  brandDot: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  headerRight: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: { padding: Spacing.xs },
  headerIcon: { fontSize: 18, color: Colors.textSecondary },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.base,
  },
  illustrationBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  illustrationEmoji: { fontSize: 44 },
  title: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: Typography.size.xxxl * 1.25,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.size.base * 1.5,
  },
  retryNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  retryDot: { fontSize: 8, color: Colors.primary },
  retryText: {
    fontSize: Typography.size.sm,
    color: Colors.primaryText,
    fontWeight: Typography.weight.medium,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
