/**
 * storage.ts — AsyncStorage wrappers for all persisted app state.
 * Single source of truth for storage keys.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN:   'baqaya.auth_token',
  IS_NEW_USER:  'baqaya.is_new_user',
  LANGUAGE:     'baqaya.language',
  SHOP_NAME:    'baqaya.shop_name',
} as const;

// ─── Token ───────────────────────────────────────────────────

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.AUTH_TOKEN);
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
}

// ─── New-user flag ────────────────────────────────────────────

export async function setIsNewUser(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.IS_NEW_USER, value ? '1' : '0');
}

export async function getIsNewUser(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.IS_NEW_USER);
  // Default true — if never set, user hasn't onboarded yet
  return val === null ? true : val === '1';
}

// ─── Language ─────────────────────────────────────────────────

export async function setLanguage(lang: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
}

export async function getLanguage(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.LANGUAGE);
}

// ─── Shop ─────────────────────────────────────────────────────

export async function setShopName(name: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.SHOP_NAME, name);
}

export async function getShopName(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.SHOP_NAME);
}

// ─── Full logout clear ────────────────────────────────────────

export async function clearAuthData(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.AUTH_TOKEN, KEYS.IS_NEW_USER]);
}
