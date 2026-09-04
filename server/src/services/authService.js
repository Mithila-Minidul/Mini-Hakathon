// src/services/authService.js
// Reusable business logic for authentication
// Controllers call these functions — no res/req objects here.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Register a new user.
 * @param {object} data - { name, email, password }
 * @returns {object} - { user, token }
 */
const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return { user, token };
};

/**
 * Log in an existing user.
 * @param {object} data - { email, password }
 * @returns {object} - { user, token }
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);
  return { user, token };
};

/**
 * Generate a signed JWT.
 * @param {string} userId
 * @returns {string} token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = { registerUser, loginUser, generateToken };
