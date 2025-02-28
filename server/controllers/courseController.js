const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncMiddleware');
const Enrollment = require('../models/Enrollment');

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin only)
exports.createCourse = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for existing course with same title
  const existingCourse = await Course.findOne({ title: req.body.title });

  if (existingCourse) {
    return next(
      new ErrorResponse(`Course with title "${req.body.title}" already exists`, 400)
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Get all courses
// @route   GET /api/v1/courses
// @access  Private (Admin only)
exports.getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Private (Admin only)
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private (Admin only)
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this course`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private (Admin only)
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this course`,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get all courses available to a student
// @route   GET /api/courses/student
// @access  Private (Student)
exports.getStudentCourses = asyncHandler(async (req, res, next) => {
  // Find all active enrollments for this student
  const enrollments = await Enrollment.find({
    user: req.user.id,
    status: 'active'
  }).select('course moduleAccess');
  
  // Extract course IDs
  const courseIds = enrollments.map(enrollment => enrollment.course);
  
  // Fetch the courses
  const courses = await Course.find({
    _id: { $in: courseIds }
  });
  
  // Map courses with their module access
  const accessibleCourses = courses.map(course => {
    const enrollment = enrollments.find(
      e => e.course.toString() === course._id.toString()
    );
    
    return {
      course,
      moduleAccess: enrollment.moduleAccess
    };
  });
  
  res.status(200).json({
    success: true,
    count: accessibleCourses.length,
    data: accessibleCourses
  });
});

// @desc    Get single course for student
// @route   GET /api/courses/student/:id
// @access  Private (Student)
exports.getStudentCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check if student has access
  const hasAccess = await course.hasUserAccess(req.user.id);
  
  if (!hasAccess) {
    return next(
      new ErrorResponse(`Not authorized to access this course`, 403)
    );
  }
  
  // Get enrollment to determine which modules are accessible
  const enrollment = await Enrollment.findOne({
    user: req.user.id,
    course: course._id,
    status: 'active'
  });
  
  // Update last accessed timestamp
  enrollment.lastAccessed = Date.now();
  await enrollment.save();
  
  // If moduleAccess is empty, return the whole course
  // Otherwise, filter the modules
  let accessibleCourse = course;
  
  if (enrollment.moduleAccess && enrollment.moduleAccess.length > 0) {
    // Filter modules that the student has access to
    const accessibleModules = course.modules.filter(module => 
      enrollment.moduleAccess.includes(module._id)
    );
    
    // Create a copy of the course with only accessible modules
    accessibleCourse = {
      ...course.toObject(),
      modules: accessibleModules
    };
  }
  
  res.status(200).json({
    success: true,
    data: accessibleCourse
  });
});

// @desc    Get single module for student
// @route   GET /api/courses/student/:courseId/modules/:moduleId
// @access  Private (Student)
exports.getStudentModule = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.courseId}`, 404)
    );
  }
  
  // Find the requested module
  const module = course.modules.id(req.params.moduleId);
  
  if (!module) {
    return next(
      new ErrorResponse(`Module not found with id of ${req.params.moduleId}`, 404)
    );
  }
  
  // Check if student has access to this specific module
  const hasModuleAccess = await course.hasModuleAccess(req.user.id, req.params.moduleId);
  
  if (!hasModuleAccess) {
    return next(
      new ErrorResponse(`Not authorized to access this module`, 403)
    );
  }
  
  res.status(200).json({
    success: true,
    data: module
  });
});
