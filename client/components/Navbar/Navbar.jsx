"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MdMenu, MdClose } from "react-icons/md";
import ResponsiveMenu from "./ResponsiveMenu";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Navigation menu data
export const NavbarMenu = [
  {
    id: 1,
    title: "Home",
    link: "/",
  },
  {
    id: 2,
    title: "Courses",
    link: "/#courses",
  },
  {
    id: 3,
    title: "Features",
    link: "/#features",
  },
  {
    id: 4,
    title: "About us",
    link: "/about",
  },
  // {
  //   id: 5,
  //   title: "Curriculum",
  //   link: "/curriculum",
  // },
  {
    id: 6,
    title: "Contact",
    link: "/contact",
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    // If not on home page, navigate to home first
    if (pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-2 bg-white/95 backdrop-blur-sm shadow-md"
            : "py-4 bg-gradient-to-r from-[#F0D6B9] via-[#C8E6E4] to-[#ECC6C6] backdrop-blur-sm"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container mx-auto px-4 flex justify-between items-center"
        >
          {/* Logo section */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center">
              <img
                src={"/assets/logo.png"}
                alt="Heritage Language School"
                className={`transition-all duration-300 ${
                  scrolled ? "h-12" : "h-16"
                } w-auto`}
              />
              <div className="flex flex-col ml-2 -space-y-1">
                <span className="text-[#008080] font-serif tracking-wider text-xl md:text-2xl leading-tight">
                  Heritage
                </span>
                <span className="font-bold text-[#854836] font-serif tracking-widest text-lg md:text-xl leading-tight">
                  Language School
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Menu section */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-700">
              {NavbarMenu.map((item) => {
                // Special handling for Courses and Features
                if (item.title === "Courses" || item.title === "Features") {
                  return (
                    <motion.li
                      key={item.id}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <button
                        onClick={() =>
                          scrollToSection(item.title.toLowerCase())
                        }
                        className="relative font-medium inline-block py-2 px-3 hover:text-[#854836] transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#854836] hover:after:w-full after:transition-all after:duration-300"
                      >
                        {item.title}
                      </button>
                    </motion.li>
                  );
                }

                // Regular navigation for other menu items
                return (
                  <motion.li
                    key={item.id}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={item.link}
                      className="relative font-medium inline-block py-2 px-3 hover:text-[#854836] transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#854836] hover:after:w-full after:transition-all after:duration-300"
                    >
                      {item.title}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Call to Action section */}
          <div className="flex items-center gap-4">
            <motion.a
              href="/register"
              className="bg-white group hover:bg-[#854836] font-semibold text-[#854836] hover:text-white rounded-md border-2 border-[#854836] px-5 py-2 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="relative z-10">Sign Up</span>
              <span className="absolute inset-0 bg-[#854836] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </motion.a>
          </div>

          {/* Mobile hamburger Menu section */}
          <motion.div
            className="md:hidden cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <MdClose className="text-3xl text-[#854836]" />
            ) : (
              <MdMenu className="text-3xl text-[#854836]" />
            )}
          </motion.div>
        </motion.div>
      </nav>

      {/* Add spacing to account for fixed navbar */}
      <div
        className={`${scrolled ? "h-16" : "h-24"} transition-all duration-300`}
      ></div>

      {/* Mobile Sidebar section */}
      <ResponsiveMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Navbar;
