import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Splash — fade in */}
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
      {/* Language — first real screen after splash */}
      <Stack.Screen name="language" options={{ animation: 'fade' }} />
      {/* Phone + OTP — forward stack */}
      <Stack.Screen name="phone" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="otp" options={{ animation: 'slide_from_right' }} />
      {/* Error terminals — replace, no back */}
      <Stack.Screen name="maintenance" options={{ animation: 'fade' }} />
      <Stack.Screen name="suspended" options={{ animation: 'fade' }} />
      {/* Informational — push */}
      <Stack.Screen name="privacy-policy" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="terms" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
