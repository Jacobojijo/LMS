const mongoose = require('mongoose');

// Updated Progress Schema to handle subtopics
const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // Module-level progress tracking
  modules: [{
    moduleId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Module',
      required: true
    },
    
    // Topic-level progress - tracks both standalone and container topics
    topics: [{
      topicId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topic',
        required: true
      },
      topicType: {
        type: String,
        enum: ['standalone', 'container'],
        required: true
      },
      
      // For standalone topics - track completion directly
      completed: {
        type: Boolean,
        default: false
      },
      viewed: {
        type: Boolean,
        default: false
      },
      completedAt: {
        type: Date
      },
      
      // For container topics - track subtopic progress
      subtopics: [{
        subtopicId: {
          type: mongoose.Schema.ObjectId,
          ref: 'Subtopic',
          required: true
        },
        completed: {
          type: Boolean,
          default: false
        },
        viewed: {
          type: Boolean,
          default: false
        },
        completedAt: {
          type: Date
        },
        practiceAttempts: [{
          questionId: {
            type: mongoose.Schema.ObjectId,
            ref: 'PracticeQuestion'
          },
          attempts: {
            type: Number,
            default: 0
          },
          passed: {
            type: Boolean,
            default: false
          },
          lastAttemptedAt: {
            type: Date
          }
        }]
      }],
      
      // Practice attempts for topic-level questions (both standalone and container topics)
      practiceAttempts: [{
        questionId: {
          type: mongoose.Schema.ObjectId,
          ref: 'PracticeQuestion'
        },
        attempts: {
          type: Number,
          default: 0
        },
        passed: {
          type: Boolean,
          default: false
        },
        lastAttemptedAt: {
          type: Date
        }
      }]
    }],
    
    // CAT attempt tracking
    catAttempt: {
      attempts: {
        type: Number,
        default: 0
      },
      bestScore: {
        type: Number,
        default: 0
      },
      passed: {
        type: Boolean,
        default: false
      },
      lastAttemptedAt: {
        type: Date
      }
    },
    
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  
  // Overall course progress
  overallProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  
  // Navigation tracking
  currentModule: {
    type: mongoose.Schema.ObjectId,
    ref: 'Module'
  },
  currentTopic: {
    type: mongoose.Schema.ObjectId,
    ref: 'Topic'
  },
  currentSubtopic: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subtopic'
  },
  lastAccessedPage: {
    type: String,
    enum: ['topic', 'subtopic', 'html', 'practice', 'assessment'],
    default: 'topic'
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate progress entries
ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

// Method to check if a topic is completed
ProgressSchema.methods.isTopicCompleted = function(topicId) {
  for (const moduleProgress of this.modules) {
    const topicProgress = moduleProgress.topics.find(
      t => t.topicId.toString() === topicId.toString()
    );
    
    if (topicProgress) {
      if (topicProgress.topicType === 'standalone') {
        return topicProgress.completed;
      } else if (topicProgress.topicType === 'container') {
        // Container topic is completed if all its subtopics are completed
        return topicProgress.subtopics.length > 0 && 
               topicProgress.subtopics.every(s => s.completed);
      }
    }
  }
  return false;
};

// Method to check if a subtopic is completed
ProgressSchema.methods.isSubtopicCompleted = function(topicId, subtopicId) {
  for (const moduleProgress of this.modules) {
    const topicProgress = moduleProgress.topics.find(
      t => t.topicId.toString() === topicId.toString()
    );
    
    if (topicProgress && topicProgress.topicType === 'container') {
      const subtopicProgress = topicProgress.subtopics.find(
        s => s.subtopicId.toString() === subtopicId.toString()
      );
      return subtopicProgress ? subtopicProgress.completed : false;
    }
  }
  return false;
};

// Method to check if module CAT is completed
ProgressSchema.methods.isModuleCATCompleted = function(moduleId) {
  const moduleProgress = this.modules.find(
    m => m.moduleId.toString() === moduleId.toString()
  );
  return moduleProgress ? moduleProgress.catAttempt.passed : false;
};

// Method to check if user can access the next module
ProgressSchema.methods.canAccessNextModule = function(prevModuleId, course) {
  const prevModuleProgress = this.modules.find(
    m => m.moduleId.toString() === prevModuleId.toString()
  );
  
  if (!prevModuleProgress) {
    return false;
  }
  
  // Check if all topics in previous module are completed
  const prevModule = course.modules.find(
    m => m._id.toString() === prevModuleId.toString()
  );
  
  if (!prevModule) {
    return false;
  }
  
  const allTopicsCompleted = prevModule.topics.every(topic => {
    return this.isTopicCompleted(topic._id);
  });
  
  // Check if CAT is passed (if module has CAT)
  const catPassed = prevModule.cat ? prevModuleProgress.catAttempt.passed : true;
  
  return allTopicsCompleted && catPassed;
};

// Method to calculate overall progress
ProgressSchema.methods.calculateOverallProgress = function(course) {
  if (!course || !course.modules || course.modules.length === 0) {
    return 0;
  }
  
  let totalContentItems = 0;
  let completedContentItems = 0;
  let totalCATs = 0;
  let completedCATs = 0;
  
  course.modules.forEach(module => {
    // Count CATs
    if (module.cat) {
      totalCATs += 1;
      const moduleProgress = this.modules.find(
        m => m.moduleId.toString() === module._id.toString()
      );
      if (moduleProgress && moduleProgress.catAttempt.passed) {
        completedCATs += 1;
      }
    }
    
    // Count content items (topics and subtopics)
    module.topics.forEach(topic => {
      if (topic.type === 'standalone') {
        totalContentItems += 1;
        if (this.isTopicCompleted(topic._id)) {
          completedContentItems += 1;
        }
      } else if (topic.type === 'container' && topic.subtopics) {
        totalContentItems += topic.subtopics.length;
        topic.subtopics.forEach(subtopic => {
          if (this.isSubtopicCompleted(topic._id, subtopic._id)) {
            completedContentItems += 1;
          }
        });
      }
    });
  });
  
  const totalItems = totalContentItems + totalCATs;
  const completedItems = completedContentItems + completedCATs;
  
  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
};

// Method to initialize progress for a course
ProgressSchema.methods.initializeForCourse = function(course) {
  this.modules = course.modules.map(module => {
    const moduleProgress = {
      moduleId: module._id,
      topics: module.topics.map(topic => {
        const topicProgress = {
          topicId: topic._id,
          topicType: topic.type,
          completed: false,
          viewed: false,
          practiceAttempts: [],
          subtopics: []
        };
        
        // Initialize subtopics for container topics
        if (topic.type === 'container' && topic.subtopics) {
          topicProgress.subtopics = topic.subtopics.map(subtopic => ({
            subtopicId: subtopic._id,
            completed: false,
            viewed: false,
            practiceAttempts: []
          }));
        }
        
        return topicProgress;
      }),
      catAttempt: {
        attempts: 0,
        bestScore: 0,
        passed: false
      },
      completed: false
    };
    
    return moduleProgress;
  });
  
  this.overallProgress = 0;
  this.completed = false;
  
  return this;
};

module.exports = mongoose.model('Progress', ProgressSchema);