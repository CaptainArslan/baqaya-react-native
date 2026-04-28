import type { User } from "@/src/types";

export interface LoginMockInput {
  phone: string;
  otp: string;
}

export interface AuthMockResult {
  token: string;
  refreshToken: string;
  user: User;
}

export async function mockLogin(input: LoginMockInput): Promise<AuthMockResult> {
  const phone = input.phone.trim();
  const normalized = phone.startsWith("+92") ? phone : `+92${phone.replace(/^0/, "")}`;
  return {
    token: `mock_token_${Date.now()}`,
    refreshToken: `mock_refresh_${Date.now()}`,
    user: {
      id: "user_mock_1",
      phone: normalized,
      shop: {
        id: "shop_mock_1",
        name: "Baqaya Demo Shop",
        phone: normalized,
      },
    },
  };
}

export async function mockLogout(): Promise<{ success: true }> {
  return { success: true };
}

