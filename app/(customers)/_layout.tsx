import { Stack } from 'expo-router';

export default function CustomersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {/* add-customer-flow */}
      <Stack.Screen name="add" />
      <Stack.Screen name="duplicate-warning" />

      {/* customer-details-flow */}
      <Stack.Screen name="[id]" />
      <Stack.Screen name="add-entry" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="transaction-detail" />

      {/* import-contacts-flow */}
      <Stack.Screen name="contact-picker" />
      <Stack.Screen name="permission-request" />
      <Stack.Screen name="permission-denied" />
    </Stack>
  );
}
