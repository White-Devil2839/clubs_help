const express = require('express');
const router = express.Router();
const { getMyMemberships, getMyEventRegistrations } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/memberships', authMiddleware, getMyMemberships);
router.get('/event-registrations', authMiddleware, getMyEventRegistrations);

module.exports = router;
