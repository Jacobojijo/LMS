const Progress = require('../models/Progress');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncMiddleware');

// Update progress for a specific course
const updateProgress = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { 
    moduleId, 
    topicId, 
    page, 
    completedModules = [], 
    completedTopics = [],
    completedAssessments = [],
    overallProgress 
  } = req.body;

  // Validate required fields
  if (!courseId) {
    return next(new ErrorResponse('Course ID is required', 400));
  }

  // Ensure user is authenticated
  if (!req.user || !req.user.id) {
    return next(new ErrorResponse('Authentication required', 401));
  }

  try {
    // Use findOneAndUpdate with upsert to handle potential race conditions
    const progress = await Progress.findOneAndUpdate(
      { 
        user: req.user.id, 
        course: courseId 
      },
      {
        $set: {
          user: req.user.id,
          course: courseId,
          currentModule: moduleId || null,
          currentTopic: topicId || null,
          lastAccessedPage: page || 'topic',
          lastAccessedAt: Date.now(),
          overallProgress: overallProgress || 0
        },
        $addToSet: {
          completedModules: { 
            $each: completedModules.map(moduleId => ({ moduleId }))
          },
          completedTopics: { 
            $each: completedTopics.map(({ moduleId, topicId }) => ({ moduleId, topicId }))
          },
          completedAssessments: { 
            $each: completedAssessments.map(moduleId => ({ moduleId }))
          }
        }
      },
      { 
        upsert: true,  // Create if not exists
        new: true,     // Return updated document
        setDefaultsOnInsert: true // Set default values if creating new
      }
    );

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    // Log the full error for debugging
    console.error('Progress update error:', error);
    
    // Check for specific duplicate key error
    if (error.code === 11000) {
      return next(new ErrorResponse('Progress for this course already exists', 409));
    }
    
    next(new ErrorResponse('Error updating progress', 500));
  }
});

// Get progress for a specific course
const getProgress = asyncHandler(async (req, res, next) => {
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

// Resume course with detailed progress information
const resumeCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  // Validate inputs
  if (!courseId) {
    return next(new ErrorResponse('Course ID is required', 400));
  }

  try {
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

    // If no progress found, return default empty progress
    if (!progress) {
      return res.status(200).json({
        success: true,
        data: {
          currentModule: null,
          currentTopic: null,
          lastAccessedPage: 'topic',
          completedModules: [],
          completedTopics: [],
          completedAssessments: [],
          overallProgress: 0
        }
      });
    }

    // Prepare resume data
    const resumeData = {
      currentModule: progress.currentModule,
      currentTopic: progress.currentTopic,
      lastAccessedPage: progress.lastAccessedPage || 'topic',
      completedModules: progress.completedModules.map(m => m.moduleId),
      completedTopics: progress.completedTopics.map(t => ({
        moduleId: t.moduleId,
        topicId: t.topicId
      })),
      completedAssessments: progress.completedAssessments.map(a => a.moduleId),
      overallProgress: progress.overallProgress || 0
    };

    res.status(200).json({
      success: true,
      data: resumeData
    });
  } catch (error) {
    console.error('Resume course error:', error);
    next(new ErrorResponse('Error retrieving course progress', 500));
  }
});

// Export as an object with the controller functions
module.exports = {
  updateProgress,
  getProgress,
  resumeCourse
};