import type { Customer, Transaction } from "@/src/types";

export type CashbookEntryType = "credit" | "debit";
export type CashbookNoteKey = "cashIn" | "udhaar" | "payment";

export interface CashbookEntryMock {
  id: string;
  customerName: string;
  type: CashbookEntryType;
  amount: number;
  timeLabel: string;
  noteKey: CashbookNoteKey;
  section: "today" | "yesterday";
}

export interface CashbookSummaryMock {
  todayLedger: number;
  totalReceived: number;
  collections: number;
  deltaPercent: number;
}

export interface LatePayerMock {
  id: string;
  name: string;
  daysPending: number;
}

export interface TopDebtorMock {
  id: string;
  name: string;
  txCount: number;
  balance: number;
}

export interface ImportContactMock {
  id: string;
  name: string;
  phone: string | null;
  existingBalance?: number;
}

export const SCREEN_MOCKS = {
  auth: {
    index: { loginAttempts: [] as string[] },
    phone: { recentCountries: [] as string[] },
    otp: { countdownSeconds: 30 },
    language: { languages: [] as string[] },
    maintenance: { notices: [] as string[] },
    suspended: { violations: [] as string[] },
    privacyPolicy: { sections: [] as string[] },
    terms: { sections: [] as string[] },
  },
  onboarding: {
    createShop: { suggestedShops: [] as string[] },
  },
  home: {
    stats: {
      totalBalance: 72250,
      todayPayment: 12300,
      todayLedger: 9800,
    },
    recentTransactions: [] as Transaction[],
    topDebtors: [] as Customer[],
  },
  customers: {
    list: [] as Customer[],
    customerDetail: {
      emptyStateCustomer: {
        id: "cu-empty",
        name: "Ali House",
        phone: "",
        balance: 0,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      } as Customer,
      transactions: [] as Transaction[],
    },
    add: { draft: { name: "", phone: "" } },
    addEntry: { recentNotes: [] as string[] },
    transactionDetail: { attachments: [] as string[] },
    duplicateWarning: { matchedCustomerIds: [] as string[] },
    permissionDenied: { deniedAt: "" },
    permissionRequest: { askedBefore: false },
    contactPicker: { pickedContacts: [] as string[] },
  },
  cashbook: {
    summary: {
      todayLedger: 12450,
      totalReceived: 84200,
      collections: 14,
      deltaPercent: 12,
    } as CashbookSummaryMock,
    filters: {
      dateRangeLabel: "Aug 01 - Aug 31",
      sort: "newest" as "newest" | "oldest",
    },
    entries: [] as CashbookEntryMock[],
  },
  reports: {
    periods: {
      today: {
        latePayers: [] as LatePayerMock[],
        topDebtors: [] as TopDebtorMock[],
        totalToCollect: 0,
        totalReceived: 0,
      },
      week: {
        latePayers: [] as LatePayerMock[],
        topDebtors: [] as TopDebtorMock[],
        totalToCollect: 0,
        totalReceived: 0,
      },
      month: {
        latePayers: [] as LatePayerMock[],
        topDebtors: [] as TopDebtorMock[],
        totalToCollect: 10500,
        totalReceived: 3500,
      },
    },
    weeklyBars: [] as number[],
  },
  modals: {
    importContacts: {
      contacts: [] as ImportContactMock[],
      recentIds: [] as string[],
    },
    multipleNumbers: {
      numbers: [] as { id: string; labelKey: "labelMobile" | "labelHome" | "labelWork"; value: string }[],
    },
  },
} as const;

export const CUSTOMER_MOCKS: Customer[] = [];
