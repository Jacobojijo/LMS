"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// Theme colors - used throughout the components
export const colors = {
  lightBeige: "#F0D6B9", // Beige/gold tone
  lightTeal: "#C8E6E4", // Teal tone
  lightRose: "#ECC6C6", // Rose/pink tone
  darkText: "#333333",
  lightText: "#666666",
  white: "#FFFFFF",
  accent: "#4A90E2", // Blue accent for active elements
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

// Module Sidebar Component
export const ModuleSidebar = ({
  course,
  activeModule,
  activeTopic,
  activePage,
  navigateTo,
  moduleCompletion = {},
}) => {
  const isTopicLocked = (moduleIndex, topicIndex) => {
    if (moduleIndex === 0 && topicIndex === 0) return false;

    if (moduleIndex > 0 && !moduleCompletion[`module-${moduleIndex - 1}`]) {
      return true;
    }

    for (let i = 0; i < topicIndex; i++) {
      if (!moduleCompletion[`${moduleIndex}-${i}`]) {
        return true;
      }
    }

    return false;
  };

  const isModuleLocked = (moduleIndex) => {
    return moduleIndex > 0 && !moduleCompletion[`module-${moduleIndex - 1}`];
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

            {/* Module Topics */}
            {moduleIndex === activeModule && (
              <div className="module-topics pl-14 mt-2 space-y-2">
                {module.topics.map((topic, topicIndex) => (
                  <div
                    key={topic._id}
                    className={`topic-item p-3 rounded-md flex items-center transition-all duration-200 ${
                      isTopicLocked(moduleIndex, topicIndex)
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor:
                        moduleIndex === activeModule &&
                        topicIndex === activeTopic &&
                        (activePage === "topic" ||
                          activePage === "html" ||
                          activePage === "practice")
                          ? colors.lightRose
                          : "transparent",
                    }}
                    onClick={() =>
                      !isTopicLocked(moduleIndex, topicIndex) &&
                      navigateTo(moduleIndex, topicIndex, "topic")
                    }
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{
                        backgroundColor: isTopicLocked(moduleIndex, topicIndex)
                          ? "#cccccc"
                          : moduleCompletion[`${moduleIndex}-${topicIndex}`]
                          ? "green"
                          : "gray",
                      }}
                    ></div>
                    <div
                      className="flex-grow"
                      style={{ color: colors.darkText }}
                    >
                      {topic.title}
                    </div>
                    {isTopicLocked(moduleIndex, topicIndex) && (
                      <span
                        className="text-xs ml-2"
                        style={{ color: colors.lightText }}
                      >
                        (Locked)
                      </span>
                    )}
                  </div>
                ))}

                {/* Assessment Section */}
                {module.cat && (
                  <div
                    className={`assessment-item p-3 rounded-md flex items-center mt-4 transition-all duration-200 ${
                      isModuleLocked(moduleIndex)
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
                      !isModuleLocked(moduleIndex) &&
                      navigateTo(moduleIndex, 0, "assessment")
                    }
                  >
                    <div
                      className="w-6 h-6 flex items-center justify-center rounded-full mr-3 text-sm font-bold"
                      style={{
                        backgroundColor: isModuleLocked(moduleIndex)
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
                    {isModuleLocked(moduleIndex) && (
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
export const TopicContent = ({ module, topic, setActivePage }) => {
  return (
    <div className="topic-content p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-600">
          {module.description}
        </h2>
        <p className="mb-6">{topic.title}</p>
      </div>

      <div className="navigation-buttons flex space-x-4 mt-8">
        <button
          onClick={() => setActivePage("html")}
          className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
          style={{ backgroundColor: colors.accent }}
        >
          View Topic Content
        </button>

        {topic.practiceQuestions && topic.practiceQuestions.length > 0 && (
          <button
            onClick={() => setActivePage("practice")}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
            style={{ backgroundColor: colors.accent }}
          >
            Practice Questions ({topic.practiceQuestions.length})
          </button>
        )}
      </div>
    </div>
  );
};

// HTML Content Component
export const HtmlContent = ({ module, topic, setActivePage }) => {
  const { user, refreshToken } = useAuth();
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHtmlContent = async () => {
      if (!topic.htmlContent) {
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
        const fullPath = `https://lms-ci8t.onrender.com/templates/${topic.htmlContent}`;

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
  }, [topic.htmlContent, user, refreshToken]);

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

  return (
    <div className="html-content p-6 bg-white rounded-lg shadow">
      <div className="content-section mb-8">{renderContent()}</div>

      <div className="navigation-buttons flex space-x-4 mt-8">
        <button
          onClick={() => setActivePage("topic")}
          className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
          style={{ backgroundColor: colors.accent }}
        >
          Back to Overview
        </button>

        {topic.practiceQuestions && topic.practiceQuestions.length > 0 && (
          <button
            onClick={() => setActivePage("practice")}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
            style={{ backgroundColor: colors.accent }}
          >
            Go to Practice Questions
          </button>
        )}
      </div>
    </div>
  );
};

export default HtmlContent;
