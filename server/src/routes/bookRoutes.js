// src/routes/bookRoutes.js
// Book CRUD endpoints — no auth required

const express = require('express');
const {
  listBooks,
  listCategories,
  getBook,
  addBook,
  editBook,
  removeBook,
} = require('../controllers/bookController');

const router = express.Router();

// GET /api/books/categories — must come BEFORE /:id to avoid route conflict
router.get('/categories', listCategories);

// GET  /api/books?search=&author=&category=&available=&page=&limit=
router.get('/', listBooks);

// GET  /api/books/:id
router.get('/:id', getBook);

// POST /api/books
router.post('/', addBook);

// PUT  /api/books/:id
router.put('/:id', editBook);

// DELETE /api/books/:id
router.delete('/:id', removeBook);

module.exports = router;
