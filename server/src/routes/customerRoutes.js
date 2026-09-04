// src/routes/customerRoutes.js
// Pure routing — NO business logic here.
// Pattern mirrors authRoutes.js

const express = require('express');
const router = express.Router();

const {
  create,
  getAll,
  getById,
  update,
  remove,
  search,
} = require('../controllers/customerController');

// ─── /api/customers/search  must be declared BEFORE /:id ─────────────────────
// If it were after, Express would treat "search" as an ObjectId param value.
// GET /api/customers/search?q=<term>
router.get('/search', search);

// ─── Standard CRUD ────────────────────────────────────────────────────────────
// POST   /api/customers
router.post('/', create);

// GET    /api/customers?search=&page=&limit=
router.get('/', getAll);

// GET    /api/customers/:id
router.get('/:id', getById);

// PUT    /api/customers/:id
router.put('/:id', update);

// DELETE /api/customers/:id
router.delete('/:id', remove);

module.exports = router;
