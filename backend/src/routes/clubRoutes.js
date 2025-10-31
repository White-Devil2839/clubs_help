const express = require('express');
const router = express.Router();
const { getAllClubs, getClubById, createClub, enrollInClub } = require('../controllers/clubController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAllClubs);
router.get('/:id', getClubById);
router.post('/', authMiddleware, isAdmin, createClub);
router.post('/:id/enroll', authMiddleware, enrollInClub);

module.exports = router;
