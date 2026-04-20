import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="import-contacts" />
      <Stack.Screen name="multiple-numbers" />
    </Stack>
  );
}
