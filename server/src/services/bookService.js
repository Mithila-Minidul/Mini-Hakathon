// src/services/bookService.js
// Business logic for the Book Discovery module (read-only public API)
// Admin CRUD would live in a separate admin service — not implemented here.

const mongoose = require('mongoose');
const Book = require('../models/Book');

// ─── Helpers ───────────────────────────────────────────────────────────────────

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

// ─── Public: Get all books with search + filter + pagination ─────────────────

/**
 * @param {object} options
 * @param {string}  options.search    - Full-text search against title & author
 * @param {string}  options.author    - Case-insensitive author filter
 * @param {string}  options.category  - Exact category filter
 * @param {boolean} options.available - Filter by stock > 0
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

  // Availability
  if (available === true || available === 'true') {
    filter.stock = { $gt: 0 };
  } else if (available === false || available === 'false') {
    filter.stock = 0;
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortObj = search
    ? { score: { $meta: 'textScore' }, [sortBy]: sortOrder }
    : { [sortBy]: sortOrder };

  const pageNum  = Math.max(1, parseInt(page, 10) || 1);
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

// ─── Public: Get single book by ID ────────────────────────────────────────────

const getBookById = async (id) => {
  assertValidObjectId(id);
  const book = await Book.findById(id);
  if (!book) throw createError(`Book with ID "${id}" not found`, 404);
  return book;
};

// ─── Public: Get all unique categories ────────────────────────────────────────

const getCategories = async () => {
  const cats = await Book.distinct('category');
  return cats.sort();
};

module.exports = { getBooks, getBookById, getCategories };
