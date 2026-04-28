import { API_CONFIG } from "@/src/config/apiConfig";
import { getToken } from "@/src/services/storage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiErrorPayload {
  code: string;
  message: string;
  status: number;
  details?: unknown;
}

export class ApiClientError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiClientError";
    this.status = payload.status;
    this.code = payload.code;
    this.details = payload.details;
  }
}

interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

function buildUrl(path: string): string {
  const normalizedBase = API_CONFIG.BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}/api/${API_CONFIG.API_VERSION}${normalizedPath}`;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const payload = text ? (JSON.parse(text) as unknown) : {};

  if (!res.ok) {
    throw new ApiClientError({
      status: res.status,
      code: (payload as any)?.code ?? "API_ERROR",
      message: (payload as any)?.message ?? `Request failed with status ${res.status}`,
      details: payload,
    });
  }
  return payload as T;
}

async function createHeaders(input?: Record<string, string>): Promise<Record<string, string>> {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...input,
  };
}

export const apiClient = {
  async request<TResponse, TBody = unknown>(
    path: string,
    options?: RequestOptions<TBody>,
  ): Promise<TResponse> {
    const method = options?.method ?? "GET";
    const timeoutMs = options?.timeoutMs ?? API_CONFIG.API_TIMEOUT_MS;
    const url = buildUrl(path);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers = await createHeaders(options?.headers);
      const init: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };
      if (options?.body !== undefined) {
        init.body = JSON.stringify(options.body);
      }

      if (__DEV__) {
        console.log(`[api] ${method} ${url}`);
      }

      const response = await fetch(url, init);
      return await parseResponse<TResponse>(response);
    } catch (error) {
      if (error instanceof ApiClientError) throw error;
      if ((error as Error).name === "AbortError") {
        throw new ApiClientError({
          status: 408,
          code: "REQUEST_TIMEOUT",
          message: "Request timed out",
        });
      }
      throw new ApiClientError({
        status: 0,
        code: "NETWORK_ERROR",
        message: (error as Error).message || "Network request failed",
      });
    } finally {
      clearTimeout(timeout);
    }
  },

  get<TResponse>(path: string) {
    return apiClient.request<TResponse>(path, { method: "GET" });
  },
  post<TResponse, TBody = unknown>(path: string, body: TBody) {
    return apiClient.request<TResponse, TBody>(path, { method: "POST", body });
  },
  put<TResponse, TBody = unknown>(path: string, body: TBody) {
    return apiClient.request<TResponse, TBody>(path, { method: "PUT", body });
  },
  patch<TResponse, TBody = unknown>(path: string, body: TBody) {
    return apiClient.request<TResponse, TBody>(path, { method: "PATCH", body });
  },
  delete<TResponse>(path: string) {
    return apiClient.request<TResponse>(path, { method: "DELETE" });
  },
};

