// src/middleware/errorMiddleware.js
// Global error handler — must be registered LAST in app.js
//
// Normalises Mongoose-specific error types before falling through to the
// generic 500 handler so callers always receive a clean, consistent response.

// ─── Mongoose error normalisers ───────────────────────────────────────────────

/**
 * Mongoose ValidationError  →  400
 * Collects every failed field into a readable message string.
 */
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  const error = new Error(messages.join('. '));
  error.statusCode = 400;
  return error;
};

/**
 * Mongoose CastError (bad ObjectId format)  →  400
 */
const handleCastError = (err) => {
  const error = new Error(`Invalid value "${err.value}" for field "${err.path}"`);
  error.statusCode = 400;
  return error;
};

/**
 * MongoDB duplicate-key error (code 11000)  →  409
 * Extracts the duplicate field name from the error's keyValue map.
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue ? err.keyValue[field] : '';
  const error = new Error(
    `Duplicate value: a record with ${field} "${value}" already exists`
  );
  error.statusCode = 409;
  return error;
};

// ─── Main error handler ───────────────────────────────────────────────────────

const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Log stack trace in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❗ Error:', err.stack);
  }

  // Normalise Mongoose-specific errors
  let normalised = err;

  if (err.name === 'ValidationError')      normalised = handleValidationError(err);
  if (err.name === 'CastError')            normalised = handleCastError(err);
  if (err.code === 11000)                  normalised = handleDuplicateKeyError(err);
  if (err.name === 'JsonWebTokenError')    { normalised = new Error('Invalid token'); normalised.statusCode = 401; }
  if (err.name === 'TokenExpiredError')    { normalised = new Error('Token has expired'); normalised.statusCode = 401; }

  const statusCode = normalised.statusCode || 500;
  const message    = normalised.message    || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// ─── 404 handler — catches unmatched routes ───────────────────────────────────

const notFound = (req, res, next) => {
  const error = new Error(`Not found — ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };

