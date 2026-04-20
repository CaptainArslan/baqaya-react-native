import { useAuthStatus } from "@/src/store/authStore";
import { Colors } from "@/src/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

/**
 * Do not use `useRootNavigationState()` on this route — Expo Router 6 throws
 * when the internal slot parent is missing (blue “Something went wrong” screen).
 *
 * Wait until auth is resolved, then navigate on next tick.
 * Using InteractionManager here can stall navigation under some Android startup states.
 */
export default function EntryGate() {
  const { status } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const timeoutId = setTimeout(() => {
      if (status === "unauthenticated") router.replace("/(auth)");
      else if (status === "onboarding")
        router.replace("/(onboarding)/create-shop");
      else router.replace("/(drawer)/(tabs)");
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [status, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
});
