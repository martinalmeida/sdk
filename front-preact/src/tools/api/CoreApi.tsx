type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

//Tipos públicos
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  errors: Record<string, string[]> | null; //errores de validación Laravel
  status: number;
  ok: boolean;
}

export interface ApiConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
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

//Configuración global
const defaultConfig: Required<ApiConfig> = {
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

//Interceptores
type RequestInterceptor = (
  config: RequestInit & { url: string },
) => RequestInit & { url: string };
type ResponseInterceptor = <T>(response: ApiResponse<T>) => ApiResponse<T>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

//Helpers internos
function buildHeaders(
  extra: Record<string, string> = {},
  token?: string | null,
): Record<string, string> {
  const headers = { ...defaultConfig.headers, ...extra };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function parseError(
  json: Record<string, unknown>,
  status: number,
): ApiResponse<never> {
  //Error de validación Laravel (422)
  if (status === 422 && json?.errors) {
    const validationErrors = json.errors as Record<string, string[]>;
    const firstMessage =
      Object.values(validationErrors)[0]?.[0] ?? "Error de validación";
    return {
      data: null,
      error: firstMessage,
      errors: validationErrors,
      status,
      ok: false,
    };
  }

  const message =
    (json?.error as string) ?? (json?.message as string) ?? "Error desconocido";

  return { data: null, error: message, errors: null, status, ok: false };
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
  } = {},
): Promise<ApiResponse<T>> {
  const { body, token, headers = {}, params } = options;

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

  //Timeout con AbortController
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
      for (const interceptor of responseInterceptors)
        response = interceptor(response) as ApiResponse<T>;
      return response;
    }

    const json = await res.json();

    if (!res.ok) {
      let response = parseError(
        json as Record<string, unknown>,
        res.status,
      ) as ApiResponse<T>;
      for (const interceptor of responseInterceptors)
        response = interceptor(response) as ApiResponse<T>;
      return response;
    }

    let response: ApiResponse<T> = {
      data: json as T,
      error: null,
      errors: null,
      status: res.status,
      ok: true,
    };

    for (const interceptor of responseInterceptors)
      response = interceptor(response) as ApiResponse<T>;

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
    if (config.headers)
      defaultConfig.headers = { ...defaultConfig.headers, ...config.headers };
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
    } = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, "DELETE", options);
  },
};
