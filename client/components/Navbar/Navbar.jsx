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
  {
    id: 5,
    title: "Curriculum",
    link: "/curriculum",
  },
  {
    id: 6,
    title: "Contact",
    link: "/contact",
  },
  {
    id: 7,
    title: "Donate",
    link: "/donate",
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

  const linkClasses = (isActive) =>
    `relative inline-block py-2 px-3 font-medium transition-colors duration-300
     after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gold
     after:transition-all after:duration-300 after:content-['']
     ${
       isActive
         ? "text-primary after:w-full"
         : "text-ink/75 hover:text-primary after:w-0 hover:after:w-full"
     }`;

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-sand-200 bg-white/90 py-2 shadow-sm backdrop-blur-md"
            : "bg-sand py-4"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container mx-auto flex items-center justify-between px-4"
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
                alt="Sigana African Heritage Language School"
                className={`w-auto transition-all duration-300 ${
                  scrolled ? "h-11" : "h-14"
                }`}
              />
              <div className="ml-2 flex flex-col leading-none">
                <span className="font-playfair text-xl leading-tight font-bold tracking-wide text-teal md:text-2xl">
                  Sigana
                </span>
                <span className="text-[10px] leading-tight font-semibold tracking-[0.18em] text-primary uppercase md:text-[11px]">
                  <span className="sm:hidden">African Heritage</span>
                  <span className="hidden sm:inline">
                    African Heritage Language School
                  </span>
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Menu section */}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-4">
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
                        className={linkClasses(false)}
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
                      aria-current={pathname === item.link ? "page" : undefined}
                      className={linkClasses(pathname === item.link)}
                    >
                      {item.title}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Call to Action section */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="font-medium text-teal transition-colors duration-300 hover:text-primary"
            >
              Log in
            </Link>
            <Link href="/register" className="btn-primary px-5 py-2.5">
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger Menu section */}
          <motion.button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="cursor-pointer lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <MdClose className="text-3xl text-primary" />
            ) : (
              <MdMenu className="text-3xl text-primary" />
            )}
          </motion.button>
        </motion.div>
      </nav>

      {/* Add spacing to account for fixed navbar */}
      <div
        className={`${scrolled ? "h-16" : "h-24"} transition-all duration-300`}
      ></div>

      {/* Mobile Sidebar section */}
      <ResponsiveMenu
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
      />
    </>
  );
};

export default Navbar;
