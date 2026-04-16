/**
 * Splash screen
 * Design ref: baqaya_splash_screen_with_progress_bar
 * Light green-white gradient bg, centered logo + name + tagline,
 * animated progress bar, "END-TO-END ENCRYPTED DATA" footer.
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '@/src/theme';
import { APP_NAME, APP_TAGLINE } from '@/src/constants';

const BAR_DURATION = 1800;

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: BAR_DURATION,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(() => {
      setShouldRedirect(true);
    });
  }, [progress]);

  if (shouldRedirect) {
    return <Redirect href="/(auth)/language" />;
  }

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '40%'],
  });

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.body}>
        {/* Logo */}
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🪙</Text>
        </View>

        {/* Name + tagline */}
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.tagline}>{APP_TAGLINE.toUpperCase()}</Text>

        {/* Progress bar */}
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>🔒  END-TO-END ENCRYPTED DATA</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F5F3',
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
  logoEmoji: {
    fontSize: 36,
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
  footerText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
