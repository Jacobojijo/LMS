const express = require('express');
const {
  createEnrollment,
  getEnrollments,
  getEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getUserEnrollments,
  checkCourseAccess,
  checkModuleAccess,
  updateLastAccessed
} = require('../controllers/enrollmentController');

const Enrollment = require('../models/Enrollment');
const advancedResults = require('../middleware/advancedResultsMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin-only routes
router
  .route('/')
  .get(
    authorize('admin'),
    advancedResults(Enrollment, [
      { path: 'user', select: 'firstName lastName email' },
      { path: 'course', select: 'title' }
    ]),
    getEnrollments
  )
  .post(authorize('admin'), createEnrollment);

router
  .route('/:id')
  .get(authorize('admin'), getEnrollment)
  .put(authorize('admin'), updateEnrollment)
  .delete(authorize('admin'), deleteEnrollment);

// Routes accessible by both admin and student
router.get('/user/:userId/courses', getUserEnrollments);
router.get('/check-access/:courseId', checkCourseAccess);
router.get('/check-access/:courseId/:moduleId', checkModuleAccess);
router.put('/update-access/:enrollmentId', updateLastAccessed);

module.exports = router;
