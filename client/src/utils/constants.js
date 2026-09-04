// src/utils/constants.js
// App-wide constants — avoids magic strings scattered throughout the codebase

export const APP_NAME = 'Mini Hakathon';

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
  // 404
  NOT_FOUND: '*',
};

export const TOKEN_KEY = 'token';
