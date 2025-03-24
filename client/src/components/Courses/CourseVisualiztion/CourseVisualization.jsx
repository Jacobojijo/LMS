import React, { useState, useEffect } from 'react';
import { 
  ModuleSidebar, 
  TopicContent, 
  HtmlContent,
  colors
} from './CourseComponents';

import {
  EnhancedPracticeQuestions,
  EnhancedAssessment
} from './ScoreCalculator'; 

// Assume we're importing the data from an asset file
import courseData from '../../../assets/file';

const CourseVisualization = () => {
  // State for course data
  const [courseInfo, setCourseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for navigation and interaction
  const [activeModule, setActiveModule] = useState(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const [activePage, setActivePage] = useState('topic'); // 'topic', 'html', 'practice', 'assessment'
  const [userAnswers, setUserAnswers] = useState({});
  
  // Track module completion status
  const [moduleCompletion, setModuleCompletion] = useState({});

  // Load course data
  useEffect(() => {
    // Load the imported data
    setCourseInfo(courseData);
    setIsLoading(false);
  }, []);

  // Reset answers when changing topics
  useEffect(() => {
    setUserAnswers({});
  }, [activeModule, activeTopic, activePage]);

  // Get the course object from the data
  const course = courseInfo?.success && courseInfo.data[0]?.course;

  // Handle navigation
  const navigateTo = (moduleIndex, topicIndex, page = 'topic') => {
    setActiveModule(moduleIndex);
    setActiveTopic(topicIndex);
    setActivePage(page);
    setUserAnswers({});
  };

  // Mark topic as complete
  const markTopicComplete = () => {
    const nextTopicIndex = activeTopic + 1;
    const currentModule = course.modules[activeModule];
    
    // Update completion status
    setModuleCompletion(prev => ({
      ...prev,
      [`${activeModule}-${activeTopic}`]: true
    }));
    
    // Check if there's a next topic in this module
    if (nextTopicIndex < currentModule.topics.length) {
      navigateTo(activeModule, nextTopicIndex);
    } else {
      // If no more topics, go to assessment or next module
      if (currentModule.cat) {
        navigateTo(activeModule, 0, 'assessment');
      } else if (activeModule + 1 < course.modules.length) {
        navigateTo(activeModule + 1, 0);
      }
    }
  };
  
  // Navigate to next module
  const navigateToNextModule = () => {
    // Mark the entire module as complete
    setModuleCompletion(prev => ({
      ...prev,
      [`module-${activeModule}`]: true
    }));
    
    // Go to next module if available
    if (activeModule + 1 < course.modules.length) {
      navigateTo(activeModule + 1, 0);
    } else {
      // Course completed!
      navigateTo(0, 0, 'topic'); // Reset to beginning or show completion screen
    }
  };

  // Get current questions
  const getCurrentQuestions = () => {
    if (!course) return [];
    const currentModule = course.modules[activeModule];
    
    if (activePage === 'assessment') {
      return currentModule.cat?.questions || [];
    } else if (activePage === 'practice') {
      return currentModule.topics[activeTopic].practiceQuestions || [];
    }
    return [];
  };

  // Calculate overall progress percentage
  const calculateProgress = () => {
    if (!course) return 0;
    
    let totalTopics = 0;
    let completedTopics = 0;
    
    course.modules.forEach((module, moduleIndex) => {
      // Count topics
      totalTopics += module.topics.length;
      
      // Count completed topics
      module.topics.forEach((_, topicIndex) => {
        if (moduleCompletion[`${moduleIndex}-${topicIndex}`]) {
          completedTopics++;
        }
      });
      
      // Count module assessment
      if (module.cat) {
        totalTopics++;
        if (moduleCompletion[`module-${moduleIndex}`]) {
          completedTopics++;
        }
      }
    });
    
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  };

  // Get current content based on active page
  const getCurrentContent = () => {
    if (!course) return <div>Select a topic to begin</div>;
    
    const currentModule = course.modules[activeModule];
    const currentTopic = currentModule.topics[activeTopic];
    const questions = getCurrentQuestions();
    const passingScore = activePage === 'practice' 
      ? currentTopic.passingScore 
      : currentModule.cat?.passingScore;
    
    switch (activePage) {
      case 'topic':
        return (
          <TopicContent 
            module={currentModule}
            topic={currentTopic}
            setActivePage={setActivePage}
          />
        );
      case 'html':
        return (
          <HtmlContent 
            module={currentModule}
            topic={currentTopic}
            setActivePage={setActivePage}
          />
        );
      case 'practice':
        return (
          <EnhancedPracticeQuestions 
            topic={currentTopic}
            module={currentModule}
            questions={questions}
            passingScore={passingScore}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            setActivePage={setActivePage}
            markTopicComplete={markTopicComplete}
            navigateToNextModule={navigateToNextModule}
          />
        );
      case 'assessment':
        return (
          <EnhancedAssessment 
            module={currentModule}
            questions={questions}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            setActivePage={setActivePage}
            navigateToNextModule={navigateToNextModule}
          />
        );
      default:
        return <div>Select a topic to begin</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading course data...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Error loading course data</div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="course-container flex h-screen">
      {/* Left Sidebar Navigation */}
      <ModuleSidebar 
        course={{
          ...course,
          progress // Add progress to the course object
        }}
        activeModule={activeModule}
        activeTopic={activeTopic}
        activePage={activePage}
        navigateTo={navigateTo}
        moduleCompletion={moduleCompletion}
      />
      
      {/* Main Content Area */}
      <div className="content-area w-3/4 overflow-y-auto p-6 bg-gray-100">
        <div className="container">
          {getCurrentContent()}
        </div>
      </div>
    </div>
  );
};

export default CourseVisualization;
