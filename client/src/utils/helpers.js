// src/utils/helpers.js
// General-purpose utility functions

/**
 * Format a number as a currency string.
 * @param {number} amount  - Value in smallest unit (cents)
 * @param {string} currency - ISO currency code (default: 'USD')
 */
export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);

/**
 * Truncate a string to a max length and append '…'
 */
export const truncate = (str, maxLength = 100) =>
  str?.length > maxLength ? `${str.slice(0, maxLength)}…` : str;

/**
 * Capitalise the first letter of a string.
 */
export const capitalise = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/**
 * Debounce a function.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
