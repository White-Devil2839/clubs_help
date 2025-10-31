const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get current user's club memberships
const getMyMemberships = async (req, res) => {
  try {
    const items = await prisma.clubMembership.findMany({
      where: { userId: req.user.id },
      include: { club: { select: { id: true, name: true, approved: true } } },
      orderBy: { id: 'desc' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load memberships', error: error.message });
  }
};

// Get current user's event registrations
const getMyEventRegistrations = async (req, res) => {
  try {
    const items = await prisma.eventRegistration.findMany({
      where: { userId: req.user.id },
      include: { event: { select: { id: true, title: true, description: true, date: true, clubId: true } } },
      orderBy: { id: 'desc' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load event registrations', error: error.message });
  }
};

module.exports = { getMyMemberships, getMyEventRegistrations };
