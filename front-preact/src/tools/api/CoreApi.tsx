type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

//Tipos públicos
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  errors: Record<string, string[]> | null;
  status: number;
  ok: boolean;
}

export interface ApiConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
  unauthorizedRedirectUrl?: string;
  onUnauthorized?: (response: ApiResponse<never>) => void;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestInterceptor = (
  config: RequestInit & { url: string },
) => RequestInit & { url: string };

type ResponseInterceptor = <T>(response: ApiResponse<T>) => ApiResponse<T>;

//Configuración global
const defaultConfig: Required<
  Pick<ApiConfig, "baseUrl" | "timeout" | "headers">
> & {
  unauthorizedRedirectUrl: string;
  onUnauthorized?: (response: ApiResponse<never>) => void;
} = {
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  unauthorizedRedirectUrl: "/",
  onUnauthorized: undefined,
};

//Interceptores
const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

//Helpers internos
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function buildHeaders(
  extra: Record<string, string> = {},
  token?: string | null,
): Record<string, string> {
  const headers = { ...defaultConfig.headers, ...extra };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function normalizeValidationErrors(
  errors: unknown,
): Record<string, string[]> | null {
  if (!isRecord(errors)) return null;

  const normalized: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      const messages = value.filter(
        (item): item is string => typeof item === "string",
      );
      if (messages.length > 0) normalized[key] = messages;
    } else if (typeof value === "string") {
      normalized[key] = [value];
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : null;
}

function parseError(payload: unknown, status: number): ApiResponse<never> {
  //Error de validación Laravel (422)
  if (status === 422 && isRecord(payload) && payload.errors) {
    const validationErrors = normalizeValidationErrors(payload.errors);
    const firstMessage = validationErrors
      ? Object.values(validationErrors)[0]?.[0]
      : undefined;

    return {
      data: null,
      error: firstMessage ?? "Error de validación",
      errors: validationErrors,
      status,
      ok: false,
    };
  }

  if (isRecord(payload)) {
    const message =
      (typeof payload.error === "string" && payload.error) ||
      (typeof payload.message === "string" && payload.message) ||
      "Error desconocido";

    return {
      data: null,
      error: message,
      errors: null,
      status,
      ok: false,
    };
  }

  return {
    data: null,
    error: "Error desconocido",
    errors: null,
    status,
    ok: false,
  };
}

async function readResponseBody(res: Response): Promise<unknown> {
  const text = await res.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function handleUnauthorized(response: ApiResponse<never>) {
  if (defaultConfig.onUnauthorized) {
    defaultConfig.onUnauthorized(response);
  }

  if (typeof window !== "undefined" && defaultConfig.unauthorizedRedirectUrl) {
    window.location.replace(defaultConfig.unauthorizedRedirectUrl);
  }
}

//Función principal
async function request<T>(
  endpoint: string,
  method: HttpMethod,
  options: {
    body?: unknown;
    token?: string | null;
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    redirectOnUnauthorized?: boolean;
  } = {},
): Promise<ApiResponse<T>> {
  const {
    body,
    token,
    headers = {},
    params,
    redirectOnUnauthorized = true,
  } = options;

  //Query params
  let url = `${defaultConfig.baseUrl}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    url += `?${qs}`;
  }

  let requestConfig: RequestInit & { url: string } = {
    url,
    method,
    headers: buildHeaders(headers, token),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  //Aplicar interceptores de request
  for (const interceptor of requestInterceptors) {
    requestConfig = interceptor(requestConfig);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), defaultConfig.timeout);

  try {
    const res = await fetch(requestConfig.url, {
      method: requestConfig.method,
      headers: requestConfig.headers,
      body: requestConfig.body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    //Sin contenido
    if (res.status === 204) {
      let response: ApiResponse<T> = {
        data: null,
        error: null,
        errors: null,
        status: 204,
        ok: true,
      };

      for (const interceptor of responseInterceptors) {
        response = interceptor(response) as ApiResponse<T>;
      }

      return response;
    }

    const payload = await readResponseBody(res);

    //No autenticado
    if (res.status === 401) {
      const response: ApiResponse<T> = {
        data: null,
        error:
          (isRecord(payload) &&
            typeof payload.error === "string" &&
            payload.error) ||
          (isRecord(payload) &&
            typeof payload.message === "string" &&
            payload.message) ||
          "No autenticado",
        errors: null,
        status: 401,
        ok: false,
      };

      for (const interceptor of responseInterceptors) {
        const next = interceptor(response) as ApiResponse<T>;
        response.error = next.error;
        response.errors = next.errors;
        response.data = next.data;
        response.status = next.status;
        response.ok = next.ok;
      }

      if (redirectOnUnauthorized) {
        handleUnauthorized(response as ApiResponse<never>);
      }

      return response;
    }

    if (!res.ok) {
      let response = parseError(payload, res.status) as ApiResponse<T>;

      for (const interceptor of responseInterceptors) {
        response = interceptor(response) as ApiResponse<T>;
      }

      return response;
    }

    let response: ApiResponse<T> = {
      data: payload as T,
      error: null,
      errors: null,
      status: res.status,
      ok: true,
    };

    for (const interceptor of responseInterceptors) {
      response = interceptor(response) as ApiResponse<T>;
    }

    return response;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        data: null,
        error: `Tiempo de espera agotado (${defaultConfig.timeout / 1000}s)`,
        errors: null,
        status: 408,
        ok: false,
      };
    }

    return {
      data: null,
      error: "Error de conexión con el servidor",
      errors: null,
      status: 0,
      ok: false,
    };
  }
}

//API pública
export const CoreApi = {
  //Configuración
  configure(config: ApiConfig) {
    if (config.baseUrl) defaultConfig.baseUrl = config.baseUrl;
    if (config.timeout) defaultConfig.timeout = config.timeout;
    if (config.headers) {
      defaultConfig.headers = { ...defaultConfig.headers, ...config.headers };
    }
    if (config.unauthorizedRedirectUrl !== undefined) {
      defaultConfig.unauthorizedRedirectUrl = config.unauthorizedRedirectUrl;
    }
    if (config.onUnauthorized !== undefined) {
      defaultConfig.onUnauthorized = config.onUnauthorized;
    }
  },

  setBaseUrl(url: string) {
    defaultConfig.baseUrl = url;
  },

  setHeader(key: string, value: string) {
    defaultConfig.headers[key] = value;
  },

  removeHeader(key: string) {
    delete defaultConfig.headers[key];
  },

  setUnauthorizedRedirectUrl(url: string) {
    defaultConfig.unauthorizedRedirectUrl = url;
  },

  setUnauthorizedHandler(handler?: (response: ApiResponse<never>) => void) {
    defaultConfig.onUnauthorized = handler;
  },

  //Interceptores
  addRequestInterceptor(fn: RequestInterceptor) {
    requestInterceptors.push(fn);
  },

  addResponseInterceptor(fn: ResponseInterceptor) {
    responseInterceptors.push(fn);
  },

  //Métodos HTTP
  get<T>(
    endpoint: string,
    options: {
      token?: string | null;
      params?: Record<string, string | number | boolean>;
      headers?: Record<string, string>;
      redirectOnUnauthorized?: boolean;
    } = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, "GET", options);
  },

  post<T>(
    endpoint: string,
    body: unknown,
    options: {
      token?: string | null;
      headers?: Record<string, string>;
      redirectOnUnauthorized?: boolean;
    } = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, "POST", { body, ...options });
  },

  put<T>(
    endpoint: string,
    body: unknown,
    options: {
      token?: string | null;
      headers?: Record<string, string>;
      redirectOnUnauthorized?: boolean;
    } = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, "PUT", { body, ...options });
  },

  patch<T>(
    endpoint: string,
    body: unknown,
    options: {
      token?: string | null;
      headers?: Record<string, string>;
      redirectOnUnauthorized?: boolean;
    } = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, "PATCH", { body, ...options });
  },

  delete<T>(
    endpoint: string,
    options: {
      token?: string | null;
      headers?: Record<string, string>;
      body?: unknown;
      redirectOnUnauthorized?: boolean;
    } = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, "DELETE", options);
  },
};
