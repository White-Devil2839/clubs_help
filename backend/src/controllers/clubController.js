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
    const club = await prisma.club.findUnique({ where: { id: Number(req.params.id) }, include: { members: true } });
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch club', error: error.message });
  }
};

// Create club (approved: false)
const createClub = async (req, res) => {
  const { name, description } = req.body;
  try {
    const club = await prisma.club.create({
      data: { name, description, approved: false, createdById: req.user.id },
    });
    res.status(201).json(club);
  } catch (error) {
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

module.exports = {
  getAllClubs,
  getClubById,
  createClub,
  enrollInClub,
};
