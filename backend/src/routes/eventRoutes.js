const express = require('express');
const router = express.Router();
const { getAllEvents, registerEvent } = require('../controllers/eventController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', getAllEvents);
router.post('/:id/register', authMiddleware, registerEvent);

module.exports = router;
