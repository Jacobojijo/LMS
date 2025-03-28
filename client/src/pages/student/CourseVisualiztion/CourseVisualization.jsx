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

// Updated to use environment variable
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

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

  // Rest of the code remains the same as in the previous implementation

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
