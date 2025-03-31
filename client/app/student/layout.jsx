"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import { Features, Courses, CourseBanner, HeritageBanner } from "@/components";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/student/Header";

export default function StudentLayout({ children }) {
  const { user, api } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasEnrollments, setHasEnrollments] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on the learning page
  const isLearningPage = pathname === "/student/learning" || pathname.startsWith("/student/learning/");

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (user && user.id) {
        try {
          const response = await api.get(`/api/enrollments/user/${user.id}/courses`);
          setEnrollments(response.data.data);
          setHasEnrollments(response.data.data.length > 0);
        } catch (error) {
          console.error("Error fetching enrollments:", error);
          setHasEnrollments(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setHasEnrollments(false);
      }
    };

    fetchEnrollments();
  }, [user, api]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div>Loading...</div>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  // For the learning page, render just the children without header or footer
  if (isLearningPage) {
    return <>{children}</>;
  }

  // For all other pages, use the standard layout
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        {user?.role === "student" && hasEnrollments ? (
          <>
            <CourseBanner enrollments={enrollments} />
            <Courses />
            <Features />
            {children}
          </>
        ) : (
          <>
            <HeritageBanner />
            <Courses />
            <Features />
            {children}
          </>
        )}
      </main>
    </div>
  );
}
