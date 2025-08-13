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
    subtopicId,
    page, 
    completedModules = [], 
    completedTopics = [],
    completedSubtopics = [],
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
    // Find or create progress record
    let progress = await Progress.findOne({ 
      user: req.user.id, 
      course: courseId 
    });

    if (!progress) {
      // Create new progress record
      const course = await Course.findById(courseId);
      if (!course) {
        return next(new ErrorResponse('Course not found', 404));
      }

      progress = new Progress({
        user: req.user.id,
        course: courseId
      });

      // Initialize progress structure
      progress.initializeForCourse(course);
    }

    // Update navigation fields
    if (moduleId) progress.currentModule = moduleId;
    if (topicId) progress.currentTopic = topicId;
    if (subtopicId) progress.currentSubtopic = subtopicId;
    if (page) progress.lastAccessedPage = page;
    progress.lastAccessedAt = Date.now();

    // Update completed items
    if (completedModules.length > 0) {
      completedModules.forEach(moduleId => {
        const moduleProgress = progress.modules.find(
          m => m.moduleId.toString() === moduleId.toString()
        );
        if (moduleProgress && !moduleProgress.completed) {
          moduleProgress.completed = true;
          moduleProgress.completedAt = Date.now();
        }
      });
    }

    if (completedTopics.length > 0) {
      completedTopics.forEach(({ moduleId, topicId }) => {
        const moduleProgress = progress.modules.find(
          m => m.moduleId.toString() === moduleId.toString()
        );
        if (moduleProgress) {
          const topicProgress = moduleProgress.topics.find(
            t => t.topicId.toString() === topicId.toString()
          );
          if (topicProgress && !topicProgress.completed) {
            topicProgress.completed = true;
            topicProgress.completedAt = Date.now();
          }
        }
      });
    }

    if (completedSubtopics.length > 0) {
      completedSubtopics.forEach(({ moduleId, topicId, subtopicId }) => {
        const moduleProgress = progress.modules.find(
          m => m.moduleId.toString() === moduleId.toString()
        );
        if (moduleProgress) {
          const topicProgress = moduleProgress.topics.find(
            t => t.topicId.toString() === topicId.toString()
          );
          if (topicProgress) {
            const subtopicProgress = topicProgress.subtopics.find(
              s => s.subtopicId.toString() === subtopicId.toString()
            );
            if (subtopicProgress && !subtopicProgress.completed) {
              subtopicProgress.completed = true;
              subtopicProgress.completedAt = Date.now();
            }
          }
        }
      });
    }

    if (completedAssessments.length > 0) {
      completedAssessments.forEach(moduleId => {
        const moduleProgress = progress.modules.find(
          m => m.moduleId.toString() === moduleId.toString()
        );
        if (moduleProgress) {
          moduleProgress.catAttempt.passed = true;
          moduleProgress.catAttempt.lastAttemptedAt = Date.now();
        }
      });
    }

    // Update overall progress if provided
    if (overallProgress !== undefined) {
      progress.overallProgress = overallProgress;
    } else {
      // Recalculate progress if course is available
      const course = await Course.findById(courseId);
      if (course) {
        progress.overallProgress = progress.calculateOverallProgress(course);
      }
    }

    // Check course completion
    if (progress.overallProgress === 100 && !progress.completed) {
      progress.completed = true;
      progress.completedAt = Date.now();
    }

    await progress.save();

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Progress update error:', error);
    
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
          currentSubtopic: null,
          lastAccessedPage: 'topic',
          completedModules: [],
          completedTopics: [],
          completedSubtopics: [],
          completedAssessments: [],
          overallProgress: 0
        }
      });
    }

    // Extract completed items for easy access
    const completedModules = progress.modules
      .filter(m => m.completed)
      .map(m => m.moduleId);

    const completedTopics = [];
    const completedSubtopics = [];

    progress.modules.forEach(moduleProgress => {
      moduleProgress.topics.forEach(topicProgress => {
        if (topicProgress.completed) {
          completedTopics.push({
            moduleId: moduleProgress.moduleId,
            topicId: topicProgress.topicId
          });
        }

        topicProgress.subtopics.forEach(subtopicProgress => {
          if (subtopicProgress.completed) {
            completedSubtopics.push({
              moduleId: moduleProgress.moduleId,
              topicId: topicProgress.topicId,
              subtopicId: subtopicProgress.subtopicId
            });
          }
        });
      });
    });

    const completedAssessments = progress.modules
      .filter(m => m.catAttempt.passed)
      .map(m => m.moduleId);

    // Prepare resume data
    const resumeData = {
      currentModule: progress.currentModule,
      currentTopic: progress.currentTopic,
      currentSubtopic: progress.currentSubtopic,
      lastAccessedPage: progress.lastAccessedPage || 'topic',
      completedModules,
      completedTopics,
      completedSubtopics,
      completedAssessments,
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

// Get detailed progress breakdown
const getDetailedProgress = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      course: courseId
    });

    if (!progress) {
      return next(new ErrorResponse('No progress found for this course', 404));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    // Build detailed progress breakdown
    const detailedProgress = {
      courseId: course._id,
      courseTitle: course.title,
      overallProgress: progress.overallProgress,
      completed: progress.completed,
      completedAt: progress.completedAt,
      modules: []
    };

    course.modules.forEach(module => {
      const moduleProgress = progress.modules.find(
        m => m.moduleId.toString() === module._id.toString()
      );

      const moduleData = {
        moduleId: module._id,
        moduleTitle: module.title,
        completed: moduleProgress ? moduleProgress.completed : false,
        completedAt: moduleProgress ? moduleProgress.completedAt : null,
        catProgress: moduleProgress ? {
          attempts: moduleProgress.catAttempt.attempts,
          bestScore: moduleProgress.catAttempt.bestScore,
          passed: moduleProgress.catAttempt.passed,
          lastAttemptedAt: moduleProgress.catAttempt.lastAttemptedAt
        } : null,
        topics: []
      };

      module.topics.forEach(topic => {
        const topicProgress = moduleProgress ? moduleProgress.topics.find(
          t => t.topicId.toString() === topic._id.toString()
        ) : null;

        const topicData = {
          topicId: topic._id,
          topicTitle: topic.title,
          topicType: topic.type,
          completed: topicProgress ? topicProgress.completed : false,
          viewed: topicProgress ? topicProgress.viewed : false,
          completedAt: topicProgress ? topicProgress.completedAt : null,
          practiceProgress: topicProgress ? {
            totalQuestions: topic.practiceQuestions.length,
            passedQuestions: topicProgress.practiceAttempts.filter(a => a.passed).length,
            attempts: topicProgress.practiceAttempts.length
          } : null
        };

        // Add subtopic data if it's a container topic
        if (topic.type === 'container' && topic.subtopics) {
          topicData.subtopics = topic.subtopics.map(subtopic => {
            const subtopicProgress = topicProgress ? topicProgress.subtopics.find(
              s => s.subtopicId.toString() === subtopic._id.toString()
            ) : null;

            return {
              subtopicId: subtopic._id,
              subtopicTitle: subtopic.title,
              completed: subtopicProgress ? subtopicProgress.completed : false,
              viewed: subtopicProgress ? subtopicProgress.viewed : false,
              completedAt: subtopicProgress ? subtopicProgress.completedAt : null,
              practiceProgress: subtopicProgress ? {
                totalQuestions: subtopic.practiceQuestions.length,
                passedQuestions: subtopicProgress.practiceAttempts.filter(a => a.passed).length,
                attempts: subtopicProgress.practiceAttempts.length
              } : null
            };
          });
        }

        moduleData.topics.push(topicData);
      });

      detailedProgress.modules.push(moduleData);
    });

    res.status(200).json({
      success: true,
      data: detailedProgress
    });
  } catch (error) {
    console.error('Get detailed progress error:', error);
    next(new ErrorResponse('Error retrieving detailed progress', 500));
  }
});

module.exports = {
  updateProgress,
  getProgress,
  resumeCourse,
  getDetailedProgress
};