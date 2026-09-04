// src/controllers/bookController.js
// Thin HTTP layer — delegates all logic to bookService

const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const {
  getBooks,
  getBookById,
  getCategories,
  createBook,
  updateBook,
  deleteBook,
} = require('../services/bookService');

// ─── GET /api/books ───────────────────────────────────────────────────────────
/**
 * Query params: search, author, category, available, sortBy, order, page, limit
 */
const listBooks = asyncHandler(async (req, res) => {
  const { search, author, category, available, sortBy, order, page, limit } = req.query;
  const result = await getBooks({ search, author, category, available, sortBy, order, page, limit });
  sendSuccess(res, 200, 'Books retrieved successfully', result);
});

// ─── GET /api/books/categories ────────────────────────────────────────────────
/**
 * Returns the list of distinct categories that have at least one book.
 */
const listCategories = asyncHandler(async (req, res) => {
  const categories = await getCategories();
  sendSuccess(res, 200, 'Categories retrieved successfully', { categories });
});

// ─── GET /api/books/:id ───────────────────────────────────────────────────────
const getBook = asyncHandler(async (req, res) => {
  const book = await getBookById(req.params.id);
  sendSuccess(res, 200, 'Book retrieved successfully', { book });
});

// ─── POST /api/books ──────────────────────────────────────────────────────────
/**
 * Body: { title, author, category, price, stock, description, coverImage }
 * price must be > 0; stock must be >= 0
 * available is auto-derived from stock
 */
const addBook = asyncHandler(async (req, res) => {
  const book = await createBook(req.body);
  sendSuccess(res, 201, 'Book created successfully', { book });
});

// ─── PUT /api/books/:id ───────────────────────────────────────────────────────
/**
 * Body: partial update (any subset of book fields)
 * available is auto-derived from stock if stock is provided
 */
const editBook = asyncHandler(async (req, res) => {
  const book = await updateBook(req.params.id, req.body);
  sendSuccess(res, 200, 'Book updated successfully', { book });
});

// ─── DELETE /api/books/:id ────────────────────────────────────────────────────
const removeBook = asyncHandler(async (req, res) => {
  const book = await deleteBook(req.params.id);
  sendSuccess(res, 200, 'Book deleted successfully', { book });
});

module.exports = { listBooks, listCategories, getBook, addBook, editBook, removeBook };
