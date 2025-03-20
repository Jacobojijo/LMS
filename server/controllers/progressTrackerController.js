const Progress = require("../models/Progress");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncMiddleware");

// @desc    Initialize progress tracking for a student
// @route   POST /api/progress/initialize
// @access  Private (Admin or Student)
exports.initializeProgress = asyncHandler(async (req, res, next) => {
  const { userId, courseId } = req.body;

  // Check if user is admin or the same student
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return next(
      new ErrorResponse(
        "Not authorized to initialize progress for this user",
        403
      )
    );
  }

  // Check if enrollment exists
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
    status: "active",
  });

  if (!enrollment) {
    return next(new ErrorResponse(`User is not enrolled in this course`, 404));
  }

  // Check if progress already exists
  let progress = await Progress.findOne({
    user: userId,
    course: courseId,
  });

  if (progress) {
    return next(
      new ErrorResponse(
        `Progress tracking already initialized for this course`,
        400
      )
    );
  }

  // Get course structure to initialize progress
  const course = await Course.findById(courseId);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${courseId}`, 404)
    );
  }

  // Create progress structure based on course
  const modules = course.modules.map((module) => {
    const topics = module.topics.map((topic) => {
      // Create practice attempt records for each question
      const practiceAttempts = topic.practiceQuestions.map((question) => ({
        questionId: question._id,
        attempts: 0,
        passed: false,
      }));

      return {
        topicId: topic._id,
        completed: false,
        viewed: false,
        practiceAttempts,
      };
    });

    return {
      moduleId: module._id,
      topics,
      catAttempt: {
        attempts: 0,
        bestScore: 0,
        passed: false,
      },
      completed: false,
    };
  });

  // Create progress record
  progress = await Progress.create({
    user: userId,
    course: courseId,
    modules,
    overallProgress: 0,
    completed: false,
  });

  res.status(201).json({
    success: true,
    data: progress,
  });
});

// @desc    Get student progress for a course
// @route   GET /api/progress/:courseId
// @access  Private (Student and Admin)
exports.getProgress = asyncHandler(async (req, res, next) => {
  const progress = await Progress.findOne({
    user: req.user.id,
    course: req.params.courseId,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress not found for this course`, 404));
  }

  res.status(200).json({
    success: true,
    data: progress,
  });
});

// @desc    Mark topic as viewed
// @route   PUT /api/progress/view-topic/:courseId/:topicId
// @access  Private (Student)
exports.markTopicViewed = asyncHandler(async (req, res, next) => {
  const { courseId, topicId } = req.params;

  // Find progress record
  let progress = await Progress.findOne({
    user: req.user.id,
    course: courseId,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress not found for this course`, 404));
  }

  // Find module and topic
  let found = false;
  for (const module of progress.modules) {
    for (const topic of module.topics) {
      if (topic.topicId.toString() === topicId) {
        topic.viewed = true;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  if (!found) {
    return next(new ErrorResponse(`Topic not found in progress record`, 404));
  }

  await progress.save();

  res.status(200).json({
    success: true,
    data: progress,
  });
});

// @desc    Submit practice question attempt
// @route   POST /api/progress/practice-attempt/:courseId/:topicId/:questionId
// @access  Private (Student)
exports.submitPracticeAttempt = asyncHandler(async (req, res, next) => {
  const { courseId, topicId, questionId } = req.params;
  const { selectedAnswer } = req.body;

  // Find progress record
  let progress = await Progress.findOne({
    user: req.user.id,
    course: courseId,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress not found for this course`, 404));
  }

  // Get course to check correct answer
  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorResponse(`Course not found`, 404));
  }

  // Find the topic and question
  let topic = null;
  let question = null;

  for (const module of course.modules) {
    for (const t of module.topics) {
      if (t._id.toString() === topicId) {
        topic = t;
        for (const q of t.practiceQuestions) {
          if (q._id.toString() === questionId) {
            question = q;
            break;
          }
        }
        break;
      }
    }
    if (topic && question) break;
  }

  if (!topic || !question) {
    return next(new ErrorResponse(`Topic or question not found`, 404));
  }

  // Check if answer is correct
  const isCorrect = selectedAnswer === question.correctAnswer;

  // Update progress record
  let moduleProgress = null;
  let topicProgress = null;
  let practiceAttempt = null;

  for (const module of progress.modules) {
    for (const t of module.topics) {
      if (t.topicId.toString() === topicId) {
        topicProgress = t;
        moduleProgress = module;

        for (const attempt of t.practiceAttempts) {
          if (attempt.questionId.toString() === questionId) {
            practiceAttempt = attempt;

            // Increment attempts counter
            attempt.attempts += 1;

            // Update passed status if correct
            if (isCorrect) {
              attempt.passed = true;
            }

            attempt.lastAttemptedAt = Date.now();
            break;
          }
        }
        break;
      }
    }
    if (topicProgress && practiceAttempt) break;
  }

  if (!practiceAttempt) {
    return next(new ErrorResponse(`Practice attempt record not found`, 404));
  }

  // Check if all practice questions are now passed
  const allPassed = topicProgress.practiceAttempts.every(
    (attempt) => attempt.passed
  );

  // If all passed, mark topic as completed
  if (allPassed) {
    topicProgress.completed = true;
    topicProgress.completedAt = Date.now();

    // Check if all topics in module are completed
    const allTopicsCompleted = moduleProgress.topics.every((t) => t.completed);

    // If all topics completed and CAT is passed, mark module as completed
    if (allTopicsCompleted && moduleProgress.catAttempt.passed) {
      moduleProgress.completed = true;
      moduleProgress.completedAt = Date.now();
    }
  }

  // Calculate overall progress
  progress.overallProgress = progress.calculateOverallProgress(course);

  // Check if entire course is completed
  progress.completed = progress.modules.every((m) => m.completed);
  if (progress.completed && !progress.completedAt) {
    progress.completedAt = Date.now();

    // Update enrollment completion status
    await Enrollment.findOneAndUpdate(
      { user: req.user.id, course: courseId },
      {
        completionProgress: 100,
        status: "completed",
      }
    );
  } else {
    // Update enrollment progress
    await Enrollment.findOneAndUpdate(
      { user: req.user.id, course: courseId },
      { completionProgress: progress.overallProgress }
    );
  }

  await progress.save();

  res.status(200).json({
    success: true,
    data: {
      isCorrect,
      progress,
      explanation: question.explanation,
      nextAttemptAllowed: true, // Always allow practice attempts
    },
  });
});

// @desc    Submit CAT attempt
// @route   POST /api/progress/cat-attempt/:courseId/:moduleId
// @access  Private (Student)
exports.submitCATAttempt = asyncHandler(async (req, res, next) => {
  const { courseId, moduleId } = req.params;
  const { answers } = req.body;

  // Find progress record
  let progress = await Progress.findOne({
    user: req.user.id,
    course: courseId,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress not found for this course`, 404));
  }

  // Get course to check correct answers
  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorResponse(`Course not found`, 404));
  }

  // Find the module and CAT
  let module = null;

  for (const m of course.modules) {
    if (m._id.toString() === moduleId) {
      module = m;
      break;
    }
  }

  if (!module || !module.cat) {
    return next(new ErrorResponse(`Module or CAT not found`, 404));
  }

  // Find CAT attempt in progress
  let catAttempt = null;
  let moduleProgress = null;

  for (const m of progress.modules) {
    if (m.moduleId.toString() === moduleId) {
      catAttempt = m.catAttempt;
      moduleProgress = m;
      break;
    }
  }

  if (!catAttempt) {
    return next(new ErrorResponse(`CAT attempt record not found`, 404));
  }

  // Check if max attempts reached
  if (catAttempt.attempts >= module.cat.maxAttempts) {
    return next(
      new ErrorResponse(
        `Maximum attempts (${module.cat.maxAttempts}) reached for this CAT`,
        400
      )
    );
  }

  // Increment attempts counter
  catAttempt.attempts += 1;
  catAttempt.lastAttemptedAt = Date.now();

  // Calculate score
  let correctAnswers = 0;

  for (const [questionIndex, selectedAnswer] of Object.entries(answers)) {
    const catQuestion = module.cat.questions[questionIndex];

    if (catQuestion && selectedAnswer === catQuestion.correctAnswer) {
      correctAnswers++;
    }
  }

  const totalQuestions = module.cat.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  // Update best score if higher
  if (score > catAttempt.bestScore) {
    catAttempt.bestScore = score;
  }

  // Check if passed
  const passed = score >= module.cat.passingScore;
  catAttempt.passed = passed;

  // If passed and all topics are completed, mark module as completed
  if (passed && moduleProgress.topics.every((t) => t.completed)) {
    moduleProgress.completed = true;
    moduleProgress.completedAt = Date.now();
  }

  // Calculate overall progress
  progress.overallProgress = progress.calculateOverallProgress(course);

  // Check if entire course is completed
  progress.completed = progress.modules.every((m) => m.completed);
  if (progress.completed && !progress.completedAt) {
    progress.completedAt = Date.now();

    // Update enrollment completion status
    await Enrollment.findOneAndUpdate(
      { user: req.user.id, course: courseId },
      {
        completionProgress: 100,
        status: "completed",
      }
    );
  } else {
    // Update enrollment progress
    await Enrollment.findOneAndUpdate(
      { user: req.user.id, course: courseId },
      { completionProgress: progress.overallProgress }
    );
  }

  await progress.save();

  const nextAttemptAllowed =
    catAttempt.attempts < module.cat.maxAttempts && !passed;

  res.status(200).json({
    success: true,
    data: {
      score,
      passed,
      attempts: catAttempt.attempts,
      maxAttempts: module.cat.maxAttempts,
      nextAttemptAllowed,
      progress,
    },
  });
});

// @desc    Check if student can access next topic
// @route   GET /api/progress/can-access/:courseId/next-topic/:topicId
// @access  Private (Student)
exports.canAccessNextTopic = asyncHandler(async (req, res, next) => {
  const { courseId, topicId } = req.params;

  // Find progress record
  let progress = await Progress.findOne({
    user: req.user.id,
    course: courseId,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress not found for this course`, 404));
  }

  // Get course structure
  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorResponse(`Course not found`, 404));
  }

  const canAccess = progress.canAccessNextTopic(topicId, course);

  res.status(200).json({
    success: true,
    canAccess,
  });
});

// @desc    Check if student can access next module
// @route   GET /api/progress/can-access/:courseId/next-module/:moduleId
// @access  Private (Student)
exports.canAccessNextModule = asyncHandler(async (req, res, next) => {
  const { courseId, moduleId } = req.params;

  // Find progress record
  let progress = await Progress.findOne({
    user: req.user.id,
    course: courseId,
  });

  if (!progress) {
    return next(new ErrorResponse(`Progress not found for this course`, 404));
  }

  // Get course structure
  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorResponse(`Course not found`, 404));
  }

  const canAccess = progress.canAccessNextModule(moduleId, course);

  res.status(200).json({
    success: true,
    canAccess,
  });
});

// @desc    Get overall student progress summary (admin only)
// @route   GET /api/progress/admin/summary/:userId
// @access  Private (Admin only)
exports.getStudentProgressSummary = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  // Find all progress records for this student
  const progress = await Progress.find({ user: userId }).populate({
    path: "course",
    select: "title description",
  });

  if (!progress || progress.length === 0) {
    return next(
      new ErrorResponse(`No progress records found for this student`, 404)
    );
  }

  // Format into summary
  const summary = progress.map((p) => ({
    courseId: p.course._id,
    courseTitle: p.course.title,
    overallProgress: p.overallProgress,
    completed: p.completed,
    completedAt: p.completedAt,
    modulesCompleted: p.modules.filter((m) => m.completed).length,
    totalModules: p.modules.length,
  }));

  res.status(200).json({
    success: true,
    data: summary,
  });
});
