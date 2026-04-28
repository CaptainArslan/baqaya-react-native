# Global Toast System

Production-grade global toast/notification system for this offline-first app.

## File Structure

- `src/services/toast/toast.types.ts`
  - strict types for API/options/queue items
- `src/services/toast/toast.controller.ts`
  - queue, priority, dedupe throttling, timers, persistence hydration
- `src/services/toast/toast.service.ts`
  - global API (`toast.success/error/info/warning`)
- `src/services/toast/index.ts`
  - barrel exports
- `src/components/common/GlobalToastViewport.tsx`
  - global renderer with safe-area and dark-mode aware visuals
- `app/_layout.tsx`
  - mounts global viewport once for whole app
- `src/services/storage.ts`
  - persisted critical queue storage helpers

## Usage Examples

### Basic

```ts
import { toast } from "@/src/services";

toast.success("Saved locally");
toast.error("Sync failed. Try again.");
```

### Custom duration + metadata

```ts
toast.info("Draft restored", {
  durationMs: 5000,
  metadata: { source: "rehydration", customerId: "c_42" },
});
```

### Retry action

```ts
toast.error("Upload failed", {
  action: {
    label: "Retry",
    onPress: () => retryUpload(),
    autoDismiss: true,
  },
});
```

### Persist critical toast across reload

```ts
toast.warning("3 entries are waiting to sync", {
  persist: true,
  dismissible: true,
  throttleKey: "sync:pending-entries",
});
```

### Manual dismiss

```ts
const id = toast.info("Working...");
if (id) {
  toast.dismiss(id);
}
```

## Behavior Summary

- Priority: `error > warning > success > info`
- Duplicate suppression window: 1800ms by `throttleKey` (or type+message)
- Queue processing: one toast visible at a time
- Auto-dismiss: per-type defaults, override per toast
- Optional persistence: only toasts marked `persist: true`

