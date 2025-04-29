
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const ProjectApplication = require('../models/ProjectApplication');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, stage, skills } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add stage filter if provided
    if (stage) {
      filter.stage = stage;
    }
    
    // Add skills filter if provided
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      filter.rolesNeeded = { $in: skillsArray };
    }
    
    // Add search filter if provided
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Execute query
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    // Get owner details for each project
    const projectsWithOwners = await Promise.all(projects.map(async (project) => {
      const owner = await User.findById(project.creatorId).select('email avatarUrl').lean();
      
      return {
        id: project._id,
        title: project.title,
        description: project.description,
        stage: project.stage,
        tags: project.tags,
        skills: project.rolesNeeded,
        createdAt: project.createdAt,
        owner: {
          id: owner._id,
          name: owner.email || "Unknown User",
          avatarUrl: owner.avatarUrl || ""
        },
        isOwner: req.user ? project.creatorId.toString() === req.user._id.toString() : false
      };
    }));
    
    res.status(200).json(projectsWithOwners);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private - MUST be logged in
router.post('/', protect, async (req, res) => {
  try {
    // User is guaranteed to exist due to the protect middleware
    const { title, description, stage, category, rolesNeeded, tags } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to create projects' });
    }
    
    const project = await Project.create({
      title,
      description,
      stage,
      category,
      rolesNeeded,
      tags,
      creatorId: req.user._id
    });
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Get a project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get owner details
    const owner = await User.findById(project.creatorId).select('email avatarUrl');
    
    const projectData = {
      id: project._id,
      title: project.title,
      description: project.description,
      stage: project.stage,
      category: project.category,
      rolesNeeded: project.rolesNeeded,
      tags: project.tags,
      createdAt: project.createdAt,
      owner: {
        id: owner._id,
        name: owner.email || "Unknown User",
        avatarUrl: owner.avatarUrl || ""
      },
      isOwner: req.user ? project.creatorId.toString() === req.user._id.toString() : false
    };
    
    res.status(200).json(projectData);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is project owner
    if (project.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    const { title, description, stage, category, rolesNeeded, tags } = req.body;
    
    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        stage,
        category,
        rolesNeeded,
        tags
      },
      { new: true }
    );
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is project owner
    if (project.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    // Delete project applications first
    await ProjectApplication.deleteMany({ projectId: project._id });
    
    // Delete the project
    await project.deleteOne();
    
    res.status(200).json({ message: 'Project removed' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
