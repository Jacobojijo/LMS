import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const CourseBanner = () => {
  // State to store course title and user info
  const [courseTitle, setCourseTitle] = useState("Loading course...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user from auth context
  const { user } = useAuth();

  // Custom color palette - light versions
  const lightBeige = "#F0D6B9"; // Beige/gold tone
  const lightTeal = "#C8E6E4";  // Teal tone
  const lightRose = "#ECC6C6";  // Rose/pink tone

  // Fetch user's course enrollment
  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem("token");
        
        const response = await axios.get(`/api/enrollments/user/${user._id}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success && response.data.count > 0) {
          // Get the first course title from enrollments
          const firstCourse = response.data.data[0];
          setCourseTitle(firstCourse.course.title);
        } else {
          setCourseTitle("No courses enrolled");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching enrollment:", err);
        setError("Could not load your course");
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [user]);

  // Get user's last name
  const getLastName = () => {
    if (!user) return "";
    
    // Assuming user object has a name field that may contain first and last name
    // Or it has a lastName field directly
    if (user.lastName) return user.lastName;
    if (user.name && user.name.includes(" ")) {
      const nameParts = user.name.split(" ");
      return nameParts[nameParts.length - 1];
    }
    return "";
  };

  const userLastName = getLastName();

  return (
    <section className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl shadow-xl max-w-6xl mx-auto"
      >
        {/* Custom gradient background using the provided colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white"></div>
        
        {/* Overlay with custom colors */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{
            background: "#F5F5F5"
          }}
        ></div>
        
        {/* Soft color accents - improved sizing for large screens */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-40 transform translate-x-1/3 -translate-y-1/3"
          style={{ backgroundColor: lightBeige }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 rounded-full opacity-40 transform -translate-x-1/3 translate-y-1/3"
          style={{ backgroundColor: lightTeal }}
        ></div>
        
        {/* Light pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 40 + 10 + 'px',
                  height: Math.random() * 40 + 10 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  opacity: Math.random() * 0.5 + 0.1
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 px-8 py-16 md:py-24 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-3/5 lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="inline-block bg-white bg-opacity-50 px-4 py-1 rounded-full text-sm font-medium mb-4 border"
                    style={{ borderColor: lightRose, color: "#7c645e" }}>
                Your Journey Continues
              </span>
              <h2 className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold mb-4"
                  style={{ color: "#5e4c41" }}>
                {loading ? (
                  "Welcome back"
                ) : (
                  <>Dear {userLastName ? userLastName : "Student"}, welcome back to</>
                )}
              </h2>
              <div className="px-6 py-4 rounded-lg mb-6 border-l-4 max-w-3xl"
                   style={{ 
                     backgroundColor: `${lightTeal}80`, 
                     borderColor: lightBeige 
                   }}>
                <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold"
                    style={{ color: "#3c6665" }}>
                  {loading ? (
                    <span className="animate-pulse">Loading your course...</span>
                  ) : error ? (
                    <span className="text-red-500">{error}</span>
                  ) : (
                    courseTitle
                  )}
                </h3>
              </div>
              <p className="text-lg lg:text-xl max-w-2xl mb-8"
                 style={{ color: "#5c5c5c" }}>
                Continue your language adventure where you left off. New cultural insights and interactive lessons await your discovery.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button 
                className="font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  background: `linear-gradient(to right, ${lightRose}, ${lightBeige})`,
                  color: "#5e4c41",
                }}
              >
                Explore Your Course
              </button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="md:w-2/5 lg:w-1/3 mt-8 md:mt-0 flex justify-center"
          >
            <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72 flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full border-4 animate-pulse"
                style={{ borderColor: `${lightBeige}aa` }}
              ></div>
              <div 
                className="w-32 h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full flex items-center justify-center shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${lightTeal} 0%, ${lightBeige} 100%)` 
                }}
              >
                <span className="text-6xl md:text-7xl lg:text-8xl">🎯</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Progress indicator */}
        <div 
          className="relative z-10 px-8 py-4"
          style={{ 
            background: `linear-gradient(to right, ${lightTeal}cc, ${lightRose}aa)`
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto">
            <div className="mb-4 md:mb-0 w-full md:w-auto">
              <span style={{ color: "#5c5c5c" }}>Your progress:</span>
              <div className="mt-2 w-full md:w-64 lg:w-80 h-2 md:h-3 bg-white bg-opacity-40 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: "35%",
                    background: `linear-gradient(to right, ${lightRose}, ${lightBeige})`
                  }}
                ></div>
              </div>
            </div>
            <div className="flex space-x-6 md:space-x-10 lg:space-x-16">
              <div className="text-center">
                <p className="text-xl lg:text-2xl font-bold" style={{ color: "#5e4c41" }}>3</p>
                <p className="text-sm lg:text-base" style={{ color: "#5c5c5c" }}>Completed</p>
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-2xl font-bold" style={{ color: "#5e4c41" }}>12</p>
                <p className="text-sm lg:text-base" style={{ color: "#5c5c5c" }}>Lessons</p>
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-2xl font-bold" style={{ color: "#5e4c41" }}>6</p>
                <p className="text-sm lg:text-base" style={{ color: "#5c5c5c" }}>Hours</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CourseBanner;