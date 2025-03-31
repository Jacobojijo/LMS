// components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};

export default Layout;
