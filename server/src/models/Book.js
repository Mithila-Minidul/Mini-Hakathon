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
      min: [0, 'Price cannot be negative'],
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
    isbn: {
      type: String,
      default: '',
      trim: true,
    },
    publisher: {
      type: String,
      default: '',
      trim: true,
    },
    publishedYear: {
      type: Number,
      min: [100, 'Invalid year'],
      max: [new Date().getFullYear() + 1, 'Published year cannot be in the future'],
    },
    language: {
      type: String,
      default: 'English',
      trim: true,
    },
    pages: {
      type: Number,
      min: [1, 'Pages must be at least 1'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: availability ─────────────────────────────────────────────────
bookSchema.virtual('available').get(function () {
  return this.stock > 0;
});

// ─── Indexes ───────────────────────────────────────────────────────────────
bookSchema.index({ title: 'text', author: 'text' }); // full-text search
bookSchema.index({ category: 1 });
bookSchema.index({ price: 1 });

module.exports = mongoose.model('Book', bookSchema);
