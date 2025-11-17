const express = require('express');
const router = express.Router();
const { getAllEvents, getEventById, registerEvent, deleteEvent, getEventRegistrations } = require('../controllers/eventController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/:id/registrations', authMiddleware, isAdmin, getEventRegistrations);
router.post('/:id/register', authMiddleware, registerEvent);
router.delete('/:id', authMiddleware, isAdmin, deleteEvent);

module.exports = router;
