const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const { registerSchema, loginSchema, validate } = require('../validators/schemas');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', isAuthenticated, getMe);

module.exports = router;
