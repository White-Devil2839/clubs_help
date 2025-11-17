const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all approved clubs
const getAllClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({ where: { approved: true } });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get clubs', error: error.message });
  }
};

// Get single club by ID
const getClubById = async (req, res) => {
  try {
    const club = await prisma.club.findUnique({ 
      where: { id: Number(req.params.id) }, 
      include: { memberships: { include: { user: { select: { id: true, name: true, email: true } } } } } 
    });
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch club', error: error.message });
  }
};

// Get all members of a specific club (admin only)
const getClubMembers = async (req, res) => {
  try {
    const clubId = Number(req.params.id);
    
    // Check if club exists
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    
    const memberships = await prisma.clubMembership.findMany({
      where: { clubId },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        club: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(memberships);
  } catch (error) {
    console.error('Error fetching club members:', error);
    res.status(500).json({ message: 'Failed to fetch club members', error: error.message });
  }
};

// Create club (approved: true for admins)
const createClub = async (req, res) => {
  const { name, description, category } = req.body;
  
  // Validation
  if (!name) {
    return res.status(400).json({ message: 'Club name is required' });
  }
  if (!description) {
    return res.status(400).json({ message: 'Club description is required' });
  }
  if (!category) {
    return res.status(400).json({ message: 'Club category is required' });
  }
  
  // Validate category enum
  const validCategories = ['TECH', 'NON_TECH', 'EXTRACURRICULAR'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
  }
  
  try {
    // Since this endpoint requires admin access, automatically approve the club
    const club = await prisma.club.create({
      data: { 
        name, 
        description, 
        category,
        approved: true, // Auto-approve for admins
        active: true,
      },
    });
    res.status(201).json(club);
  } catch (error) {
    console.error('Error creating club:', error);
    res.status(500).json({ message: 'Failed to create club', error: error.message });
  }
};

// Enroll (request to join club: status=PENDING)
const enrollInClub = async (req, res) => {
  try {
    const clubId = Number(req.params.id || req.body.clubId);
    // Only allow one pending/approved membership per user/club
    const exists = await prisma.clubMembership.findFirst({ where: { userId: req.user.id, clubId, status: { in: ['PENDING','APPROVED'] } } });
    if (exists) return res.status(409).json({ message: 'Already requested or member' });
    const membership = await prisma.clubMembership.create({
      data: { userId: req.user.id, clubId, status: 'PENDING' }
    });
    res.status(201).json(membership);
  } catch (error) {
    res.status(500).json({ message: 'Could not enroll in club', error: error.message });
  }
};

// Delete club (admin only)
const deleteClub = async (req, res) => {
  try {
    const clubId = Number(req.params.id);
    
    // Check if club exists
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    
    // Get all events for this club first
    const clubEvents = await prisma.event.findMany({ where: { clubId }, select: { id: true } });
    const eventIds = clubEvents.map(e => e.id);
    
    // Delete related records first
    // Delete event registrations for club's events
    if (eventIds.length > 0) {
      await prisma.eventRegistration.deleteMany({ where: { eventId: { in: eventIds } } });
    }
    // Delete club memberships
    await prisma.clubMembership.deleteMany({ where: { clubId } });
    // Delete club events
    await prisma.event.deleteMany({ where: { clubId } });
    
    // Delete the club
    await prisma.club.delete({ where: { id: clubId } });
    res.json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error('Error deleting club:', error);
    res.status(500).json({ message: 'Failed to delete club', error: error.message });
  }
};

module.exports = {
  getAllClubs,
  getClubById,
  createClub,
  enrollInClub,
  deleteClub,
  getClubMembers,
};
