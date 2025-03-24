import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/';
import './StudentCoursePage.css';

const StudentCoursePage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [topicContent, setTopicContent] = useState('');
  const [showingPracticeQuestions, setShowingPracticeQuestions] = useState(false);
  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchEnrollment = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/enrollments/user/${user._id}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const userEnrollment = response.data.data.find(
          enrollment => enrollment.course._id === courseId
        );
        
        if (!userEnrollment) {
          setError('You are not enrolled in this course.');
          setLoading(false);
          return;
        }
        
        setEnrollment(userEnrollment);
        
        // Set default active module and topic
        if (userEnrollment.course.modules.length > 0) {
          const firstModule = userEnrollment.course.modules.sort((a, b) => a.order - b.order)[0];
          setActiveModule(firstModule);
          
          if (firstModule.topics.length > 0) {
            const firstTopic = firstModule.topics.sort((a, b) => a.order - b.order)[0];
            setActiveTopic(firstTopic);
            loadTopicContent(firstTopic.htmlContent);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching enrollment:', err);
        setError('Failed to load course data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchEnrollment();
  }, [user, courseId]);
  
  const loadTopicContent = async (htmlPath) => {
    try {
      // In a real app, you might need to fetch the HTML file
      // This is a simplified version
      const response = await axios.get(`/content/${htmlPath}`);
      setTopicContent(response.data);
    } catch (err) {
      console.error('Error loading topic content:', err);
      setTopicContent('<div>Failed to load content</div>');
    }
  };
  
  const handleModuleClick = (module) => {
    setActiveModule(module);
    if (module.topics.length > 0) {
      const firstTopic = module.topics.sort((a, b) => a.order - b.order)[0];
      setActiveTopic(firstTopic);
      loadTopicContent(firstTopic.htmlContent);
      setShowingPracticeQuestions(false);
    }
  };
  
  const handleTopicClick = (topic) => {
    setActiveTopic(topic);
    loadTopicContent(topic.htmlContent);
    setShowingPracticeQuestions(false);
  };
  
  const handleShowPracticeQuestions = () => {
    setShowingPracticeQuestions(true);
    setAnswers({});
    setQuizResults(null);
  };
  
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };
  
  const handleSubmitPracticeQuestions = () => {
    if (!activeTopic) return;
    
    const questions = activeTopic.practiceQuestions;
    let correctCount = 0;
    
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= activeTopic.passingScore;
    
    setQuizResults({
      score,
      passed,
      correctCount,
      total: questions.length
    });
  };
  
  const getNextTopic = () => {
    if (!activeModule || !activeTopic) return null;
    
    const sortedTopics = [...activeModule.topics].sort((a, b) => a.order - b.order);
    const currentIndex = sortedTopics.findIndex(t => t._id === activeTopic._id);
    
    if (currentIndex < sortedTopics.length - 1) {
      return sortedTopics[currentIndex + 1];
    }
    
    // Check if there's another module
    const sortedModules = enrollment.course.modules.sort((a, b) => a.order - b.order);
    const currentModuleIndex = sortedModules.findIndex(m => m._id === activeModule._id);
    
    if (currentModuleIndex < sortedModules.length - 1) {
      const nextModule = sortedModules[currentModuleIndex + 1];
      if (nextModule.topics.length > 0) {
        return {
          nextModule,
          nextTopic: nextModule.topics.sort((a, b) => a.order - b.order)[0]
        };
      }
    }
    
    return null;
  };
  
  const handleNextTopic = () => {
    const next = getNextTopic();
    
    if (!next) return;
    
    if (next.nextModule) {
      setActiveModule(next.nextModule);
      setActiveTopic(next.nextTopic);
      loadTopicContent(next.nextTopic.htmlContent);
    } else {
      setActiveTopic(next);
      loadTopicContent(next.htmlContent);
    }
    
    setShowingPracticeQuestions(false);
    setQuizResults(null);
  };
  
  if (loading) return <div className="loading">Loading course content...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!enrollment) return <div className="error">No enrollment found for this course.</div>;
  
  return (
    <div className="course-container">
      <div className="sidebar">
        <h2>{enrollment.course.title}</h2>
        <div className="modules-list">
          {enrollment.course.modules
            .sort((a, b) => a.order - b.order)
            .map(module => (
              <div key={module._id} className="module-item">
                <div 
                  className={`module-title ${activeModule && activeModule._id === module._id ? 'active' : ''}`}
                  onClick={() => handleModuleClick(module)}
                >
                  {module.title}
                </div>
                
                {activeModule && activeModule._id === module._id && (
                  <div className="topics-list">
                    {module.topics
                      .sort((a, b) => a.order - b.order)
                      .map(topic => (
                        <div 
                          key={topic._id}
                          className={`topic-item ${activeTopic && activeTopic._id === topic._id ? 'active' : ''}`}
                          onClick={() => handleTopicClick(topic)}
                        >
                          {topic.title}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            ))
          }
        </div>
      </div>
      
      <div className="content-area">
        {activeTopic && (
          <>
            <div className="content-header">
              <h3>{activeModule?.title} - {activeTopic?.title}</h3>
              <div className="navigation-buttons">
                {!showingPracticeQuestions && activeTopic.practiceQuestions?.length > 0 && (
                  <button 
                    className="btn btn-primary"
                    onClick={handleShowPracticeQuestions}
                  >
                    Practice Questions
                  </button>
                )}
                
                {getNextTopic() && (
                  <button 
                    className="btn btn-success"
                    onClick={handleNextTopic}
                  >
                    Next Topic
                  </button>
                )}
              </div>
            </div>
            
            <div className="content-body">
              {!showingPracticeQuestions ? (
                <div 
                  className="topic-content"
                  dangerouslySetInnerHTML={{ __html: topicContent }}
                ></div>
              ) : (
                <div className="practice-questions">
                  <h3>Practice Questions</h3>
                  
                  {quizResults ? (
                    <div className={`quiz-results ${quizResults.passed ? 'passed' : 'failed'}`}>
                      <h4>{quizResults.passed ? 'Congratulations!' : 'Keep practicing!'}</h4>
                      <p>You scored {quizResults.score}% ({quizResults.correctCount}/{quizResults.total})</p>
                      <p>Required to pass: {activeTopic.passingScore}%</p>
                      
                      <div className="quiz-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => {
                            setAnswers({});
                            setQuizResults(null);
                          }}
                        >
                          Try Again
                        </button>
                        
                        {quizResults.passed && getNextTopic() && (
                          <button 
                            className="btn btn-success"
                            onClick={handleNextTopic}
                          >
                            Next Topic
                          </button>
                        )}
                        
                        <button 
                          className="btn btn-primary"
                          onClick={() => {
                            setShowingPracticeQuestions(false);
                            setQuizResults(null);
                          }}
                        >
                          Back to Content
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {activeTopic.practiceQuestions.map((question, qIndex) => (
                        <div key={qIndex} className="question-card">
                          <h4>Question {qIndex + 1}</h4>
                          <p>{question.question}</p>
                          
                          <div className="options-list">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="option-item">
                                <label className={answers[qIndex] === oIndex ? 'selected' : ''}>
                                  <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    checked={answers[qIndex] === oIndex}
                                    onChange={() => handleAnswerSelect(qIndex, oIndex)}
                                  />
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        className="btn btn-primary submit-quiz"
                        onClick={handleSubmitPracticeQuestions}
                        disabled={Object.keys(answers).length < activeTopic.practiceQuestions.length}
                      >
                        Submit Answers
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentCoursePage;