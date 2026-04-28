import { apiEndpoints } from "@/src/config/apiEndpoints";
import { apiClient } from "@/src/services/apiClient";
import type { Customer } from "@/src/types";

export interface CreateCustomerInput {
  name: string;
  phone?: string;
  avatarUrl?: string;
}

export const CustomerService = {
  async list(): Promise<Customer[]> {
    return apiClient.get<Customer[]>(apiEndpoints.customers.list);
  },

  async getById(id: string): Promise<Customer | null> {
    return apiClient.get<Customer | null>(apiEndpoints.customers.byId(id));
  },

  async create(input: CreateCustomerInput): Promise<Customer> {
    return apiClient.post<Customer, CreateCustomerInput>(apiEndpoints.customers.create, input);
  },

  async update(
    id: string,
    patch: Partial<Pick<Customer, "name" | "phone" | "avatarUrl" | "balance">>,
  ): Promise<Customer | null> {
    return apiClient.patch<Customer | null, typeof patch>(apiEndpoints.customers.update(id), patch);
  },

  async remove(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(apiEndpoints.customers.remove(id));
  },
};

