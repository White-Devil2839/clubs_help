const express = require('express');
const router = express.Router();
const { approveClubRequest, approveMemberRequest, rejectMemberRequest, createEvent, listUsers, promoteUser, listClubMemberships, listEventRegistrations } = require('../controllers/adminController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Approve club, member request, create event
router.patch('/club/:id/approve', authMiddleware, isAdmin, approveClubRequest);
router.patch('/member/:id/approve', authMiddleware, isAdmin, approveMemberRequest);
router.patch('/member/:id/reject', authMiddleware, isAdmin, rejectMemberRequest);
router.post('/event', authMiddleware, isAdmin, createEvent);

// Users admin actions
router.get('/users', authMiddleware, isAdmin, listUsers);
router.patch('/users/:id/promote', authMiddleware, isAdmin, promoteUser);

// Memberships and event registrations
router.get('/memberships', authMiddleware, isAdmin, listClubMemberships);
router.get('/event-registrations', authMiddleware, isAdmin, listEventRegistrations);

module.exports = router;
