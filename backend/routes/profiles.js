
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');

// @route   GET /api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Combine user and profile data
    const profileData = {
      id: req.user._id,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
      firstName: profile.firstName,
      lastName: profile.lastName,
      title: profile.title,
      bio: profile.bio,
      location: profile.location,
      education: profile.education,
      experience: profile.experience,
      skills: profile.skills,
      industry: profile.industry,
      githubUrl: profile.githubUrl,
      linkedinUrl: profile.linkedinUrl,
      createdAt: profile.createdAt
    };
    
    res.status(200).json(profileData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/profiles/:userId
// @desc    Get user profile by userId
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const profile = await Profile.findOne({ userId: req.params.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Combine user and profile data
    const profileData = {
      id: user._id,
      email: user.email,
      avatarUrl: user.avatarUrl,
      firstName: profile.firstName,
      lastName: profile.lastName,
      title: profile.title,
      bio: profile.bio,
      location: profile.location,
      education: profile.education,
      experience: profile.experience,
      skills: profile.skills,
      industry: profile.industry,
      githubUrl: profile.githubUrl,
      linkedinUrl: profile.linkedinUrl,
      createdAt: profile.createdAt
    };
    
    res.status(200).json(profileData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/profiles
// @desc    Update user profile
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      title,
      bio,
      location,
      education,
      experience,
      skills,
      industry,
      githubUrl,
      linkedinUrl,
      avatarUrl
    } = req.body;
    
    // Update user if avatarUrl provided
    if (avatarUrl) {
      await User.findByIdAndUpdate(req.user._id, { avatarUrl });
    }
    
    // Update or create profile
    const profileFields = {
      userId: req.user._id,
      firstName,
      lastName,
      title,
      bio,
      location,
      education,
      experience,
      skills,
      industry,
      githubUrl,
      linkedinUrl
    };
    
    let profile = await Profile.findOne({ userId: req.user._id });
    
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      profile = await Profile.create(profileFields);
    }
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
