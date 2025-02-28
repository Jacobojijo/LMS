const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncMiddleware');

// @desc    Enroll user in a course (full access or specific modules)
// @route   POST /api/enrollments
// @access  Private (Admin only)
exports.createEnrollment = asyncHandler(async (req, res, next) => {
  const { userId, courseId, moduleAccess } = req.body;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${userId}`, 404));
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${courseId}`, 404));
  }

  // If moduleAccess is provided, verify modules exist in the course
  if (moduleAccess && moduleAccess.length > 0) {
    // Extract module IDs from the course
    const courseModuleIds = course.modules.map(module => module._id.toString());
    
    // Check if all provided module IDs exist in the course
    const invalidModules = moduleAccess.filter(
      moduleId => !courseModuleIds.includes(moduleId.toString())
    );
    
    if (invalidModules.length > 0) {
      return next(
        new ErrorResponse(
          `Modules with ids ${invalidModules.join(', ')} do not exist in this course`,
          400
        )
      );
    }
  }

  // Check for existing enrollment
  const existingEnrollment = await Enrollment.findOne({
    user: userId,
    course: courseId
  });

  if (existingEnrollment) {
    return next(
      new ErrorResponse(
        `User is already enrolled in this course`,
        400
      )
    );
  }

  // Create enrollment record
  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
    moduleAccess: moduleAccess || [], // Empty array means full course access
    enrolledBy: req.user.id
  });

  res.status(201).json({
    success: true,
    data: enrollment
  });
});

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Private (Admin only)
exports.getEnrollments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single enrollment
// @route   GET /api/enrollments/:id
// @access  Private (Admin only)
exports.getEnrollment = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'firstName lastName email'
    })
    .populate({
      path: 'course',
      select: 'title'
    })
    .populate({
      path: 'enrolledBy',
      select: 'firstName lastName'
    });

  if (!enrollment) {
    return next(
      new ErrorResponse(`Enrollment not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: enrollment
  });
});

// @desc    Update enrollment
// @route   PUT /api/enrollments/:id
// @access  Private (Admin only)
exports.updateEnrollment = asyncHandler(async (req, res, next) => {
  let enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return next(
      new ErrorResponse(`Enrollment not found with id of ${req.params.id}`, 404)
    );
  }

  // If updating moduleAccess, verify the modules exist in the course
  if (req.body.moduleAccess) {
    const course = await Course.findById(enrollment.course);
    
    // Extract module IDs from the course
    const courseModuleIds = course.modules.map(module => module._id.toString());
    
    // Check if all provided module IDs exist in the course
    const invalidModules = req.body.moduleAccess.filter(
      moduleId => !courseModuleIds.includes(moduleId.toString())
    );
    
    if (invalidModules.length > 0) {
      return next(
        new ErrorResponse(
          `Modules with ids ${invalidModules.join(', ')} do not exist in this course`,
          400
        )
      );
    }
  }

  enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: enrollment
  });
});

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private (Admin only)
exports.deleteEnrollment = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return next(
      new ErrorResponse(`Enrollment not found with id of ${req.params.id}`, 404)
    );
  }

  await enrollment.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get courses for a specific student
// @route   GET /api/enrollments/user/:userId/courses
// @access  Private
exports.getUserEnrollments = asyncHandler(async (req, res, next) => {
  // Check if the user is admin or the user themselves
  if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this resource`,
        403
      )
    );
  }

  const enrollments = await Enrollment.find({ 
    user: req.params.userId,
    status: 'active'
  })
  .populate({
    path: 'course',
    select: 'title overview structure modules'
  });

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});

// @desc    Check if user has access to a specific course
// @route   GET /api/enrollments/check-access/:courseId
// @access  Private
exports.checkCourseAccess = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findOne({
    user: req.user.id,
    course: req.params.courseId,
    status: 'active'
  });

  const hasAccess = !!enrollment;

  res.status(200).json({
    success: true,
    hasAccess,
    data: enrollment || null
  });
});

// @desc    Check if user has access to a specific module
// @route   GET /api/enrollments/check-access/:courseId/:moduleId
// @access  Private
exports.checkModuleAccess = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findOne({
    user: req.user.id,
    course: req.params.courseId,
    status: 'active'
  });

  if (!enrollment) {
    return res.status(200).json({
      success: true,
      hasAccess: false,
      data: null
    });
  }

  // If moduleAccess is empty, user has access to all modules
  // Otherwise, check if the module is in the moduleAccess array
  const hasAccess = 
    enrollment.moduleAccess.length === 0 || 
    enrollment.moduleAccess.includes(req.params.moduleId);

  res.status(200).json({
    success: true,
    hasAccess,
    data: enrollment
  });
});

// @desc    Update user's last accessed timestamp
// @route   PUT /api/enrollments/update-access/:enrollmentId
// @access  Private
exports.updateLastAccessed = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findById(req.params.enrollmentId);

  if (!enrollment) {
    return next(
      new ErrorResponse(`Enrollment not found with id of ${req.params.enrollmentId}`, 404)
    );
  }

  // Check if user is authorized
  if (enrollment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this enrollment`,
        403
      )
    );
  }

  enrollment.lastAccessed = Date.now();
  await enrollment.save();

  res.status(200).json({
    success: true,
    data: enrollment
  });
});
