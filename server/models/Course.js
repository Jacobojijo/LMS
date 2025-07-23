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

// New SubtopicSchema
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

// Updated TopicSchema to include subtopics
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
  subtopics: [SubtopicSchema],
  // Optional: Topic-level practice questions that cover all subtopics
  practiceQuestions: [PracticeQuestionSchema],
  passingScore: {
    type: Number,
    default: 50, // 50% passing score for topic-level practice questions
    min: 0,
    max: 100,
  },
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

// Helper method to get all subtopics in a course
CourseSchema.methods.getAllSubtopics = function() {
  const subtopics = [];
  this.modules.forEach(module => {
    module.topics.forEach(topic => {
      topic.subtopics.forEach(subtopic => {
        subtopics.push({
          moduleId: module._id,
          moduleTitle: module.title,
          topicId: topic._id,
          topicTitle: topic.title,
          subtopicId: subtopic._id,
          subtopicTitle: subtopic.title,
          order: subtopic.order
        });
      });
    });
  });
  return subtopics;
};

module.exports = mongoose.model("Course", CourseSchema);
