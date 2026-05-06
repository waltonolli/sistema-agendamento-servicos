const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/authController');
const { loginLimiter, registerLimiter } = require('../Middleware/rateLimitMiddleware');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);

module.exports = router;
