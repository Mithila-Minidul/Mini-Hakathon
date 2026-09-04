// src/controllers/customerController.js
// Thin HTTP layer — reads req, calls service, sends res.
// All business logic lives in customerService.js

const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} = require('../services/customerService');

const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── POST /api/customers ──────────────────────────────────────────────────────
/**
 * Create a new customer.
 * Body: { name, email, phone, address? }
 */
const create = asyncHandler(async (req, res) => {
  const customer = await createCustomer(req.body);
  sendSuccess(res, 201, 'Customer created successfully', { customer });
});

// ─── GET /api/customers ───────────────────────────────────────────────────────
/**
 * Get all customers with optional search + pagination.
 * Query: ?search=&page=1&limit=20
 */
const getAll = asyncHandler(async (req, res) => {
  const { search, page, limit } = req.query;
  const result = await getAllCustomers({ search, page, limit });
  sendSuccess(res, 200, 'Customers retrieved successfully', result);
});

// ─── GET /api/customers/:id ───────────────────────────────────────────────────
/**
 * Get a single customer by MongoDB ObjectId.
 */
const getById = asyncHandler(async (req, res) => {
  const customer = await getCustomerById(req.params.id);
  sendSuccess(res, 200, 'Customer retrieved successfully', { customer });
});

// ─── PUT /api/customers/:id ───────────────────────────────────────────────────
/**
 * Update a customer (partial update — only supplied fields are changed).
 * Body: any subset of { name, email, phone, address }
 */
const update = asyncHandler(async (req, res) => {
  const customer = await updateCustomer(req.params.id, req.body);
  sendSuccess(res, 200, 'Customer updated successfully', { customer });
});

// ─── DELETE /api/customers/:id ────────────────────────────────────────────────
/**
 * Delete a customer by ID.
 */
const remove = asyncHandler(async (req, res) => {
  const customer = await deleteCustomer(req.params.id);
  sendSuccess(res, 200, 'Customer deleted successfully', {
    customer: { id: customer._id, name: customer.name },
  });
});

// ─── GET /api/customers/search ────────────────────────────────────────────────
/**
 * Dedicated search endpoint.
 * Query: ?q=<term>
 * Searches name, email, and phone simultaneously.
 */
const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return sendError(res, 400, 'Query parameter "q" is required');
  }
  const result = await searchCustomers(q);
  sendSuccess(res, 200, `Search results for "${q}"`, result);
});

module.exports = { create, getAll, getById, update, remove, search };
