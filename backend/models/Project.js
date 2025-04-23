
const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  stage: {
    type: String,
    required: true,
    enum: ['idea', 'concept', 'prototype', 'mvp', 'growth', 'scaling']
  },
  category: {
    type: String,
    required: true
  },
  rolesNeeded: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  premiumFeatures: {
    type: Boolean,
    default: false
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

// Add text search index
projectSchema.index({ 
  title: 'text', 
  description: 'text',
  category: 'text',
  tags: 'text',
  rolesNeeded: 'text'
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
