// src/routes/paymentRoutes.js
// Stripe payment routes — keep lean, logic lives in controllers/services

const express = require('express');
const router = express.Router();

const { createIntent, stripeWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/payments/create-intent  (protected)
router.post('/create-intent', protect, createIntent);

// POST /api/payments/webhook  (raw body — see app.js for bodyParser config)
router.post('/webhook', stripeWebhook);

module.exports = router;
