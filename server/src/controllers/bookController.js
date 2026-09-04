// src/controllers/bookController.js
// Thin HTTP layer — delegates all logic to bookService

const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { getBooks, getBookById, getCategories } = require('../services/bookService');

/**
 * GET /api/books
 * Query params: search, author, category, available, sortBy, order, page, limit
 */
const listBooks = asyncHandler(async (req, res) => {
  const { search, author, category, available, sortBy, order, page, limit } = req.query;
  const result = await getBooks({ search, author, category, available, sortBy, order, page, limit });
  sendSuccess(res, 200, 'Books retrieved successfully', result);
});

/**
 * GET /api/books/categories
 * Returns the list of distinct categories that have at least one book.
 */
const listCategories = asyncHandler(async (req, res) => {
  const categories = await getCategories();
  sendSuccess(res, 200, 'Categories retrieved successfully', { categories });
});

/**
 * GET /api/books/:id
 */
const getBook = asyncHandler(async (req, res) => {
  const book = await getBookById(req.params.id);
  sendSuccess(res, 200, 'Book retrieved successfully', { book });
});

module.exports = { listBooks, listCategories, getBook };
