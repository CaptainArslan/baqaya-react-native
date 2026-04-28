import {
  clearPersistedToastQueue,
  getPersistedToastQueue,
  setPersistedToastQueue,
} from "@/src/services/storage";
import type { ToastItem, ToastOptions, ToastPriority, ToastSnapshot, ToastType } from "./toast.types";

const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 2600,
  info: 3000,
  warning: 3600,
  error: 4400,
};

const PRIORITY: Record<ToastType, ToastPriority> = {
  info: 1,
  success: 2,
  warning: 3,
  error: 4,
};

const DUPLICATE_WINDOW_MS = 1800;

type Listener = () => void;

function toToastItem(type: ToastType, message: string, options?: ToastOptions): ToastItem {
  const now = Date.now();
  const throttleKey = options?.throttleKey ?? `${type}:${message.trim().toLowerCase()}`;
  return {
    id: options?.id ?? `toast_${now}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    message,
    durationMs: options?.durationMs ?? DEFAULT_DURATIONS[type],
    dismissible: options?.dismissible ?? true,
    action: options?.action,
    metadata: options?.metadata,
    persist: Boolean(options?.persist),
    throttleKey,
    createdAt: now,
    priority: PRIORITY[type],
  };
}

export class ToastController {
  private queue: ToastItem[] = [];
  private current: ToastItem | null = null;
  private snapshot: ToastSnapshot = { current: null, queueSize: 0 };
  private timer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<Listener>();
  private recentByKey = new Map<string, number>();
  private hydrated = false;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): ToastSnapshot {
    return this.snapshot;
  }

  async hydratePersistedQueue(): Promise<void> {
    if (this.hydrated) return;
    this.hydrated = true;
    try {
      const raw = await getPersistedToastQueue();
      if (!raw) return;
      const parsed = JSON.parse(raw) as ToastItem[];
      const safe = Array.isArray(parsed)
        ? parsed.filter((item) => Boolean(item?.message && item?.type))
        : [];
      if (safe.length === 0) {
        await clearPersistedToastQueue();
        return;
      }
      this.queue = [...this.queue, ...safe];
      this.reorderQueue();
      this.emit();
      this.showNextIfIdle();
    } catch {
      await clearPersistedToastQueue();
    }
  }

  show(type: ToastType, message: string, options?: ToastOptions): string | null {
    const item = toToastItem(type, message, options);
    if (this.isThrottled(item.throttleKey)) {
      return null;
    }

    if (!this.current) {
      this.current = item;
      this.emit();
      this.startTimerForCurrent();
      return item.id;
    }

    if (item.priority > this.current.priority) {
      this.queue.unshift(this.current);
      this.current = item;
      this.reorderQueue();
      this.emit();
      this.startTimerForCurrent();
      void this.persistQueueIfNeeded();
      return item.id;
    }

    this.queue.push(item);
    this.reorderQueue();
    this.emit();
    void this.persistQueueIfNeeded();
    return item.id;
  }

  dismissCurrent(reason: "timer" | "manual" | "action" = "manual"): void {
    if (!this.current) return;
    this.clearTimer();
    this.current = null;
    this.emit();
    this.showNextIfIdle();
    if (reason !== "timer") {
      void this.persistQueueIfNeeded();
    }
  }

  dismissById(id: string): void {
    if (this.current?.id === id) {
      this.dismissCurrent("manual");
      return;
    }
    const before = this.queue.length;
    this.queue = this.queue.filter((item) => item.id !== id);
    if (before !== this.queue.length) {
      this.emit();
      void this.persistQueueIfNeeded();
    }
  }

  clearAll(): void {
    this.clearTimer();
    this.current = null;
    this.queue = [];
    this.emit();
    void clearPersistedToastQueue();
  }

  private showNextIfIdle(): void {
    if (this.current || this.queue.length === 0) return;
    this.current = this.queue.shift() ?? null;
    this.emit();
    this.startTimerForCurrent();
    void this.persistQueueIfNeeded();
  }

  private startTimerForCurrent(): void {
    this.clearTimer();
    if (!this.current) return;
    if (this.current.durationMs <= 0) return;
    this.timer = setTimeout(() => {
      this.dismissCurrent("timer");
    }, this.current.durationMs);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private reorderQueue(): void {
    this.queue.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.createdAt - b.createdAt;
    });
  }

  private isThrottled(key: string): boolean {
    const now = Date.now();
    const previous = this.recentByKey.get(key);
    this.recentByKey.set(key, now);
    if (!previous) return false;
    return now - previous < DUPLICATE_WINDOW_MS;
  }

  private async persistQueueIfNeeded(): Promise<void> {
    const persisted = [this.current, ...this.queue].filter((t): t is ToastItem => Boolean(t?.persist));
    if (persisted.length === 0) {
      await clearPersistedToastQueue();
      return;
    }
    await setPersistedToastQueue(JSON.stringify(persisted));
  }

  private emit(): void {
    this.snapshot = {
      current: this.current,
      queueSize: this.queue.length,
    };
    this.listeners.forEach((fn) => fn());
  }
}

export const toastController = new ToastController();
