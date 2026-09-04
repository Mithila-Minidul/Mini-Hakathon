// src/controllers/paymentController.js
// Thin controller — delegates all Stripe logic to paymentService

const { createPaymentIntent, constructWebhookEvent } = require('../services/paymentService');

/**
 * POST /api/payments/create-intent
 */
const createIntent = async (req, res, next) => {
  try {
    const { amount, currency, metadata } = req.body;
    const paymentIntent = await createPaymentIntent(amount, currency, metadata);

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/payments/webhook
 * Note: Express must receive the raw body for Stripe signature verification.
 */
const stripeWebhook = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  try {
    const event = constructWebhookEvent(req.body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('💰 PaymentIntent succeeded:', event.data.object.id);
        // TODO: Update order status in DB
        break;
      case 'payment_intent.payment_failed':
        console.warn('❌ PaymentIntent failed:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = { createIntent, stripeWebhook };
