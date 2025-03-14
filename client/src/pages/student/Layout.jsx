// components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "../../components/Footer/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header/>
      <main className="flex-grow">
        Good
      </main>
      <Footer />
    </div>
  );
};

export default Layout;