// ─── Customer ──────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  balance: number; // positive = they owe you, negative = you owe them
  lastActivity?: string; // ISO date
  createdAt: string;
}

// ─── Transaction ───────────────────────────────────────────────────────────

export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  type: TransactionType;
  amount: number;
  note?: string;
  imageUrl?: string;
  createdAt: string;
  synced: boolean;
}

// ─── Shop ──────────────────────────────────────────────────────────────────

export interface Shop {
  id: string;
  name: string;
  phone: string;
  ownerName?: string;
  address?: string;
}

// ─── User ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  phone: string;
  shop?: Shop;
}

// ─── UI helpers ────────────────────────────────────────────────────────────

export type SyncStatus = 'synced' | 'pending' | 'offline' | 'syncing';

export type TabId = 'home' | 'customers' | 'cashbook' | 'reports';

export type DateRangeFilter = 'today' | 'week' | 'month' | 'custom';
