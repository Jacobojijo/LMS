const mongoose = require('mongoose');

// Practice Question Schema (multiple choice)
const PracticeQuestionSchema = new mongoose.Schema({
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
  correctAnswer: {
    type: Number,
    required: [true, 'Please add correct answer index'],
    validate: {
      validator: function(v) {
        return v >= 0 && v < this.options.length;
      },
      message: 'Correct answer must reference a valid option'
    }
  },
  explanation: {
    type: String,
    required: false
  }
});

// Topic Schema
const TopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a topic title'],
    trim: true
  },
  htmlContent: {
    type: String,
    required: [true, 'Please upload HTML content for this topic']
  },
  order: {
    type: Number,
    required: true
  },
  practiceQuestions: [PracticeQuestionSchema]
});

// CAT Schema (Continuous Assessment Test - multiple choice)
const CATQuestionSchema = new mongoose.Schema({
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
  correctAnswer: {
    type: Number,
    required: [true, 'Please add correct answer index'],
    validate: {
      validator: function(v) {
        return v >= 0 && v < this.options.length;
      },
      message: 'Correct answer must reference a valid option'
    }
  }
});

const CATSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a CAT title'],
    trim: true
  },
  description: {
    type: String
  },
  questions: [CATQuestionSchema],
  duration: {
    type: Number, // duration in minutes
    default: 30
  },
  passingScore: {
    type: Number,
    default: 60, // percentage
    min: 0,
    max: 100
  }
});

// Module Schema
const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a module title'],
    trim: true
  },
  description: {
    type: String
  },
  topics: [TopicSchema],
  cat: CATSchema,
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
  description: {
    type: String,
    required: [true, 'Please add a course description']
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
  },
  isPublished: {
    type: Boolean,
    default: false
  }
});

// Check if user has access to this course
CourseSchema.methods.hasUserAccess = async function(userId) {
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
