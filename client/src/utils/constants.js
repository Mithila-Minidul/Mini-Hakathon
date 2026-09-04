// src/utils/constants.js
// App-wide constants — avoids magic strings scattered throughout the codebase

export const APP_NAME = 'BookLedger';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  // Customer
  CUSTOMERS:       '/customers',
  CUSTOMER_NEW:    '/customers/new',
  CUSTOMER_DETAIL: '/customers/:id',
  CUSTOMER_EDIT:   '/customers/:id/edit',
  // Books (public discovery)
  BOOKS:       '/books',
  BOOK_DETAIL: '/books/:id',
  // Admin — Books CRUD
  ADMIN_BOOKS:       '/admin/books',
  ADMIN_BOOK_NEW:    '/admin/books/new',
  ADMIN_BOOK_DETAIL: '/admin/books/:id',
  ADMIN_BOOK_EDIT:   '/admin/books/:id/edit',
  // 404
  NOT_FOUND: '*',
};

export const TOKEN_KEY = 'token';

export const BOOK_CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Science', 'Technology',
  'History', 'Biography', 'Self-Help', 'Children',
  'Mystery', 'Romance', 'Fantasy', 'Horror',
  'Business', 'Art', 'Travel', 'Other',
];
