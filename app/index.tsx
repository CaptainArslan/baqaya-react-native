import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStatus } from '@/src/store/authStore';
import { Colors } from '@/src/theme';

export default function EntryGate() {
  const { status } = useAuthStatus();

  return (
    status === 'loading'
      ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )
      : status === 'unauthenticated'
        ? <Redirect href="/(auth)" />
        : status === 'onboarding'
          ? <Redirect href="/(onboarding)/create-shop" />
          : <Redirect href="/(tabs)" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgApp,
  },
});
