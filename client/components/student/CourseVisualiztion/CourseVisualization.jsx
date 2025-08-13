// CourseVisualization.jsx - Updated with fixed progress calculation
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ModuleSidebar,
  TopicContent,
  SubtopicContent,
  HtmlContent,
  colors,
} from "./CourseComponents";

import {
  EnhancedPracticeQuestions,
  EnhancedAssessment,
} from "./ScoreCalculator";

import { useAuth } from "@/context/AuthContext";

const BASE_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
  const [activeSubtopic, setActiveSubtopic] = useState(null); // New state for subtopics
  const [activePage, setActivePage] = useState("topic");
  const [userAnswers, setUserAnswers] = useState({});

  // Load course data and resume progress
  useEffect(() => {
    const fetchCourseProgressAndData = async () => {
      // Verify BASE_API_URL is set
      if (!BASE_API_URL) {
        console.error("Backend URL is not configured");
        setInitialLoadFailed(true);
        setIsLoading(false);
        return;
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        // Fetch user's enrolled courses
        const courseResponse = await axios.get(
          `${BASE_API_URL}/api/enrollments/user/${user._id}/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (courseResponse.data.count > 0) {
          const enrolledCourse = courseResponse.data.data[0].course;

          // Try to resume progress
          try {
            const progressResponse = await axios.get(
              `${BASE_API_URL}/api/progress/course/${enrolledCourse._id}/resume`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const progressData = progressResponse.data.data;

            // Initialize module completion from progress data
            const newModuleCompletion = {};

            // Mark completed modules
            progressData.completedModules?.forEach((moduleId) => {
              const moduleIndex = enrolledCourse.modules.findIndex(
                (m) => m._id === moduleId
              );
              if (moduleIndex !== -1) {
                newModuleCompletion[`module-${moduleIndex}`] = true;
              }
            });

            // Mark completed topics and subtopics
            progressData.completedTopics?.forEach(({ moduleId, topicId, subtopicId }) => {
              const moduleIndex = enrolledCourse.modules.findIndex(
                (m) => m._id === moduleId
              );
              if (moduleIndex !== -1) {
                const topicIndex = enrolledCourse.modules[
                  moduleIndex
                ].topics.findIndex((t) => t._id === topicId);
                if (topicIndex !== -1) {
                  const topic = enrolledCourse.modules[moduleIndex].topics[topicIndex];
                  
                  if (topic.type === 'standalone') {
                    // Mark standalone topic as complete
                    newModuleCompletion[`${moduleIndex}-${topicIndex}`] = true;
                  } else if (topic.type === 'container' && subtopicId) {
                    // Mark specific subtopic as complete
                    const subtopicIndex = topic.subtopics?.findIndex((s) => s._id === subtopicId);
                    if (subtopicIndex !== -1) {
                      newModuleCompletion[`${moduleIndex}-${topicIndex}-${subtopicIndex}`] = true;
                    }
                  }
                }
              }
            });

            setModuleCompletion(newModuleCompletion);
            setOverallProgress(progressData.overallProgress || 0);

            // Set active navigation based on progress
            if (progressData.currentModule) {
              const moduleIndex = enrolledCourse.modules.findIndex(
                (m) => m._id === progressData.currentModule
              );
              if (moduleIndex !== -1) {
                setActiveModule(moduleIndex);

                if (progressData.currentTopic) {
                  const topicIndex = enrolledCourse.modules[
                    moduleIndex
                  ].topics.findIndex(
                    (t) => t._id === progressData.currentTopic
                  );
                  if (topicIndex !== -1) {
                    setActiveTopic(topicIndex);

                    // Set active subtopic if it exists
                    if (progressData.currentSubtopic) {
                      const topic = enrolledCourse.modules[moduleIndex].topics[topicIndex];
                      const subtopicIndex = topic.subtopics?.findIndex(
                        (s) => s._id === progressData.currentSubtopic
                      );
                      if (subtopicIndex !== -1) {
                        setActiveSubtopic(subtopicIndex);
                      }
                    }
                  }
                }
              }
            }

            setActivePage(progressData.lastAccessedPage || "topic");
          } catch (progressError) {
            console.log("No previous progress found, starting from beginning");
            // Initialize with first module/topic
            setActiveModule(0);
            setActiveTopic(0);
            setActiveSubtopic(null);
            setActivePage("topic");
          }

          setCourseInfo({
            success: true,
            data: [{ course: enrolledCourse }],
          });
          setInitialLoadFailed(false);
        } else {
          setInitialLoadFailed(true);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching course data:", err);
        setInitialLoadFailed(true);
        setIsLoading(false);
      }
    };

    fetchCourseProgressAndData();
  }, [user]);

  // Reset answers when changing topics or subtopics
  useEffect(() => {
    setUserAnswers({});
  }, [activeModule, activeTopic, activeSubtopic, activePage]);

  // Update progress on server
  const updateProgress = async () => {
    if (!courseInfo?.data?.[0]?.course) return;

    try {
      const token = localStorage.getItem("token");
      const courseId = courseInfo.data[0].course._id;
      const currentModule = courseInfo.data[0].course.modules[activeModule];
      const currentTopic = currentModule.topics[activeTopic];

      // Prepare completed modules, topics, and subtopics
      const completedModules = [];
      const completedTopics = [];
      const completedAssessments = [];

      Object.keys(moduleCompletion).forEach((key) => {
        if (key.startsWith("module-")) {
          const moduleIndex = key.split("-")[1];
          const moduleId = courseInfo.data[0].course.modules[moduleIndex]?._id;
          if (moduleId) {
            completedModules.push(moduleId);
            // Assume module assessments are completed when module is marked complete
            completedAssessments.push(moduleId);
          }
        } else if (key.includes("-")) {
          const parts = key.split("-");
          if (parts.length === 2) {
            // Topic completion (standalone topics)
            const [moduleIndex, topicIndex] = parts;
            const moduleId = courseInfo.data[0].course.modules[moduleIndex]?._id;
            const topicId =
              courseInfo.data[0].course.modules[moduleIndex]?.topics[topicIndex]
                ?._id;
            if (moduleId && topicId) {
              completedTopics.push({ moduleId, topicId });
            }
          } else if (parts.length === 3) {
            // Subtopic completion
            const [moduleIndex, topicIndex, subtopicIndex] = parts;
            const moduleId = courseInfo.data[0].course.modules[moduleIndex]?._id;
            const topicId =
              courseInfo.data[0].course.modules[moduleIndex]?.topics[topicIndex]
                ?._id;
            const subtopicId =
              courseInfo.data[0].course.modules[moduleIndex]?.topics[topicIndex]
                ?.subtopics?.[subtopicIndex]?._id;
            if (moduleId && topicId && subtopicId) {
              completedTopics.push({ moduleId, topicId, subtopicId });
            }
          }
        }
      });

      const updateData = {
        moduleId: currentModule._id,
        topicId: currentTopic._id,
        page: activePage,
        completedModules,
        completedTopics,
        completedAssessments,
        overallProgress: calculateProgress(),
      };

      // Add subtopic if active
      if (activeSubtopic !== null && currentTopic.subtopics?.[activeSubtopic]) {
        updateData.subtopicId = currentTopic.subtopics[activeSubtopic]._id;
      }

      await axios.put(
        `${BASE_API_URL}/api/progress/course/${courseId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  // Get the course object from the data
  const course = courseInfo?.success && courseInfo.data[0]?.course;

  // Handle navigation - updated to support subtopics
  const navigateTo = (moduleIndex, topicIndex, subtopicIndex = null, page = "topic") => {
    setActiveModule(moduleIndex);
    setActiveTopic(topicIndex);
    setActiveSubtopic(subtopicIndex);
    setActivePage(page);
    setUserAnswers({});
  };

  // Mark topic as complete (for standalone topics)
  const markTopicComplete = () => {
    const nextTopicIndex = activeTopic + 1;
    const currentModule = course.modules[activeModule];

    // Update completion status using activeTopic
    setModuleCompletion((prev) => ({
      ...prev,
      [`${activeModule}-${activeTopic}`]: true,
    }));

    // Navigate to next topic or assessment
    if (nextTopicIndex < currentModule.topics.length) {
      const nextTopic = currentModule.topics[nextTopicIndex];
      
      // If next topic is a container with subtopics, go directly to first subtopic
      if (nextTopic.type === 'container' && nextTopic.subtopics && nextTopic.subtopics.length > 0) {
        navigateTo(activeModule, nextTopicIndex, 0, "subtopic");
      } else {
        navigateTo(activeModule, nextTopicIndex);
      }
    } else {
      // If no more topics, go to assessment or next module
      if (currentModule.cat) {
        navigateTo(activeModule, 0, null, "assessment");
      } else if (activeModule + 1 < course.modules.length) {
        const nextModule = course.modules[activeModule + 1];
        const firstTopic = nextModule.topics[0];
        
        // If first topic of next module is container, go to first subtopic
        if (firstTopic.type === 'container' && firstTopic.subtopics && firstTopic.subtopics.length > 0) {
          navigateTo(activeModule + 1, 0, 0, "subtopic");
        } else {
          navigateTo(activeModule + 1, 0);
        }
      }
    }
  };

  // Mark subtopic as complete
  const markSubtopicComplete = () => {
    const currentModule = course.modules[activeModule];
    const currentTopic = currentModule.topics[activeTopic];

    // Update completion status for current subtopic
    setModuleCompletion((prev) => ({
      ...prev,
      [`${activeModule}-${activeTopic}-${activeSubtopic}`]: true,
    }));

    // Navigate to next subtopic or next topic
    const nextSubtopicIndex = activeSubtopic + 1;
    
    if (nextSubtopicIndex < currentTopic.subtopics.length) {
      // Go to next subtopic
      navigateTo(activeModule, activeTopic, nextSubtopicIndex, "subtopic");
    } else {
      // All subtopics completed, check if there are topic-level practice questions
      if (currentTopic.practiceQuestions && currentTopic.practiceQuestions.length > 0) {
        navigateTo(activeModule, activeTopic, null, "practice");
      } else {
        // Move to next topic
        const nextTopicIndex = activeTopic + 1;
        if (nextTopicIndex < currentModule.topics.length) {
          const nextTopic = currentModule.topics[nextTopicIndex];
          
          // If next topic is container, go directly to first subtopic
          if (nextTopic.type === 'container' && nextTopic.subtopics && nextTopic.subtopics.length > 0) {
            navigateTo(activeModule, nextTopicIndex, 0, "subtopic");
          } else {
            navigateTo(activeModule, nextTopicIndex);
          }
        } else {
          // Go to assessment or next module
          if (currentModule.cat) {
            navigateTo(activeModule, 0, null, "assessment");
          } else if (activeModule + 1 < course.modules.length) {
            const nextModule = course.modules[activeModule + 1];
            const firstTopic = nextModule.topics[0];
            
            // If first topic of next module is container, go to first subtopic
            if (firstTopic.type === 'container' && firstTopic.subtopics && firstTopic.subtopics.length > 0) {
              navigateTo(activeModule + 1, 0, 0, "subtopic");
            } else {
              navigateTo(activeModule + 1, 0);
            }
          }
        }
      }
    }
  };

  // Navigate to next module
  const navigateToNextModule = () => {
    // Mark the entire module as complete
    setModuleCompletion((prev) => ({
      ...prev,
      [`module-${activeModule}`]: true,
    }));

    // Go to next module if available
    if (activeModule + 1 < course.modules.length) {
      const nextModule = course.modules[activeModule + 1];
      const firstTopic = nextModule.topics[0];
      
      // If first topic is container, go directly to first subtopic
      if (firstTopic.type === 'container' && firstTopic.subtopics && firstTopic.subtopics.length > 0) {
        navigateTo(activeModule + 1, 0, 0, "subtopic");
      } else {
        navigateTo(activeModule + 1, 0);
      }
    } else {
      // Course completed!
      navigateTo(0, 0, null, "topic"); // Reset to beginning or show completion screen
    }
  };

  // Get current questions - updated to handle subtopics
  const getCurrentQuestions = () => {
    if (!course) return [];
    const currentModule = course.modules[activeModule];

    if (activePage === "assessment") {
      return currentModule.cat?.questions || [];
    } else if (activePage === "practice") {
      if (activeSubtopic !== null) {
        // Subtopic practice questions
        const currentTopic = currentModule.topics[activeTopic];
        return currentTopic.subtopics?.[activeSubtopic]?.practiceQuestions || [];
      } else {
        // Topic practice questions
        return currentModule.topics[activeTopic].practiceQuestions || [];
      }
    }
    return [];
  };

  // Fixed progress calculation that updates properly
  const calculateProgress = () => {
    if (!course) return 0;

    let totalItems = 0;
    let completedItems = 0;

    course.modules.forEach((module, moduleIndex) => {
      // Count content items (topics and subtopics)
      module.topics.forEach((topic, topicIndex) => {
        if (topic.type === 'standalone') {
          totalItems++;
          if (moduleCompletion[`${moduleIndex}-${topicIndex}`]) {
            completedItems++;
          }
        } else if (topic.type === 'container' && topic.subtopics) {
          totalItems += topic.subtopics.length;
          topic.subtopics.forEach((_, subtopicIndex) => {
            if (moduleCompletion[`${moduleIndex}-${topicIndex}-${subtopicIndex}`]) {
              completedItems++;
            }
          });
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
    return progress;
  };

  // Update overall progress when moduleCompletion changes
  useEffect(() => {
    if (course) {
      const newProgress = calculateProgress();
      setOverallProgress(newProgress);
      updateProgress();
    }
  }, [moduleCompletion, course]);

  // Handle page reload
  const handleReload = () => {
    window.location.reload();
  };

  // Get current content based on active page - updated for subtopics
  const getCurrentContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          Loading course content...
        </div>
      );
    }

    if (initialLoadFailed) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4">Almost There!</h2>
          <p className="text-gray-600 mb-8 text-center max-w-md">
            We're having trouble loading your course data. Click the button
            below to refresh and try again.
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
      return (
        <div className="flex items-center justify-center h-full">
          Select a topic to begin
        </div>
      );
    }

    const currentModule = course.modules[activeModule];
    const currentTopic = currentModule.topics[activeTopic];
    const currentSubtopic = activeSubtopic !== null ? currentTopic.subtopics?.[activeSubtopic] : null;
    const questions = getCurrentQuestions();
    
    // Determine passing score based on context
    let passingScore;
    if (activePage === "assessment") {
      passingScore = currentModule.cat?.passingScore;
    } else if (activePage === "practice") {
      if (currentSubtopic) {
        passingScore = currentSubtopic.passingScore;
      } else {
        passingScore = currentTopic.passingScore;
      }
    }

    switch (activePage) {
      case "topic":
        return (
          <TopicContent
            module={currentModule}
            topic={currentTopic}
            setActivePage={setActivePage}
            markTopicComplete={markTopicComplete}
          />
        );

      case "subtopic":
        if (!currentSubtopic) {
          return (
            <div className="flex items-center justify-center h-full">
              Subtopic not found
            </div>
          );
        }
        return (
          <SubtopicContent
            module={currentModule}
            topic={currentTopic}
            subtopic={currentSubtopic}
            setActivePage={setActivePage}
            markSubtopicComplete={markSubtopicComplete}
          />
        );

      case "html":
        return (
          <HtmlContent
            module={currentModule}
            topic={currentTopic}
            subtopic={currentSubtopic}
            setActivePage={setActivePage}
            markTopicComplete={markTopicComplete}
            markSubtopicComplete={markSubtopicComplete}
          />
        );

      case "practice":
        return (
          <EnhancedPracticeQuestions
            topic={currentSubtopic || currentTopic}
            module={currentModule}
            questions={questions}
            passingScore={passingScore}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            setActivePage={setActivePage}
            markTopicComplete={currentSubtopic ? markSubtopicComplete : markTopicComplete}
            navigateToNextModule={navigateToNextModule}
            isSubtopic={!!currentSubtopic}
          />
        );

      case "assessment":
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
        return (
          <div className="flex items-center justify-center h-full">
            Select a topic to begin
          </div>
        );
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

  return (
    <div className="course-container flex h-screen">
      {/* Left Sidebar Navigation */}
      <ModuleSidebar
        course={{
          ...course,
          progress: overallProgress,
        }}
        activeModule={activeModule}
        activeTopic={activeTopic}
        activeSubtopic={activeSubtopic}
        activePage={activePage}
        navigateTo={navigateTo}
        moduleCompletion={moduleCompletion}
      />

      {/* Main Content Area */}
      <div className="content-area w-3/4 overflow-y-auto p-6 bg-gray-100">
        <div className="container">{getCurrentContent()}</div>
      </div>
    </div>
  );
};

export default CourseVisualization;