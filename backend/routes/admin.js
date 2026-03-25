const express = require('express');
const User = require('../models/User');
const Draw = require('../models/Draw');
const Charity = require('../models/Charity');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Get all users (You already had this!)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// 2. NEW: Get Platform Analytics
router.get('/stats', protect, admin, async (req, res) => {
  try {
    // Count documents in the database
    const totalUsers = await User.countDocuments();
    const activeSubscribers = await User.countDocuments({ isSubscribed: true });
    const totalCharities = await Charity.countDocuments();

    // Calculate total prize money generated across all historical draws
    const draws = await Draw.find();
    const totalPrizePool = draws.reduce((sum, draw) => sum + draw.totalPrizePool, 0);

    // Send it all back as one object
    res.status(200).json({
      totalUsers,
      activeSubscribers,
      totalCharities,
      totalPrizePool
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching platform stats.' });
  }
});

module.exports = router;