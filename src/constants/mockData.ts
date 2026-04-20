import { CUSTOMER_MOCKS, SCREEN_MOCKS } from "@/data";
import type { Customer, Transaction } from "../types";

export const MOCK_CUSTOMERS: Customer[] = CUSTOMER_MOCKS;
export const MOCK_TRANSACTIONS: Transaction[] = SCREEN_MOCKS.home.recentTransactions;

// Runtime-added customers (survive only for the session)
const _runtimeCustomers: Customer[] = [];

export function addMockCustomer(customer: Customer): void {
  _runtimeCustomers.unshift(customer);
}

export function getAllMockCustomers(): Customer[] {
  return [..._runtimeCustomers, ...MOCK_CUSTOMERS];
}

export function getMockCustomer(id: string): Customer | undefined {
  return getAllMockCustomers().find((c) => c.id === id);
}
