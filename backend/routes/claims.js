const User = require('../models/User');
const express = require('express');
const Claim = require('../models/Claim');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// USER ROUTE: Submit a new claim with screenshot proof
router.post('/submit', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id);
    
    const newClaim = new Claim({
      userId: user._id,
      userName: user.name,
      proofImage: req.body.proofImage
    });
    
    await newClaim.save();
    res.status(201).json({ message: 'Claim submitted successfully! Awaiting Admin review.' });
  } catch (error) {
    console.error('CRITICAL CLAIM ERROR:', error);
    res.status(500).json({ message: 'Error submitting claim.', details: error.message });
  }
});

// ADMIN ROUTE: Get all claims
router.get('/all', protect, admin, async (req, res) => {
  try {
    const claims = await Claim.find({}).sort({ createdAt: -1 });
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching claims.' });
  }
});

// ADMIN ROUTE: Update claim status (Approve/Reject & Payout)
router.put('/:id/update', protect, admin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const claim = await Claim.findByIdAndUpdate(
      req.params.id, 
      { status, paymentStatus }, 
      { new: true }
    );
    res.status(200).json({ message: 'Claim updated successfully!', claim });
  } catch (error) {
    res.status(500).json({ message: 'Error updating claim.' });
  }
});

module.exports = router;