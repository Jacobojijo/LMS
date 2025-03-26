import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

// Theme colors - used throughout the components
export const colors = {
  lightBeige: "#F0D6B9", // Beige/gold tone
  lightTeal: "#C8E6E4",  // Teal tone
  lightRose: "#ECC6C6",  // Rose/pink tone
  darkText: "#333333",
  lightText: "#666666",
  white: "#FFFFFF",
  accent: "#4A90E2" // Blue accent for active elements
};

const getModuleNumberText = (num) => {
  const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  return numbers[num - 1] || num;
};

// QuestionOption Component - Used in both Practice and Assessment components
export const QuestionOption = ({ option, optionIndex, isSelected, isCorrect, showExplanation, onClick }) => {
  // Determine background color based on selection state and correctness
  const getBackgroundColor = () => {
    if (!isSelected) return colors.white;
    
    if (showExplanation) {
      return isCorrect ? '#d1ffd1' : '#ffe6e6';
    }
    
    return colors.lightRose;
  };
  
  return (
    <div 
      className="option p-4 rounded-md cursor-pointer transition flex items-center"
      style={{
        backgroundColor: getBackgroundColor(),
        border: "1px solid " + (isSelected ? colors.accent : '#ddd'),
      }}
      onClick={onClick}
    >
      <div 
        className="option-circle w-8 h-8 rounded-full flex items-center justify-center mr-3" 
        style={{
          backgroundColor: isSelected ? colors.accent : '#f0f0f0',
          color: isSelected ? colors.white : colors.darkText
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
  moduleCompletion = {} 
}) => {
  const isTopicLocked = (moduleIndex, topicIndex) => {
    // First module and first topic are always accessible
    if (moduleIndex === 0 && topicIndex === 0) return false;

    // Check if previous module is completed if trying to access a new module
    if (moduleIndex > 0 && !moduleCompletion[`module-${moduleIndex - 1}`]) {
      return true;
    }

    // Check if all previous topics in the current module are completed
    for (let i = 0; i < topicIndex; i++) {
      if (!moduleCompletion[`${moduleIndex}-${i}`]) {
        return true;
      }
    }

    return false;
  };

  const isModuleLocked = (moduleIndex) => {
    // First module is always accessible
    if (moduleIndex === 0) return false;

    // Check if previous module is completed
    return !moduleCompletion[`module-${moduleIndex - 1}`];
  };

  return (
    <div className="sidebar w-1/4 overflow-y-auto shadow-md" style={{backgroundColor: colors.lightBeige}}>
      <div className="p-4 border-b" style={{borderColor: 'rgba(0,0,0,0.1)'}}>
        <h1 className="text-xl font-bold text-center mb-2">{course.title}</h1>
        <div className="progress-bar w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full" 
            style={{
              width: `${course.progress || 0}%`, 
              backgroundColor: colors.accent
            }}
          ></div>
        </div>
        <div className="text-sm text-center mt-1">{course.progress || 0}% Complete</div>
      </div>
      
      <div className="modules-list p-4">
        {course.modules.map((module, moduleIndex) => (
          <div key={module._id} className="module-container mb-4">
            <div 
              className={`module-title font-semibold p-3 rounded-md flex items-center ${
                isModuleLocked(moduleIndex) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              style={{
                backgroundColor: moduleIndex === activeModule ? colors.lightTeal : 'transparent',
                color: colors.darkText
              }}
              onClick={() => !isModuleLocked(moduleIndex) && navigateTo(moduleIndex, 0)}
            >
              <div 
                className="module-icon mr-3 w-8 h-8 flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: isModuleLocked(moduleIndex) ? '#cccccc' : colors.accent, 
                  color: 'white'
                }}
              >
                {moduleIndex + 1}
              </div>
              {`Module ${getModuleNumberText(moduleIndex + 1)}: ${module.title}`}
              {isModuleLocked(moduleIndex) && (
                <span className="ml-2 text-xs text-gray-500">(Locked)</span>
              )}
            </div>
            
            {moduleIndex === activeModule && (
              <div className="module-topics pl-10 mt-2 space-y-1">
                {module.topics.map((topic, topicIndex) => (
                  <div 
                    key={topic._id} 
                    className={`topic-item p-2 rounded-md flex items-center ${
                      isTopicLocked(moduleIndex, topicIndex) 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer'
                    }`}
                    style={{
                      backgroundColor: 
                        moduleIndex === activeModule && 
                        topicIndex === activeTopic && 
                        (activePage === 'topic' || activePage === 'html' || activePage === 'practice')
                          ? colors.lightRose 
                          : 'transparent',
                      color: colors.darkText
                    }}
                    onClick={() => 
                      !isTopicLocked(moduleIndex, topicIndex) && 
                      navigateTo(moduleIndex, topicIndex, 'topic')
                    }
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor: isTopicLocked(moduleIndex, topicIndex) 
                          ? '#cccccc' 
                          : (moduleCompletion[`${moduleIndex}-${topicIndex}`] ? 'green' : 'gray')
                      }}
                    ></div>
                    {topic.title}
                    {isTopicLocked(moduleIndex, topicIndex) && (
                      <span className="ml-2 text-xs text-gray-500">(Locked)</span>
                    )}
                  </div>
                ))}
                
                {module.cat && (
                  <div 
                    className={`assessment-item p-2 rounded-md flex items-center mt-4 ${
                      isModuleLocked(moduleIndex) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    style={{
                      backgroundColor: 
                        moduleIndex === activeModule && activePage === 'assessment' 
                          ? colors.lightRose 
                          : 'transparent',
                      color: colors.darkText,
                      borderTop: '1px solid rgba(0,0,0,0.1)',
                      marginTop: '8px',
                      paddingTop: '8px'
                    }}
                    onClick={() => 
                      !isModuleLocked(moduleIndex) && 
                      navigateTo(moduleIndex, 0, 'assessment')
                    }
                  >
                    <div 
                      className="w-4 h-4 text-sm flex items-center justify-center text-white rounded-full mr-2"
                      style={{
                        backgroundColor: isModuleLocked(moduleIndex) ? '#cccccc' : 'orange'
                      }}
                    >
                      !
                    </div>
                    {module.cat.title}
                    {isModuleLocked(moduleIndex) && (
                      <span className="ml-2 text-xs text-gray-500">(Locked)</span>
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
        <h2 className="text-xl font-semibold mb-4 text-gray-600">{module.description}</h2>
        <p className="mb-6">{topic.title}</p>
      </div>
      
      <div className="navigation-buttons flex space-x-4 mt-8">
        <button 
          onClick={() => setActivePage('html')} 
          className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
          style={{backgroundColor: colors.accent}}
        >
          View Topic Content
        </button>
        
        {topic.practiceQuestions && topic.practiceQuestions.length > 0 && (
          <button 
            onClick={() => setActivePage('practice')} 
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
            style={{backgroundColor: colors.accent}}
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
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHtmlContent = async () => {
      if (!topic.htmlContent) {
        setError('No HTML content available');
        setLoading(false);
        return;
      }

      try {
        // Get the token from localStorage
        let token = localStorage.getItem('token');
        
        // If no token, attempt to refresh
        if (!token && refreshToken) {
          try {
            token = await refreshToken();
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            setError('Session expired. Please log in again.');
            setLoading(false);
            return;
          }
        }

        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        // Construct the full URL for the HTML file
        const fullPath = `https://lms-ci8t.onrender.com/templates/${topic.htmlContent}`;
        
        // Fetch the HTML content with token
        const response = await axios.get(fullPath, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).catch(async (err) => {
          // Handle 403 error specifically
          if (err.response && err.response.status === 403) {
            // Attempt to refresh token
            if (refreshToken) {
              try {
                const newToken = await refreshToken();
                // Retry the request with the new token
                return axios.get(fullPath, {
                  headers: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
              } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
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
        console.error('Error fetching HTML content:', err);
        
        // More descriptive error handling
        if (err.response) {
          switch (err.response.status) {
            case 403:
              setError('Access forbidden. Please check your permissions.');
              break;
            case 401:
              setError('Unauthorized. Please log in again.');
              break;
            default:
              setError('Failed to load HTML content');
          }
        } else {
          setError('Network error. Please check your connection.');
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
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          {error}
        </div>
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-600">{topic.title} - HTML Content</h2>
      </div>
      
      <div className="content-section mb-8">
        {renderContent()}
      </div>
      
      <div className="navigation-buttons flex space-x-4 mt-8">
        <button 
          onClick={() => setActivePage('topic')} 
          className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
          style={{backgroundColor: colors.accent}}
        >
          Back to Overview
        </button>
        
        {topic.practiceQuestions && topic.practiceQuestions.length > 0 && (
          <button 
            onClick={() => setActivePage('practice')} 
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition"
            style={{backgroundColor: colors.accent}}
          >
            Go to Practice Questions
          </button>
        )}
      </div>
    </div>
  );
};

export default HtmlContent;