const express = require('express');
const { 
  updateProgress, 
  getProgress, 
  resumeCourse 
} = require('../controllers/progressTrackerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/course/:courseId')
  .put(protect, updateProgress)   // Update progress for a course
  .get(protect, getProgress);     // Get current progress for a course

router.route('/course/:courseId/resume')
  .get(protect, resumeCourse);    // Get resume data for a course

module.exports = router;