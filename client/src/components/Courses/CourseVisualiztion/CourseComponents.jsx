import React from 'react';

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
export const ModuleSidebar = ({ course, activeModule, activeTopic, activePage, navigateTo }) => {
  return (
    <div className="sidebar w-1/4 overflow-y-auto shadow-md" style={{backgroundColor: colors.lightBeige}}>
      <div className="p-4 border-b" style={{borderColor: 'rgba(0,0,0,0.1)'}}>
        <h1 className="text-xl font-bold text-center mb-2">{course.title}</h1>
        <div className="progress-bar w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full" style={{width: '0%', backgroundColor: colors.accent}}></div>
        </div>
        <div className="text-sm text-center mt-1">0% Complete</div>
      </div>
      
      <div className="modules-list p-4">
        {course.modules.map((module, moduleIndex) => (
          <div key={module._id} className="module-container mb-4">
            <div 
              className="module-title font-semibold p-3 rounded-md cursor-pointer flex items-center"
              style={{
                backgroundColor: moduleIndex === activeModule ? colors.lightTeal : 'transparent',
                color: colors.darkText
              }}
              onClick={() => navigateTo(moduleIndex, 0)}
            >
              <div 
                className="module-icon mr-3 w-8 h-8 flex items-center justify-center rounded-full"
                style={{backgroundColor: colors.accent, color: 'white'}}
              >
                {moduleIndex + 1}
              </div>
              {`Module ${getModuleNumberText(moduleIndex + 1)}: ${module.title}`}
            </div>
            
            {moduleIndex === activeModule && (
              <div className="module-topics pl-10 mt-2 space-y-1">
                {module.topics.map((topic, topicIndex) => (
                  <div 
                    key={topic._id} 
                    className="topic-item p-2 rounded-md cursor-pointer flex items-center"
                    style={{
                      backgroundColor: moduleIndex === activeModule && topicIndex === activeTopic && 
                        (activePage === 'topic' || activePage === 'html' || activePage === 'practice')
                        ? colors.lightRose 
                        : 'transparent',
                      color: colors.darkText
                    }}
                    onClick={() => navigateTo(moduleIndex, topicIndex, 'topic')}
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    {topic.title}
                  </div>
                ))}
                
                {module.cat && (
                  <div 
                    className="assessment-item p-2 rounded-md cursor-pointer flex items-center mt-4"
                    style={{
                      backgroundColor: moduleIndex === activeModule && activePage === 'assessment' 
                        ? colors.lightRose 
                        : 'transparent',
                      color: colors.darkText,
                      borderTop: '1px solid rgba(0,0,0,0.1)',
                      marginTop: '8px',
                      paddingTop: '8px'
                    }}
                    onClick={() => navigateTo(moduleIndex, 0, 'assessment')}
                  >
                    <div className="w-4 h-4 text-sm flex items-center justify-center bg-yellow-500 text-white rounded-full mr-2">
                      !
                    </div>
                    {module.cat.title}
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
        <h2 className="text-xl font-semibold mb-4 text-gray-600">{topic.title}</h2>
        <p className="mb-6">{module.description}</p>
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
  // Format the HTML content for display
  const formatHtmlContent = (htmlContent) => {
    // Display as formatted code block
    return (
      <div className="code-block p-4 rounded-md bg-gray-100 font-mono text-sm overflow-x-auto">
        {htmlContent}
      </div>
    );
  };

  return (
    <div className="html-content p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-600">{topic.title} - HTML Content</h2>
      </div>
      
      <div className="content-section mb-8">
        {formatHtmlContent(topic.htmlContent)}
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
