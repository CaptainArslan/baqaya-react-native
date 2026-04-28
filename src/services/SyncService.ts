import { apiEndpoints } from "@/src/config/apiEndpoints";
import { apiClient } from "@/src/services/apiClient";

export interface SyncOperation {
  operationId: string;
  operation: "create" | "update" | "delete";
  entityType: "customer" | "order";
  entityId: string;
  timestamp: string;
  payload?: Record<string, unknown>;
}

export interface SyncPushInput {
  requestId: string;
  deviceId: string;
  timestamp: string;
  operations: SyncOperation[];
}

export interface SyncPullInput {
  cursor?: string;
  limit?: number;
}

export const SyncService = {
  push(input: SyncPushInput) {
    return apiClient.post<{ accepted: boolean; requestId: string }, SyncPushInput>(
      apiEndpoints.sync.push,
      input,
    );
  },

  pull(input?: SyncPullInput) {
    const params = new URLSearchParams();
    if (input?.cursor) params.set("cursor", input.cursor);
    if (input?.limit) params.set("limit", String(input.limit));
    const qs = params.toString();
    const path = qs ? `${apiEndpoints.sync.pull}?${qs}` : apiEndpoints.sync.pull;
    return apiClient.get<{
      cursor: string;
      hasMore: boolean;
      changes: Array<Record<string, unknown>>;
    }>(path);
  },

  status(requestId: string) {
    return apiClient.get<{
      requestId: string;
      status: "processing" | "completed" | "failed";
      processed: number;
      failed: number;
    }>(apiEndpoints.sync.status(requestId));
  },
};

