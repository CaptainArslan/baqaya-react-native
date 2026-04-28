export const API_VERSION = "v1" as const;

/**
 * Base URL is environment-driven.
 * Change EXPO_PUBLIC_API_BASE_URL to switch dev/staging/prod instantly.
 */
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8000";

export const API_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 15000);

export const API_CONFIG = {
  BASE_URL,
  API_VERSION,
  API_TIMEOUT_MS,
} as const;

