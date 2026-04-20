export const Colors = {
  // ─── Brand ───────────────────────────────────────────────
  primary: "#1A4D3A", // dark green — headers, FAB, primary CTA
  primaryDark: "#122E23", // pressed / deeper
  primaryMid: "#1E6B4A", // payment-add button, secondary green CTA
  primaryLight: "#E6F2EC", // tinted backgrounds, badges
  primaryText: "#1A4D3A", // green text on light bg

  // ─── Accent ──────────────────────────────────────────────
  debit: "#B71C1C", // Udhaar / add ledger (debit)
  debitLight: "#FDECEA", // debit tint bg
  credit: "#1E6B4A", // payment / credit
  creditLight: "#E6F2EC", // credit tint bg

  // ─── Backgrounds ─────────────────────────────────────────
  background: "#EDEEE8", // warm cream — screen bg
  surface: "#FFFFFF", // cards, sheets
  surfaceSecondary: "#F5F5F0", // subtle panel bg
  headerBg: "#1A4D3A", // main tab header bg

  // ─── Text ────────────────────────────────────────────────
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  textInverse: "#FFFFFF",
  textOnPrimary: "#FFFFFF",
  textDebit: "#B71C1C", // owes / debit amount
  textCredit: "#1E6B4A", // you'll get / credit amount

  // ─── Border ──────────────────────────────────────────────
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  divider: "#F0F0EA",

  // ─── Status ──────────────────────────────────────────────
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  info: "#3B82F6",
  infoLight: "#DBEAFE",

  // ─── Sync / Offline ──────────────────────────────────────
  syncPending: "#FFF7ED",
  syncPendingBorder: "#FED7AA",
  syncPendingText: "#92400E",
  offlineBg: "#FFF7ED",
  offlineBorder: "#FED7AA",
  offlineText: "#92400E",
  syncingBg: "#EFF6FF",

  // ─── Avatar palette (initials bg) ────────────────────────
  avatar: ["#DCE8F5", "#D4EBE0", "#F5E6D0", "#EAD4F5", "#F5D4D4", "#D4E8F5"],

  // ─── Misc ────────────────────────────────────────────────
  overlay: "rgba(0,0,0,0.45)",
  transparent: "transparent",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export type ColorKey = keyof typeof Colors;
