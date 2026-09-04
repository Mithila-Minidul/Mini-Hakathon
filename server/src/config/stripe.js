// src/config/stripe.js
// Initialises and exports the Stripe client

const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10', // pin to a stable version
});

module.exports = stripe;
