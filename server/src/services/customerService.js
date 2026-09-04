// src/services/customerService.js
// All Customer business logic lives here.
// No req / res / next — pure data operations only.

const mongoose = require('mongoose');
const Customer = require('../models/Customer');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Throw a structured error with an HTTP status code.
 */
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Validate that a string is a valid Mongoose ObjectId.
 * Throws 400 if invalid so the controller never reaches the DB.
 */
const assertValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(`Invalid customer ID: "${id}"`, 400);
  }
};

// ─── CRUD Operations ──────────────────────────────────────────────────────────

/**
 * Create a new customer.
 * @param {object} data - { name, email, phone, address }
 * @returns {Customer} newly created document
 */
const createCustomer = async (data) => {
  // Check for duplicate email before hitting the unique index so we get a
  // readable 409 instead of a raw Mongo duplicate-key error.
  const existing = await Customer.findOne({ email: data.email?.toLowerCase().trim() });
  if (existing) {
    throw createError(`A customer with email "${data.email}" already exists`, 409);
  }

  const customer = await Customer.create(data);
  return customer;
};

/**
 * Get all customers with optional search.
 * @param {object} query - { search, page, limit }
 *   search: free-text matched against name, email, phone
 *   page:   1-based page number (default 1)
 *   limit:  results per page   (default 20, max 100)
 * @returns {{ customers, total, page, pages }}
 */
const getAllCustomers = async ({ search = '', page = 1, limit = 20 } = {}) => {
  // Build filter
  const filter = {};

  if (search && search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
    ];
  }

  // Clamp limit to reasonable bounds
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage  = Math.max(Number(page)  || 1,  1);
  const skip      = (safePage - 1) * safeLimit;

  const [customers, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    Customer.countDocuments(filter),
  ]);

  return {
    customers,
    total,
    page: safePage,
    pages: Math.ceil(total / safeLimit),
  };
};

/**
 * Get a single customer by ID.
 * @param {string} id - Mongoose ObjectId string
 * @returns {Customer}
 */
const getCustomerById = async (id) => {
  assertValidObjectId(id);

  const customer = await Customer.findById(id);
  if (!customer) {
    throw createError(`Customer with ID "${id}" not found`, 404);
  }
  return customer;
};

/**
 * Update a customer by ID (partial update supported).
 * @param {string} id
 * @param {object} updates - fields to update
 * @returns {Customer} updated document
 */
const updateCustomer = async (id, updates) => {
  assertValidObjectId(id);

  // If email is being changed, check it's not already taken by another customer
  if (updates.email) {
    const duplicate = await Customer.findOne({
      email: updates.email.toLowerCase().trim(),
      _id: { $ne: id },
    });
    if (duplicate) {
      throw createError(`Email "${updates.email}" is already in use by another customer`, 409);
    }
  }

  const customer = await Customer.findByIdAndUpdate(
    id,
    { $set: updates },
    {
      new: true,           // return updated doc
      runValidators: true, // run schema validators on update
    }
  );

  if (!customer) {
    throw createError(`Customer with ID "${id}" not found`, 404);
  }

  return customer;
};

/**
 * Delete a customer by ID.
 * @param {string} id
 * @returns {Customer} deleted document
 */
const deleteCustomer = async (id) => {
  assertValidObjectId(id);

  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) {
    throw createError(`Customer with ID "${id}" not found`, 404);
  }
  return customer;
};

// ─── Search (dedicated endpoint helper) ───────────────────────────────────────

/**
 * Search customers by name, email, or phone.
 * Delegates to getAllCustomers with the search param — kept separate
 * so the controller can expose /search as a distinct endpoint if needed.
 * @param {string} term
 * @returns {{ customers, total }}
 */
const searchCustomers = async (term) => {
  if (!term || !term.trim()) {
    throw createError('Search term is required', 400);
  }
  return getAllCustomers({ search: term });
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
};
