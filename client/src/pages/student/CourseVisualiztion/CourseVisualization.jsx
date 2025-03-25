import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

import { useAuth } from '../../../context/AuthContext';

const CourseVisualization = () => {
  // Use authentication context
  const { user } = useAuth();

  // State for course data
  const [courseInfo, setCourseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);
  
  // States for navigation and interaction
  const [activeModule, setActiveModule] = useState(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const [activePage, setActivePage] = useState('topic'); // 'topic', 'html', 'practice', 'assessment'
  const [userAnswers, setUserAnswers] = useState({});
  
  // Track module completion status
  const [moduleCompletion, setModuleCompletion] = useState({});

  // Load course data
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // Fetch user's enrolled courses
        const response = await axios.get(`/api/enrollments/user/${user._id}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Assuming the first enrollment is selected
        if (response.data.count > 0) {
          // Extract the course from the first enrollment
          const enrolledCourse = response.data.data[0].course;
          
          // Transform the backend data to match the existing component structure
          const transformedCourseData = {
            success: true,
            data: [{ course: enrolledCourse }]
          };

          setCourseInfo(transformedCourseData);
          setInitialLoadFailed(false);
        } else {
          setInitialLoadFailed(true);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setInitialLoadFailed(true);
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [user]);

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

  // Handle page reload
  const handleReload = () => {
    window.location.reload();
  };

  // Get current content based on active page
  const getCurrentContent = () => {
    if (isLoading) {
      return <div>Loading course content...</div>;
    }

    if (initialLoadFailed) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4">Almost There!</h2>
          <p className="text-gray-600 mb-8 text-center max-w-md">
            We're having trouble loading your course data. Click the button below to refresh and try again.
          </p>
          <button
            onClick={handleReload}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Course
          </button>
        </div>
      );
    }

    if (!course) {
      return <div>Select a topic to begin</div>;
    }
    
    const currentModule = course.modules[activeModule];
    const currentTopic = currentModule.topics[activeTopic];
    const questions = getCurrentQuestions();
    const passingScore = activePage === 'practice' 
      ? currentTopic.passingScore 
      : currentModule.cat?.passingScore;
    
    switch (activePage) {
      case 'topic':
        return (
          <div className="topic-content p-6 bg-white rounded-lg shadow">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <h2 className="text-xl font-semibold mb-4 text-gray-600">{currentModule.title}</h2>
              <h3 className="text-lg font-medium mb-4">{currentTopic.title}</h3>
              <p className="mb-6">{currentModule.description}</p>
            </div>
            
            <div className="navigation-buttons flex space-x-4 mt-8">
              <button 
                onClick={() => setActivePage('html')} 
                className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
                style={{backgroundColor: colors.accent}}
              >
                View Topic Content
              </button>
              
              {currentTopic.practiceQuestions && currentTopic.practiceQuestions.length > 0 && (
                <button 
                  onClick={() => setActivePage('practice')} 
                  className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
                  style={{backgroundColor: colors.accent}}
                >
                  Practice Questions ({currentTopic.practiceQuestions.length})
                </button>
              )}
            </div>
          </div>
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

  if (initialLoadFailed) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Almost There!</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We're preparing your course! Click here to continue
          </p>
          <button
            onClick={handleReload}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Access Course
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading ...</div>
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