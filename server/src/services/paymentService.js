// src/services/paymentService.js
// Stripe payment logic — no req/res, pure business logic

const stripe = require('../config/stripe');

/**
 * Create a Stripe PaymentIntent.
 * @param {number} amount  - Amount in smallest currency unit (e.g. cents)
 * @param {string} currency - e.g. 'usd'
 * @param {object} metadata - Arbitrary key/value pairs stored on the intent
 * @returns {object} paymentIntent
 */
const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
  return paymentIntent;
};

/**
 * Construct and verify a Stripe webhook event.
 * @param {Buffer} rawBody  - Raw request body buffer
 * @param {string} signature - Value of the 'stripe-signature' header
 * @returns {object} Stripe event
 */
const constructWebhookEvent = (rawBody, signature) => {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};

module.exports = { createPaymentIntent, constructWebhookEvent };
