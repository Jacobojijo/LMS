// coursecomponents.jsx - Fixed locking logic and progress calculation
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, ChevronRight } from "lucide-react";

// Theme colors - used throughout the components
export const colors = {
  lightBeige: "#F0D6B9", // Beige/gold tone
  lightTeal: "#C8E6E4", // Teal tone
  lightRose: "#ECC6C6", // Rose/pink tone
  darkText: "#333333",
  lightText: "#666666",
  white: "#FFFFFF",
  accent: "#4A90E2", // Blue accent for active elements
  borderColor: "#e0e0e0",
  softShadow: "rgba(0,0,0,0.1)",
};

const getModuleNumberText = (num) => {
  const numbers = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];
  return numbers[num - 1] || num;
};

// QuestionOption Component - Used in both Practice and Assessment components
export const QuestionOption = ({
  option,
  optionIndex,
  isSelected,
  isCorrect,
  showExplanation,
  onClick,
}) => {
  // Determine background color based on selection state and correctness
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

// Updated Module Sidebar Component with improved access tracking
export const ModuleSidebar = ({
  course,
  activeModule,
  activeTopic,
  activeSubtopic,
  activePage,
  navigateTo,
  moduleCompletion = {},
  completedTopics = [], // Add this prop - array of completed topics
  completedSubtopics = [], // Add this prop - array of completed subtopics
}) => {
  const [expandedTopics, setExpandedTopics] = useState(new Set());

  // Toggle topic expansion for container topics
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

  // Auto-expand active topic
  useEffect(() => {
    if (activeModule !== null && activeTopic !== null) {
      const key = `${activeModule}-${activeTopic}`;
      setExpandedTopics(prev => new Set([...prev, key]));
    }
  }, [activeModule, activeTopic]);

  // Enhanced helper function to check if user has ever accessed a position
  const hasAccessedPosition = (moduleIndex, topicIndex = null, subtopicIndex = null) => {
    // Current position is always accessible
    if (moduleIndex === activeModule) {
      if (topicIndex === null || topicIndex === activeTopic) {
        if (subtopicIndex === null || subtopicIndex === activeSubtopic) {
          return true;
        }
      }
    }

    // Check completion data and arrays for previously accessed items
    if (subtopicIndex !== null && topicIndex !== null) {
      // Check if this specific subtopic was accessed
      const subtopicKey = `${moduleIndex}-${topicIndex}-${subtopicIndex}`;
      if (moduleCompletion[subtopicKey]) {
        return true;
      }
      
      // Check if this subtopic is in the completedSubtopics array
      const isInCompletedSubtopics = completedSubtopics.some(
        item => item.moduleId === moduleIndex && 
                item.topicId === topicIndex && 
                item.subtopicId === subtopicIndex
      );
      if (isInCompletedSubtopics) {
        return true;
      }
    }

    if (topicIndex !== null && subtopicIndex === null) {
      // Check if this specific topic was accessed
      const topicKey = `${moduleIndex}-${topicIndex}`;
      if (moduleCompletion[topicKey]) {
        return true;
      }
      
      // Check if this topic is in the completedTopics array
      const isInCompletedTopics = completedTopics.some(
        item => item.moduleId === moduleIndex && item.topicId === topicIndex
      );
      if (isInCompletedTopics) {
        return true;
      }

      // For container topics, check if any subtopic has been accessed
      const topic = course.modules[moduleIndex]?.topics[topicIndex];
      if (topic?.type === 'container' && topic.subtopics) {
        const hasAccessedSubtopic = topic.subtopics.some((_, sIndex) => {
          const subtopicKey = `${moduleIndex}-${topicIndex}-${sIndex}`;
          return moduleCompletion[subtopicKey] || completedSubtopics.some(
            item => item.moduleId === moduleIndex && 
                    item.topicId === topicIndex && 
                    item.subtopicId === sIndex
          );
        });
        if (hasAccessedSubtopic) {
          return true;
        }
      }
    }

    // Check sequential progression - if user has progressed past this position
    if (activeModule === null || activeTopic === null) {
      return false;
    }

    // If we're in a later module, all previous modules should be accessible
    if (moduleIndex < activeModule) {
      return true;
    }
    
    // If we're in the same module but a later topic, previous topics should be accessible
    if (moduleIndex === activeModule && topicIndex !== null && topicIndex < activeTopic) {
      return true;
    }
    
    // If we're in the same topic but a later subtopic, previous subtopics should be accessible
    if (moduleIndex === activeModule && topicIndex === activeTopic && 
        subtopicIndex !== null && activeSubtopic !== null && subtopicIndex < activeSubtopic) {
      return true;
    }

    // Additional check: if user has accessed any later position, intermediate positions should be unlocked
    // Check if user has accessed any topic after this one in the same module
    if (moduleIndex === activeModule && topicIndex !== null) {
      for (let laterTopicIndex = topicIndex + 1; laterTopicIndex < course.modules[moduleIndex]?.topics.length; laterTopicIndex++) {
        if (hasTopicBeenDirectlyAccessed(moduleIndex, laterTopicIndex)) {
          return true; // If a later topic was accessed, this one should be unlocked
        }
      }
    }

    // Check if user has accessed any module after this one
    if (activeModule > moduleIndex) {
      return true;
    }

    return false;
  };

  // Helper function to check if a topic has been directly accessed (not just inferred)
  const hasTopicBeenDirectlyAccessed = (moduleIndex, topicIndex) => {
    const topic = course.modules[moduleIndex]?.topics[topicIndex];
    if (!topic) return false;

    if (topic.type === 'standalone') {
      const topicKey = `${moduleIndex}-${topicIndex}`;
      return moduleCompletion[topicKey] || completedTopics.some(
        item => item.moduleId === moduleIndex && item.topicId === topicIndex
      );
    } else if (topic.type === 'container') {
      // Check if any subtopic has been directly accessed
      return topic.subtopics?.some((_, subtopicIndex) => {
        const subtopicKey = `${moduleIndex}-${topicIndex}-${subtopicIndex}`;
        return moduleCompletion[subtopicKey] || completedSubtopics.some(
          item => item.moduleId === moduleIndex && 
                  item.topicId === topicIndex && 
                  item.subtopicId === subtopicIndex
        );
      });
    }

    return false;
  };

  // Helper function to check if a topic has been viewed (either completed or currently active)
  const hasTopicBeenViewed = (moduleIndex, topicIndex) => {
    // Current topic is always considered viewed
    if (moduleIndex === activeModule && topicIndex === activeTopic) {
      return true;
    }

    return hasTopicBeenDirectlyAccessed(moduleIndex, topicIndex);
  };

  // Helper function to check if a subtopic has been viewed
  const hasSubtopicBeenViewed = (moduleIndex, topicIndex, subtopicIndex) => {
    // Current subtopic is always considered viewed
    if (moduleIndex === activeModule && 
        topicIndex === activeTopic && 
        subtopicIndex === activeSubtopic) {
      return true;
    }

    // Check if subtopic has been completed
    const subtopicKey = `${moduleIndex}-${topicIndex}-${subtopicIndex}`;
    return moduleCompletion[subtopicKey] || completedSubtopics.some(
      item => item.moduleId === moduleIndex && 
              item.topicId === topicIndex && 
              item.subtopicId === subtopicIndex
    );
  };

  // Helper function to check if all previous items are accessible
  const areAllPreviousItemsAccessible = (moduleIndex, topicIndex, subtopicIndex = null) => {
    // Check all previous modules
    for (let mIndex = 0; mIndex < moduleIndex; mIndex++) {
      if (!hasAccessedPosition(mIndex)) {
        return false;
      }
    }

    // Check all previous topics in current module
    if (topicIndex !== null) {
      for (let tIndex = 0; tIndex < topicIndex; tIndex++) {
        if (!hasAccessedPosition(moduleIndex, tIndex)) {
          return false;
        }
      }
    }

    // Check all previous subtopics in current topic
    if (subtopicIndex !== null && topicIndex !== null) {
      for (let sIndex = 0; sIndex < subtopicIndex; sIndex++) {
        if (!hasAccessedPosition(moduleIndex, topicIndex, sIndex)) {
          return false;
        }
      }
    }

    return true;
  };

  // Updated locking functions with better logic
  const isTopicLocked = (moduleIndex, topicIndex) => {
    // If user has accessed this position before, it should remain unlocked
    if (hasAccessedPosition(moduleIndex, topicIndex) || hasTopicBeenViewed(moduleIndex, topicIndex)) {
      return false;
    }

    // First topic of first module is always unlocked
    if (moduleIndex === 0 && topicIndex === 0) return false;

    // Check sequential access pattern
    // If this is the next logical item in sequence, it should be unlocked
    if (moduleIndex === activeModule && topicIndex === activeTopic + 1) {
      // Check if current topic is completed (for standalone) or all subtopics completed (for container)
      const currentTopic = course.modules[activeModule]?.topics[activeTopic];
      if (currentTopic) {
        if (currentTopic.type === 'standalone') {
          const currentTopicKey = `${activeModule}-${activeTopic}`;
          return !moduleCompletion[currentTopicKey];
        } else if (currentTopic.type === 'container') {
          const allSubtopicsCompleted = currentTopic.subtopics?.every((_, sIndex) => {
            const subtopicKey = `${activeModule}-${activeTopic}-${sIndex}`;
            return moduleCompletion[subtopicKey];
          });
          return !allSubtopicsCompleted;
        }
      }
      return false; // Unlock the next topic
    }

    // For modules beyond current, check if we should unlock based on completion
    if (moduleIndex > activeModule) {
      // Check if previous module is completed
      for (let prevModule = 0; prevModule < moduleIndex; prevModule++) {
        const moduleCompleted = course.modules[prevModule]?.topics.every((topic, tIndex) => {
          if (topic.type === 'standalone') {
            const topicKey = `${prevModule}-${tIndex}`;
            return moduleCompletion[topicKey];
          } else if (topic.type === 'container') {
            return topic.subtopics?.every((_, sIndex) => {
              const subtopicKey = `${prevModule}-${tIndex}-${sIndex}`;
              return moduleCompletion[subtopicKey];
            });
          }
          return false;
        });

        if (!moduleCompleted && prevModule === moduleIndex - 1) {
          return true; // Lock if immediately previous module isn't complete
        }
      }

      // If it's the first topic of a module and previous module is complete, unlock it
      if (topicIndex === 0) {
        return false;
      }
    }

    // For topics in current module beyond current + 1
    if (moduleIndex === activeModule && topicIndex > activeTopic + 1) {
      // Check if there's a sequential gap
      for (let tIndex = activeTopic + 1; tIndex < topicIndex; tIndex++) {
        if (!hasAccessedPosition(moduleIndex, tIndex)) {
          return true; // Lock if there's an unaccessed topic before this one
        }
      }
      return false; // Unlock if no gaps
    }

    return false;
  };

  const isSubtopicLocked = (moduleIndex, topicIndex, subtopicIndex) => {
    // If user has accessed this position before, it should remain unlocked
    if (hasAccessedPosition(moduleIndex, topicIndex, subtopicIndex) || 
        hasSubtopicBeenViewed(moduleIndex, topicIndex, subtopicIndex)) {
      return false;
    }

    // If topic is locked, all subtopics are locked
    if (isTopicLocked(moduleIndex, topicIndex)) return true;

    // First subtopic is unlocked if topic is unlocked
    if (subtopicIndex === 0) return false;

    // Check if this is the next subtopic in sequence
    if (moduleIndex === activeModule && topicIndex === activeTopic && subtopicIndex === (activeSubtopic ?? -1) + 1) {
      // Check if previous subtopic is completed
      if (activeSubtopic !== null) {
        const prevSubtopicKey = `${moduleIndex}-${topicIndex}-${activeSubtopic}`;
        return !moduleCompletion[prevSubtopicKey];
      }
      return false;
    }

    // For subtopics beyond the next in sequence, check for gaps
    if (moduleIndex === activeModule && topicIndex === activeTopic && subtopicIndex > (activeSubtopic ?? -1) + 1) {
      // Check if there are any unaccessed subtopics before this one
      for (let sIndex = 0; sIndex < subtopicIndex; sIndex++) {
        if (!hasAccessedPosition(moduleIndex, topicIndex, sIndex)) {
          return true; // Lock if there's a gap
        }
      }
      return false; // Unlock if no gaps
    }

    return false;
  };

  const isModuleLocked = (moduleIndex) => {
    // If user has accessed this module before, it should remain unlocked
    if (hasAccessedPosition(moduleIndex)) {
      return false;
    }

    // Check if any topic in this module has been accessed
    const moduleHasBeenAccessed = course.modules[moduleIndex]?.topics.some((topic, topicIndex) => 
      hasTopicBeenViewed(moduleIndex, topicIndex)
    );

    if (moduleHasBeenAccessed) {
      return false;
    }

    // Check if this is the next module in sequence
    if (moduleIndex === activeModule + 1) {
      // Check if current module is completed
      const currentModuleCompleted = course.modules[activeModule]?.topics.every((topic, tIndex) => {
        if (topic.type === 'standalone') {
          const topicKey = `${activeModule}-${tIndex}`;
          return moduleCompletion[topicKey];
        } else if (topic.type === 'container') {
          return topic.subtopics?.every((_, sIndex) => {
            const subtopicKey = `${activeModule}-${tIndex}-${sIndex}`;
            return moduleCompletion[subtopicKey];
          });
        }
        return false;
      });

      return !currentModuleCompleted;
    }

    // Only lock modules that are beyond the next module and haven't been accessed
    return moduleIndex > activeModule + 1;
  };

  const isAssessmentLocked = (moduleIndex) => {
    // Current module assessment should never be locked if we're on assessment page
    if (moduleIndex === activeModule && activePage === "assessment") {
      return false;
    }

    // If user has accessed this module, assessment should be unlocked
    if (hasAccessedPosition(moduleIndex)) {
      return false;
    }

    // Lock assessments for modules beyond current that haven't been accessed
    if (moduleIndex > activeModule) {
      return !hasAccessedPosition(moduleIndex);
    }
    
    // For current module, check if all topics are completed
    const module = course.modules[moduleIndex];
    return module.topics.some((topic, topicIndex) => {
      if (topic.type === 'standalone') {
        return !moduleCompletion[`${moduleIndex}-${topicIndex}`];
      } else if (topic.type === 'container') {
        // Check if all subtopics are completed
        return topic.subtopics.some((_, subtopicIndex) => 
          !moduleCompletion[`${moduleIndex}-${topicIndex}-${subtopicIndex}`]
        );
      }
      return false;
    });
  };

  const getTopicCompletionStatus = (moduleIndex, topicIndex, topic) => {
    if (topic.type === 'standalone') {
      return moduleCompletion[`${moduleIndex}-${topicIndex}`];
    } else if (topic.type === 'container') {
      // Container topic is complete if all subtopics are complete
      return topic.subtopics?.every((_, subtopicIndex) => 
        moduleCompletion[`${moduleIndex}-${topicIndex}-${subtopicIndex}`]
      );
    }
    return false;
  };

  // Rest of the component remains the same...
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

            {/* Module Topics */}
            {moduleIndex === activeModule && (
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
                              // Navigate directly to first subtopic
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
                          <div className="mr-2">
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

// Updated Topic Content Component to handle container topics with Next button
export const TopicContent = ({ module, topic, setActivePage, markTopicComplete }) => {
  // Container topics should not reach here anymore since we navigate directly to subtopics
  // But keep this as fallback
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

  // Standalone topic content (original behavior)
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

// New Subtopic Content Component
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

// Updated HTML Content Component to handle both topics and subtopics
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

  // Determine which content to load - subtopic takes precedence
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
        // Get the token from localStorage
        let token = localStorage.getItem("token");

        // If no token, attempt to refresh
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

        // Construct the full URL for the HTML file
        const fullPath = `https://lms-ci8t.onrender.com/templates/${contentItem.htmlContent}`;

        // Fetch the HTML content with token
        const response = await axios
          .get(fullPath, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .catch(async (err) => {
            // Handle 403 error specifically
            if (err.response && err.response.status === 403) {
              // Attempt to refresh token
              if (refreshToken) {
                try {
                  const newToken = await refreshToken();
                  // Retry the request with the new token
                  return axios.get(fullPath, {
                    headers: {
                      Authorization: `Bearer ${newToken}`,
                    },
                  });
                } catch (refreshError) {
                  console.error("Token refresh failed:", refreshError);
                  throw err; // Re-throw original error if refresh fails
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

        // More descriptive error handling
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

  // Render method for loading states and errors
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

    // Render the fetched HTML content using dangerouslySetInnerHTML
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