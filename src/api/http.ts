const API_BASE = "http://localhost:3001/api/v1";
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function http<T>(
  path: string,
  options?: {
    method?: HttpMethod;
    body?: unknown;
    token?: string;
    params?: Record<string, string | number | boolean | undefined>;
  },
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (options?.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }

  const res = await fetch(url.toString(), {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "X-ADMIN-KEY": "0iyPfvo=tgv,",
      ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  return res.json() as Promise<T>;
}
