const { PrismaClient } = require('@prisma/client');
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
    const updated = await prisma.clubMembership.update({ where: { id }, data: { status: 'APPROVED' } });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve member', error: error.message });
  }
};

// Create new event (uses Event.title per schema)
const createEvent = async (req, res) => {
  const { description, date, clubId, type } = req.body;
  const title = req.body.title || req.body.name; // support either field from clients
  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        clubId: clubId !== undefined && clubId !== null && clubId !== '' ? Number(clubId) : null,
        type: type || undefined,
      },
    });
    res.status(201).json(event);
  } catch (error) {
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
  createEvent,
  listUsers,
  promoteUser,
  listClubMemberships,
  listEventRegistrations,
};
