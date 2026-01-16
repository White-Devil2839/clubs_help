const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');

// @desc    Get all events for the institution
// @route   GET /api/:institutionCode/events
// @access  Public
const getEvents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const events = await Event.find({ institutionId: req.institutionId })
            .sort({ date: 1 })
            .skip(skip)
            .limit(limit);

        const eventsWithCounts = await Promise.all(events.map(async (event) => {
            const count = await EventRegistration.countDocuments({ eventId: event._id });
            return {
                ...event.toObject(),
                registrationCount: count,
                spotsLeft: event.capacity ? event.capacity - count : null
            };
        }));

        const total = await Event.countDocuments({ institutionId: req.institutionId });

        res.json({
            events: eventsWithCounts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalEvents: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single event details
// @route   GET /api/:institutionCode/events/:eventId
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId).populate('clubId', 'name');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.institutionId.toString() !== req.institutionId.toString()) {
            return res.status(404).json({ message: 'Event not found in this institution' });
        }

        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register for an event
// @route   POST /api/:institutionCode/events/:eventId/register
// @access  Member
const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.institutionId.toString() !== req.institutionId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const existingRegistration = await EventRegistration.findOne({
            userId: req.user._id,
            eventId: req.params.eventId,
        });

        if (existingRegistration) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        // Check Capacity
        const registrationCount = await EventRegistration.countDocuments({ eventId: req.params.eventId });
        if (event.capacity && registrationCount >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        // Check for User Schedule Overlap
        // Find all events the user is registered for
        const userRegistrations = await EventRegistration.find({ userId: req.user._id }).populate('eventId');

        const hasOverlap = userRegistrations.some(reg => {
            const registeredEvent = reg.eventId;
            if (!registeredEvent) return false; // Handle deleted events

            // Check overlap logic
            const newStart = new Date(event.date);
            const newEnd = new Date(event.endTime);
            const existingStart = new Date(registeredEvent.date);
            const existingEnd = new Date(registeredEvent.endTime);

            return (newStart < existingEnd && newEnd > existingStart);
        });

        if (hasOverlap) {
            return res.status(400).json({ message: 'You have another event scheduled at this time' });
        }

        const registration = await EventRegistration.create({
            userId: req.user._id,
            eventId: req.params.eventId,
            institutionId: req.institutionId,
        });

        res.status(201).json(registration);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my event registrations
// @route   GET /api/:institutionCode/me/event-registrations
// @access  Member
const getMyRegistrations = async (req, res) => {
    try {
        const registrations = await EventRegistration.find({
            userId: req.user._id,
            institutionId: req.institutionId,
        }).populate('eventId', 'title date type');

        res.json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getEvents,
    getEventById,
    registerForEvent,
    getMyRegistrations,
};
