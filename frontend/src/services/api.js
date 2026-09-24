import { handleMockRequest } from './mockApi';

const configuredApiUrl = import.meta.env.VITE_API_URL;
// Base URL points to configured backend URL or relative /api
const API_BASE_URL = configuredApiUrl || '/api';

export async function request(endpoint, options = {}) {
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

    // If endpoint returned 405 or HTML on an error status (unrouted static SPA page)
    const contentType = response.headers.get('content-type') || '';
    if (response.status === 405 || (contentType.includes('text/html') && !response.ok)) {
      console.warn(`[API] Endpoint ${endpoint} returned ${response.status}. Falling back to resilient client layer.`);
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
    // If network connection failed completely (e.g. backend server is offline)
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      console.warn(`[API] Network failure connecting to ${url}. Falling back to resilient client layer.`);
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
