const express = require('express');
const router = express.Router();
const { getAllClubs, getClubById, createClub, enrollInClub, deleteClub, getClubMembers } = require('../controllers/clubController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAllClubs);
router.get('/:id', getClubById);
router.get('/:id/members', authMiddleware, isAdmin, getClubMembers);
router.post('/', authMiddleware, isAdmin, createClub);
router.post('/:id/enroll', authMiddleware, enrollInClub);
router.delete('/:id', authMiddleware, isAdmin, deleteClub);

module.exports = router;
