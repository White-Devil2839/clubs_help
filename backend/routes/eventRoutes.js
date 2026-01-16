const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const {
    getEvents,
    getEventById,
    registerForEvent,
    getMyRegistrations,
} = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/:eventId', getEventById);

// Protected routes
router.post('/:eventId/register', protect, registerForEvent);

module.exports = router;
