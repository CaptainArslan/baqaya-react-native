import { apiEndpoints } from "@/src/config/apiEndpoints";
import { apiClient } from "@/src/services/apiClient";
import type { User } from "@/src/types";

export interface LoginInput {
  phone: string;
  otp: string;
}

export interface LoginResult {
  token: string;
  refreshToken: string;
  user: User;
}

export const AuthService = {
  async login(input: LoginInput): Promise<LoginResult> {
    return apiClient.post<LoginResult, LoginInput>(apiEndpoints.auth.login, input);
  },

  async logout(): Promise<{ success: true }> {
    return apiClient.post<{ success: true }, Record<string, never>>(
      apiEndpoints.auth.logout,
      {},
    );
  },
};

