/**
 * All translation keys, typed.
 * Add new keys here first, then add values to each language file.
 */
export interface TranslationMap {
  // ─── Common ──────────────────────────────────────────────
  common: {
    appName: string;
    tagline: string;
    save: string;
    cancel: string;
    back: string;
    continue: string;
    loading: string;
    retry: string;
    needHelp: string;
    contactSupport: string;
    yes: string;
    no: string;
    ok: string;
  };

  // ─── Auth ─────────────────────────────────────────────────
  auth: {
    splash: {
      encrypted: string;
    };
    language: {
      screenTitle: string;
      heading: string;
      subtitle: string;
      saveChanges: string;
      globalAccessibility: string;
      secureSetup: string;
      fastSync: string;
      langEnDesc: string;
      langUrDesc: string;
      langRomanDesc: string;
    };
    phone: {
      heading: string;
      subtitle: string;
      label: string;
      placeholder: string;
      privacyNote: string;
      sendOtp: string;
      termsPrefix: string;
      termsLink: string;
      errorInvalidFormat: string;
      errorSendFailed: string;
    };
    otp: {
      heading: string;
      sentTo: string;
      editNumber: string;
      resendIn: string;
      resendOtp: string;
      verify: string;
      errorInvalidCode: string;
      errorVerifyFailed: string;
      errorEnterCode: string;
    };
    maintenance: {
      title: string;
      subtitle: string;
      retryNote: string;
    };
    suspended: {
      screenTitle: string;
      title: string;
      body: string;
      violationLabel: string;
      violationTitle: string;
      violationNote: string;
      contactSupport: string;
      reviewTerms: string;
      securityNote: string;
      backToLogin: string;
    };
  };

  // ─── Onboarding ───────────────────────────────────────────
  onboarding: {
    createShop: {
      screenTitle: string;
      title: string;
      subtitle: string;
      label: string;
      placeholder: string;
      safeTitle: string;
      safeBody: string;
      hint: string;
      continue: string;
      errorEmpty: string;
    };
  };

  // ─── Tabs ─────────────────────────────────────────────────
  tabs: {
    home: string;
    customers: string;
    cashbook: string;
    reports: string;
  };

  // ─── Home ─────────────────────────────────────────────────
  home: {
    welcomeTitle: string;
    welcomeBody: string;
    emptyTitle: string;
    emptyBody: string;
    syncPending: string;
    syncOffline: string;
    totalBalance: string;
    todayPayment: string;
    todayLedger: string;
    recentTransactions: string;
    topDebtors: string;
    offlineHint: string;
    noEntriesToday: string;
  };

  // ─── Customers ────────────────────────────────────────────
  customers: {
    searchPlaceholder: string;
    allCustomers: string;
    emptyTitle: string;
    emptyBody: string;
    importContacts: string;
    addCustomer: string;
    owes: string;
    settled: string;
    toGive: string;
  };

  // ─── Add Customer ─────────────────────────────────────────
  addCustomer: {
    screenTitle: string;
    heading: string;
    subheading: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    importLabel: string;
    importSub: string;
    save: string;
    errorNameRequired: string;
  };

  // ─── Customer Detail ──────────────────────────────────────
  customerDetail: {
    netBalanceDue: string;
    youllGet: string;
    youllGive: string;
    entries: string;
    udhaarAdd: string;
    paymentAdd: string;
    whatsappReminder: string;
    noEntries: string;
    noEntriesBody: string;
    typeUdhaar: string;
    typePayment: string;
  };

  // ─── Cashbook ─────────────────────────────────────────────
  cashbook: {
    filterAll: string;
    filterReceived: string;
    filterGiven: string;
    emptyTitle: string;
    emptyBody: string;
    newEntry: string;
    searchPlaceholder: string;
    dateFilter: string;
    sort: string;
    todayLedger: string;
    totalReceived: string;
    collections: string;
    vsYesterday: string;
    sectionToday: string;
    sectionYesterday: string;
    typeReceived: string;
    typeGave: string;
    typeCashIn: string;
  };

  // ─── Reports ──────────────────────────────────────────────
  reports: {
    today: string;
    week: string;
    month: string;
    youNeedToCollect: string;
    pendingSettlements: string;
    allSettled: string;
    viewingPeriod: string;
    latePayers: string;
    noLatePayers: string;
    noLatePayersBody: string;
    remind: string;
    daysPending: string;
    topDebtors: string;
    noDebtors: string;
    transactions: string;
    reportSummary: string;
    selectedPeriod: string;
    totalToCollect: string;
    totalReceived: string;
    weeklyCollections: string;
    noChartData: string;
    noChartDataBody: string;
    addNewEntry: string;
    emptyTitle: string;
    emptyBody: string;
  };

  // ─── WhatsApp ─────────────────────────────────────────────
  whatsapp: {
    /** Prefilled reminder message. Use {name} and {balance} as placeholders. */
    message: string;
    buttonLabel: string;
    noPhone: string;
    notInstalled: string;
  };

  // ─── Sync / Offline ───────────────────────────────────────
  sync: {
    pending: string; // "{n} changes pending sync"
    pendingOne: string; // "1 change pending sync"
    syncing: string; // "Syncing changes…"
    offline: string; // "You are offline. Changes will sync later."
    failed: string; // "Sync failed. Tap to retry."
    syncNow: string; // "Sync Now"
    retry: string; // "Retry"
    synced: string; // "Synced"
    syncedBody: string; // "All data is up to date."
  };

  // ─── Permissions ──────────────────────────────────────────
  permissions: {
    contactsTitle: string;
    contactsBody: string;
    allowAccess: string;
    notNow: string;
    deniedTitle: string;
    deniedBody: string;
    openSettings: string;
    addManually: string;
    retry: string;
    encryptedNote: string;
    dataSafetyTitle: string;
    heroTitle: string;
    heroTagline: string;
    checkingPermission: string;
  };

  // ─── Import contacts ──────────────────────────────────────
  importContacts: {
    screenTitle: string;
    searchPlaceholder: string;
    recentContacts: string;
    allContacts: string;
    addNew: string;
    owes: string;
    advance: string;
    noPhone: string;
    noPhoneToastTitle: string;
    noPhoneToastBody: string;
    skip: string;
    addNumber: string;
  };

  // ─── Multiple numbers ─────────────────────────────────────
  multipleNumbers: {
    title: string;
    contactPrefix: string;
    confirm: string;
    cancel: string;
    labelMobile: string;
    labelHome: string;
    labelWork: string;
  };

  // ─── Duplicate warning ────────────────────────────────────
  duplicate: {
    title: string;
    body: string;
    viewExisting: string;
    addAnyway: string;
    phone: string;
    owes: string;
    cancel: string;
  };

  // ─── Drawer ───────────────────────────────────────────────
  drawer: {
    language: string;
    helpSupport: string;
    privacy: string;
    terms: string;
    logout: string;
  };
}
