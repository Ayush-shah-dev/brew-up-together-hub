
const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
