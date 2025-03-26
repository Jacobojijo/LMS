const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  currentModule: {
    type: mongoose.Schema.ObjectId,
    ref: 'Module'
  },
  currentTopic: {
    type: mongoose.Schema.ObjectId,
    ref: 'Topic'
  },
  completedModules: [{
    moduleId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Module'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedTopics: [{
    moduleId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Module'
    },
    topicId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Topic'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedAssessments: [{
    moduleId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Module'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastAccessedPage: {
    type: String,
    enum: ['topic', 'html', 'practice', 'assessment'],
    default: 'topic'
  },
  overallProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate progress entries
ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);