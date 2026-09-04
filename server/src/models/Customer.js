// src/models/Customer.js
// Mongoose schema & model for Customer

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^\+?[1-9]\d{6,14}$/,
        'Please provide a valid phone number (7–15 digits, optional leading +)',
      ],
    },

    address: {
      street: {
        type: String,
        trim: true,
        default: '',
      },
      city: {
        type: String,
        trim: true,
        default: '',
      },
      state: {
        type: String,
        trim: true,
        default: '',
      },
      postalCode: {
        type: String,
        trim: true,
        default: '',
      },
      country: {
        type: String,
        trim: true,
        default: '',
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Note: email already has a unique index from { unique: true } in the field definition.
// Only add indexes for fields that don't already have one.
customerSchema.index({ name: 'text' }); // full-text search on name
customerSchema.index({ phone: 1 });     // fast lookup by phone

module.exports = mongoose.model('Customer', customerSchema);
