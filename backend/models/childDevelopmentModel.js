const mongoose = require('mongoose');

const childDevelopmentSchema = mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child', 
    required: true,
  },
  periods: [{
    startAge: {
      type: Number,
      required: true,
    },
    endAge: {
      type: Number,
      required: true,
    },
    physicalDevelopment: {
      type: String,
      required: true,
    },
    emotionalDevelopment: {
      type: String,
      required: true,
    },
    intellectualDevelopment: {
      type: String,
      required: true,
    },
    socialDevelopment: {
      type: String,
      required: true,
    },
  }],
});

const ChildDevelopment = mongoose.model('ChildDevelopment', childDevelopmentSchema);
module.exports = ChildDevelopment;
