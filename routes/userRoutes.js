const express = require('express');
const UserController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:id', authenticate, UserController.getUserById);

module.exports = router;