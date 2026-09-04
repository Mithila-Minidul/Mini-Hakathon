// src/models/Book.js
// Mongoose schema for the Book collection

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [300, 'Title must be 300 characters or fewer'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [150, 'Author must be 150 characters or fewer'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Fiction',
          'Non-Fiction',
          'Science',
          'Technology',
          'History',
          'Biography',
          'Self-Help',
          'Children',
          'Mystery',
          'Romance',
          'Fantasy',
          'Horror',
          'Business',
          'Art',
          'Travel',
          'Other',
        ],
        message: '{VALUE} is not a supported category',
      },
    },
    description: {
      type: String,
      default: '',
      maxlength: [2000, 'Description must be 2000 characters or fewer'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than 0'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    coverImage: {
      type: String,
      default: '',
    },
    // Stored field — automatically set by pre-save hook based on stock
    available: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,         // adds createdAt & updatedAt
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

// ─── Pre-save hook: derive `available` from `stock` ──────────────────────────
bookSchema.pre('save', function (next) {
  this.available = this.stock > 0;
  next();
});

// ─── Pre-findOneAndUpdate hook: keep `available` in sync on updates ──────────
bookSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  // Handle both $set and top-level field updates
  const stockValue =
    update && update.$set && update.$set.stock !== undefined
      ? update.$set.stock
      : update && update.stock !== undefined
      ? update.stock
      : undefined;

  if (stockValue !== undefined) {
    if (update.$set) {
      update.$set.available = stockValue > 0;
    } else {
      update.available = stockValue > 0;
    }
  }
  next();
});

// ─── Indexes ─────────────────────────────────────────────────────────────────
bookSchema.index({ title: 'text', author: 'text' }); // full-text search
bookSchema.index({ category: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ available: 1 });

module.exports = mongoose.model('Book', bookSchema);
