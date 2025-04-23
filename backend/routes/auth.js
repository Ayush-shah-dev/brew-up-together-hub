
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      email,
      password
    });
    
    // Create empty profile
    await Profile.create({
      userId: user._id
    });
    
    if (user) {
      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
          createdAt: user.createdAt
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if password is correct
    if (await user.isValidPassword(password)) {
      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
          createdAt: user.createdAt
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get user data
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    // User is already available in req.user from the auth middleware
    const user = {
      id: req.user._id,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
      provider: req.user.provider,
      createdAt: req.user.createdAt
    };
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/logout
// @desc    Log out user (client-side only for JWT)
// @access  Public
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
