/**
 * WhatsApp reminder helper.
 * Pure utilities — no React, no hooks.
 *
 * Rules:
 *  - Uses wa.me universal link (works even if app isn't installed via browser fallback)
 *  - Never auto-sends — user must tap Send inside WhatsApp
 *  - Handles missing phone gracefully via return codes
 */
import { Linking } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WhatsAppResult =
  | 'opened'    // URL opened successfully
  | 'no_phone'  // phone string was empty / missing
  | 'no_app';   // Linking rejected (WhatsApp not installed / URL error)

// ─── Phone normalisation ──────────────────────────────────────────────────────

/**
 * Normalises a Pakistani phone number to E.164 without the leading +.
 * Accepts: 0300XXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX, 3XXXXXXXXX
 * Returns: 923XXXXXXXXX  (ready for wa.me)
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');

  if (digits.startsWith('92') && digits.length === 12) return digits;       // already E.164
  if (digits.startsWith('0')  && digits.length === 11) return '92' + digits.slice(1); // 0XXX → 92XXX
  if (!digits.startsWith('9') && digits.length === 10) return '92' + digits;          // 3XX → 923XX
  if (digits.startsWith('92'))                          return digits;       // partial E.164

  // Unknown format — prepend 92 and hope for the best
  return '92' + digits;
}

// ─── Message builder ──────────────────────────────────────────────────────────

/**
 * Interpolates `{name}` and `{balance}` placeholders in a message template.
 * Template comes from i18n so it's language-aware.
 */
export function buildReminderMessage(
  template: string,
  name: string,
  balance: string,
): string {
  return template
    .replace('{name}', name)
    .replace('{balance}', balance);
}

// ─── URL builder ─────────────────────────────────────────────────────────────

/**
 * Returns a wa.me deep-link URL for the given phone + prefilled text.
 * wa.me works whether WhatsApp is installed (opens app) or not (opens browser → install prompt).
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  const encoded    = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encoded}`;
}

// ─── Action ───────────────────────────────────────────────────────────────────

/**
 * Opens WhatsApp with a prefilled message. Never auto-sends.
 * Returns a result code so callers can show appropriate UI feedback.
 */
export async function openWhatsAppReminder(
  phone: string | null | undefined,
  message: string,
): Promise<WhatsAppResult> {
  if (!phone || !phone.trim()) return 'no_phone';

  const url = buildWhatsAppUrl(phone, message);

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) return 'no_app';
    await Linking.openURL(url);
    return 'opened';
  } catch {
    return 'no_app';
  }
}
