// courseRoutes.js
const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  // New methods for student access
  getStudentCourses,
  getStudentCourse,
  getStudentModule
} = require('../controllers/courseController');

const Course = require('../models/Course');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const advancedResults = require('../middleware/advancedResultsMiddleware');

// Admin routes
router
  .route('/')
  .get(
    protect,
    authorize('admin'),
    advancedResults(Course),
    getCourses
  )
  .post(protect, authorize('admin'), createCourse);

router
  .route('/:id')
  .get(protect, authorize('admin'), getCourse)
  .put(protect, authorize('admin'), updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

// Student routes
router.get('/student', protect, getStudentCourses);
router.get('/student/:id', protect, getStudentCourse);
router.get('/student/:courseId/modules/:moduleId', protect, getStudentModule);

module.exports = router;