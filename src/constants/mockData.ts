import { CUSTOMER_MOCKS, SCREEN_MOCKS } from "@/data";
import type { Customer, Transaction } from "../types";

export const MOCK_CUSTOMERS: Customer[] = CUSTOMER_MOCKS;
export const MOCK_TRANSACTIONS: Transaction[] =
  SCREEN_MOCKS.customers.customerDetail.transactions;

// Runtime-added customers (survive only for the session)
const _runtimeCustomers: Customer[] = [];
const _updatedCustomers = new Map<string, Customer>();
const _deletedCustomerIds = new Set<string>();
const _runtimeTransactions: Transaction[] = [];
const _updatedTransactions = new Map<string, Transaction>();
const _deletedTransactionIds = new Set<string>();

export function addMockCustomer(customer: Customer): void {
  _runtimeCustomers.unshift(customer);
  _updatedCustomers.set(customer.id, customer);
  _deletedCustomerIds.delete(customer.id);
}

export function updateMockCustomer(
  id: string,
  patch: Partial<Pick<Customer, "name" | "phone" | "avatarUrl" | "balance">>,
): Customer | undefined {
  const existing =
    _updatedCustomers.get(id) ??
    _runtimeCustomers.find((c) => c.id === id) ??
    SCREEN_MOCKS.customers.list.find((c) => c.id === id) ??
    MOCK_CUSTOMERS.find((c) => c.id === id);
  if (!existing) return undefined;
  const updated: Customer = {
    ...existing,
    ...patch,
    phone: patch.phone ?? existing.phone ?? "",
  };
  _updatedCustomers.set(id, updated);
  return updated;
}

export function deleteMockCustomer(id: string): void {
  _deletedCustomerIds.add(id);
  _updatedCustomers.delete(id);
}

export function getAllMockCustomers(): Customer[] {
  const combined = [..._runtimeCustomers, ...SCREEN_MOCKS.customers.list, ...MOCK_CUSTOMERS];
  const deduped = new Map<string, Customer>();
  combined.forEach((customer) => {
    if (_deletedCustomerIds.has(customer.id)) return;
    deduped.set(customer.id, _updatedCustomers.get(customer.id) ?? customer);
  });
  return Array.from(deduped.values());
}

export function getMockCustomer(id: string): Customer | undefined {
  return getAllMockCustomers().find((c) => c.id === id);
}

export function addMockTransaction(tx: Transaction): void {
  _deletedTransactionIds.delete(tx.id);
  _updatedTransactions.set(tx.id, tx);
  _runtimeTransactions.unshift(tx);
}

export function getAllMockTransactions(): Transaction[] {
  const combined = [..._runtimeTransactions, ...MOCK_TRANSACTIONS];
  const deduped = new Map<string, Transaction>();
  combined.forEach((tx) => {
    if (_deletedTransactionIds.has(tx.id)) return;
    deduped.set(tx.id, _updatedTransactions.get(tx.id) ?? tx);
  });
  return Array.from(deduped.values());
}

export function getMockTransactionsForCustomer(customerId: string): Transaction[] {
  return getAllMockTransactions().filter((tx) => tx.customerId === customerId);
}

export function getMockTransaction(id: string): Transaction | undefined {
  return getAllMockTransactions().find((tx) => tx.id === id);
}

export function updateMockTransaction(
  id: string,
  patch: Partial<Pick<Transaction, "amount" | "note" | "type" | "imageUrl" | "createdAt" | "synced">>,
): Transaction | undefined {
  const existing =
    _updatedTransactions.get(id) ??
    _runtimeTransactions.find((tx) => tx.id === id) ??
    MOCK_TRANSACTIONS.find((tx) => tx.id === id);
  if (!existing) return undefined;
  const updated: Transaction = { ...existing, ...patch };
  _updatedTransactions.set(id, updated);
  return updated;
}

export function deleteMockTransaction(id: string): void {
  _deletedTransactionIds.add(id);
  _updatedTransactions.delete(id);
}

export function getHomeMockData() {
  const txs = getAllMockTransactions()
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const recentTransactions = txs.slice(0, 8);
  const customers = getAllMockCustomers();

  const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0);
  const todayPayment = txs
    .filter((tx) => tx.type === "credit")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const todayLedger = txs
    .filter((tx) => tx.type === "debit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const topDebtors = customers
    .filter((c) => c.balance > 0)
    .slice()
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  return {
    stats: { totalBalance, todayPayment, todayLedger },
    recentTransactions,
    topDebtors,
  };
}

export interface CashbookEntryView {
  id: string;
  customerId: string;
  customerName: string;
  type: "credit" | "debit";
  amount: number;
  createdAt: string;
  timeLabel: string;
  noteKey: "cashIn" | "udhaar" | "payment";
  section: string;
}

export function getCashbookMockData() {
  const entries: CashbookEntryView[] = getAllMockTransactions()
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((tx) => {
      const created = new Date(tx.createdAt);
      const now = new Date();
      const diffDays = Math.floor(
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
      );
      const section =
        diffDays === 0
          ? "today"
          : diffDays === 1
            ? "yesterday"
            : created.toLocaleDateString("en-PK", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
      const noteKey: "cashIn" | "udhaar" | "payment" =
        tx.type === "credit"
          ? tx.note?.toLowerCase().includes("payment")
            ? "payment"
            : "cashIn"
          : "udhaar";

      return {
        id: tx.id,
        customerId: tx.customerId,
        customerName: tx.customerName,
        type: tx.type,
        amount: tx.amount,
        createdAt: tx.createdAt,
        timeLabel: created.toLocaleTimeString("en-PK", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        noteKey,
        section,
      };
    });

  const todayLedger = entries
    .filter((e) => e.section === "today")
    .reduce((s, e) => s + (e.type === "credit" ? e.amount : -e.amount), 0);
  const totalReceived = entries
    .filter((e) => e.type === "credit")
    .reduce((s, e) => s + e.amount, 0);
  const collections = entries.filter((e) => e.type === "credit").length;

  return {
    summary: {
      todayLedger,
      totalReceived,
      collections,
      deltaPercent: SCREEN_MOCKS.cashbook.summary.deltaPercent,
    },
    filters: SCREEN_MOCKS.cashbook.filters,
    entries,
  };
}
