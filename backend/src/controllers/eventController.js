const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({ include: { registrations: true } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get events', error: error.message });
  }
};

// Register user for event
const registerEvent = async (req, res) => {
  const eventId = Number(req.params.id || req.body.eventId);
  try {
    // Check for duplicate registration
    const exists = await prisma.eventRegistration.findFirst({ where: { userId: req.user.id, eventId } });
    if (exists) return res.status(409).json({ message: 'Already registered' });
    const registration = await prisma.eventRegistration.create({
      data: { userId: req.user.id, eventId }
    });
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Could not register for event', error: error.message });
  }
};

module.exports = {
  getAllEvents,
  registerEvent,
};
