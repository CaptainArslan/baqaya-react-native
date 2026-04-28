import { toast } from "@/src/services";

/**
 * Small convenience hook for screens/components.
 * Keeps callsites concise while still using the global toast service.
 */
export function useToast() {
  return toast;
}
