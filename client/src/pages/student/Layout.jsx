import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "../../components/Footer/Footer";
import { Features, Courses, CourseBanner } from "../../components";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed

const Layout = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const enrollmentChecked = useRef(false);
  
  // Reset enrollment check when user or auth state changes
  useEffect(() => {
    // Only reset if we have a definitive change
    if (!authLoading) {
      enrollmentChecked.current = false;
      
      // Begin enrollment check with a small delay to ensure user data is fully populated
      if (user && user._id) {
        setLoading(true);
        
        // Small delay to ensure all auth processes complete
        const timer = setTimeout(() => {
          checkEnrollment(user);
        }, 500);
        
        return () => clearTimeout(timer);
      } else {
        // No user or incomplete user, mark as not enrolled
        enrollmentChecked.current = true;
        setIsEnrolled(false);
        setLoading(false);
      }
    }
  }, [user, authLoading]);
  
  // Function to check enrollment status
  const checkEnrollment = async (currentUser) => {
    if (!currentUser || !currentUser._id || enrollmentChecked.current) {
      setLoading(false);
      enrollmentChecked.current = true;
      return;
    }
    
    console.log("Checking enrollment for user:", currentUser._id);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("Token not available");
        setIsEnrolled(false);
        enrollmentChecked.current = true;
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`/api/enrollments/user/${currentUser._id}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update enrolled status based on enrollment count
      const enrolled = response.data.count > 0;
      console.log("Enrollment check result:", enrolled ? "Enrolled" : "Not enrolled");
      
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error("Error checking enrollment:", error);
      setIsEnrolled(false);
    } finally {
      enrollmentChecked.current = true;
      setLoading(false);
    }
  };

  // Determine what to render
  const renderContent = () => {
    if (authLoading || loading) {
      return (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      );
    }
    
    return (
      <>
        {isEnrolled && <CourseBanner />}
        <Courses />
        <Features />
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
