// src/controllers/authController.js
// Thin controller — delegates all business logic to authService

const { registerUser, loginUser } = require('../services/authService');
const { validationResult } = require('express-validator');

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { user, token } = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: { id: user._id, name: user.name, email: user.email }, token },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { user, token } = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: { id: user._id, name: user.name, email: user.email }, token },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me  (protected)
 */
const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
};

module.exports = { register, login, getMe };
