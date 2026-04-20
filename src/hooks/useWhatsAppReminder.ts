/**
 * useWhatsAppReminder — composable hook for sending WhatsApp reminders.
 *
 * Usage:
 *   const { send, canSend } = useWhatsAppReminder({ phone, name, balance });
 *   <WhatsAppButton onPress={send} disabled={!canSend} />
 *
 * Handles:
 *  - Missing phone → `canSend` is false; `send()` shows Alert
 *  - WhatsApp not installed → Alert with explanation
 *  - Message template pulled from active i18n language
 */
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from '@/src/i18n';
import {
  buildReminderMessage,
  openWhatsAppReminder,
} from '@/src/utils/whatsapp';
import { formatCurrency } from '@/src/utils';

interface Options {
  phone?: string | null;
  name: string;
  balance: number;   // raw number — hook formats it
}

interface Result {
  /** Call this on button press. Handles all error cases internally. */
  send: () => Promise<void>;
  /** True when a phone number is present. Use to enable/disable the button. */
  canSend: boolean;
}

export function useWhatsAppReminder({ phone, name, balance }: Options): Result {
  const { t } = useTranslation();

  const canSend = !!phone?.trim();

  const send = useCallback(async () => {
    // Missing phone — surface gracefully instead of silent no-op
    if (!canSend) {
      Alert.alert(name, t.whatsapp.noPhone);
      return;
    }

    const message = buildReminderMessage(
      t.whatsapp.message,
      name,
      formatCurrency(Math.abs(balance)),
    );

    const result = await openWhatsAppReminder(phone, message);

    if (result === 'no_app') {
      Alert.alert('WhatsApp', t.whatsapp.notInstalled);
    }
    // 'opened' → WhatsApp launched, user sends manually — no feedback needed
  }, [canSend, phone, name, balance, t]);

  return { send, canSend };
}
