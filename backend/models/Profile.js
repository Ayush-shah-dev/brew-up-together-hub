
const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  bio: {
    type: String
  },
  location: {
    type: String,
    trim: true
  },
  education: {
    type: String
  },
  experience: {
    type: String
  },
  skills: {
    type: [String],
    default: []
  },
  industry: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  linkedinUrl: {
    type: String,
    trim: true
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

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
