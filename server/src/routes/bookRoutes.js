// src/routes/bookRoutes.js
// Public book-discovery endpoints — no auth required for browsing

const express = require('express');
const { listBooks, listCategories, getBook } = require('../controllers/bookController');

const router = express.Router();

// GET /api/books/categories  — must come BEFORE /:id to avoid route conflict
router.get('/categories', listCategories);

// GET /api/books?search=&author=&category=&available=&page=&limit=
router.get('/', listBooks);

// GET /api/books/:id
router.get('/:id', getBook);

module.exports = router;
