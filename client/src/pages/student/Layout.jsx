import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "../../components/Footer/Footer";
import { Features, Courses, CourseBanner, HeritageBanner } from "../../components";
import { useAuth } from "../../context/AuthContext";

const Layout = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasEnrollments, setHasEnrollments] = useState(false);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`/api/enrollments/user/${user.id}/courses`);
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
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        {user?.role === 'student' && hasEnrollments ? (
          <>
            <CourseBanner enrollments={enrollments} />
            <Courses />
            <Features />
            <Outlet />
          </>
        ) : (
          <>
            <HeritageBanner />
            <Courses />
            <Features />
            {user?.role === 'student' && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4">
                  You're not enrolled in any courses yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Browse our courses below and start your learning journey
                </p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;