const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').notEmpty().withMessage('Password is required'),
  body('phone').optional(),
], validate, register);

router.post('/login', [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, login);

module.exports = router;
