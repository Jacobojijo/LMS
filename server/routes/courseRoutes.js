const express = require('express');
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getStudentCourses,
  getStudentCourse,
  getStudentModule,
  getStudentTopic,
  getStudentSubtopic,
  submitTopicPracticeAnswer,
  submitSubtopicPracticeAnswer,
  submitCAT,
  getStudentProgress
} = require('../controllers/courseController');

const Course = require('../models/Course');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');
const advancedResults = require('../middleware/advancedResultsMiddleware');

const router = express.Router();

// Admin routes
router
  .route('/')
  .get(protect, authorize('admin'), advancedResults(Course), getCourses)
  .post(protect, authorize('admin'), createCourse);

router
  .route('/:id')
  .get(protect, authorize('admin'), getCourse)
  .put(protect, authorize('admin'), updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

// Student routes
router
  .route('/student')
  .get(protect, authorize('student'), getStudentCourses);

router
  .route('/student/:id')
  .get(protect, authorize('student'), getStudentCourse);

router
  .route('/student/:id/progress')
  .get(protect, authorize('student'), getStudentProgress);

router
  .route('/student/:courseId/modules/:moduleId')
  .get(protect, authorize('student'), getStudentModule);

router
  .route('/student/:courseId/modules/:moduleId/topics/:topicId')
  .get(protect, authorize('student'), getStudentTopic);

// New subtopic route
router
  .route('/student/:courseId/modules/:moduleId/topics/:topicId/subtopics/:subtopicId')
  .get(protect, authorize('student'), getStudentSubtopic);

// Practice question routes - topic level
router
  .route('/student/:courseId/modules/:moduleId/topics/:topicId/practice/:questionId')
  .post(protect, authorize('student'), submitTopicPracticeAnswer);

// Practice question routes - subtopic level
router
  .route('/student/:courseId/modules/:moduleId/topics/:topicId/subtopics/:subtopicId/practice/:questionId')
  .post(protect, authorize('student'), submitSubtopicPracticeAnswer);

// CAT routes
router
  .route('/student/:courseId/modules/:moduleId/cat')
  .post(protect, authorize('student'), submitCAT);

module.exports = router;