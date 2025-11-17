const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('../utils/emailService');
const {
  membershipApprovedEmail,
  membershipRejectedEmail,
  newEventNotificationEmail,
} = require('../utils/emailTemplates');
const prisma = new PrismaClient();

// Approve club request
const approveClubRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.club.update({ where: { id }, data: { approved: true } });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve club', error: error.message });
  }
};

// Approve member request
const approveMemberRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    // Check if membership exists
    const membership = await prisma.clubMembership.findUnique({ where: { id } });
    if (!membership) {
      return res.status(404).json({ message: 'Membership request not found' });
    }
    
    const updated = await prisma.clubMembership.update({ 
      where: { id }, 
      data: { status: 'APPROVED' },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        club: { select: { id: true, name: true } }
      }
    });
    if (updated?.user?.email) {
      sendEmail({
        to: updated.user.email,
        subject: `Membership Approved - ${updated.club?.name || 'Club'}`,
        html: membershipApprovedEmail(updated.user.name || 'Member', updated.club?.name || 'the club'),
      });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error approving member request:', error);
    res.status(500).json({ message: 'Failed to approve member', error: error.message });
  }
};

// Reject member request
const rejectMemberRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    // Check if membership exists
    const membership = await prisma.clubMembership.findUnique({ where: { id } });
    if (!membership) {
      return res.status(404).json({ message: 'Membership request not found' });
    }
    
    const updated = await prisma.clubMembership.update({ 
      where: { id }, 
      data: { status: 'REJECTED' },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        club: { select: { id: true, name: true } }
      }
    });
    if (updated?.user?.email) {
      sendEmail({
        to: updated.user.email,
        subject: `Membership Update - ${updated.club?.name || 'Club'}`,
        html: membershipRejectedEmail(updated.user.name || 'Member', updated.club?.name || 'the club'),
      });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error rejecting member request:', error);
    res.status(500).json({ message: 'Failed to reject member', error: error.message });
  }
};

// Create new event (uses Event.title per schema)
const createEvent = async (req, res) => {
  const { description, date, clubId, type } = req.body;
  const title = req.body.title || req.body.name; // support either field from clients
  
  // Validation
  if (!title) {
    return res.status(400).json({ message: 'Event title/name is required' });
  }
  if (!description) {
    return res.status(400).json({ message: 'Event description is required' });
  }
  if (!date) {
    return res.status(400).json({ message: 'Event date is required' });
  }
  
  try {
    // Validate and parse date
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Handle clubId - convert to number or null
    let parsedClubId = null;
    if (clubId !== undefined && clubId !== null && clubId !== '') {
      parsedClubId = Number(clubId);
      if (isNaN(parsedClubId)) {
        return res.status(400).json({ message: 'Invalid clubId format' });
      }
      // Verify club exists
      const club = await prisma.club.findUnique({ where: { id: parsedClubId } });
      if (!club) {
        return res.status(400).json({ message: `Club with ID ${parsedClubId} does not exist` });
      }
    }
    
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: eventDate,
        clubId: parsedClubId,
        type: type || 'CLUB',
      },
    });
    if (parsedClubId) {
      const approvedMembers = await prisma.clubMembership.findMany({
        where: { clubId: parsedClubId, status: 'APPROVED' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          club: { select: { name: true } },
        },
      });

      const clubName = approvedMembers[0]?.club?.name || 'your club';
      const emailPromises = approvedMembers
        .filter((member) => member.user?.email)
        .map((member) =>
          sendEmail({
            to: member.user.email,
            subject: `New Event: ${title}`,
            html: newEventNotificationEmail(
              member.user.name || 'Member',
              title,
              event.date,
              description,
              clubName,
            ),
          })
        );

      if (emailPromises.length > 0) {
        Promise.allSettled(emailPromises);
      }
    }
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// List users (admin-only)
const listUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to list users', error: error.message });
  }
};

// Promote a user to ADMIN (admin-only)
const promoteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.update({ where: { id }, data: { role: 'ADMIN' }, select: { id: true, name: true, email: true, role: true } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to promote user', error: error.message });
  }
};

// List all club memberships with user and club
const listClubMemberships = async (_req, res) => {
  try {
    const memberships = await prisma.clubMembership.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, club: { select: { id: true, name: true } } },
      orderBy: { id: 'desc' },
    });
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: 'Failed to list memberships', error: error.message });
  }
};

// List all event registrations with user and event
const listEventRegistrations = async (_req, res) => {
  try {
    const regs = await prisma.eventRegistration.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, event: { select: { id: true, title: true, date: true } } },
      orderBy: { id: 'desc' },
    });
    res.json(regs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to list event registrations', error: error.message });
  }
};

module.exports = {
  approveClubRequest,
  approveMemberRequest,
  rejectMemberRequest,
  createEvent,
  listUsers,
  promoteUser,
  listClubMemberships,
  listEventRegistrations,
};
