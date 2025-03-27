import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../pages/student/Header";
import Footer from "../../components/Footer/Footer";
import CourseVisualization from "./CourseVisualiztion/CourseVisualization";

const LearningPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <CourseVisualization />
      </main>
    </div>
  );
};

export default LearningPage;