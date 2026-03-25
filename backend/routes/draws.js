// const express = require('express');
// const Draw = require('../models/Draw');
// const User = require('../models/User');
// const Score = require('../models/Score');
// const { protect, admin } = require('../middleware/authMiddleware');

// const router = express.Router();

// // The "Simulate Draw" Route (Only Admins can run this!)
// router.post('/simulate', protect, admin, async (req, res) => {
//   try {
//     // 1. Generate 5 random winning numbers between 1 and 45
//     const winningNumbers = [];
//     while (winningNumbers.length < 5) {
//       const randomNum = Math.floor(Math.random() * 45) + 1;
//       // Make sure we don't pick the same number twice!
//       if (!winningNumbers.includes(randomNum)) {
//         winningNumbers.push(randomNum);
//       }
//     }

//     // 2. Calculate the Total Prize Pool
//     // Since we haven't built Stripe yet, let's pretend every user puts $10 into the pool
//     const users = await User.find({});
//     const totalPrizePool = users.length * 10; 

//     // Calculate the splits based on the PRD rules
//     const pool5Match = totalPrizePool * 0.40; // 40%
//     const pool4Match = totalPrizePool * 0.35; // 35%
//     const pool3Match = totalPrizePool * 0.25; // 25%

//     // 3. Find the Winners!
//     const winners = { match5: [], match4: [], match3: [] };

//     // Loop through every single user on the platform
//     for (let i = 0; i < users.length; i++) {
//       const user = users[i];
      
//       // Get this user's latest 5 scores
//       const userScores = await Score.find({ userId: user._id }).sort({ datePlayed: -1 }).limit(5);
      
//       // Extract just the numbers from their score files
//       const userNumbers = userScores.map(score => score.scoreValue);

//       // Check how many of their numbers match the winning numbers
//       let matchCount = 0;
//       userNumbers.forEach(num => {
//         if (winningNumbers.includes(num)) {
//           matchCount++;
//         }
//       });

//       // Sort them into the winner categories!
//       if (matchCount === 5) winners.match5.push(user.name);
//       if (matchCount === 4) winners.match4.push(user.name);
//       if (matchCount === 3) winners.match3.push(user.name);
//     }

//     // 4. Send the Simulation Report back to the Admin
//     res.status(200).json({
//       message: 'Simulation Complete! (Not published yet)',
//       winningNumbers: winningNumbers,
//       prizePool: {
//         total: totalPrizePool,
//         match5Pool: pool5Match,
//         match4Pool: pool4Match,
//         match3Pool: pool3Match
//       },
//       results: {
//         match5Winners: winners.match5,
//         match4Winners: winners.match4,
//         match3Winners: winners.match3
//       },
//       jackpotRollover: winners.match5.length === 0 ? true : false // PRD Rule: Rollover if no 5-match
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error running draw simulation.' });
//   }
// });

// // The "Publish Draw" Route (Only Admins can run this!)
// router.post('/publish', protect, admin, async (req, res) => {
//   try {
//     // 1. Grab the simulation data the Admin decided to approve
//     const { winningNumbers, totalPrizePool, jackpotRollover } = req.body;

//     // 2. Generate the current month and year (e.g., "March 2026")
//     const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

//     // 3. Create the official Draw record in the database
//     const newDraw = new Draw({
//       month: currentMonth,
//       winningNumbers: winningNumbers,
//       totalPrizePool: totalPrizePool,
//       isPublished: true,
//       jackpotRollover: jackpotRollover
//     });

//     await newDraw.save();

//     res.status(201).json({ message: 'Draw published officially!', draw: newDraw });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error publishing draw.' });
//   }
// });

// module.exports = router;


const express = require('express');
const Draw = require('../models/Draw');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// ADMIN ROUTE: Execute a new Monthly Draw
router.post('/run', protect, admin, async (req, res) => {
  try {
    // 1. Generate 5 unique random numbers between 1 and 45
    const winningNumbers = [];
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) winningNumbers.push(num);
    }
    
    // Sort them so they look nice
    winningNumbers.sort((a, b) => a - b);

    // 2. Calculate the Prize Pool
    // For this prototype, we will assume a base pool of $10,000 + $5 for every premium user
    const premiumUsers = await User.countDocuments({ isSubscribed: true });
    const totalPrizePool = 10000 + (premiumUsers * 5);

    // 3. Calculate the splits (40% / 35% / 25%)
    const match5Amount = totalPrizePool * 0.40;
    const match4Amount = totalPrizePool * 0.35;
    const match3Amount = totalPrizePool * 0.25;

    // 4. Save the Draw to the Database
    const newDraw = new Draw({
      winningNumbers,
      totalPrizePool,
      payouts: {
        match5: { amount: match5Amount, winners: 0 }, // We default winners to 0 for the prototype
        match4: { amount: match4Amount, winners: 0 },
        match3: { amount: match3Amount, winners: 0 }
      }
    });

    await newDraw.save();
    res.status(201).json({ message: 'Draw executed successfully!', draw: newDraw });

  } catch (error) {
    console.error('Draw Engine Error:', error);
    res.status(500).json({ message: 'Critical error executing the draw.' });
  }
});

// PUBLIC ROUTE: Get all past draws to show on the dashboard
router.get('/history', protect, async (req, res) => {
  try {
    const draws = await Draw.find().sort({ dateRun: -1 });
    res.status(200).json(draws);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching draw history.' });
  }
});

module.exports = router;