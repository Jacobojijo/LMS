const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
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
  // If moduleAccess is empty, user has access to all modules
  // Otherwise, user only has access to specified modules
  moduleAccess: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Module'
  }],
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  enrolledBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'completed'],
    default: 'active'
  },
  completionProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastAccessed: {
    type: Date
  }
});

// Prevent duplicate enrollments
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
