
const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectApplicationSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  introduction: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  motivation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure a user can only apply once to a project
projectApplicationSchema.index({ projectId: 1, applicantId: 1 }, { unique: true });

const ProjectApplication = mongoose.model('ProjectApplication', projectApplicationSchema);

module.exports = ProjectApplication;
