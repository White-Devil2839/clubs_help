const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('../utils/emailService');
const { eventRegistrationConfirmationEmail } = require('../utils/emailTemplates');
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
  try {
    // Check for duplicate registration
    const exists = await prisma.eventRegistration.findFirst({ where: { userId: req.user.id, eventId } });
    if (exists) return res.status(409).json({ message: 'Already registered' });
    const registration = await prisma.eventRegistration.create({
      data: { userId: req.user.id, eventId }
    });

    Promise.allSettled([
      (async () => {
        const [event, user] = await Promise.all([
          prisma.event.findUnique({ where: { id: eventId }, select: { title: true, date: true } }),
          prisma.user.findUnique({ where: { id: req.user.id }, select: { name: true, email: true } }),
        ]);
        if (event && user?.email) {
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
