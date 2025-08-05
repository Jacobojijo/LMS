const mongoose = require("mongoose");

// Update to PracticeQuestionSchema
const PracticeQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Please add a question"],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, "Please add options"],
    validate: {
      validator: function (v) {
        return v.length >= 2; // At least 2 options
      },
      message: "Please add at least 2 options",
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, "Please add correct answer index"],
    validate: {
      validator: function (v) {
        return v >= 0 && v < this.options.length;
      },
      message: "Correct answer must reference a valid option",
    },
  },
  explanation: {
    type: String,
    required: false,
  },
});

// SubtopicSchema - for topics that have multiple subtopics
const SubtopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a subtopic title"],
    trim: true,
  },
  htmlContent: {
    type: String,
    required: [true, "Please upload HTML content for this subtopic"],
  },
  order: {
    type: Number,
    required: true,
  },
  practiceQuestions: [PracticeQuestionSchema],
  passingScore: {
    type: Number,
    default: 50, // 50% passing score for practice questions
    min: 0,
    max: 100,
  },
});

// Updated TopicSchema - can either have subtopics OR be standalone with content
const TopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a topic title"],
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  order: {
    type: Number,
    required: true,
  },
  // Topic type: 'standalone' for single topics with content, 'container' for topics with subtopics
  type: {
    type: String,
    enum: ['standalone', 'container'],
    required: true,
    default: 'container'
  },
  
  // For standalone topics - same content structure as subtopics
  htmlContent: {
    type: String,
    required: function() {
      return this.type === 'standalone';
    },
    validate: {
      validator: function(v) {
        // If type is standalone, htmlContent is required
        if (this.type === 'standalone') {
          return v && v.trim().length > 0;
        }
        // If type is container, htmlContent should be empty or null
        return !v || v.trim().length === 0;
      },
      message: "Standalone topics must have HTML content, container topics should not"
    }
  },
  
  // For container topics - array of subtopics
  subtopics: {
    type: [SubtopicSchema],
    validate: {
      validator: function(v) {
        // If type is container, must have at least one subtopic
        if (this.type === 'container') {
          return v && v.length > 0;
        }
        // If type is standalone, should have no subtopics
        return !v || v.length === 0;
      },
      message: "Container topics must have subtopics, standalone topics should not"
    }
  },
  
  // Practice questions - can exist on both standalone and container topics
  practiceQuestions: [PracticeQuestionSchema],
  passingScore: {
    type: Number,
    default: 50, // 50% passing score for practice questions
    min: 0,
    max: 100,
  },
});

// Add validation to ensure topic structure consistency
TopicSchema.pre('validate', function(next) {
  if (this.type === 'standalone') {
    // Standalone topics should have content but no subtopics
    if (!this.htmlContent || this.htmlContent.trim().length === 0) {
      return next(new Error('Standalone topics must have HTML content'));
    }
    if (this.subtopics && this.subtopics.length > 0) {
      return next(new Error('Standalone topics cannot have subtopics'));
    }
  } else if (this.type === 'container') {
    // Container topics should have subtopics but no direct content
    if (!this.subtopics || this.subtopics.length === 0) {
      return next(new Error('Container topics must have at least one subtopic'));
    }
    if (this.htmlContent && this.htmlContent.trim().length > 0) {
      return next(new Error('Container topics should not have direct HTML content'));
    }
  }
  next();
});

// CAT Schema (Continuous Assessment Test - multiple choice)
const CATQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Please add a question"],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, "Please add options"],
    validate: {
      validator: function (v) {
        return v.length >= 2; // At least 2 options
      },
      message: "Please add at least 2 options",
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, "Please add correct answer index"],
    validate: {
      validator: function (v) {
        return v >= 0 && v < this.options.length;
      },
      message: "Correct answer must reference a valid option",
    },
  },
});

const CATSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a CAT title"],
    trim: true,
  },
  description: {
    type: String,
  },
  questions: [CATQuestionSchema],
  duration: {
    type: Number, // duration in minutes
    default: 30,
  },
  passingScore: {
    type: Number,
    default: 50, // 50% passing score for CAT
    min: 0,
    max: 100,
  },
  maxAttempts: {
    type: Number,
    default: 5,
    min: 1,
  },
});

// Module Schema
const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a module title"],
    trim: true,
  },
  description: {
    type: String,
  },
  topics: [TopicSchema],
  cat: CATSchema,
  order: {
    type: Number,
    required: true,
  },
});

// Course Schema
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a course title"],
    unique: true,
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  structure: {
    type: String,
    required: [true, "Please provide a path to the course structure HTML file"],
    trim: true,
    validate: {
      validator: function(v) {
        // Basic validation to ensure it looks like a file path
        return /\.(html|htm)$/.test(v);
      },
      message: "Structure must be a valid path to an HTML file"
    }
  },
  modules: [ModuleSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
});

// Check if user has access to this course
CourseSchema.methods.hasUserAccess = async function (userId) {
  const Enrollment = require("./Enrollment");

  const enrollment = await Enrollment.findOne({
    user: userId,
    course: this._id,
    status: "active",
  });

  return !!enrollment;
};

// Check if user has access to a specific module in this course
CourseSchema.methods.hasModuleAccess = async function (userId, moduleId) {
  const Enrollment = require("./Enrollment");

  const enrollment = await Enrollment.findOne({
    user: userId,
    course: this._id,
    status: "active",
  });

  if (!enrollment) {
    return false;
  }

  // If moduleAccess is empty, user has access to all modules
  return (
    enrollment.moduleAccess.length === 0 ||
    enrollment.moduleAccess.includes(moduleId)
  );
};

// Updated helper method to get all content items (topics and subtopics) in a course
CourseSchema.methods.getAllContentItems = function() {
  const contentItems = [];
  
  this.modules.forEach(module => {
    module.topics.forEach(topic => {
      if (topic.type === 'standalone') {
        // Add standalone topic as a content item
        contentItems.push({
          moduleId: module._id,
          moduleTitle: module.title,
          topicId: topic._id,
          topicTitle: topic.title,
          contentType: 'topic',
          order: topic.order,
          htmlContent: topic.htmlContent,
          practiceQuestions: topic.practiceQuestions
        });
      } else if (topic.type === 'container') {
        // Add each subtopic as a content item
        topic.subtopics.forEach(subtopic => {
          contentItems.push({
            moduleId: module._id,
            moduleTitle: module.title,
            topicId: topic._id,
            topicTitle: topic.title,
            subtopicId: subtopic._id,
            subtopicTitle: subtopic.title,
            contentType: 'subtopic',
            order: subtopic.order,
            htmlContent: subtopic.htmlContent,
            practiceQuestions: subtopic.practiceQuestions
          });
        });
      }
    });
  });
  
  return contentItems;
};

// Helper method to get all topics in a course (both standalone and container)
CourseSchema.methods.getAllTopics = function() {
  const topics = [];
  
  this.modules.forEach(module => {
    module.topics.forEach(topic => {
      topics.push({
        moduleId: module._id,
        moduleTitle: module.title,
        topicId: topic._id,
        topicTitle: topic.title,
        topicType: topic.type,
        order: topic.order,
        subtopicsCount: topic.subtopics ? topic.subtopics.length : 0
      });
    });
  });
  
  return topics;
};

// Legacy method for backward compatibility - now returns all content items
CourseSchema.methods.getAllSubtopics = function() {
  return this.getAllContentItems();
};

module.exports = mongoose.model("Course", CourseSchema);