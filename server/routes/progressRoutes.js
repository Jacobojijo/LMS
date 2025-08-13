const express = require('express');
const { 
  updateProgress, 
  getProgress, 
  resumeCourse,
  getDetailedProgress 
} = require('../controllers/progressTrackerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Basic progress operations
router.route('/course/:courseId')
  .put(protect, updateProgress)   // Update progress for a course
  .get(protect, getProgress);     // Get current progress for a course

// Resume course functionality
router.route('/course/:courseId/resume')
  .get(protect, resumeCourse);    // Get resume data for a course

// Detailed progress breakdown
router.route('/course/:courseId/detailed')
  .get(protect, getDetailedProgress); // Get detailed progress breakdown

module.exports = router;