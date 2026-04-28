import { toastController } from "./toast.controller";
import type { ToastItem, ToastOptions, ToastSnapshot, ToastType } from "./toast.types";

type ShowFn = (message: string, options?: ToastOptions) => string | null;

function show(type: ToastType, message: string, options?: ToastOptions): string | null {
  return toastController.show(type, message, options);
}

export const toast: {
  success: ShowFn;
  error: ShowFn;
  warning: ShowFn;
  info: ShowFn;
  dismiss: (id?: string) => void;
  clearAll: () => void;
  actionPress: (item: ToastItem) => void;
  getSnapshot: () => ToastSnapshot;
  subscribe: (listener: () => void) => () => void;
  hydrate: () => Promise<void>;
} = {
  success: (message, options) => show("success", message, options),
  error: (message, options) => show("error", message, options),
  warning: (message, options) => show("warning", message, options),
  info: (message, options) => show("info", message, options),
  dismiss: (id) => {
    if (!id) {
      toastController.dismissCurrent("manual");
      return;
    }
    toastController.dismissById(id);
  },
  clearAll: () => {
    toastController.clearAll();
  },
  actionPress: (item) => {
    item.action?.onPress();
    if (item.action?.autoDismiss !== false) {
      toastController.dismissCurrent("action");
    }
  },
  getSnapshot: () => toastController.getSnapshot(),
  subscribe: (listener) => toastController.subscribe(listener),
  hydrate: () => toastController.hydratePersistedQueue(),
};
