// src/services/customerService.js
// All Customer REST API calls — thin wrappers over the central api.js

import { get, post, put, del } from './api';

const BASE = '/customers';

/**
 * GET /api/customers?search=&page=&limit=
 */
export const fetchCustomers = ({ search = '', page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('page', String(page));
  params.set('limit', String(limit));
  return get(`${BASE}?${params.toString()}`);
};

/**
 * GET /api/customers/:id
 */
export const fetchCustomerById = (id) => get(`${BASE}/${id}`);

/**
 * POST /api/customers
 */
export const createCustomer = (data) => post(BASE, data);

/**
 * PUT /api/customers/:id
 */
export const updateCustomer = (id, data) => put(`${BASE}/${id}`, data);

/**
 * DELETE /api/customers/:id
 */
export const deleteCustomer = (id) => del(`${BASE}/${id}`);

/**
 * GET /api/customers/search?q=<term>
 */
export const searchCustomers = (q) => get(`${BASE}/search?q=${encodeURIComponent(q)}`);
