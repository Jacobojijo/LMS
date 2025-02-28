const mongoose = require('mongoose');

// Lesson Schema
const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a lesson title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add lesson content']
  },
  order: {
    type: Number,
    required: true
  }
});

// Topic Schema
const TopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a topic title'],
    trim: true
  },
  lessons: [LessonSchema],
  order: {
    type: Number,
    required: true
  }
});

// Assessment Schema (for CATs and Final Exam)
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Please add options'],
    validate: {
      validator: function(v) {
        return v.length >= 2; // At least 2 options
      },
      message: 'Please add at least 2 options'
    }
  },
  correctAnswers: {
    type: [Number],
    required: [true, 'Please add correct answer(s)'],
    validate: {
      validator: function(v) {
        return v.length >= 1 && Math.max(...v) < this.options.length;
      },
      message: 'Correct answers must reference valid options'
    }
  }
});

const AssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an assessment title'],
    trim: true
  },
  description: {
    type: String
  },
  questions: [QuestionSchema],
  type: {
    type: String,
    enum: ['CAT', 'Final Exam'],
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

// Module Schema
const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a module title'],
    trim: true
  },
  topics: [TopicSchema],
  assessments: [AssessmentSchema],
  order: {
    type: Number,
    required: true
  }
});

// Course Schema
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    unique: true,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  overview: {
    type: String,
    required: [true, 'Please add a course overview']
  },
  structure: {
    type: String,
    required: [true, 'Please add course structure']
  },
  modules: [ModuleSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Check if user has access to this course
CourseSchema.methods.hasUserAccess = async function(userId) {
  // This assumes Enrollment model is imported at the top of the file
  const Enrollment = require('./Enrollment');
  
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: this._id,
    status: 'active'
  });
  
  return !!enrollment;
};

// Check if user has access to a specific module in this course
CourseSchema.methods.hasModuleAccess = async function(userId, moduleId) {
  const Enrollment = require('./Enrollment');
  
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: this._id,
    status: 'active'
  });
  
  if (!enrollment) {
    return false;
  }
  
  // If moduleAccess is empty, user has access to all modules
  return enrollment.moduleAccess.length === 0 || 
         enrollment.moduleAccess.includes(moduleId);
};

module.exports = mongoose.model('Course', CourseSchema);
