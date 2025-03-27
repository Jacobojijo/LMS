import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import About from "./pages/about/about";
import AuthRoutes from "./pages/auth/AuthRoutes";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LearningPage from "./pages/student/LearningPage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin routes - outside of the main Layout */}
          <Route path="admin/dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Student routes */}
          <Route path="student/dashboard" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="student/learning" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <LearningPage />
            </ProtectedRoute>
          } />
          
          {/* Public and student routes - within Layout */}
          <Route path="/" element={<Layout />}>
            {/* Redirect to dashboard if authenticated */}
            <Route index element={<HomeOrDashboard />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="/*" element={<AuthRoutes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

// Helper component to redirect to the appropriate dashboard if authenticated
const HomeOrDashboard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }
  
  // If not authenticated, show the home page
  return <Home />;
};

export default App;
