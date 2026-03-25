const express = require('express');
const bcrypt = require('bcryptjs'); // The password scrambler
const jwt = require('jsonwebtoken'); // The VIP wristband maker
const User = require('../models/User'); // Our User blueprint

const router = express.Router();

// CHANGED: From /signup to /register to match your Frontend!
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'That email is already in use!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword
    });

    await newUser.save();

    // Include the role in the token so the Admin Dashboard works
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } 
    );

    res.status(201).json({ 
      message: 'User created successfully!', 
      token: token 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Oops! Something went wrong at the registration desk.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found! Please sign up first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password!' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      message: 'Logged in successfully!', 
      token: token,
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Oops! Something went wrong at the login desk.' });
  }
});

// --- NEW PROFILE ROUTES --- //
const { protect } = require('../middleware/authMiddleware');

// GET: Fetch the logged-in user's profile data
router.get('/profile', protect, async (req, res) => {
  try {
    // FIXED: Changed req.user._id to req.user.id to match your middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
});

// PUT: Update the user's profile
router.put('/profile', protect, async (req, res) => {
  try {
    // FIXED: Changed req.user._id to req.user.id
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile.' });
  }
});

module.exports = router;