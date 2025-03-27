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

const BASE_API_URL = 'https://lms-ci8t.onrender.com/api'; // Or your local API URL

const CourseVisualization = () => {
  const { user } = useAuth();

  // State for course data
  const [courseInfo, setCourseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);
  
  // Progress tracking states
  const [moduleCompletion, setModuleCompletion] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);
  
  // States for navigation and interaction
  const [activeModule, setActiveModule] = useState(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const [activePage, setActivePage] = useState('topic');
  const [userAnswers, setUserAnswers] = useState({});

  // Load course data and resume progress
  useEffect(() => {
    const fetchCourseProgressAndData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        
        // Fetch user's enrolled courses
        const courseResponse = await axios.get(`${BASE_API_URL}/enrollments/user/${user._id}/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (courseResponse.data.count > 0) {
          const enrolledCourse = courseResponse.data.data[0].course;
          
          // Try to resume progress
          try {
            const progressResponse = await axios.get(`${BASE_API_URL}/progress/course/${enrolledCourse._id}/resume`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const progressData = progressResponse.data.data;
            
            // Initialize module completion from progress data
            const newModuleCompletion = {};
            
            // Mark completed modules
            progressData.completedModules?.forEach(moduleId => {
              const moduleIndex = enrolledCourse.modules.findIndex(m => m._id === moduleId);
              if (moduleIndex !== -1) {
                newModuleCompletion[`module-${moduleIndex}`] = true;
              }
            });

            // Mark completed topics
            progressData.completedTopics?.forEach(({ moduleId, topicId }) => {
              const moduleIndex = enrolledCourse.modules.findIndex(m => m._id === moduleId);
              if (moduleIndex !== -1) {
                const topicIndex = enrolledCourse.modules[moduleIndex].topics.findIndex(t => t._id === topicId);
                if (topicIndex !== -1) {
                  newModuleCompletion[`${moduleIndex}-${topicIndex}`] = true;
                }
              }
            });

            setModuleCompletion(newModuleCompletion);
            setOverallProgress(progressData.overallProgress || 0);

            // Set active navigation based on progress
            if (progressData.currentModule) {
              const moduleIndex = enrolledCourse.modules.findIndex(m => m._id === progressData.currentModule);
              if (moduleIndex !== -1) {
                setActiveModule(moduleIndex);
                
                if (progressData.currentTopic) {
                  const topicIndex = enrolledCourse.modules[moduleIndex].topics.findIndex(
                    t => t._id === progressData.currentTopic
                  );
                  if (topicIndex !== -1) {
                    setActiveTopic(topicIndex);
                  }
                }
              }
            }

            setActivePage(progressData.lastAccessedPage || 'topic');
          } catch (progressError) {
            console.log('No previous progress found, starting from beginning');
            // Initialize with first module/topic
            setActiveModule(0);
            setActiveTopic(0);
            setActivePage('topic');
          }

          setCourseInfo({
            success: true, 
            data: [{ course: enrolledCourse }]
          });
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

    fetchCourseProgressAndData();
  }, [user]);

  // Reset answers when changing topics
  useEffect(() => {
    setUserAnswers({});
  }, [activeModule, activeTopic, activePage]);

  // Update progress on server
  const updateProgress = async () => {
    if (!courseInfo?.data?.[0]?.course) return;

    try {
      const token = localStorage.getItem('token');
      const courseId = courseInfo.data[0].course._id;
      const currentModule = courseInfo.data[0].course.modules[activeModule];
      const currentTopic = currentModule.topics[activeTopic];

      // Prepare completed modules and topics
      const completedModules = [];
      const completedTopics = [];
      const completedAssessments = [];

      Object.keys(moduleCompletion).forEach(key => {
        if (key.startsWith('module-')) {
          const moduleIndex = key.split('-')[1];
          const moduleId = courseInfo.data[0].course.modules[moduleIndex]?._id;
          if (moduleId) {
            completedModules.push(moduleId);
            // Assume module assessments are completed when module is marked complete
            completedAssessments.push(moduleId);
          }
        } else if (key.includes('-')) {
          const [moduleIndex, topicIndex] = key.split('-');
          const moduleId = courseInfo.data[0].course.modules[moduleIndex]?._id;
          const topicId = courseInfo.data[0].course.modules[moduleIndex]?.topics[topicIndex]?._id;
          if (moduleId && topicId) {
            completedTopics.push({ moduleId, topicId });
          }
        }
      });

      await axios.put(`${BASE_API_URL}/progress/course/${courseId}`, {
        moduleId: currentModule._id,
        topicId: currentTopic._id,
        page: activePage,
        completedModules,
        completedTopics,
        completedAssessments,
        overallProgress: calculateProgress()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

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
    
    // Update completion status using activeTopic
    setModuleCompletion(prev => ({
      ...prev,
      [`${activeModule}-${activeTopic}`]: true
    }));

    // Update progress
    updateProgress();
    
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
      [`module-${activeModule}`]:true
    }));

    // Update progress
    updateProgress();
    
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
    
    let totalItems = 0;
    let completedItems = 0;
    
    course.modules.forEach((module, moduleIndex) => {
      // Count topics
      totalItems += module.topics.length;
      
      // Count completed topics
      module.topics.forEach((_, topicIndex) => {
        if (moduleCompletion[`${moduleIndex}-${topicIndex}`]) {
          completedItems++;
        }
      });
      
      // Count module assessment
      if (module.cat) {
        totalItems++;
        if (moduleCompletion[`module-${moduleIndex}`]) {
          completedItems++;
        }
      }
    });
    
    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    setOverallProgress(progress);
    return progress;
  };

  // Handle page reload
  const handleReload = () => {
    window.location.reload();
  };

  // Get current content based on active page
  const getCurrentContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full">Loading course content...</div>;
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
      return <div className="flex items-center justify-center h-full">Select a topic to begin</div>;
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
            markTopicComplete={markTopicComplete}
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
        return <div className="flex items-center justify-center h-full">Select a topic to begin</div>;
    }
  };

  // Update progress when completion status changes
  useEffect(() => {
    if (courseInfo && Object.keys(moduleCompletion).length > 0) {
      updateProgress();
    }
  }, [moduleCompletion]);

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

  return (
    <div className="course-container flex h-screen">
      {/* Left Sidebar Navigation */}
      <ModuleSidebar 
        course={{
          ...course,
          progress: overallProgress
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