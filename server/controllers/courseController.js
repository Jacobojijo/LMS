const Course = require("../models/Course");
const Progress = require("../models/Progress"); // Add progress model
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncMiddleware");
const Enrollment = require("../models/Enrollment");

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
      new ErrorResponse(
        `Course with title "${req.body.title}" already exists`,
        400
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
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
    data: course,
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
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this course`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
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
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this course`,
        401
      )
    );
  }

  await course.deleteOne(); // Updated from remove() which is deprecated

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get all courses available to a student
// @route   GET /api/courses/student
// @access  Private (Student)
exports.getStudentCourses = asyncHandler(async (req, res, next) => {
  // Find all active enrollments for this student
  const enrollments = await Enrollment.find({
    user: req.user.id,
    status: "active",
  }).select("course moduleAccess");

  // Extract course IDs
  const courseIds = enrollments.map((enrollment) => enrollment.course);

  // Fetch the courses
  const courses = await Course.find({
    _id: { $in: courseIds },
  });

  // Fetch progress for all courses
  const progressRecords = await Progress.find({
    user: req.user.id,
    course: { $in: courseIds },
  });

  // Map courses with their module access and progress
  const accessibleCourses = courses.map((course) => {
    const enrollment = enrollments.find(
      (e) => e.course.toString() === course._id.toString()
    );

    const progress = progressRecords.find(
      (p) => p.course.toString() === course._id.toString()
    );

    return {
      course,
      moduleAccess: enrollment.moduleAccess,
      progress: progress
        ? {
            overallProgress: progress.overallProgress,
            completed: progress.completed,
            completedAt: progress.completedAt,
          }
        : null,
    };
  });

  res.status(200).json({
    success: true,
    count: accessibleCourses.length,
    data: accessibleCourses,
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
    return next(new ErrorResponse(`Not authorized to access this course`, 403));
  }

  // Get enrollment to determine which modules are accessible
  const enrollment = await Enrollment.findOne({
    user: req.user.id,
    course: course._id,
    status: "active",
  });

  // Get student progress for this course
  let progress = await Progress.findOne({
    user: req.user.id,
    course: course._id,
  });

  // If no progress record exists, create one
  if (!progress) {
    // Initialize progress with empty modules matching course structure
    const moduleProgress = course.modules.map((module) => ({
      moduleId: module._id,
      topics: module.topics.map((topic) => ({
        topicId: topic._id,
        completed: false,
        viewed: false,
        practiceAttempts: [],
      })),
      catAttempt: {
        attempts: 0,
        bestScore: 0,
        passed: false,
      },
      completed: false,
    }));

    progress = await Progress.create({
      user: req.user.id,
      course: course._id,
      modules: moduleProgress,
      overallProgress: 0,
      completed: false,
    });
  }

  // Update last accessed timestamp
  enrollment.lastAccessed = Date.now();
  await enrollment.save();

  // If moduleAccess is empty, student has access to all modules
  // Otherwise, filter based on module access and progress
  let accessibleModules = [];

  if (enrollment.moduleAccess && enrollment.moduleAccess.length > 0) {
    // Filter modules that the student has access to based on enrollment
    accessibleModules = course.modules.filter((module) =>
      enrollment.moduleAccess.includes(module._id)
    );
  } else {
    // Student has access to all modules, but progression is sequential
    accessibleModules = course.modules;
  }

  // Now filter based on progression rules
  const processedModules = accessibleModules.map((module, index) => {
    // First module is always accessible
    if (index === 0) {
      return module;
    }

    // Check if previous module is completed
    const prevModule = accessibleModules[index - 1];
    const canAccess = progress.canAccessNextModule(prevModule._id, course);

    if (!canAccess) {
      // If module cannot be accessed yet, return a limited version
      return {
        _id: module._id,
        title: module.title,
        description: module.description,
        order: module.order,
        locked: true, // Add a flag indicating the module is locked
      };
    }

    return module;
  });

  // Create a copy of the course with only accessible modules
  const accessibleCourse = {
    ...course.toObject(),
    modules: processedModules,
  };

  // Include progress information
  const responseData = {
    course: accessibleCourse,
    progress: {
      overallProgress: progress.overallProgress,
      completed: progress.completed,
      completedAt: progress.completedAt,
      moduleProgress: progress.modules.map((module) => ({
        moduleId: module.moduleId,
        completed: module.completed,
        completedAt: module.completedAt,
        catProgress: module.catAttempt
          ? {
              attempts: module.catAttempt.attempts,
              bestScore: module.catAttempt.bestScore,
              passed: module.catAttempt.passed,
              lastAttemptedAt: module.catAttempt.lastAttemptedAt,
            }
          : null,
      })),
    },
  };

  res.status(200).json({
    success: true,
    data: responseData,
  });
});

// @desc    Get single module for student
// @route   GET /api/courses/student/:courseId/modules/:moduleId
// @access  Private (Student)
exports.getStudentModule = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      new ErrorResponse(
        `Course not found with id of ${req.params.courseId}`,
        404
      )
    );
  }

  // Find the requested module
  const module = course.modules.id(req.params.moduleId);

  if (!module) {
    return next(
      new ErrorResponse(
        `Module not found with id of ${req.params.moduleId}`,
        404
      )
    );
  }

  // Check if student has access to this specific module
  const hasModuleAccess = await course.hasModuleAccess(
    req.user.id,
    req.params.moduleId
  );

  if (!hasModuleAccess) {
    return next(new ErrorResponse(`Not authorized to access this module`, 403));
  }

  // Get progress record
  const progress = await Progress.findOne({
    user: req.user.id,
    course: course._id,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress record not found`, 404));
  }

  // Check if module is unlocked in sequence
  // If it's the first module, allow access
  const moduleIndex = course.modules.findIndex(
    (m) => m._id.toString() === req.params.moduleId
  );

  if (moduleIndex > 0) {
    // Check if previous module is completed
    const prevModuleId = course.modules[moduleIndex - 1]._id;
    const canAccess = progress.isModuleCATCompleted(prevModuleId);

    if (!canAccess) {
      return next(
        new ErrorResponse(
          `Complete previous module before accessing this one`,
          403
        )
      );
    }
  }

  // Get module progress
  const moduleProgress = progress.modules.find(
    (m) => m.moduleId.toString() === req.params.moduleId
  );

  // Return module with progress information
  res.status(200).json({
    success: true,
    data: {
      module,
      progress: moduleProgress,
    },
  });
});

// @desc    Get single topic for student
// @route   GET /api/courses/student/:courseId/modules/:moduleId/topics/:topicId
// @access  Private (Student)
exports.getStudentTopic = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      new ErrorResponse(
        `Course not found with id of ${req.params.courseId}`,
        404
      )
    );
  }

  // Find the requested module
  const module = course.modules.id(req.params.moduleId);

  if (!module) {
    return next(
      new ErrorResponse(
        `Module not found with id of ${req.params.moduleId}`,
        404
      )
    );
  }

  // Find the requested topic
  const topic = module.topics.id(req.params.topicId);

  if (!topic) {
    return next(
      new ErrorResponse(`Topic not found with id of ${req.params.topicId}`, 404)
    );
  }

  // Check if student has access to this specific module
  const hasModuleAccess = await course.hasModuleAccess(
    req.user.id,
    req.params.moduleId
  );

  if (!hasModuleAccess) {
    return next(new ErrorResponse(`Not authorized to access this module`, 403));
  }

  // Get progress record
  const progress = await Progress.findOne({
    user: req.user.id,
    course: course._id,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress record not found`, 404));
  }

  // Check if student can access this topic (sequential progression)
  const topicIndex = module.topics.findIndex(
    (t) => t._id.toString() === req.params.topicId
  );

  if (topicIndex > 0) {
    // Check if previous topic is completed
    const prevTopicId = module.topics[topicIndex - 1]._id;
    const canAccess = progress.isTopicCompleted(prevTopicId);

    if (!canAccess) {
      return next(
        new ErrorResponse(
          `Complete previous topic before accessing this one`,
          403
        )
      );
    }
  }

  // Get module progress
  const moduleProgress = progress.modules.find(
    (m) => m.moduleId.toString() === req.params.moduleId
  );

  // Get topic progress
  const topicProgress = moduleProgress.topics.find(
    (t) => t.topicId.toString() === req.params.topicId
  );

  // Mark topic as viewed if not already
  if (!topicProgress.viewed) {
    topicProgress.viewed = true;
    await progress.save();
  }

  // Return topic with progress information
  res.status(200).json({
    success: true,
    data: {
      topic,
      progress: topicProgress,
    },
  });
});

// @desc    Submit practice question answer
// @route   POST /api/courses/student/:courseId/modules/:moduleId/topics/:topicId/practice/:questionId
// @access  Private (Student)
exports.submitPracticeAnswer = asyncHandler(async (req, res, next) => {
  const { answer } = req.body;

  if (answer === undefined) {
    return next(new ErrorResponse("Please provide an answer", 400));
  }

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      new ErrorResponse(
        `Course not found with id of ${req.params.courseId}`,
        404
      )
    );
  }

  // Find the requested module
  const module = course.modules.id(req.params.moduleId);

  if (!module) {
    return next(
      new ErrorResponse(
        `Module not found with id of ${req.params.moduleId}`,
        404
      )
    );
  }

  // Find the requested topic
  const topic = module.topics.id(req.params.topicId);

  if (!topic) {
    return next(
      new ErrorResponse(`Topic not found with id of ${req.params.topicId}`, 404)
    );
  }

  // Find the practice question
  const question = topic.practiceQuestions.id(req.params.questionId);

  if (!question) {
    return next(
      new ErrorResponse(
        `Question not found with id of ${req.params.questionId}`,
        404
      )
    );
  }

  // Get progress record
  let progress = await Progress.findOne({
    user: req.user.id,
    course: course._id,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress record not found`, 404));
  }

  // Find module progress
  const moduleProgress = progress.modules.find(
    (m) => m.moduleId.toString() === req.params.moduleId
  );

  // Find topic progress
  const topicProgress = moduleProgress.topics.find(
    (t) => t.topicId.toString() === req.params.topicId
  );

  // Find or create practice attempt
  let practiceAttempt = topicProgress.practiceAttempts.find(
    (a) => a.questionId.toString() === req.params.questionId
  );

  if (!practiceAttempt) {
    practiceAttempt = {
      questionId: req.params.questionId,
      attempts: 0,
      passed: false,
      lastAttemptedAt: Date.now(),
    };
    topicProgress.practiceAttempts.push(practiceAttempt);
  }

  // Check answer
  const isCorrect = parseInt(answer) === question.correctAnswer;

  // Update attempt record
  practiceAttempt.attempts += 1;
  practiceAttempt.lastAttemptedAt = Date.now();

  if (isCorrect) {
    practiceAttempt.passed = true;
  }

  // Check if all practice questions are now passed
  const allPassed = topic.practiceQuestions.every((q) => {
    const attempt = topicProgress.practiceAttempts.find(
      (a) => a.questionId.toString() === q._id.toString()
    );
    return attempt && attempt.passed;
  });

  // If all questions are passed, mark topic as completed
  if (allPassed) {
    topicProgress.completed = true;
    topicProgress.completedAt = Date.now();

    // Check if all topics in module are completed
    const allTopicsCompleted = module.topics.every((t) => {
      const tProgress = moduleProgress.topics.find(
        (tp) => tp.topicId.toString() === t._id.toString()
      );
      return tProgress && tProgress.completed;
    });

    // If all topics completed and CAT is passed, mark module as completed
    if (
      allTopicsCompleted &&
      (!module.cat || moduleProgress.catAttempt.passed)
    ) {
      moduleProgress.completed = true;
      moduleProgress.completedAt = Date.now();
    }
  }

  // Recalculate overall progress
  progress.overallProgress = progress.calculateOverallProgress(course);

  // Check if entire course is now completed
  if (progress.overallProgress === 100 && !progress.completed) {
    progress.completed = true;
    progress.completedAt = Date.now();
  }

  // Save progress
  await progress.save();

  res.status(200).json({
    success: true,
    data: {
      isCorrect,
      attempts: practiceAttempt.attempts,
      passed: practiceAttempt.passed,
      explanation: question.explanation,
      topicCompleted: topicProgress.completed,
      moduleCompleted: moduleProgress.completed,
      overallProgress: progress.overallProgress,
      courseCompleted: progress.completed,
    },
  });
});

// @desc    Submit CAT (Continuous Assessment Test) answers
// @route   POST /api/courses/student/:courseId/modules/:moduleId/cat
// @access  Private (Student)
exports.submitCAT = asyncHandler(async (req, res, next) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return next(new ErrorResponse("Please provide answers array", 400));
  }

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      new ErrorResponse(
        `Course not found with id of ${req.params.courseId}`,
        404
      )
    );
  }

  // Find the requested module
  const module = course.modules.id(req.params.moduleId);

  if (!module) {
    return next(
      new ErrorResponse(
        `Module not found with id of ${req.params.moduleId}`,
        404
      )
    );
  }

  // Make sure module has a CAT
  if (!module.cat) {
    return next(new ErrorResponse(`This module does not have a CAT`, 404));
  }

  // Get progress record
  let progress = await Progress.findOne({
    user: req.user.id,
    course: course._id,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress record not found`, 404));
  }

  // Find module progress
  const moduleProgress = progress.modules.find(
    (m) => m.moduleId.toString() === req.params.moduleId
  );

  // Check if all topics are completed
  const allTopicsCompleted = module.topics.every((topic) => {
    const topicProgress = moduleProgress.topics.find(
      (t) => t.topicId.toString() === topic._id.toString()
    );
    return topicProgress && topicProgress.completed;
  });

  if (!allTopicsCompleted) {
    return next(
      new ErrorResponse(`Complete all topics before taking the CAT`, 403)
    );
  }

  // Check if max attempts reached
  if (moduleProgress.catAttempt.attempts >= module.cat.maxAttempts) {
    return next(
      new ErrorResponse(
        `Maximum attempts (${module.cat.maxAttempts}) reached for this CAT`,
        403
      )
    );
  }

  // Increase attempt count
  moduleProgress.catAttempt.attempts += 1;
  moduleProgress.catAttempt.lastAttemptedAt = Date.now();

  // Calculate score
  let correctAnswers = 0;

  answers.forEach((answer, index) => {
    if (
      index < module.cat.questions.length &&
      parseInt(answer) === module.cat.questions[index].correctAnswer
    ) {
      correctAnswers += 1;
    }
  });

  const score = (correctAnswers / module.cat.questions.length) * 100;

  // Update best score if current score is higher
  if (score > moduleProgress.catAttempt.bestScore) {
    moduleProgress.catAttempt.bestScore = score;
  }

  // Check if passed
  const passed = score >= module.cat.passingScore;

  if (passed) {
    moduleProgress.catAttempt.passed = true;

    // If all topics already completed, mark module as completed
    if (allTopicsCompleted) {
      moduleProgress.completed = true;
      moduleProgress.completedAt = Date.now();
    }
  }

  // Recalculate overall progress
  progress.overallProgress = progress.calculateOverallProgress(course);

  // Check if entire course is now completed
  if (progress.overallProgress === 100 && !progress.completed) {
    progress.completed = true;
    progress.completedAt = Date.now();
  }

  // Save progress
  await progress.save();

  res.status(200).json({
    success: true,
    data: {
      score,
      passed,
      bestScore: moduleProgress.catAttempt.bestScore,
      attempts: moduleProgress.catAttempt.attempts,
      maxAttempts: module.cat.maxAttempts,
      moduleCompleted: moduleProgress.completed,
      overallProgress: progress.overallProgress,
      courseCompleted: progress.completed,
    },
  });
});

// @desc    Get student progress for course
// @route   GET /api/courses/student/:id/progress
// @access  Private (Student)
exports.getStudentProgress = asyncHandler(async (req, res, next) => {
  const progress = await Progress.findOne({
    user: req.user.id,
    course: req.params.id,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress record not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: progress,
  });
});
