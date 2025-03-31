import React from "react";
import { Routes, Route } from "react-router-dom";
import CourseList from "@/components/Courses/CourseListComponents";
import CourseDetail from "@/components/Courses/CourseDetails";
import Layout from "./Layout";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<Layout />}>
        {/* Course Management Routes */}
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/:id" element={<CourseDetail />} />

        {/* Other admin routes would go here */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
