const express = require('express');
const Charity = require('../models/Charity');
const User = require('../models/User'); // We need this to save the user's choice!
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// -----------------------------------------
// PUBLIC & USER ROUTES
// -----------------------------------------

// 1. Get All Charities (Used by both User and Admin dashboards to populate lists)
router.get('/', async (req, res) => {
  try {
    const charities = await Charity.find().sort({ name: 1 });
    res.status(200).json(charities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching charities.' });
  }
});

// 2. Save User's Charity Choice (Used by the User Dashboard)
router.put('/select', protect, async (req, res) => {
  try {
    const { charityId, percentage } = req.body;

    // The PRD says the minimum contribution is 10%
    if (percentage < 10) {
      return res.status(400).json({ message: 'Contribution must be at least 10%.' });
    }

    // Find the logged-in user and update their profile
    // Note: We use req.user._id to prevent MongoDB cast errors
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { selectedCharityId: charityId, charityPercentage: percentage },
      { new: true } 
    );

    res.status(200).json({ message: 'Charity preferences saved!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error saving charity preferences.' });
  }
});


// -----------------------------------------
// ADMIN ROUTES
// -----------------------------------------

// 3. Add a new charity (Used by Admin Dashboard)
router.post('/add', protect, admin, async (req, res) => {
  try {
    const newCharity = new Charity({ name: req.body.name });
    await newCharity.save();
    res.status(201).json({ message: 'Charity added successfully!', charity: newCharity });
  } catch (error) {
    res.status(400).json({ message: 'Error adding charity. It might already exist.' });
  }
});

// 4. Delete a charity (Used by Admin Dashboard)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Charity.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Charity removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting charity.' });
  }
});

module.exports = router;