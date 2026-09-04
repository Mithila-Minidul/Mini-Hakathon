// src/services/bookService.js
// Business logic for the Book module (CRUD + search/filter)

const mongoose = require('mongoose');
const Book = require('../models/Book');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const assertValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(`Invalid book ID: "${id}"`, 400);
  }
};

// ─── GET all books: search + filter + pagination ─────────────────────────────

/**
 * @param {object} options
 * @param {string}  options.search    - Full-text search against title & author
 * @param {string}  options.author    - Case-insensitive author filter
 * @param {string}  options.category  - Exact category filter
 * @param {string}  options.available - 'true' | 'false' availability filter
 * @param {string}  options.sortBy    - Field to sort by (default: 'createdAt')
 * @param {string}  options.order     - 'asc' | 'desc' (default: 'desc')
 * @param {number}  options.page      - Page number (default: 1)
 * @param {number}  options.limit     - Results per page (default: 20)
 */
const getBooks = async ({
  search = '',
  author = '',
  category = '',
  available,
  sortBy = 'createdAt',
  order = 'desc',
  page = 1,
  limit = 20,
} = {}) => {
  const filter = {};

  // Full-text search across title + author index
  if (search && search.trim()) {
    filter.$text = { $search: search.trim() };
  }

  // Author substring filter (when not using full-text search on author)
  if (author && author.trim() && !search) {
    filter.author = { $regex: author.trim(), $options: 'i' };
  }

  // Category exact match
  if (category && category.trim()) {
    filter.category = category.trim();
  }

  // Availability filter (stored boolean field)
  if (available === true || available === 'true') {
    filter.available = true;
  } else if (available === false || available === 'false') {
    filter.available = false;
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortObj = search
    ? { score: { $meta: 'textScore' }, [sortBy]: sortOrder }
    : { [sortBy]: sortOrder };

  const pageNum  = Math.max(1, parseInt(page, 10)  || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip     = (pageNum - 1) * limitNum;

  const projection = search ? { score: { $meta: 'textScore' } } : {};

  const [books, total] = await Promise.all([
    Book.find(filter, projection).sort(sortObj).skip(skip).limit(limitNum),
    Book.countDocuments(filter),
  ]);

  return {
    books,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  };
};

// ─── GET single book by ID ────────────────────────────────────────────────────

const getBookById = async (id) => {
  assertValidObjectId(id);
  const book = await Book.findById(id);
  if (!book) throw createError(`Book with ID "${id}" not found`, 404);
  return book;
};

// ─── GET distinct categories ─────────────────────────────────────────────────

const getCategories = async () => {
  const cats = await Book.distinct('category');
  return cats.sort();
};

// ─── CREATE a book ────────────────────────────────────────────────────────────

/**
 * @param {object} data - Book fields from request body
 */
const createBook = async (data) => {
  const { title, author, category, price, stock, description, coverImage } = data;

  // Manual guard (Mongoose validation also runs, but this gives a cleaner msg)
  if (!title || !author || !category || price === undefined) {
    throw createError('title, author, category, and price are required', 400);
  }

  if (typeof price !== 'number' || price <= 0) {
    throw createError('Price must be a number greater than 0', 400);
  }

  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    throw createError('Stock must be 0 or greater', 400);
  }

  const book = await Book.create({ title, author, category, price, stock, description, coverImage });
  return book;
};

// ─── UPDATE a book ────────────────────────────────────────────────────────────

/**
 * @param {string} id   - MongoDB ObjectId
 * @param {object} data - Partial update fields
 */
const updateBook = async (id, data) => {
  assertValidObjectId(id);

  // Reject unknown / protected fields gracefully
  const allowed = ['title', 'author', 'category', 'price', 'stock', 'description', 'coverImage'];
  const updateData = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  if (Object.keys(updateData).length === 0) {
    throw createError('No valid fields provided for update', 400);
  }

  // Validate price if present
  if (updateData.price !== undefined && (typeof updateData.price !== 'number' || updateData.price <= 0)) {
    throw createError('Price must be a number greater than 0', 400);
  }

  // Validate stock if present
  if (updateData.stock !== undefined && (typeof updateData.stock !== 'number' || updateData.stock < 0)) {
    throw createError('Stock must be 0 or greater', 400);
  }

  const book = await Book.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!book) throw createError(`Book with ID "${id}" not found`, 404);
  return book;
};

// ─── DELETE a book ────────────────────────────────────────────────────────────

/**
 * @param {string} id - MongoDB ObjectId
 */
const deleteBook = async (id) => {
  assertValidObjectId(id);
  const book = await Book.findByIdAndDelete(id);
  if (!book) throw createError(`Book with ID "${id}" not found`, 404);
  return book;
};

module.exports = { getBooks, getBookById, getCategories, createBook, updateBook, deleteBook };
