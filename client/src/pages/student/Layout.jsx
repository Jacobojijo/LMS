import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "../../components/Footer/Footer";
import { Features, Courses, HeritageBanner, CourseBanner } from "../../components";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed

const Layout = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const enrollmentChecked = useRef(false);
  
  // Effect to reset banner visibility on user change
  useEffect(() => {
    // Hide banner immediately on user change/login
    setShowBanner(false);
    enrollmentChecked.current = false;
  }, [user]);
  
  // Separate effect for enrollment check
  useEffect(() => {
    // Skip if auth is still loading or already checked
    if (authLoading || enrollmentChecked.current) {
      return;
    }
    
    // Skip if no user (after auth loading completes)
    if (!user && !authLoading) {
      setIsEnrolled(false);
      setShowBanner(true);
      enrollmentChecked.current = true;
      return;
    }
    
    const checkEnrollment = async () => {
      // If no user, we're not enrolled
      if (!user) {
        setIsEnrolled(false);
        setShowBanner(true);
        enrollmentChecked.current = true;
        return;
      }
      
      try {
        const token = localStorage.getItem("token");
        
        // Ensure we have token and user ID
        if (!token || !user._id) {
          setIsEnrolled(false);
          setShowBanner(true);
          enrollmentChecked.current = true;
          return;
        }
        
        console.log("Checking enrollment for user:", user._id);
        
        const response = await axios.get(`/api/enrollments/user/${user._id}/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update enrolled status based on enrollment count
        const enrolled = response.data.count > 0;
        console.log("Enrollment check result:", enrolled ? "Enrolled" : "Not enrolled");
        
        setIsEnrolled(enrolled);
        enrollmentChecked.current = true;
        setShowBanner(true); // Only show banner after check completes
      } catch (error) {
        console.error("Error checking enrollment:", error);
        setIsEnrolled(false);
        enrollmentChecked.current = true;
        setShowBanner(true);
      }
    };
    
    // Only run enrollment check if auth is complete and we have a user
    if (!authLoading && user) {
      console.log("Starting enrollment check...");
      checkEnrollment();
    }
  }, [user, authLoading]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        {showBanner ? (
          isEnrolled ? <CourseBanner /> : <HeritageBanner />
        ) : null}
        <Courses />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;