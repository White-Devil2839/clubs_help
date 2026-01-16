const express = require('express');
const router = express.Router({ mergeParams: true });
const { loginUser, registerUser } = require('../controllers/authController');
const institutionMiddleware = require('../middleware/institutionMiddleware');

// These routes are mounted at /api/:institutionCode/auth
// The institutionMiddleware is already applied at the parent level in server.js
router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;
