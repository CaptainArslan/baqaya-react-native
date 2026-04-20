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
      totalBalance: 0,
      todayPayment: 0,
      todayLedger: 0,
    },
    recentTransactions: [] as Transaction[],
    topDebtors: [] as Customer[],
  },
  customers: {
    list: [] as Customer[],
    customerDetail: {
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
