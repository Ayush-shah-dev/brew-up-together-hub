
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Project = require('../models/Project');
const ProjectApplication = require('../models/ProjectApplication');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/:projectId
// @desc    Get messages for a project
// @access  Private
router.get('/:projectId', protect, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is authorized (either project owner or approved applicant)
    const isOwner = project.creatorId.toString() === req.user._id.toString();
    
    if (!isOwner) {
      const application = await ProjectApplication.findOne({
        projectId,
        applicantId: req.user._id,
        status: 'approved'
      });
      
      if (!application) {
        return res.status(403).json({ message: 'User not authorized to access project messages' });
      }
    }
    
    // Get messages
    const messages = await Message.find({ projectId })
      .sort({ createdAt: 1 });
    
    // Get sender details for each message
    const messagesWithSenders = await Promise.all(messages.map(async (message) => {
      const sender = await User.findById(message.senderId).select('email avatarUrl');
      
      return {
        id: message._id,
        content: message.content,
        createdAt: message.createdAt,
        sender: {
          id: sender._id,
          name: sender.email || "Unknown User",
          avatarUrl: sender.avatarUrl || ""
        },
        isOwn: message.senderId.toString() === req.user._id.toString()
      };
    }));
    
    res.status(200).json(messagesWithSenders);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/messages/:projectId
// @desc    Send a message in a project
// @access  Private
router.post('/:projectId', protect, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is authorized (either project owner or approved applicant)
    const isOwner = project.creatorId.toString() === req.user._id.toString();
    
    if (!isOwner) {
      const application = await ProjectApplication.findOne({
        projectId,
        applicantId: req.user._id,
        status: 'approved'
      });
      
      if (!application) {
        return res.status(403).json({ message: 'User not authorized to send messages to this project' });
      }
    }
    
    // Create message
    const message = await Message.create({
      projectId,
      senderId: req.user._id,
      content
    });
    
    // Get sender details for response
    const sender = await User.findById(req.user._id).select('email avatarUrl');
    
    const messageData = {
      id: message._id,
      content: message.content,
      createdAt: message.createdAt,
      sender: {
        id: sender._id,
        name: sender.email || "Unknown User",
        avatarUrl: sender.avatarUrl || ""
      },
      isOwn: true
    };
    
    res.status(201).json(messageData);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
