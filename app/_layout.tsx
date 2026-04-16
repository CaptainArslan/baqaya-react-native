import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { authStore, useAuthStatus } from '@/src/store/authStore';
import { i18nStore } from '@/src/i18n';

// Bootstrap runs once before any screen renders
authStore.bootstrap();
i18nStore.bootstrap();

export default function RootLayout() {
  const { status } = useAuthStatus();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Wait until bootstrap resolves
    if (status === 'loading') return;

    const inAuth       = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    switch (status) {
      case 'unauthenticated':
        if (!inAuth) router.replace('/(auth)');
        break;
      case 'onboarding':
        if (!inOnboarding) router.replace('/(onboarding)/create-shop');
        break;
      case 'authenticated':
        if (inAuth || inOnboarding) router.replace('/(tabs)');
        break;
    }
  }, [status, segments]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(customers)" />
        <Stack.Screen name="drawer" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
