"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdAssignment,
  MdSettings,
  MdChevronLeft,
  MdChevronRight,
  MdLogout,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const [submenuOpen, setSubmenuOpen] = useState({
    users: false,
    courses: false,
    enrollments: false,
    settings: false,
  });

  // Set active menu based on current path
  useEffect(() => {
    const path = pathname.split("/")[2] || "dashboard";
    setActiveMenu(path);
  }, [pathname]);

  // Toggle submenu visibility
  const toggleSubmenu = (menu) => {
    setSubmenuOpen({
      ...submenuOpen,
      [menu]: !submenuOpen[menu],
    });
  };

  // Handle logout
  const handleLogout = () => {
    // Remove token and user role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    // Redirect to home page
    router.push("/");
  };

  // List of menu items with their respective icons and submenus
  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <MdDashboard />,
      link: "/admin/dashboard",
    },
    {
      id: "users",
      title: "Users Management",
      icon: <MdPeople />,
      subMenu: [
        { title: "List All Users", link: "/admin/users" },
        { title: "Create New User", link: "/admin/users/create" },
        { title: "User Status", link: "/admin/users/status" },
      ],
    },
    {
      id: "courses",
      title: "Courses Management",
      icon: <MdSchool />,
      subMenu: [
        { title: "List All Courses", link: "/admin/courses" },
        { title: "Create New Course", link: "/admin/courses/create" },
        { title: "Course Modules", link: "/admin/courses/modules" },
      ],
    },
    {
      id: "enrollments",
      title: "Enrollments",
      icon: <MdAssignment />,
      subMenu: [
        { title: "List All Enrollments", link: "/admin/enrollments" },
        { title: "Create New Enrollment", link: "/admin/enrollments/create" },
        { title: "Module Access", link: "/admin/enrollments/access" },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      icon: <MdSettings />,
      subMenu: [{ title: "Account Settings", link: "/admin/settings/account" }],
    },
    {
      id: "logout",
      title: "Logout",
      icon: <MdLogout />,
      action: handleLogout,
    },
  ];

  return (
    <div className="flex h-screen">
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="bg-gradient-to-b from-white to-gray-50 h-full shadow-lg relative"
      >
        {/* Logo Section */}
        <div className={`py-6 flex ${collapsed ? "justify-center" : "px-6"}`}>
          {collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={"/assets/logo.png"}
                alt="Heritage Language School"
                className="h-12 w-auto"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <img
                src={"/assets/logo.png"}
                alt="Heritage Language School"
                className="h-12 w-auto"
              />
              <div className="flex flex-col ml-2 -space-y-1">
                <span className="text-[#008080] font-serif tracking-wider text-lg leading-tight">
                  Heritage
                </span>
                <span className="font-bold text-[#854836] font-serif tracking-widest text-sm leading-tight">
                  Admin Panel
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <div className="px-6">
          <div className="h-px bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70"></div>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                {/* Main menu item */}
                <div
                  className={`group flex items-center px-3 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    activeMenu === item.id
                      ? "bg-gradient-to-r from-indigo-600/10 to-purple-600/10 text-[#854836]"
                      : "hover:bg-gray-100 text-gray-700 hover:text-[#854836]"
                  }`}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.subMenu) {
                      toggleSubmenu(item.id);
                    } else if (item.link) {
                      router.push(item.link);
                      setActiveMenu(item.id);
                    }
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="ml-4 font-medium">{item.title}</span>
                      {item.subMenu && (
                        <span className="ml-auto">
                          {submenuOpen[item.id] ? (
                            <MdExpandLess />
                          ) : (
                            <MdExpandMore />
                          )}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Submenu items */}
                {!collapsed && item.subMenu && submenuOpen[item.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ul className="pl-12 pr-3 mt-1 space-y-1">
                      {item.subMenu.map((subItem, index) => (
                        <li key={index}>
                          <Link
                            href={subItem.link}
                            className={`block py-2 px-3 rounded-md text-sm transition-colors duration-300 ${
                              pathname === subItem.link
                                ? "bg-gradient-to-r from-indigo-600/10 to-purple-600/10 text-[#854836]"
                                : "text-gray-600 hover:bg-gray-100 hover:text-[#854836]"
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile Section at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 pb-6">
          <div className="px-6">
            <div className="h-px bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70 mb-4"></div>
          </div>

          {collapsed ? (
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white cursor-pointer shadow-md"
                onClick={handleLogout}
              >
                <MdLogout />
              </motion.div>
            </div>
          ) : (
            <div className="px-6">
              <div className="flex items-center px-3 py-3 rounded-lg bg-gradient-to-r from-indigo-600/5 to-purple-600/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                  <span className="text-xl font-semibold">A</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@heritage.edu</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="ml-auto text-lg text-gray-600 hover:text-[#854836] transition-colors duration-300"
                  onClick={handleLogout}
                >
                  <MdLogout />
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-20 bg-white rounded-full p-1 shadow-md border border-gray-200 text-[#854836] hover:bg-gray-50 transition-colors duration-300"
        >
          {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
        </button>
      </motion.div>
    </div>
  );
};

export default AdminSidebar;
