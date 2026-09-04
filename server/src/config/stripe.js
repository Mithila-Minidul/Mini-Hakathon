// src/config/stripe.js
// Initialises and exports the Stripe client
// Guards against missing key so the server still starts even when Stripe is not configured.

const Stripe = require('stripe');

let stripe = null;

if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_xxx')) {
  console.warn(
    '⚠️  STRIPE_SECRET_KEY is missing or is a placeholder. ' +
    'Payment endpoints will return 503 until a real key is provided.'
  );
} else {
  try {
    stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  } catch (err) {
    console.error('❌ Failed to initialise Stripe:', err.message);
  }
}

module.exports = stripe;
