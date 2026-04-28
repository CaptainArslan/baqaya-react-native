import { addMockCustomer, deleteMockCustomer, getAllMockCustomers, getMockCustomer, updateMockCustomer } from "@/src/constants/mockData";
import type { Customer } from "@/src/types";

export interface CreateCustomerInput {
  name: string;
  phone?: string;
  avatarUrl?: string;
}

export async function mockListCustomers(): Promise<Customer[]> {
  return getAllMockCustomers();
}

export async function mockCreateCustomer(input: CreateCustomerInput): Promise<Customer> {
  const now = new Date().toISOString();
  const customer: Customer = {
    id: `c_${Date.now()}`,
    name: input.name.trim(),
    phone: input.phone?.trim(),
    avatarUrl: input.avatarUrl,
    balance: 0,
    createdAt: now,
    lastActivity: now,
  };
  addMockCustomer(customer);
  return customer;
}

export async function mockGetCustomer(id: string): Promise<Customer | null> {
  return getMockCustomer(id) ?? null;
}

export async function mockUpdateCustomer(
  id: string,
  patch: Partial<Pick<Customer, "name" | "phone" | "avatarUrl" | "balance">>,
): Promise<Customer | null> {
  return updateMockCustomer(id, patch) ?? null;
}

export async function mockDeleteCustomer(id: string): Promise<{ success: boolean }> {
  deleteMockCustomer(id);
  return { success: true };
}

