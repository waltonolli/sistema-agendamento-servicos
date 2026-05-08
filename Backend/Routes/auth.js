const express = require('express');
const router = express.Router();
const { register, login, getProviders } = require('../Controllers/authController');
const { loginLimiter, registerLimiter } = require('../Middleware/rateLimitMiddleware');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/providers', getProviders);

module.exports = router;
