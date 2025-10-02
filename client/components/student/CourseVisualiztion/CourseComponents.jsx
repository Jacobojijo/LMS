// coursecomponents.jsx - Fixed with persistent unlocking logic
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, ChevronRight } from "lucide-react";

// Theme colors - used throughout the components
export const colors = {
  lightBeige: "#F0D6B9",
  lightTeal: "#C8E6E4",
  lightRose: "#ECC6C6",
  darkText: "#333333",
  lightText: "#666666",
  white: "#FFFFFF",
  accent: "#4A90E2",
  borderColor: "#e0e0e0",
  softShadow: "rgba(0,0,0,0.1)",
};

const getModuleNumberText = (num) => {
  const numbers = [
    "one", "two", "three", "four", "five", 
    "six", "seven", "eight", "nine", "ten",
  ];
  return numbers[num - 1] || num;
};

// QuestionOption Component
export const QuestionOption = ({
  option,
  optionIndex,
  isSelected,
  isCorrect,
  showExplanation,
  onClick,
}) => {
  const getBackgroundColor = () => {
    if (!isSelected) return colors.white;
    if (showExplanation) {
      return isCorrect ? "#d1ffd1" : "#ffe6e6";
    }
    return colors.lightRose;
  };

  return (
    <div
      className="option p-4 rounded-md cursor-pointer transition flex items-center"
      style={{
        backgroundColor: getBackgroundColor(),
        border: "1px solid " + (isSelected ? colors.accent : "#ddd"),
      }}
      onClick={onClick}
    >
      <div
        className="option-circle w-8 h-8 rounded-full flex items-center justify-center mr-3"
        style={{
          backgroundColor: isSelected ? colors.accent : "#f0f0f0",
          color: isSelected ? colors.white : colors.darkText,
        }}
      >
        {String.fromCharCode(65 + optionIndex)}
      </div>
      <div className="option-text">{option}</div>
    </div>
  );
};

// Updated Module Sidebar with persistent unlocking tracking
export const ModuleSidebar = ({
  course,
  activeModule,
  activeTopic,
  activeSubtopic,
  activePage,
  navigateTo,
  moduleCompletion = {},
}) => {
  // Track all expanded topics - default all to collapsed
  const [expandedTopics, setExpandedTopics] = useState(() => {
    return new Set(); // Start with empty set - all topics collapsed
  });

  // Helper function to check topic completion
  const getTopicCompletionStatus = (moduleIndex, topicIndex, topic) => {
    if (topic.type === 'standalone') {
      return moduleCompletion[`${moduleIndex}-${topicIndex}`];
    } else if (topic.type === 'container') {
      return topic.subtopics?.every((_, subtopicIndex) => 
        moduleCompletion[`${moduleIndex}-${topicIndex}-${subtopicIndex}`]
      );
    }
    return false;
  };

  // Track which items have been unlocked (persistent across navigation)
  const [unlockedItems, setUnlockedItems] = useState(() => {
    // Initialize with first module, first topic, and first subtopic unlocked
    const initial = new Set();
    initial.add('module-0'); // First module
    initial.add('topic-0-0'); // First topic of first module
    
    // Check if first topic is a container, unlock first subtopic
    if (course.modules[0]?.topics[0]?.type === 'container') {
      initial.add('subtopic-0-0-0');
    }
    
    return initial;
  });

  // Update unlocked items whenever active position or completion changes
  useEffect(() => {
    setUnlockedItems(prev => {
      const updated = new Set(prev);
      
      // Unlock current and all previous modules
      for (let i = 0; i <= activeModule; i++) {
        updated.add(`module-${i}`);
        
        // For previous modules, unlock all their topics and subtopics
        if (i < activeModule) {
          const prevModule = course.modules[i];
          prevModule.topics.forEach((topic, topicIndex) => {
            updated.add(`topic-${i}-${topicIndex}`);
            
            // If it's a container topic, unlock all its subtopics
            if (topic.type === 'container' && topic.subtopics) {
              topic.subtopics.forEach((_, subtopicIndex) => {
                updated.add(`subtopic-${i}-${topicIndex}-${subtopicIndex}`);
              });
            }
          });
        }
      }
      
      // For current module, unlock all topics up to and including current topic
      if (activeTopic !== null) {
        for (let i = 0; i <= activeTopic; i++) {
          updated.add(`topic-${activeModule}-${i}`);
          
          const topic = course.modules[activeModule].topics[i];
          
          // For previous topics in current module, unlock all subtopics
          if (i < activeTopic && topic.type === 'container' && topic.subtopics) {
            topic.subtopics.forEach((_, subtopicIndex) => {
              updated.add(`subtopic-${activeModule}-${i}-${subtopicIndex}`);
            });
          }
          
          // For current topic, unlock subtopics up to current subtopic
          if (i === activeTopic && activeSubtopic !== null && topic.type === 'container') {
            for (let j = 0; j <= activeSubtopic; j++) {
              updated.add(`subtopic-${activeModule}-${activeTopic}-${j}`);
            }
          }
        }
      }
      
      // Check completed topics and unlock next topic or assessment
      course.modules.forEach((module, moduleIndex) => {
        module.topics.forEach((topic, topicIndex) => {
          const isTopicCompleted = getTopicCompletionStatus(moduleIndex, topicIndex, topic);
          
          if (isTopicCompleted) {
            // Unlock the next topic if it exists
            if (topicIndex + 1 < module.topics.length) {
              updated.add(`topic-${moduleIndex}-${topicIndex + 1}`);
              
              // If next topic is a container, unlock its first subtopic
              const nextTopic = module.topics[topicIndex + 1];
              if (nextTopic.type === 'container' && nextTopic.subtopics && nextTopic.subtopics.length > 0) {
                updated.add(`subtopic-${moduleIndex}-${topicIndex + 1}-0`);
              }
            } else {
              // If it's the last topic, unlock the assessment (but not the next module yet)
              if (module.cat) {
                updated.add(`assessment-${moduleIndex}`);
              }
            }
          }
        });
        
        // Check if assessment is completed to unlock next module
        // Only unlock next module if the current module's assessment is completed
        if (module.cat && moduleCompletion[`assessment-${moduleIndex}`]) {
          // Unlock the next module if it exists
          if (moduleIndex + 1 < course.modules.length) {
            updated.add(`module-${moduleIndex + 1}`);
            updated.add(`topic-${moduleIndex + 1}-0`);
            
            // If first topic of next module is a container, unlock its first subtopic
            const nextModule = course.modules[moduleIndex + 1];
            if (nextModule.topics[0].type === 'container' && nextModule.topics[0].subtopics && nextModule.topics[0].subtopics.length > 0) {
              updated.add(`subtopic-${moduleIndex + 1}-0-0`);
            }
          }
        }
      });
      
      // If on assessment page, unlock the assessment
      if (activePage === "assessment") {
        updated.add(`assessment-${activeModule}`);
      }
      
      return updated;
    });
  }, [activeModule, activeTopic, activeSubtopic, activePage, course.modules, moduleCompletion]);

  // Toggle topic expansion
  const toggleTopicExpansion = (moduleIndex, topicIndex) => {
    const key = `${moduleIndex}-${topicIndex}`;
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Simplified locking logic using unlockedItems
  const isModuleLocked = (moduleIndex) => {
    return !unlockedItems.has(`module-${moduleIndex}`);
  };

  const isTopicLocked = (moduleIndex, topicIndex) => {
    // Module must be unlocked first
    if (isModuleLocked(moduleIndex)) return true;
    return !unlockedItems.has(`topic-${moduleIndex}-${topicIndex}`);
  };

  const isSubtopicLocked = (moduleIndex, topicIndex, subtopicIndex) => {
    // Topic must be unlocked first
    if (isTopicLocked(moduleIndex, topicIndex)) return true;
    return !unlockedItems.has(`subtopic-${moduleIndex}-${topicIndex}-${subtopicIndex}`);
  };

  const isAssessmentLocked = (moduleIndex) => {
    // Check if on assessment page for current module
    if (moduleIndex === activeModule && activePage === "assessment") {
      return false;
    }

    // Check if assessment has been unlocked before
    if (unlockedItems.has(`assessment-${moduleIndex}`)) {
      return false;
    }

    // Module must be unlocked
    if (isModuleLocked(moduleIndex)) return true;
    
    // Check if all topics are completed
    const module = course.modules[moduleIndex];
    return module.topics.some((topic, topicIndex) => {
      if (topic.type === 'standalone') {
        return !moduleCompletion[`${moduleIndex}-${topicIndex}`];
      } else if (topic.type === 'container') {
        return topic.subtopics.some((_, subtopicIndex) => 
          !moduleCompletion[`${moduleIndex}-${topicIndex}-${subtopicIndex}`]
        );
      }
      return false;
    });
  };

  return (
    <div
      className="sidebar w-1/4 overflow-y-auto rounded-lg shadow-lg"
      style={{
        backgroundColor: colors.white,
        borderLeft: `4px solid ${colors.accent}`,
        boxShadow: `0 4px 6px ${colors.softShadow}`,
      }}
    >
      {/* Course Header */}
      <div
        className="p-6 border-b text-center"
        style={{
          backgroundColor: colors.lightBeige,
          borderColor: colors.borderColor,
        }}
      >
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: colors.darkText }}
        >
          {course.title}
        </h1>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2 shadow-inner">
          <div
            className="h-full transition-all duration-500 ease-in-out"
            style={{
              width: `${course.progress || 0}%`,
              backgroundColor: colors.accent,
              boxShadow: `0 0 10px ${colors.accent}20`,
            }}
          ></div>
        </div>

        <div
          className="text-sm font-medium"
          style={{ color: colors.lightText }}
        >
          {course.progress || 0}% Complete
        </div>
      </div>

      {/* Modules List */}
      <div className="modules-list p-4 space-y-4">
        {course.modules.map((module, moduleIndex) => (
          <div
            key={module._id}
            className="module-container transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Module Title */}
            <div
              className={`module-title p-4 rounded-lg flex items-center transition-all duration-200 ${
                isModuleLocked(moduleIndex)
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-md"
              }`}
              style={{
                backgroundColor:
                  moduleIndex === activeModule
                    ? colors.lightTeal
                    : "transparent",
                border: `1px solid ${
                  moduleIndex === activeModule
                    ? colors.accent
                    : colors.borderColor
                }`,
                transform:
                  moduleIndex === activeModule ? "translateX(10px)" : "none",
              }}
              onClick={() =>
                !isModuleLocked(moduleIndex) && navigateTo(moduleIndex, 0)
              }
            >
              {/* Module Number */}
              <div
                className="module-icon mr-4 w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold shadow-md"
                style={{
                  backgroundColor: isModuleLocked(moduleIndex)
                    ? "#cccccc"
                    : colors.accent,
                  color: "white",
                }}
              >
                {moduleIndex + 1}
              </div>

              {/* Module Title */}
              <div>
                <div
                  className="font-semibold"
                  style={{ color: colors.darkText }}
                >
                  {`Module ${getModuleNumberText(moduleIndex + 1)}: ${
                    module.title
                  }`}
                </div>
                {isModuleLocked(moduleIndex) && (
                  <span
                    className="text-xs mt-1"
                    style={{ color: colors.lightText }}
                  >
                    (Locked)
                  </span>
                )}
              </div>
            </div>

            {/* Module Topics - Show for unlocked modules */}
            {!isModuleLocked(moduleIndex) && (
              <div className="module-topics pl-14 mt-2 space-y-2">
                {module.topics.map((topic, topicIndex) => {
                  const isTopicActive = moduleIndex === activeModule && topicIndex === activeTopic;
                  const isExpanded = expandedTopics.has(`${moduleIndex}-${topicIndex}`);
                  const topicCompleted = getTopicCompletionStatus(moduleIndex, topicIndex, topic);
                  const topicLocked = isTopicLocked(moduleIndex, topicIndex);
                  
                  return (
                    <div key={topic._id} className="topic-container">
                      {/* Topic Item */}
                      <div
                        className={`topic-item p-3 rounded-md flex items-center transition-all duration-200 ${
                          topicLocked
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:bg-gray-100"
                        }`}
                        style={{
                          backgroundColor:
                            isTopicActive && activePage === "topic"
                              ? colors.lightRose
                              : "transparent",
                        }}
                        onClick={() => {
                          if (!topicLocked) {
                            if (topic.type === 'container') {
                              if (topic.subtopics && topic.subtopics.length > 0) {
                                navigateTo(moduleIndex, topicIndex, 0, "subtopic");
                              }
                            } else {
                              navigateTo(moduleIndex, topicIndex, null, "topic");
                            }
                          }
                        }}
                      >
                        {/* Expansion Icon for Container Topics */}
                        {topic.type === 'container' && (
                          <div 
                            className="mr-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTopicExpansion(moduleIndex, topicIndex);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </div>
                        )}

                        {/* Topic Status Indicator */}
                        <div
                          className="w-3 h-3 rounded-full mr-3"
                          style={{
                            backgroundColor: topicLocked
                              ? "#cccccc"
                              : topicCompleted
                              ? "green"
                              : "gray",
                          }}
                        ></div>

                        {/* Topic Title */}
                        <div
                          className="flex-grow"
                          style={{ color: colors.darkText }}
                        >
                          {topic.title}
                          {topic.type === 'container' && (
                            <span className="text-xs ml-2 text-gray-500">
                              ({topic.subtopics?.length || 0} subtopics)
                            </span>
                          )}
                        </div>

                        {topicLocked && (
                          <span
                            className="text-xs ml-2"
                            style={{ color: colors.lightText }}
                          >
                            (Locked)
                          </span>
                        )}
                      </div>

                      {/* Subtopics for Container Topics */}
                      {topic.type === 'container' && isExpanded && topic.subtopics && (
                        <div className="subtopics-list ml-8 mt-2 space-y-1">
                          {topic.subtopics.map((subtopic, subtopicIndex) => {
                            const isSubtopicActive = 
                              isTopicActive && 
                              activeSubtopic === subtopicIndex &&
                              (activePage === "subtopic" || activePage === "html" || activePage === "practice");
                            const subtopicLocked = isSubtopicLocked(moduleIndex, topicIndex, subtopicIndex);

                            return (
                              <div
                                key={subtopic._id}
                                className={`subtopic-item p-2 rounded-md flex items-center transition-all duration-200 ${
                                  subtopicLocked
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:bg-gray-50"
                                }`}
                                style={{
                                  backgroundColor: isSubtopicActive
                                    ? colors.lightRose
                                    : "transparent",
                                  fontSize: "0.9rem",
                                }}
                                onClick={() =>
                                  !subtopicLocked &&
                                  navigateTo(moduleIndex, topicIndex, subtopicIndex, "subtopic")
                                }
                              >
                                {/* Subtopic Status Indicator */}
                                <div
                                  className="w-2 h-2 rounded-full mr-2"
                                  style={{
                                    backgroundColor: subtopicLocked
                                      ? "#cccccc"
                                      : moduleCompletion[`${moduleIndex}-${topicIndex}-${subtopicIndex}`]
                                      ? "green"
                                      : "gray",
                                  }}
                                ></div>

                                {/* Subtopic Title */}
                                <div
                                  className="flex-grow"
                                  style={{ color: colors.darkText }}
                                >
                                  {subtopic.title}
                                </div>

                                {subtopicLocked && (
                                  <span
                                    className="text-xs ml-2"
                                    style={{ color: colors.lightText }}
                                  >
                                    (Locked)
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Assessment Section */}
                {module.cat && (
                  <div
                    className={`assessment-item p-3 rounded-md flex items-center mt-4 transition-all duration-200 ${
                      isAssessmentLocked(moduleIndex)
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor:
                        moduleIndex === activeModule &&
                        activePage === "assessment"
                          ? colors.lightRose
                          : "transparent",
                      borderTop: `1px solid ${colors.borderColor}`,
                    }}
                    onClick={() =>
                      !isAssessmentLocked(moduleIndex) &&
                      navigateTo(moduleIndex, 0, null, "assessment")
                    }
                  >
                    <div
                      className="w-6 h-6 flex items-center justify-center rounded-full mr-3 text-sm font-bold"
                      style={{
                        backgroundColor: isAssessmentLocked(moduleIndex)
                          ? "#cccccc"
                          : "orange",
                        color: "white",
                      }}
                    >
                      !
                    </div>
                    <div
                      className="flex-grow"
                      style={{ color: colors.darkText }}
                    >
                      {module.cat.title}
                    </div>
                    {isAssessmentLocked(moduleIndex) && (
                      <span
                        className="text-xs ml-2"
                        style={{ color: colors.lightText }}
                      >
                        (Locked)
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Topic Content Component
export const TopicContent = ({ module, topic, setActivePage, markTopicComplete }) => {
  if (topic.type === 'container') {
    return (
      <div className="topic-content p-6 bg-white rounded-lg shadow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
          <h2 className="text-xl font-semibold mb-4 text-gray-600">
            {module.description}
          </h2>
          <h3 className="text-lg font-medium mb-4">{topic.title}</h3>
          <p className="mb-6 text-gray-600">
            Navigate through the subtopics in the sidebar to complete this topic.
          </p>
        </div>
      </div>
    );
  }

  const hasPracticeQuestions = topic.practiceQuestions && topic.practiceQuestions.length > 0;

  return (
    <div className="topic-content p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-600">
          {module.description}
        </h2>
        <h3 className="text-lg font-medium mb-4">{topic.title}</h3>
        <p className="mb-6">{topic.description}</p>
      </div>

      <div className="navigation-buttons flex space-x-4 mt-8">
        <button
          onClick={() => setActivePage("html")}
          className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
          style={{ backgroundColor: colors.accent }}
        >
          View Topic Content
        </button>

        {hasPracticeQuestions ? (
          <button
            onClick={() => setActivePage("practice")}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
            style={{ backgroundColor: colors.accent }}
          >
            Practice Questions ({topic.practiceQuestions.length})
          </button>
        ) : (
          <button
            onClick={markTopicComplete}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
            style={{ backgroundColor: colors.accent }}
          >
            Continue to Next Topic
          </button>
        )}
      </div>
    </div>
  );
};

// Subtopic Content Component
export const SubtopicContent = ({ module, topic, subtopic, setActivePage, markSubtopicComplete }) => {
  const hasPracticeQuestions = subtopic.practiceQuestions && subtopic.practiceQuestions.length > 0;

  return (
    <div className="subtopic-content p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-600">
          {topic.title}
        </h2>
        <h3 className="text-lg font-medium mb-4">{subtopic.title}</h3>
        <p className="mb-6">{module.description}</p>
      </div>

      <div className="navigation-buttons flex space-x-4 mt-8">
        <button
          onClick={() => setActivePage("html")}
          className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
          style={{ backgroundColor: colors.accent }}
        >
          View Subtopic Content
        </button>

        {hasPracticeQuestions ? (
          <button
            onClick={() => setActivePage("practice")}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
            style={{ backgroundColor: colors.accent }}
          >
            Practice Questions ({subtopic.practiceQuestions.length})
          </button>
        ) : (
          <button
            onClick={markSubtopicComplete}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
            style={{ backgroundColor: colors.accent }}
          >
            Continue to Next Subtopic
          </button>
        )}
      </div>
    </div>
  );
};

// HTML Content Component
export const HtmlContent = ({ 
  module, 
  topic, 
  subtopic = null, 
  setActivePage, 
  markTopicComplete, 
  markSubtopicComplete 
}) => {
  const { user, refreshToken } = useAuth();
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const contentItem = subtopic || topic;
  const isSubtopic = !!subtopic;

  useEffect(() => {
    const fetchHtmlContent = async () => {
      if (!contentItem.htmlContent) {
        setError("No HTML content available");
        setLoading(false);
        return;
      }

      try {
        let token = localStorage.getItem("token");

        if (!token && refreshToken) {
          try {
            token = await refreshToken();
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            setError("Session expired. Please log in again.");
            setLoading(false);
            return;
          }
        }

        if (!token) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        const fullPath = `https://lms-ci8t.onrender.com/templates/${contentItem.htmlContent}`;

        const response = await axios
          .get(fullPath, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .catch(async (err) => {
            if (err.response && err.response.status === 403) {
              if (refreshToken) {
                try {
                  const newToken = await refreshToken();
                  return axios.get(fullPath, {
                    headers: {
                      Authorization: `Bearer ${newToken}`,
                    },
                  });
                } catch (refreshError) {
                  console.error("Token refresh failed:", refreshError);
                  throw err;
                }
              }
              throw err;
            }
            throw err;
          });

        setHtmlContent(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching HTML content:", err);

        if (err.response) {
          switch (err.response.status) {
            case 403:
              setError("Access forbidden. Please check your permissions.");
              break;
            case 401:
              setError("Unauthorized. Please log in again.");
              break;
            default:
              setError("Failed to load HTML content");
          }
        } else {
          setError("Network error. Please check your connection.");
        }

        setLoading(false);
      }
    };

    fetchHtmlContent();
  }, [contentItem.htmlContent, user, refreshToken]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center p-6">
          <p>Loading content...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
      );
    }

    return (
      <div
        className="html-file-content p-4 rounded-md bg-gray-100 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  const hasPracticeQuestions = contentItem.practiceQuestions && contentItem.practiceQuestions.length > 0;

  return (
    <div className="html-content p-6 bg-white rounded-lg shadow">
      <div className="content-section mb-8">{renderContent()}</div>

      <div className="navigation-buttons flex space-x-4 mt-8">
        <button
          onClick={() => setActivePage(isSubtopic ? "subtopic" : "topic")}
          className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
          style={{ backgroundColor: colors.accent }}
        >
          Back to Overview
        </button>

        {hasPracticeQuestions ? (
          <button
            onClick={() => setActivePage("practice")}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
            style={{ backgroundColor: colors.accent }}
          >
            Go to Practice Questions
          </button>
        ) : (
          <button
            onClick={isSubtopic ? markSubtopicComplete : markTopicComplete}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
            style={{ backgroundColor: colors.accent }}
          >
            {isSubtopic ? "Continue to Next Subtopic" : "Continue to Next Topic"}
          </button>
        )}
      </div>
    </div>
  );
};

export default HtmlContent;