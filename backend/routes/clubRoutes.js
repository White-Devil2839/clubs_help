const express = require('express');
const router = express.Router({ mergeParams: true });
const { getClubs, getClubById, joinClub, getClubMembers, getClubEvents } = require('../controllers/clubController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getClubs);
router.get('/:clubId', getClubById);
router.get('/:clubId/members', getClubMembers);
router.get('/:clubId/events', getClubEvents);
router.post('/:clubId/join', protect, joinClub);

module.exports = router;
