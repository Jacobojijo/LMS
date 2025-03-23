import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdOutlineClass, MdKeyboardArrowRight, MdAccessTime, MdCalendarToday, MdPerson } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          throw new Error('Failed to fetch courses');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Courses</h1>
        <Link
          to="/admin/courses/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded my-4">
          <p>No courses found. Click "Create New Course" to add a course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link 
              to={`/admin/courses/${course._id}`} 
              key={course._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
            >
              <div className="bg-gray-100 p-4 flex items-center">
                <div className="bg-blue-600 text-white p-3 rounded-full mr-4">
                  <MdOutlineClass size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 truncate">{course.title}</h2>
              </div>
              
              <div className="p-4">
                <p className="text-gray-600 mb-4 line-clamp-3">{course.description.replace(/<[^>]*>?/gm, '')}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MdPerson className="mr-1" />
                  <span>Admin</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MdAccessTime className="mr-1" />
                  <span>{course.modules?.length || 0} modules</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MdCalendarToday className="mr-1" />
                  <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <div className="flex items-center text-blue-600 font-medium">
                    View Details
                    <MdKeyboardArrowRight />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;