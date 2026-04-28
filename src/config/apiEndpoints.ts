export const apiEndpoints = {
  /**
   * Auth flow in app:
   * phone -> request OTP -> verify OTP -> issue token
   */
  auth: {
    requestOtp: "/auth/otp/request",
    verifyOtp: "/auth/otp/verify",
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    me: "/auth/me",
  },

  /**
   * Onboarding / shop setup
   */
  onboarding: {
    createShop: "/onboarding/shop",
    getShop: "/onboarding/shop",
    updateShop: "/onboarding/shop",
  },

  users: {
    profile: "/users/me",
    updateProfile: "/users/me",
  },

  /**
   * Business profile from drawer
   */
  business: {
    profile: "/business/profile",
    updateProfile: "/business/profile",
  },

  customers: {
    list: "/customers",
    create: "/customers",
    byId: (id: string) => `/customers/${id}`,
    update: (id: string) => `/customers/${id}`,
    remove: (id: string) => `/customers/${id}`,
    ledger: (id: string) => `/customers/${id}/ledger`,
    stats: (id: string) => `/customers/${id}/stats`,
  },

  /**
   * Ledger entries / transactions (used by add-entry, edit-transaction, detail)
   */
  transactions: {
    list: "/transactions",
    create: "/transactions",
    byId: (id: string) => `/transactions/${id}`,
    update: (id: string) => `/transactions/${id}`,
    remove: (id: string) => `/transactions/${id}`,
    byCustomer: (customerId: string) => `/customers/${customerId}/transactions`,
  },

  /**
   * Cashbook + reports screens
   */
  cashbook: {
    list: "/cashbook/entries",
    summary: "/cashbook/summary",
  },
  reports: {
    dashboard: "/reports/dashboard",
    collections: "/reports/collections",
    debtors: "/reports/debtors",
  },

  /**
   * Contacts import backend helpers (optional, when syncing contact metadata)
   */
  contacts: {
    import: "/contacts/import",
    match: "/contacts/match",
  },

  /**
   * Account security / destructive actions
   */
  account: {
    requestDeleteOtp: "/account/delete/request-otp",
    verifyDeleteOtp: "/account/delete/verify-otp",
    delete: "/account/delete",
  },

  /**
   * Legacy order domain (kept for compatibility with created services)
   */
  orders: {
    list: "/orders",
    create: "/orders",
    byId: (id: string) => `/orders/${id}`,
    update: (id: string) => `/orders/${id}`,
    remove: (id: string) => `/orders/${id}`,
  },
  sync: {
    push: "/sync/push",
    pull: "/sync/pull",
    status: (requestId: string) => `/sync/status/${requestId}`,
  },
} as const;

export type ApiEndpoints = typeof apiEndpoints;

