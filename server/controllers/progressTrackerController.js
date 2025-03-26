const Progress = require('../models/Progress');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncMiddleware');

exports.updateProgress = asyncHandler(async (req, res, next) => {
  const { 
    courseId, 
    moduleId, 
    topicId, 
    page, 
    completedModules = [], 
    completedTopics = [],
    completedAssessments = [],
    overallProgress 
  } = req.body;

  // Find or create progress record
  let progress = await Progress.findOne({ 
    user: req.user.id, 
    course: courseId 
  });

  if (!progress) {
    progress = new Progress({
      user: req.user.id,
      course: courseId
    });
  }

  // Update current location
  progress.currentModule = moduleId;
  progress.currentTopic = topicId;
  progress.lastAccessedPage = page;

  // Update completed modules
  completedModules.forEach(moduleId => {
    if (!progress.completedModules.some(m => m.moduleId.toString() === moduleId)) {
      progress.completedModules.push({ moduleId });
    }
  });

  // Update completed topics
  completedTopics.forEach(({ moduleId, topicId }) => {
    if (!progress.completedTopics.some(
      t => t.moduleId.toString() === moduleId && 
            t.topicId.toString() === topicId
    )) {
      progress.completedTopics.push({ moduleId, topicId });
    }
  });

  // Update completed assessments
  completedAssessments.forEach(moduleId => {
    if (!progress.completedAssessments.some(a => a.moduleId.toString() === moduleId)) {
      progress.completedAssessments.push({ moduleId });
    }
  });

  // Update overall progress
  progress.overallProgress = overallProgress;
  progress.lastAccessedAt = Date.now();

  await progress.save();

  res.status(200).json({
    success: true,
    data: progress
  });
});

exports.getProgress = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const progress = await Progress.findOne({ 
    user: req.user.id, 
    course: courseId 
  }).populate('course currentModule currentTopic');

  if (!progress) {
    return next(new ErrorResponse('No progress found for this course', 404));
  }

  res.status(200).json({
    success: true,
    data: progress
  });
});

exports.resumeCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const progress = await Progress.findOne({ 
    user: req.user.id, 
    course: courseId 
  }).populate({
    path: 'course',
    populate: {
      path: 'modules',
      populate: {
        path: 'topics'
      }
    }
  });

  if (!progress) {
    return next(new ErrorResponse('No progress found for this course', 404));
  }

  // Prepare resume data
  const resumeData = {
    currentModule: progress.currentModule,
    currentTopic: progress.currentTopic,
    lastAccessedPage: progress.lastAccessedPage,
    completedModules: progress.completedModules.map(m => m.moduleId),
    completedTopics: progress.completedTopics.map(t => ({
      moduleId: t.moduleId,
      topicId: t.topicId
    })),
    completedAssessments: progress.completedAssessments.map(a => a.moduleId),
    overallProgress: progress.overallProgress
  };

  res.status(200).json({
    success: true,
    data: resumeData
  });
});