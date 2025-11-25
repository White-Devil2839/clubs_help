const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('../utils/emailService');
const { eventRegistrationConfirmationEmail } = require('../utils/emailTemplates');
const prisma = new PrismaClient();

// Get all events
const getAllEvents = async (_req, res) => {
  try {
    const now = new Date();
    const events = await prisma.event.findMany({
      where: { date: { gte: now } },
      include: { registrations: true },
      orderBy: { date: 'asc' },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get events', error: error.message });
  }
};

// Get single event by ID
const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ 
      where: { id: Number(req.params.id) },
      include: { 
        registrations: { 
          include: { user: { select: { id: true, name: true, email: true } } }
        },
        club: { select: { id: true, name: true } }
      }
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
};

// Get all registrations for a specific event (admin only)
const getEventRegistrations = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    
    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true, date: true } }
      },
      orderBy: { registeredAt: 'desc' },
    });
    
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({ message: 'Failed to fetch event registrations', error: error.message });
  }
};

// Register user for event
const registerEvent = async (req, res) => {
  const eventId = Number(req.params.id || req.body.eventId);
  if (Number.isNaN(eventId)) {
    return res.status(400).json({ message: 'Invalid event id' });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true, date: true },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (new Date(event.date) <= new Date()) {
      return res.status(400).json({ message: 'This event has already concluded.' });
    }

    const exists = await prisma.eventRegistration.findFirst({ where: { userId: req.user.id, eventId } });
    if (exists) return res.status(409).json({ message: 'Already registered' });

    const registration = await prisma.eventRegistration.create({
      data: { userId: req.user.id, eventId },
    });

    Promise.allSettled([
      (async () => {
        const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { name: true, email: true } });
        if (user?.email) {
          await sendEmail({
            to: user.email,
            subject: `Registration Confirmed - ${event.title}`,
            html: eventRegistrationConfirmationEmail(
              user.name || 'Member',
              event.title,
              event.date,
            ),
          });
        }
      })(),
    ]);

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Could not register for event', error: error.message });
  }
};

// Delete event (admin only)
const deleteEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    
    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Delete related records first (event registrations)
    await prisma.eventRegistration.deleteMany({ where: { eventId } });
    
    // Delete the event
    await prisma.event.delete({ where: { id: eventId } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  registerEvent,
  deleteEvent,
  getEventRegistrations,
};
