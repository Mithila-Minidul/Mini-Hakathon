// src/services/api.js
// Centralised Axios (or fetch) instance with base URL and auth header injection

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Core fetch wrapper that attaches the JWT from localStorage and
 * returns parsed JSON (or throws a structured error).
 *
 * @param {string} endpoint  - e.g. '/auth/login'
 * @param {RequestInit} options  - standard fetch options
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// ─── Convenience wrappers ─────────────────────────────────────────────────────

export const get = (endpoint, options = {}) =>
  request(endpoint, { method: 'GET', ...options });

export const post = (endpoint, body, options = {}) =>
  request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options });

export const put = (endpoint, body, options = {}) =>
  request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options });

export const del = (endpoint, options = {}) =>
  request(endpoint, { method: 'DELETE', ...options });

export default { get, post, put, del };
