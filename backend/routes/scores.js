const express = require('express');
const Score = require('../models/Score'); // Our Score blueprint
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route 1: Get the user's saved scores
// Notice we put 'protect' in the middle. The bouncer checks their wristband first!
router.get('/', protect, async (req, res) => {
  try {
    // Find all scores belonging to this user, sorted from newest to oldest
    const scores = await Score.find({ userId: req.user.id }).sort({ datePlayed: -1 });
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scores.' });
  }
});

// Route 2: Add a new score
router.post('/', protect, async (req, res) => {
  try {
    const { scoreValue, datePlayed } = req.body;

    // 1. Make sure the score is between 1 and 45
    if (scoreValue < 1 || scoreValue > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45.' });
    }

    // 2. Save the new score
    const newScore = new Score({
      userId: req.user.id,
      scoreValue: scoreValue,
      datePlayed: datePlayed
    });
    await newScore.save();

    // 3. THE 5-SCORE RULE: Find all their scores
    const allScores = await Score.find({ userId: req.user.id }).sort({ datePlayed: -1 });
    
    // If they have more than 5 scores, delete the oldest ones
    if (allScores.length > 5) {
      // Get everything after the first 5
      const extraScores = allScores.slice(5); 
      for (let i = 0; i < extraScores.length; i++) {
        await Score.findByIdAndDelete(extraScores[i]._id);
      }
    }

    res.status(201).json({ message: 'Score added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving score.' });
  }
});

module.exports = router;