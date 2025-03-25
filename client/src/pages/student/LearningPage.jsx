import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../pages/student/Header";
import Footer from "../../components/Footer/Footer";
import CourseVisualization from "./CourseVisualiztion/CourseVisualization";

const LearningPage = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        <CourseVisualization />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LearningPage;