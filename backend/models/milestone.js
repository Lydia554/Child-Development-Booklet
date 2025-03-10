const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  milestoneType: {
    type: String,
    required: true
  },
  milestoneDate: {
    type: Date,
    required: true
  },
  progress: {
    type: String,
    required: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Milestone', milestoneSchema);
