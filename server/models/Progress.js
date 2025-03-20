const mongoose = require("mongoose");

// Track attempts and scores for practice questions
const PracticeAttemptSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  passed: {
    type: Boolean,
    default: false,
  },
  lastAttemptedAt: {
    type: Date,
    default: Date.now,
  },
});

// Track attempts and scores for CAT
const CATAttemptSchema = new mongoose.Schema({
  attempts: {
    type: Number,
    default: 0,
    max: 5, // Maximum 5 attempts allowed
  },
  bestScore: {
    type: Number,
    default: 0,
  },
  passed: {
    type: Boolean,
    default: false,
  },
  lastAttemptedAt: {
    type: Date,
    default: Date.now,
  },
});

// Topic progress schema
const TopicProgressSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
  practiceAttempts: [PracticeAttemptSchema],
  completedAt: {
    type: Date,
  },
});

// Module progress schema
const ModuleProgressSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  topics: [TopicProgressSchema],
  catAttempt: CATAttemptSchema,
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

// Student progress schema
const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
  modules: [ModuleProgressSchema],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate progress records
ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

// Update timestamp before saving
ProgressSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Helper method to calculate if a topic is completed
ProgressSchema.methods.isTopicCompleted = function (topicId) {
  for (const module of this.modules) {
    const topic = module.topics.find(
      (t) => t.topicId.toString() === topicId.toString()
    );
    if (topic && topic.completed) {
      return true;
    }
  }
  return false;
};

// Helper method to check if all practice questions in a topic are passed
ProgressSchema.methods.areAllPracticeQuestionsPassed = function (topicId) {
  for (const module of this.modules) {
    const topic = module.topics.find(
      (t) => t.topicId.toString() === topicId.toString()
    );
    if (topic) {
      // Check if all practice attempts are passed
      return topic.practiceAttempts.every((attempt) => attempt.passed);
    }
  }
  return false;
};

// Helper method to check if a module CAT is passed
ProgressSchema.methods.isModuleCATCompleted = function (moduleId) {
  const module = this.modules.find(
    (m) => m.moduleId.toString() === moduleId.toString()
  );
  return module && module.catAttempt && module.catAttempt.passed;
};

// Helper method to check if student can access next topic
ProgressSchema.methods.canAccessNextTopic = function (
  currentTopicId,
  courseData
) {
  // First, we need to find the current topic in the course structure
  let currentModuleIndex = -1;
  let currentTopicIndex = -1;

  // Find current module and topic indexes
  for (let i = 0; i < courseData.modules.length; i++) {
    const moduleTopics = courseData.modules[i].topics;
    for (let j = 0; j < moduleTopics.length; j++) {
      if (moduleTopics[j]._id.toString() === currentTopicId.toString()) {
        currentModuleIndex = i;
        currentTopicIndex = j;
        break;
      }
    }
    if (currentModuleIndex !== -1) break;
  }

  // If we couldn't find the topic, return false
  if (currentModuleIndex === -1 || currentTopicIndex === -1) {
    return false;
  }

  // Check if current topic is completed
  return this.isTopicCompleted(currentTopicId);
};

// Helper method to check if student can access next module
ProgressSchema.methods.canAccessNextModule = function (
  currentModuleId,
  courseData
) {
  // Find current module index
  const currentModuleIndex = courseData.modules.findIndex(
    (m) => m._id.toString() === currentModuleId.toString()
  );

  // If we couldn't find the module, return false
  if (currentModuleIndex === -1) {
    return false;
  }

  // Check if current module is completed
  const moduleProgress = this.modules.find(
    (m) => m.moduleId.toString() === currentModuleId.toString()
  );

  return moduleProgress && moduleProgress.completed;
};

// Helper method to calculate overall progress
ProgressSchema.methods.calculateOverallProgress = function (courseData) {
  let totalItems = 0;
  let completedItems = 0;

  // Count modules, topics, and assessments
  courseData.modules.forEach((module) => {
    totalItems++; // Count module itself

    // Find module progress
    const moduleProgress = this.modules.find(
      (m) => m.moduleId.toString() === module._id.toString()
    );

    if (moduleProgress && moduleProgress.completed) {
      completedItems++;
    }

    // Count topics in this module
    module.topics.forEach((topic) => {
      totalItems++; // Count topic itself

      // Find topic progress
      const topicProgress = moduleProgress?.topics.find(
        (t) => t.topicId.toString() === topic._id.toString()
      );

      if (topicProgress && topicProgress.completed) {
        completedItems++;
      }
    });

    // Count module CAT
    if (module.cat) {
      totalItems++;

      if (
        moduleProgress &&
        moduleProgress.catAttempt &&
        moduleProgress.catAttempt.passed
      ) {
        completedItems++;
      }
    }
  });

  // Calculate percentage
  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
};

module.exports = mongoose.model("Progress", ProgressSchema);
