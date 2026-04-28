export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPriority = 1 | 2 | 3 | 4;

export type ToastMetadata = Record<string, unknown>;

export interface ToastAction {
  label: string;
  onPress: () => void;
  autoDismiss?: boolean;
}

export interface ToastOptions {
  id?: string;
  durationMs?: number;
  dismissible?: boolean;
  action?: ToastAction;
  metadata?: ToastMetadata;
  persist?: boolean;
  throttleKey?: string;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  durationMs: number;
  dismissible: boolean;
  action?: ToastAction;
  metadata?: ToastMetadata;
  persist: boolean;
  throttleKey: string;
  createdAt: number;
  priority: ToastPriority;
}

export interface ToastSnapshot {
  current: ToastItem | null;
  queueSize: number;
}
