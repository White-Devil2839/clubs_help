const express = require('express');
const router = express.Router({ mergeParams: true });
const { loginUser, registerUser } = require('../controllers/authController');
const { registerInstitution } = require('../controllers/authController');

// Global Routes (no institution context needed)
router.post('/institutions/register', registerInstitution);
router.post('/auth/login', require('../controllers/authController').globalLogin);
router.get('/test-email', require('../controllers/authController').testEmail);

router.post('/auth/refresh', require('../controllers/authController').refreshToken);
router.post('/auth/logout', require('../controllers/authController').logout);

// Password Reset Flow
router.post('/auth/request-reset', require('../controllers/authController').requestReset);
router.get('/auth/validate-reset', require('../controllers/authController').validateReset);
router.post('/auth/reset-password', require('../controllers/authController').resetPassword);

// Protected Auth Routes
const { protect } = require('../middleware/authMiddleware');
router.put('/auth/password', protect, require('../controllers/authController').changePassword);

module.exports = router;

