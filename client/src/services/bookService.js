// src/services/bookService.js
// Frontend API wrappers for the Book Discovery module

import { get } from './api';

const BASE = '/books';

/**
 * GET /api/books?search=&author=&category=&available=&page=&limit=
 */
export const fetchBooks = ({
  search = '',
  author = '',
  category = '',
  available = '',
  sortBy = 'createdAt',
  order = 'desc',
  page = 1,
  limit = 12,
} = {}) => {
  const params = new URLSearchParams();
  if (search)    params.set('search',    search);
  if (author)    params.set('author',    author);
  if (category)  params.set('category',  category);
  if (available !== '') params.set('available', available);
  params.set('sortBy', sortBy);
  params.set('order',  order);
  params.set('page',   String(page));
  params.set('limit',  String(limit));
  return get(`${BASE}?${params.toString()}`);
};

/**
 * GET /api/books/categories
 */
export const fetchCategories = () => get(`${BASE}/categories`);

/**
 * GET /api/books/:id
 */
export const fetchBookById = (id) => get(`${BASE}/${id}`);
