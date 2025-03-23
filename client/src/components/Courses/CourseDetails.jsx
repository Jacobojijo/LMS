import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MdKeyboardArrowRight, 
  MdKeyboardArrowLeft, 
  MdOutlineMenuBook, 
  MdEditNote,
  MdPublish,
  MdDelete,
  MdLibraryBooks,
  MdQuiz,
  MdCheck,
  MdLock,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.data.success) {
          const courseData = response.data.data;
          setCourse(courseData);
          
          // Set initial module and topic if they exist
          if (courseData.modules && courseData.modules.length > 0) {
            // Initialize all modules as expanded
            const initialExpandedState = {};
            courseData.modules.forEach(module => {
              initialExpandedState[module._id] = true;
            });
            setExpandedModules(initialExpandedState);
            
            // Set first module as active
            setActiveModule(courseData.modules[0]);
            
            // Set first topic of first module as active if it exists
            if (courseData.modules[0].topics && courseData.modules[0].topics.length > 0) {
              setActiveTopic(courseData.modules[0].topics[0]);
            }
          }
        } else {
          throw new Error('Failed to fetch course details');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching course details');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handlePublishToggle = async () => {
    try {
      const response = await axios.put(
        `/api/v1/courses/${id}`,
        { isPublished: !course.isPublished },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (response.data.success) {
        setCourse({ ...course, isPublished: !course.isPublished });
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  const handleDeleteCourse = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/v1/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        navigate('/admin/courses');
      } catch (err) {
        console.error('Error deleting course:', err);
      }
    }
  };

  const toggleModuleExpand = (moduleId) => {
    setExpandedModules({
      ...expandedModules,
      [moduleId]: !expandedModules[moduleId]
    });
  };

  const handleTopicClick = (module, topic) => {
    setActiveModule(module);
    setActiveTopic(topic);
  };

  const navigateToPreviousTopic = () => {
    if (!activeModule || !activeTopic) return;
    
    const currentModuleIndex = course.modules.findIndex(m => m._id === activeModule._id);
    const currentTopicIndex = activeModule.topics.findIndex(t => t._id === activeTopic._id);
    
    if (currentTopicIndex > 0) {
      // Navigate to previous topic in the same module
      setActiveTopic(activeModule.topics[currentTopicIndex - 1]);
    } else if (currentModuleIndex > 0) {
      // Navigate to the last topic of the previous module
      const previousModule = course.modules[currentModuleIndex - 1];
      setActiveModule(previousModule);
      if (previousModule.topics && previousModule.topics.length > 0) {
        setActiveTopic(previousModule.topics[previousModule.topics.length - 1]);
      } else {
        setActiveTopic(null);
      }
    }
  };

  const navigateToNextTopic = () => {
    if (!activeModule || !activeTopic) return;
    
    const currentModuleIndex = course.modules.findIndex(m => m._id === activeModule._id);
    const currentTopicIndex = activeModule.topics.findIndex(t => t._id === activeTopic._id);
    
    if (currentTopicIndex < activeModule.topics.length - 1) {
      // Navigate to next topic in the same module
      setActiveTopic(activeModule.topics[currentTopicIndex + 1]);
    } else if (currentModuleIndex < course.modules.length - 1) {
      // Navigate to the first topic of the next module
      const nextModule = course.modules[currentModuleIndex + 1];
      setActiveModule(nextModule);
      if (nextModule.topics && nextModule.topics.length > 0) {
        setActiveTopic(nextModule.topics[0]);
      } else {
        setActiveTopic(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded my-4">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Course Header */}
      <div className="bg-white shadow-md p-4 border-b">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
              <div className="text-sm text-gray-500 mt-1">
                {course.modules?.length || 0} modules • Created: {new Date(course.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/admin/courses/${id}/edit`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded flex items-center"
              >
                <MdEditNote className="mr-1" /> Edit
              </Link>
              <button
                onClick={handlePublishToggle}
                className={`${
                  course.isPublished 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                } text-white font-medium py-2 px-4 rounded flex items-center`}
              >
                <MdPublish className="mr-1" /> 
                {course.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={handleDeleteCourse}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded flex items-center"
              >
                <MdDelete className="mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Course Outline */}
        <div className="w-80 bg-gray-100 border-r overflow-y-auto">
          <div className="p-4 border-b bg-white">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <MdOutlineMenuBook className="mr-2" /> Course Outline
            </h2>
          </div>
          <div className="p-2">
            {course.modules?.map((module, moduleIndex) => (
              <div key={module._id} className="mb-2">
                <div 
                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                    activeModule?._id === module._id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => toggleModuleExpand(module._id)}
                >
                  <div className="font-medium flex items-center">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                      {moduleIndex + 1}
                    </span>
                    {module.title}
                  </div>
                  {expandedModules[module._id] ? <MdExpandLess /> : <MdExpandMore />}
                </div>
                
                {expandedModules[module._id] && module.topics?.map((topic, topicIndex) => (
                  <div 
                    key={topic._id}
                    className={`ml-8 p-2 rounded cursor-pointer flex items-center ${
                      activeTopic?._id === topic._id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
                    }`}
                    onClick={() => handleTopicClick(module, topic)}
                  >
                    <span className="w-5 h-5 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs mr-2">
                      {topicIndex + 1}
                    </span>
                    <span className="truncate">{topic.title}</span>
                  </div>
                ))}
                
                {expandedModules[module._id] && module.cat && (
                  <div className="ml-8 p-2 rounded cursor-pointer flex items-center hover:bg-gray-200">
                    <span className="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs mr-2">
                      <MdQuiz size={12} />
                    </span>
                    <span className="truncate">{module.cat.title}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTopic ? (
            <>
              {/* Topic Navigation */}
              <div className="bg-white p-4 border-b flex justify-between items-center">
                <button 
                  onClick={navigateToPreviousTopic}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <MdKeyboardArrowLeft size={20} /> Previous
                </button>
                <div className="text-lg font-semibold">{activeTopic.title}</div>
                <button 
                  onClick={navigateToNextTopic}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  Next <MdKeyboardArrowRight size={20} />
                </button>
              </div>
              
              {/* Topic Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div dangerouslySetInnerHTML={{ __html: activeTopic.htmlContent }} />
                
                {/* Practice Questions */}
                {activeTopic.practiceQuestions && activeTopic.practiceQuestions.length > 0 && (
                  <div className="mt-8 border-t pt-4">
                    <h3 className="text-xl font-semibold mb-4">Practice Questions</h3>
                    {activeTopic.practiceQuestions.map((question, index) => (
                      <div key={question._id} className="mb-6 bg-gray-50 p-4 rounded">
                        <div className="font-medium mb-2">Question {index + 1}: {question.question}</div>
                        <div className="ml-4">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-start my-2">
                              <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                                optionIndex === question.correctAnswer 
                                  ? 'bg-green-100 text-green-800 border border-green-500'
                                  : 'bg-gray-100 text-gray-800 border border-gray-400'
                              }`}>
                                {optionIndex === question.correctAnswer ? <MdCheck size={16} /> : ''}
                              </div>
                              <div dangerouslySetInnerHTML={{ __html: option }} />
                            </div>
                          ))}
                        </div>
                        {question.explanation && (
                          <div className="mt-2 p-2 bg-blue-50 text-blue-800 border-l-4 border-blue-500">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-10">
                <MdLibraryBooks size={64} className="text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-600">Select a topic to view its content</h2>
                <p className="text-gray-500 mt-2">Choose a topic from the course outline on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;