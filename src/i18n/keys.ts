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
    emptyTitle: string;
    emptyBody: string;
    syncPending: string;
    syncOffline: string;
    totalBalance: string;
    todayPayment: string;
    todayLedger: string;
    recentTransactions: string;
    topDebtors: string;
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
  };

  // ─── Cashbook ─────────────────────────────────────────────
  cashbook: {
    filterAll: string;
    filterReceived: string;
    filterGiven: string;
    emptyTitle: string;
    emptyBody: string;
  };

  // ─── Reports ──────────────────────────────────────────────
  reports: {
    today: string;
    week: string;
    month: string;
    youNeedToCollect: string;
    latePayers: string;
    topDebtors: string;
    emptyTitle: string;
    emptyBody: string;
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
  };

  // ─── Duplicate warning ────────────────────────────────────
  duplicate: {
    title: string;
    body: string;
    viewExisting: string;
    addAnyway: string;
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
