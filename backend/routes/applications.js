
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProjectApplication = require('../models/ProjectApplication');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/applications
// @desc    Submit a project application
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { projectId, introduction, experience, motivation } = req.body;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is not applying to their own project
    if (project.creatorId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot apply to your own project' });
    }
    
    // Check if user already applied
    const existingApplication = await ProjectApplication.findOne({
      projectId,
      applicantId: req.user._id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this project' });
    }
    
    // Create application
    const application = await ProjectApplication.create({
      projectId,
      applicantId: req.user._id,
      introduction,
      experience,
      motivation,
      status: 'pending'
    });
    
    res.status(201).json(application);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/applications
// @desc    Get all applications for user (submitted or received)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type } = req.query; // 'submitted' or 'received'
    
    if (type === 'submitted') {
      // Get applications submitted by current user
      const applications = await ProjectApplication.find({ applicantId: req.user._id })
        .sort({ createdAt: -1 });
      
      // Get project details for each application
      const applicationsWithDetails = await Promise.all(applications.map(async (app) => {
        const project = await Project.findById(app.projectId);
        const owner = await User.findById(project.creatorId).select('email avatarUrl');
        
        return {
          id: app._id,
          project: {
            id: project._id,
            title: project.title,
            description: project.description,
            stage: project.stage
          },
          owner: {
            id: owner._id,
            name: owner.email || "Unknown User",
            avatarUrl: owner.avatarUrl || ""
          },
          status: app.status,
          createdAt: app.createdAt
        };
      }));
      
      return res.status(200).json(applicationsWithDetails);
      
    } else if (type === 'received') {
      // Get user's projects
      const userProjects = await Project.find({ creatorId: req.user._id });
      const projectIds = userProjects.map(p => p._id);
      
      // Get applications for user's projects
      const applications = await ProjectApplication.find({ 
        projectId: { $in: projectIds } 
      }).sort({ createdAt: -1 });
      
      // Get project and applicant details for each application
      const applicationsWithDetails = await Promise.all(applications.map(async (app) => {
        const project = await Project.findById(app.projectId);
        const applicant = await User.findById(app.applicantId).select('email avatarUrl');
        
        return {
          id: app._id,
          project: {
            id: project._id,
            title: project.title
          },
          applicant: {
            id: applicant._id,
            name: applicant.email || "Unknown User",
            avatarUrl: applicant.avatarUrl || ""
          },
          status: app.status,
          createdAt: app.createdAt
        };
      }));
      
      return res.status(200).json(applicationsWithDetails);
    }
    
    return res.status(400).json({ message: 'Please specify type parameter (submitted or received)' });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/applications/:id
// @desc    Get application by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await ProjectApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is authorized (either applicant or project owner)
    const project = await Project.findById(application.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (application.applicantId.toString() !== req.user._id.toString() && 
        project.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    // Get project and user details
    const applicant = await User.findById(application.applicantId).select('email avatarUrl');
    const projectOwner = await User.findById(project.creatorId).select('email avatarUrl');
    
    const applicationData = {
      id: application._id,
      project: {
        id: project._id,
        title: project.title,
        description: project.description,
        stage: project.stage,
        owner: {
          id: projectOwner._id,
          name: projectOwner.email || "Unknown User",
          avatarUrl: projectOwner.avatarUrl || ""
        }
      },
      applicant: {
        id: applicant._id,
        name: applicant.email || "Unknown User",
        avatarUrl: applicant.avatarUrl || ""
      },
      introduction: application.introduction,
      experience: application.experience,
      motivation: application.motivation,
      status: application.status,
      createdAt: application.createdAt,
      isOwner: project.creatorId.toString() === req.user._id.toString(),
      isApplicant: application.applicantId.toString() === req.user._id.toString()
    };
    
    res.status(200).json(applicationData);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const application = await ProjectApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is project owner
    const project = await Project.findById(application.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    application.status = status;
    await application.save();
    
    res.status(200).json(application);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
