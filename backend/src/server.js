const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { PrismaClient } = require('@prisma/client');
const { startEventCleanup } = require('./utils/eventCleanup');

const prisma = new PrismaClient();
const app = express();

// CORS configuration - allow all in dev, specific origin in production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/me', require('./routes/userRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  const interval = Number(process.env.EVENT_CLEANUP_INTERVAL_MINUTES);
  startEventCleanup(interval);
});
