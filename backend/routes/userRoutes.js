const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const { getMyMemberships } = require('../controllers/clubController');
const { getMyRegistrations } = require('../controllers/eventController');

router.use(protect);

router.get('/memberships', getMyMemberships);
router.get('/event-registrations', getMyRegistrations);

module.exports = router;
