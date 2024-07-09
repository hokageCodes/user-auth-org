const express = require('express');
const AuthController = require('../controllers/authController');
const { userValidationRules, validate } = require('../validators/userValidator');

const router = express.Router();

router.post('/register', userValidationRules(), validate, AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;