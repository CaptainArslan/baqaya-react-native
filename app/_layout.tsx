import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { authStore } from '@/src/store/authStore';
import { i18nStore } from '@/src/i18n';

// Bootstrap runs once before any screen renders
authStore.bootstrap();
i18nStore.bootstrap();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
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
