/**
 * Splash screen
 * Design ref: baqaya_splash_screen_with_progress_bar
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcon } from '@/src/components';
import { Colors, Spacing, Typography } from '@/src/theme';
import { useTranslation } from '@/src/i18n';

const BAR_DURATION = 1800;

export default function SplashScreen() {
  const { t } = useTranslation();
  const progress = useRef(new Animated.Value(0)).current;
  const [done, setDone] = React.useState(false);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: BAR_DURATION,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(() => setDone(true));
  }, [progress]);

  if (done) return <Redirect href="/(auth)/language" />;

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '42%'],
  });

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* subtle radial tint top-left */}
      <View style={styles.tintTL} pointerEvents="none" />

      <View style={styles.body}>
        {/* Logo */}
        <View style={styles.logoBox}>
          <MaterialIcon name="account-balance-wallet" size={40} color={Colors.textInverse} />
        </View>

        <Text style={styles.appName}>{t.common.appName}</Text>
        <Text style={styles.tagline}>{t.common.tagline.toUpperCase()}</Text>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <MaterialIcon name="lock-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.footerText}>{t.auth.splash.encrypted.toUpperCase()}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  tintTL: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.primaryLight,
    opacity: 0.5,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  appName: {
    fontSize: Typography.size.display,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  tagline: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  barTrack: {
    marginTop: Spacing.xl,
    width: 120,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
