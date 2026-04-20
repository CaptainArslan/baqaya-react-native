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
    phone: { recentCountries: ["PK"] },
    otp: { countdownSeconds: 30 },
    language: { languages: ["en", "ur", "roman"] },
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
    recentTransactions: [
      {
        id: "tx-1",
        customerId: "cu-3",
        customerName: "Customer 3",
        type: "debit",
        amount: 4500,
        note: "Grocery items",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        synced: true,
      },
      {
        id: "tx-2",
        customerId: "cu-8",
        customerName: "Customer 8",
        type: "credit",
        amount: 2200,
        note: "Part payment",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        synced: true,
      },
      {
        id: "tx-3",
        customerId: "cu-15",
        customerName: "Customer 15",
        type: "debit",
        amount: 8800,
        note: "Monthly supply",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        synced: false,
      },
      {
        id: "tx-4",
        customerId: "cu-21",
        customerName: "Customer 21",
        type: "credit",
        amount: 5000,
        note: "Cash collected",
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        synced: true,
      },
      {
        id: "tx-5",
        customerId: "cu-27",
        customerName: "Customer 27",
        type: "debit",
        amount: 12000,
        note: "Bulk order",
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        synced: false,
      },
      {
        id: "tx-6",
        customerId: "cu-34",
        customerName: "Customer 34",
        type: "credit",
        amount: 3000,
        note: "UPI transfer",
        createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
        synced: true,
      },
    ] as Transaction[],
    topDebtors: [
      {
        id: "cu-27",
        name: "Customer 27",
        phone: "03210000027",
        balance: 47500,
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "cu-15",
        name: "Customer 15",
        phone: "03210000015",
        balance: 32500,
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "cu-3",
        name: "Customer 3",
        phone: "03210000003",
        balance: 19400,
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "cu-42",
        name: "Customer 42",
        phone: "03210000042",
        balance: 13800,
        lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "cu-8",
        name: "Customer 8",
        phone: "03210000008",
        balance: 10450,
        lastActivity: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ] as Customer[],
  },
  customers: {
    list: Array.from({ length: 100 }, (_, index) => {
      const i = index + 1;
      const seededBalance = i % 4 === 0 ? 0 : (i * 1375) % 50000;
      const phoneSuffix = String(1000000 + i).slice(-7);
      return {
        id: `cu-${i}`,
        name: `Customer ${i}`,
        phone: `03${(i % 5) + 1}${phoneSuffix}`,
        balance: seededBalance,
        lastActivity: new Date(
          Date.now() - ((i % 14) + 1) * 24 * 60 * 60 * 1000,
        ).toISOString(),
        createdAt: new Date(
          Date.now() - ((i % 180) + 10) * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };
    }) as Customer[],
    customerDetail: {
      emptyStateCustomer: {
        id: "cu-empty",
        name: "Ali House",
        phone: "",
        balance: 0,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      } as Customer,
      transactions: [
        {
          id: "cd-tx-0",
          customerId: "cu-empty",
          customerName: "Ali House",
          type: "debit",
          amount: 2400,
          note: "Daily items",
          createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          synced: true,
        },
        {
          id: "cd-tx-0b",
          customerId: "cu-empty",
          customerName: "Ali House",
          type: "credit",
          amount: 1200,
          note: "Partial payment",
          createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
          synced: true,
        },
        {
          id: "cd-tx-1",
          customerId: "cu-1",
          customerName: "Customer 1",
          type: "debit",
          amount: 2800,
          note: "Grocery items",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          synced: true,
        },
        {
          id: "cd-tx-2",
          customerId: "cu-1",
          customerName: "Customer 1",
          type: "credit",
          amount: 1200,
          note: "Part payment",
          createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
          synced: true,
        },
        {
          id: "cd-tx-3",
          customerId: "cu-2",
          customerName: "Customer 2",
          type: "debit",
          amount: 4300,
          note: "Monthly supply",
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          synced: false,
        },
        {
          id: "cd-tx-4",
          customerId: "cu-2",
          customerName: "Customer 2",
          type: "credit",
          amount: 1500,
          note: "Cash received",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          synced: true,
        },
        {
          id: "cd-tx-5",
          customerId: "cu-3",
          customerName: "Customer 3",
          type: "credit",
          amount: 1950,
          note: "Advance adjustment",
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          synced: true,
        },
      ] as Transaction[],
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
    entries: [
      {
        id: "e1",
        customerName: "Ali Raza Bakery",
        type: "credit",
        amount: 4500,
        timeLabel: "10:45 AM",
        noteKey: "cashIn",
        section: "today",
      },
      {
        id: "e2",
        customerName: "Zeeshan General Store",
        type: "debit",
        amount: 1200,
        timeLabel: "09:15 AM",
        noteKey: "udhaar",
        section: "today",
      },
      {
        id: "e6",
        customerName: "Asif Traders",
        type: "credit",
        amount: 2700,
        timeLabel: "08:05 AM",
        noteKey: "payment",
        section: "today",
      },
      {
        id: "e7",
        customerName: "Naeem Canteen",
        type: "debit",
        amount: 650,
        timeLabel: "12:30 PM",
        noteKey: "udhaar",
        section: "today",
      },
      {
        id: "e3",
        customerName: "M. Ahmed",
        type: "credit",
        amount: 8000,
        timeLabel: "06:20 PM",
        noteKey: "cashIn",
        section: "yesterday",
      },
      {
        id: "e4",
        customerName: "Kashif Ali",
        type: "debit",
        amount: 3100,
        timeLabel: "02:10 PM",
        noteKey: "udhaar",
        section: "yesterday",
      },
      {
        id: "e5",
        customerName: "Irfan Malik",
        type: "credit",
        amount: 950,
        timeLabel: "11:00 AM",
        noteKey: "payment",
        section: "yesterday",
      },
      {
        id: "e8",
        customerName: "Sajid Fruits",
        type: "debit",
        amount: 2100,
        timeLabel: "04:40 PM",
        noteKey: "udhaar",
        section: "yesterday",
      },
      {
        id: "e9",
        customerName: "Al Noor Dairy",
        type: "credit",
        amount: 5200,
        timeLabel: "01:10 PM",
        noteKey: "cashIn",
        section: "yesterday",
      },
    ] as CashbookEntryMock[],
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
        latePayers: [
          { id: "lp1", name: "Arsalan Khan", daysPending: 12 },
          { id: "lp2", name: "Babar Azam", daysPending: 10 },
        ] as LatePayerMock[],
        topDebtors: [
          { id: "td1", name: "Mohammad Rizwan", txCount: 4, balance: 4500 },
          { id: "td2", name: "Shahin Afridi", txCount: 2, balance: 3200 },
          { id: "td3", name: "Shadab Khan", txCount: 3, balance: 2800 },
        ] as TopDebtorMock[],
        totalToCollect: 10500,
        totalReceived: 3500,
      },
    },
    weeklyBars: [0.6, 0.3, 0.8, 0.45],
  },
  modals: {
    importContacts: {
      contacts: [
        {
          id: "c1",
          name: "Ahmed Khan",
          phone: "03001234567",
          existingBalance: 8400,
        },
        {
          id: "c2",
          name: "Zubair Shah",
          phone: "03121234567",
          existingBalance: -1200,
        },
        { id: "c3", name: "Mohammad Din", phone: "03451234567" },
        { id: "c4", name: "Kashif Raza", phone: "03331122334" },
        { id: "c5", name: "Farhan Malik", phone: null },
        { id: "c6", name: "Irfan Siddiqui", phone: "03216543210" },
        { id: "c7", name: "Bilal Ahmed", phone: "03019988776" },
        { id: "c8", name: "Usman Tariq", phone: null },
        {
          id: "c9",
          name: "Adnan Butt",
          phone: "03450011223",
          existingBalance: 3250,
        },
      ] as ImportContactMock[],
      recentIds: ["c1", "c2", "c3"],
    },
    multipleNumbers: {
      numbers: [
        { id: "n1", labelKey: "labelMobile" as const, value: "03001234567" },
        { id: "n2", labelKey: "labelHome" as const, value: "04235678901" },
        { id: "n3", labelKey: "labelWork" as const, value: "03121112233" },
      ],
    },
  },
} as const;

export const CUSTOMER_MOCKS: Customer[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    phone: "03001234567",
    balance: 8400,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Zubair Khan",
    phone: "03121234567",
    balance: 3250,
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Irfan Malik",
    phone: "",
    balance: -1950,
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    name: "Kashif Ali",
    phone: "03451234567",
    balance: 0,
    lastActivity: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
