import * as Network from "expo-network";
import { useEffect, useState } from "react";

export function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkInitial() {
      const state = await Network.getNetworkStateAsync();
      if (!mounted) return;
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    }

    void checkInitial();

    const subscription = Network.addNetworkStateListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return isOnline;
}
