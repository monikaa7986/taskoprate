import { handleMockRequest } from './mockApi';

const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = configuredApiUrl || '/api';

// Check if running on a remote static host (like *.vercel.app) without an external backend URL configured
const isStaticProduction =
  !configuredApiUrl &&
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

export async function request(endpoint, options = {}) {
  // If in static production deployment without external backend, immediately serve via mock engine
  if (isStaticProduction) {
    return await handleMockRequest(endpoint, options);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = localStorage.getItem('atelier_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // If Vercel or static CDN returned 405 Method Not Allowed or 404
    if (response.status === 405 || response.status === 404) {
      console.warn(`[API] Endpoint ${endpoint} returned ${response.status}. Falling back to client-side mock service.`);
      return await handleMockRequest(endpoint, options);
    }

    // Check if response is HTML instead of JSON (typical when SPA rewrite serves index.html on missing API route)
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      console.warn(`[API] Endpoint ${endpoint} returned HTML instead of JSON. Falling back to client-side mock service.`);
      return await handleMockRequest(endpoint, options);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If network error (e.g. backend offline or server unreachable), fallback to mock
    if (
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.status >= 500
    ) {
      console.warn(`[API] Network failure for ${endpoint}. Falling back to mock service.`);
      return await handleMockRequest(endpoint, options);
    }

    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

export default {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' })
};
