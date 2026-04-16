export const APP_NAME = 'Baqaya';
export const APP_TAGLINE = 'The Resilient Ledger';

export const CURRENCY = 'Rs.';
export const DEFAULT_COUNTRY_CODE = '+92';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  SHOP_DATA: 'shop_data',
  LANGUAGE: 'language',
  ONBOARDING_DONE: 'onboarding_done',
} as const;

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'اردو' },
] as const;

export const TABS = {
  HOME: 'index',
  CUSTOMERS: 'customers',
  CASHBOOK: 'cashbook',
  REPORTS: 'reports',
} as const;
