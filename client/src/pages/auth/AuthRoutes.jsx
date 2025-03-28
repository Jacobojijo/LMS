import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Login from "./Login";
import Register from "./Register";
import VerifyEmail from "./VerifyEmail";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const AuthRoutes = () => {
  const { user, loading } = useAuth();
  
  // If still loading, you might want to show a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If authenticated, redirect to appropriate dashboard
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="verify-email" element={<VerifyEmail />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:resettoken" element={<ResetPassword />} />
      <Route index element={<Register />} />
    </Routes>
  );
};

export default AuthRoutes;