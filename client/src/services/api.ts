const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export class ApiError extends Error {
  statusCode: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(message: string, statusCode = 500, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('esr_auth_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Clear token on 401 unauthorized
      if (token && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('esr_auth_token');
        localStorage.removeItem('esr_auth_user');
        window.location.href = '/login?session=expired';
      }
    }

    // Handle CSV or non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/csv')) {
      if (!response.ok) {
        throw new ApiError('Failed to generate export file', response.status);
      }
      return (await response.blob()) as unknown as T;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data.errors);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network connection failed. Check server status.', 0);
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),

  getBlob: (endpoint: string) =>
    request<Blob>(endpoint, { method: 'GET' }),
};
